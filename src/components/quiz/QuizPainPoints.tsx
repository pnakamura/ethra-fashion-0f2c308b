import { motion } from 'framer-motion';
import { Shirt, RefreshCw, CalendarDays, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PainOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  microcopy: string;
}

const OPTIONS: PainOption[] = [
  {
    id: 'closet',
    title: 'Tenho muita roupa e não sei combinar',
    description: 'Meu armário é cheio, mas sempre visto a mesma coisa.',
    icon: <Shirt className="w-7 h-7" />,
    microcopy: 'Perfeito — vamos organizar seu closet virtual com combinações inteligentes.',
  },
  {
    id: 'curadoria',
    title: 'Sinto que estou sempre com a mesma cara',
    description: 'Quero renovar meu estilo sem gastar demais.',
    icon: <RefreshCw className="w-7 h-7" />,
    microcopy: 'Ótimo — nossa IA vai sugerir looks frescos a partir do que você já tem.',
  },
  {
    id: 'evento',
    title: 'Tenho um evento e não sei o que vestir',
    description: 'Preciso de ajuda para uma ocasião especial.',
    icon: <CalendarDays className="w-7 h-7" />,
    microcopy: 'Entendido — vamos montar looks sob medida para suas próximas ocasiões.',
  },
];

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function QuizPainPoints({ selected, onSelect }: Props) {
  const selectedOption = OPTIONS.find(o => o.id === selected);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-display text-gradient">
          Qual é seu maior desafio de estilo?
        </h2>
        <p className="text-muted-foreground font-body text-sm md:text-base">
          Isso vai personalizar sua experiência no app
        </p>
      </div>

      <div className="space-y-3 max-w-lg mx-auto">
        {OPTIONS.map((opt, i) => {
          const isSelected = selected === opt.id;
          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              onClick={() => onSelect(opt.id)}
              className={cn(
                'w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-300',
                'border',
                isSelected
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-glow'
                  : 'border-border bg-card hover:border-primary/30 shadow-soft'
              )}
            >
              <div className={cn(
                'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              )}>
                {isSelected ? <Check className="w-6 h-6" /> : opt.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  'font-body font-medium text-sm md:text-base leading-snug',
                  isSelected ? 'text-foreground' : 'text-foreground'
                )}>
                  {opt.title}
                </h3>
                <p className="text-muted-foreground text-xs mt-1">{opt.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Contextual microcopy */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-primary font-body italic max-w-md mx-auto">
            ✨ {selectedOption.microcopy}
          </p>
        </motion.div>
      )}
    </div>
  );
}
