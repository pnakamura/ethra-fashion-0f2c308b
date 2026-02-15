import { motion } from 'framer-motion';
import { Check, ArrowRight, Crown, User, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    id: 'free',
    name: 'Iniciante',
    price: 'Grátis',
    period: '',
    icon: User,
    color: '#6B7280',
    highlights: ['1 avatar virtual', '10 peças no closet', '3 provas por dia'],
    cta: 'Começar grátis',
    featured: false,
  },
  {
    id: 'trendsetter',
    name: 'Trendsetter',
    price: 'R$29,90',
    period: '/mês',
    icon: TrendingUp,
    color: '#8B5CF6',
    highlights: ['3 avatares', '50 peças no closet', '10 provas por dia'],
    cta: '7 dias grátis',
    featured: true,
    trialBadge: true,
  },
  {
    id: 'icon',
    name: 'Icon',
    price: 'R$59,90',
    period: '/mês',
    icon: Star,
    color: '#F59E0B',
    highlights: ['Avatares ilimitados', '200 peças no closet', 'Voyager incluído'],
    cta: 'Escolher plano',
    featured: false,
    popular: true,
  },
  {
    id: 'muse',
    name: 'Muse',
    price: 'R$99,90',
    period: '/mês',
    icon: Crown,
    color: '#EC4899',
    highlights: ['Tudo ilimitado', 'VIP Looks exclusivos', 'Suporte prioritário'],
    cta: 'Escolher plano',
    featured: false,
  },
];

export function PricingPreview() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4">
            Um plano para cada
            <br />
            <span className="text-gradient">momento seu</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comece grátis e evolua quando quiser. Sem surpresas, sem letras miúdas.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                plan.featured
                  ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20'
                  : 'border-border/50 bg-card hover:border-primary/30'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {plan.trialBadge && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs">
                  7 dias grátis
                </Badge>
              )}
              {plan.popular && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs">
                  Mais popular
                </Badge>
              )}

              <div className="text-center mb-4">
                <div
                  className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: `${plan.color}20` }}
                >
                  <plan.icon className="w-5 h-5" style={{ color: plan.color }} />
                </div>
                <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
              </div>

              <div className="text-center mb-5">
                <span className="text-2xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
              </div>

              <ul className="space-y-2 mb-6">
                {plan.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{h}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${plan.featured ? 'gradient-primary text-primary-foreground' : ''}`}
                variant={plan.featured ? 'default' : 'outline'}
                size="sm"
                onClick={() => navigate('/auth?mode=signup')}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => navigate('/subscription')}
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            Ver comparativo completo
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
