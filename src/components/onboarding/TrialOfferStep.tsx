import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Gift, Check, ArrowRight, Shield, Clock, Sparkles } from 'lucide-react';

interface TrialOfferStepProps {
  username: string;
  onAcceptTrial: () => void;
  onSkipTrial: () => void;
  isLoading?: boolean;
}

const trialBenefits = [
  { label: '50 peças no closet digital', included: true },
  { label: '3 avatares para provador virtual', included: true },
  { label: '10 provas virtuais por dia', included: true },
  { label: 'Recomendações personalizadas com IA', included: true },
];

export function TrialOfferStep({ username, onAcceptTrial, onSkipTrial, isLoading }: TrialOfferStepProps) {
  return (
    <div className="text-center max-w-lg mx-auto w-full">
      {/* Gift animation */}
      <motion.div
        className="relative w-24 h-24 mx-auto mb-6"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', delay: 0.1 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/30 to-emerald-500/30"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <Gift className="w-11 h-11 text-white" />
        </div>
      </motion.div>

      <motion.h2
        className="font-display text-3xl md:text-4xl font-semibold mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {username ? `${username}, temos` : 'Temos'} um
        <br />
        <span className="text-gradient">presente para você!</span>
      </motion.h2>

      <motion.p
        className="text-muted-foreground mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Experimente o plano <strong className="text-foreground">Trendsetter</strong> por 7 dias, totalmente grátis.
        Sem cartão de crédito.
      </motion.p>

      {/* Benefits list */}
      <motion.div
        className="space-y-2.5 mb-6 text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3 text-center">
          O que você ganha no trial
        </p>
        {trialBenefits.map((benefit, index) => (
          <motion.div
            key={benefit.label}
            className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.08 }}
          >
            <div className="w-6 h-6 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm">{benefit.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Value comparison */}
      <motion.div
        className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm text-muted-foreground line-through">R$29,90/mês</span>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">R$0,00</span>
          <span className="text-xs bg-green-500/15 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
            7 dias grátis
          </span>
        </div>
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          size="lg"
          className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
          onClick={onAcceptTrial}
          disabled={isLoading}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isLoading ? 'Ativando...' : 'Quero meus 7 dias grátis!'}
        </Button>

        <button
          onClick={onSkipTrial}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
          disabled={isLoading}
        >
          Agora não, continuar com plano gratuito
        </button>
      </motion.div>

      {/* Trust signals */}
      <motion.div
        className="flex items-center justify-center gap-4 mt-5 text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Sem compromisso
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Cancele quando quiser
        </span>
      </motion.div>
    </div>
  );
}
