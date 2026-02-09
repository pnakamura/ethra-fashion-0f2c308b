import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift, Shield, Clock, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8"
          whileHover={{ scale: 1.05 }}
        >
          <Gift className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300 font-medium">
            Ainda em dúvida? Teste 7 dias grátis
          </span>
        </motion.div>

        <h2 className="font-display text-4xl md:text-6xl font-semibold mb-6">
          Seu estilo
          <br />
          <span className="text-gradient">começa aqui</span>
        </h2>

        <p className="text-xl text-muted-foreground mb-6 max-w-xl mx-auto">
          Junte-se a 12.000+ pessoas que já transformaram sua relação com a moda
        </p>

        {/* Two CTA options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button
            size="lg"
            className="group text-lg px-10 py-7 gradient-primary text-primary-foreground shadow-glow hover:shadow-elevated transition-all duration-300"
            onClick={() => navigate('/auth?mode=signup&trial=true')}
          >
            Começar trial grátis de 7 dias
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-7 border-primary/30 hover:bg-primary/5"
            onClick={() => navigate('/auth?mode=signup')}
          >
            Criar conta gratuita
          </Button>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            Sem cartão de crédito
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Setup em 2 minutos
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Cancele quando quiser
          </span>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
