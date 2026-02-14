/**
 * useBiometricConsent
 *
 * Manages biometric data consent (LGPD) — checks if the user has
 * already consented, logs new consent events, and provides a flag
 * indicating whether the consent modal should be shown.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

/** Current version of the biometric consent terms. Bump when terms change. */
export const BIOMETRIC_TERM_VERSION = '1.0.0';

export type ConsentContext = 'chromatic_camera' | 'tryon_avatar' | 'onboarding';

interface UseBiometricConsentReturn {
  /** Whether the user has a valid consent for the current term version. */
  hasConsent: boolean;
  /** True while loading the consent status from the DB. */
  isLoading: boolean;
  /** Log an opt-in consent event and update profile. */
  grantConsent: (context: ConsentContext) => Promise<void>;
  /** Log an opt-out / revocation event. */
  revokeConsent: (context: ConsentContext) => Promise<void>;
}

export function useBiometricConsent(): UseBiometricConsentReturn {
  const { user } = useAuth();
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check existing consent on mount
  useEffect(() => {
    async function checkConsent() {
      if (!user) {
        setHasConsent(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check profile for biometric_consent_at — quick path
        const { data: profile } = await supabase
          .from('profiles')
          .select('biometric_consent_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profile?.biometric_consent_at) {
          // Verify that the latest consent log matches current term version
          const { data: latestLog } = await supabase
            .from('biometric_consent_logs')
            .select('consent_granted, term_version')
            .eq('user_id', user.id)
            .eq('consent_type', 'face_capture')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (
            latestLog &&
            latestLog.consent_granted &&
            latestLog.term_version === BIOMETRIC_TERM_VERSION
          ) {
            setHasConsent(true);
            setIsLoading(false);
            return;
          }
        }

        // No valid consent
        setHasConsent(false);
      } catch (err) {
        console.warn('[useBiometricConsent] Error checking consent:', err);
        setHasConsent(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkConsent();
  }, [user]);

  const grantConsent = useCallback(
    async (context: ConsentContext) => {
      if (!user) return;

      const now = new Date().toISOString();

      try {
        // 1. Insert audit log
        await supabase.from('biometric_consent_logs').insert({
          user_id: user.id,
          consent_type: 'face_capture',
          consent_granted: true,
          term_version: BIOMETRIC_TERM_VERSION,
          context,
          user_agent: navigator.userAgent,
        });

        // Also log liveness & face matching consents in the same batch
        await supabase.from('biometric_consent_logs').insert([
          {
            user_id: user.id,
            consent_type: 'liveness_detection',
            consent_granted: true,
            term_version: BIOMETRIC_TERM_VERSION,
            context,
            user_agent: navigator.userAgent,
          },
          {
            user_id: user.id,
            consent_type: 'face_matching',
            consent_granted: true,
            term_version: BIOMETRIC_TERM_VERSION,
            context,
            user_agent: navigator.userAgent,
          },
        ]);

        // 2. Update profile timestamp
        await supabase
          .from('profiles')
          .update({ biometric_consent_at: now })
          .eq('user_id', user.id);

        setHasConsent(true);
      } catch (err) {
        console.error('[useBiometricConsent] Error granting consent:', err);
        throw err;
      }
    },
    [user],
  );

  const revokeConsent = useCallback(
    async (context: ConsentContext) => {
      if (!user) return;

      try {
        await supabase.from('biometric_consent_logs').insert({
          user_id: user.id,
          consent_type: 'face_capture',
          consent_granted: false,
          term_version: BIOMETRIC_TERM_VERSION,
          context,
          user_agent: navigator.userAgent,
        });

        await supabase
          .from('profiles')
          .update({ biometric_consent_at: null })
          .eq('user_id', user.id);

        setHasConsent(false);
      } catch (err) {
        console.error('[useBiometricConsent] Error revoking consent:', err);
      }
    },
    [user],
  );

  return { hasConsent, isLoading, grantConsent, revokeConsent };
}
