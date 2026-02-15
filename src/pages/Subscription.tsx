import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown, Check, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { PageContainer } from '@/components/layout/PageContainer';
import { PricingCard } from '@/components/subscription/PricingCard';
import { UsageIndicator } from '@/components/subscription/UsageIndicator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription, PlanLimit } from '@/contexts/SubscriptionContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const WITHDRAWAL_DAYS = 7;

export default function Subscription() {
  const { plan: currentPlan, currentPlanId, demoPlanId, setDemoPlan, allPlans } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch all plan limits for display
  const { data: allLimits = [] } = useQuery({
    queryKey: ['all-plan-limits'],
    queryFn: async () => {
      const { data } = await supabase.from('plan_limits').select('*').order('feature_key');
      return (data || []) as PlanLimit[];
    },
  });

  // Fetch subscription start date
  const { data: subscriptionStartedAt } = useQuery({
    queryKey: ['subscription-started-at', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('subscription_started_at')
        .eq('user_id', user.id)
        .single();
      return data?.subscription_started_at ?? null;
    },
    enabled: !!user,
  });

  const isPaidPlan = currentPlanId !== 'free' && currentPlanId !== null;
  const withinWithdrawalPeriod = (() => {
    if (!subscriptionStartedAt) return false;
    const start = new Date(subscriptionStartedAt);
    const now = new Date();
    const diffDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= WITHDRAWAL_DAYS;
  })();

  const daysRemaining = (() => {
    if (!subscriptionStartedAt) return 0;
    const start = new Date(subscriptionStartedAt);
    const now = new Date();
    const diffDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(WITHDRAWAL_DAYS - diffDays));
  })();

  // Group limits by plan
  const getLimitsForPlan = (planId: string) => {
    return allLimits.filter((l) => l.plan_id === planId);
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // In a real app, this would trigger a payment flow
  };

  const handleCancelWithRefund = async () => {
    if (!user) return;
    setCancelling(true);
    try {
      // Downgrade to free plan and clear subscription dates
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_plan_id: 'free',
          subscription_expires_at: null,
          subscription_started_at: null,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Cancelamento realizado',
        description: 'Sua assinatura foi cancelada e o reembolso será processado em até 7 dias úteis.',
      });
      setShowCancelDialog(false);
    } catch {
      toast({
        title: 'Erro ao cancelar',
        description: 'Não foi possível processar o cancelamento. Tente novamente ou entre em contato pelo email contato@ethra.com.br.',
        variant: 'destructive',
      });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <Header title="Assinatura" />
      <PageContainer className="px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Current Plan Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge
              className="text-sm px-4 py-1"
              style={{ backgroundColor: currentPlan?.badge_color, color: 'white' }}
            >
              <Crown className="w-3.5 h-3.5 mr-1.5" />
              {currentPlan?.display_name || 'Free'}
            </Badge>
            <h1 className="font-display text-3xl mt-4 mb-2">Escolha seu plano</h1>
            <p className="text-muted-foreground">Desbloqueie recursos premium para sua experiência de moda</p>
          </motion.div>

          {/* Current Usage Overview */}
          <Card className="p-5 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Seu uso atual
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <UsageIndicator feature="wardrobe_slots" />
              <UsageIndicator feature="avatars" />
              <UsageIndicator feature="try_on_daily" />
            </div>
          </Card>

          {/* Demo Toggle */}
          <Card className="p-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                  Modo Demo: Visualize como seria com outro plano
                </p>
                <div className="flex gap-2 flex-wrap">
                  {allPlans.map((p) => (
                    <Button
                      key={p.id}
                      size="sm"
                      variant={currentPlanId === p.id ? 'default' : 'outline'}
                      onClick={() => setDemoPlan(currentPlanId === p.id && !demoPlanId ? null : p.id)}
                      className="text-xs"
                    >
                      {p.display_name}
                      {currentPlanId === p.id && demoPlanId === null && (
                        <Check className="w-3 h-3 ml-1" />
                      )}
                    </Button>
                  ))}
                  {demoPlanId && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDemoPlan(null)}
                      className="text-xs text-amber-700"
                    >
                      Resetar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Pricing Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {allPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PricingCard
                  plan={plan}
                  limits={getLimitsForPlan(plan.id)}
                  isCurrentPlan={currentPlanId === plan.id}
                  isPopular={plan.id === 'icon'}
                  onSelect={() => handleSelectPlan(plan.id)}
                />
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison */}
          <Card className="p-6">
            <h3 className="font-display text-lg mb-4">Comparativo de recursos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 pr-4">Recurso</th>
                    {allPlans.map((p) => (
                      <th
                        key={p.id}
                        className="text-center py-3 px-2"
                        style={{ color: p.badge_color }}
                      >
                        {p.display_name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['avatars', 'wardrobe_slots', 'try_on_daily', 'trips', 'vip_looks'].map((featureKey) => {
                    const featureName = allLimits.find((l) => l.feature_key === featureKey)?.feature_display_name || featureKey;
                    return (
                      <tr key={featureKey} className="border-b border-border/50">
                        <td className="py-3 pr-4 text-muted-foreground">{featureName}</td>
                        {allPlans.map((plan) => {
                          const limit = allLimits.find(
                            (l) => l.plan_id === plan.id && l.feature_key === featureKey
                          );
                          const value = limit?.limit_value ?? 0;
                          const type = limit?.limit_type ?? 'count';

                          return (
                            <td key={plan.id} className="text-center py-3 px-2">
                              {type === 'boolean' ? (
                                value === 1 ? (
                                  <Check className="w-4 h-4 text-primary mx-auto" />
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )
                              ) : value === -1 ? (
                                <span className="font-medium text-primary">∞</span>
                              ) : (
                                <span className={value === 0 ? 'text-muted-foreground' : ''}>
                                  {value}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Right of Withdrawal (Direito de Arrependimento) */}
          <Card className="p-5 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-1">
                  Garantia de 7 dias — Direito de Arrependimento
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  Conforme o Art. 49 do Código de Defesa do Consumidor, você pode cancelar sua
                  assinatura em até 7 dias corridos após a contratação e receber reembolso integral.{' '}
                  <Link to="/terms" className="underline font-medium">
                    Saiba mais nos Termos de Uso (Seção 9)
                  </Link>.
                </p>

                {isPaidPlan && withinWithdrawalPeriod && (
                  <div className="mt-3 flex items-center gap-3">
                    <Badge variant="outline" className="border-emerald-400 text-emerald-700 dark:text-emerald-300">
                      {daysRemaining} {daysRemaining === 1 ? 'dia restante' : 'dias restantes'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      Cancelar com reembolso
                    </Button>
                  </div>
                )}

                {isPaidPlan && !withinWithdrawalPeriod && subscriptionStartedAt && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    O prazo de arrependimento para sua assinatura atual já expirou.
                    Você ainda pode cancelar a qualquer momento — o acesso permanece até o
                    final do período pago.
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* FAQ or additional info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Dúvidas? Entre em contato com nosso suporte.</p>
            <p className="mt-1">Pagamentos processados de forma segura.</p>
          </div>

          {/* Cancellation with Refund Dialog */}
          <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Cancelar assinatura com reembolso
                </DialogTitle>
                <DialogDescription>
                  Você está exercendo seu direito de arrependimento (CDC Art. 49).
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Ao confirmar:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Sua assinatura <strong>{currentPlan?.display_name}</strong> será cancelada imediatamente</li>
                  <li>O valor pago será reembolsado integralmente em até 7 dias úteis</li>
                  <li>Seu plano retornará ao nível gratuito</li>
                  <li>Você perderá acesso imediato aos recursos premium</li>
                </ul>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                  Manter assinatura
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelWithRefund}
                  disabled={cancelling}
                >
                  {cancelling ? 'Processando...' : 'Confirmar cancelamento'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageContainer>
      <BottomNav />
    </>
  );
}
