import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePermission } from '@/hooks/usePermission';
import { cn } from '@/lib/utils';

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
  blurContent?: boolean;
  grayScale?: boolean;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgrade = true,
  blurContent = false,
  grayScale = false,
}: FeatureGateProps) {
  const { hasAccess, remaining, limit, featureName, isUnlimited } = usePermission(feature);
  const navigate = useNavigate();

  if (hasAccess) {
    return <>{children}</>;
  }

  // Custom fallback provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default locked overlay
  return (
    <div className="relative">
      {/* Blurred or grayscale content */}
      {(blurContent || grayScale) && (
        <div
          className={cn(
            'pointer-events-none',
            blurContent && 'blur-sm opacity-50',
            grayScale && 'grayscale opacity-60'
          )}
        >
          {children}
        </div>
      )}

      {/* Lock overlay */}
      <div
        className={cn(
          'flex items-center justify-center rounded-xl',
          (blurContent || grayScale) ? 'absolute inset-0 bg-background/80 backdrop-blur-sm' : 'p-8 bg-muted/50'
        )}
      >
        <div className="text-center p-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium mb-1">{featureName} bloqueado</p>
          {!isUnlimited && (
            <p className="text-xs text-muted-foreground mb-3">
              Limite: {remaining}/{limit}
            </p>
          )}
          {showUpgrade && (
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                onClick={() => navigate('/subscription')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Gift className="w-3.5 h-3.5 mr-1.5" />
                Testar 7 dias grátis
              </Button>
              <button
                onClick={() => navigate('/subscription')}
                className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
              >
                Ver planos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
