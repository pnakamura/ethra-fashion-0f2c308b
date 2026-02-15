import { useNavigate } from 'react-router-dom';
import { Lock, Crown, Gift, Home, ArrowLeft, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { PageContainer } from '@/components/layout/PageContainer';
import { usePermission } from '@/hooks/usePermission';

interface LockedFeaturePageProps {
  feature: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function LockedFeaturePage({ feature, title, description, icon: Icon }: LockedFeaturePageProps) {
  const navigate = useNavigate();
  const { featureName } = usePermission(feature);

  return (
    <>
      <Header title={title} />
      <PageContainer className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm px-4">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center grayscale">
              <Icon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-background border">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <h2 className="font-display text-2xl mb-2">{title}</h2>
          <p className="text-muted-foreground mb-2">{description}</p>
          <p className="text-sm text-muted-foreground/70 mb-6">
            Experimente grátis por 7 dias ou escolha um plano para desbloquear.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/subscription')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Gift className="w-4 h-4 mr-2" />
              Experimentar 7 dias grátis
            </Button>
            <Button
              onClick={() => navigate('/subscription')}
              variant="outline"
              className="w-full"
            >
              <Crown className="w-4 h-4 mr-2" />
              Ver todos os planos
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate(-1)} className="flex-1 text-sm">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Voltar
              </Button>
              <Button variant="ghost" onClick={() => navigate('/')} className="flex-1 text-sm">
                <Home className="w-3.5 h-3.5 mr-1.5" />
                Início
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
      <BottomNav />
    </>
  );
}
