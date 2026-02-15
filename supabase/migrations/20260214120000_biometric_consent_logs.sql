-- Tabela de log de consentimento biométrico (LGPD audit trail)
-- Cada evento de consentimento é registrado individualmente para auditoria.

CREATE TABLE IF NOT EXISTS public.biometric_consent_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,          -- 'face_capture', 'liveness_detection', 'face_matching'
  consent_granted BOOLEAN NOT NULL,    -- true = opt-in, false = opt-out / revoked
  term_version TEXT NOT NULL,          -- e.g. '1.0.0'
  context TEXT,                        -- 'chromatic_camera', 'tryon_avatar', 'onboarding'
  ip_address TEXT,                     -- optional, for extra audit
  user_agent TEXT,                     -- optional, browser info
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice por user_id para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_biometric_consent_logs_user
  ON public.biometric_consent_logs (user_id, created_at DESC);

-- RLS
ALTER TABLE public.biometric_consent_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own consent logs"
  ON public.biometric_consent_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consent logs"
  ON public.biometric_consent_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários não podem deletar nem alterar logs (imutável para auditoria)
