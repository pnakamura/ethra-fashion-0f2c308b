import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SilhouetteOption {
  id: string;
  name: string;
  symbol: string;
  description: string;
}

const SILHOUETTES: SilhouetteOption[] = [
  { id: 'hourglass', name: 'Curvas Harmônicas', symbol: '∞', description: 'Proporção equilibrada entre ombros e quadris' },
  { id: 'pear', name: 'Base Expressiva', symbol: '⌂', description: 'Quadris mais largos, cintura definida' },
  { id: 'inverted-triangle', name: 'Ombros Imponentes', symbol: '▽', description: 'Ombros mais largos, quadris estreitos' },
  { id: 'rectangle', name: 'Linhas Alongadas', symbol: '║', description: 'Proporções lineares e elegantes' },
  { id: 'apple', name: 'Centro Poderoso', symbol: '✦', description: 'Cintura ampla, pernas torneadas' },
  { id: 'diamond', name: 'Silhueta Esculpida', symbol: '◇', description: 'Cintura mais ampla, ombros e quadris alinhados' },
];

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function QuizSilhouette({ selected, onSelect }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-display text-gradient">
          Seu perfil de silhueta
        </h2>
        <p className="text-muted-foreground font-body text-sm md:text-base max-w-md mx-auto">
          Nosso ajuste de IA garante que as peças sugeridas respeitem o seu caimento preferido.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
        {SILHOUETTES.map((s, i) => {
          const isSelected = selected === s.id;
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onClick={() => onSelect(s.id)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300',
                'text-center',
                isSelected
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-glow scale-[1.02]'
                  : 'border-border bg-card hover:border-primary/30 shadow-soft hover:scale-[1.01]'
              )}
            >
              <div className={cn(
                'text-4xl md:text-5xl transition-all duration-300 leading-none',
                isSelected ? 'text-primary dark:text-glow' : 'text-muted-foreground'
              )}>
                {s.symbol}
              </div>
              <h3 className="font-body text-xs md:text-sm font-medium leading-tight">
                {s.name}
              </h3>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-tight">
                {s.description}
              </p>
              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Check className="w-4 h-4 text-primary" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
