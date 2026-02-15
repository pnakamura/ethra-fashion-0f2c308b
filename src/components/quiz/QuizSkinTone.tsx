import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const SKIN_TONES = [
  { id: 'very-light', label: 'Muito Claro', color: '#FDEBD3' },
  { id: 'light', label: 'Claro', color: '#F5D0A9' },
  { id: 'medium-light', label: 'Médio Claro', color: '#D4A574' },
  { id: 'medium', label: 'Médio', color: '#C08B5C' },
  { id: 'medium-dark', label: 'Médio Escuro', color: '#8D5E3C' },
  { id: 'dark', label: 'Escuro', color: '#5C3A21' },
];

const UNDERTONES = [
  { id: 'warm', label: 'Quente', description: 'Veias esverdeadas, bronzeia fácil', color: '#E8B168' },
  { id: 'cool', label: 'Frio', description: 'Veias azuladas, pele rosada', color: '#C4A1D4' },
  { id: 'neutral', label: 'Neutro', description: 'Mix de veias verdes e azuis', color: '#C8B8A8' },
];

const HAIR_COLORS = [
  { id: 'black', label: 'Preto', color: '#1A1A1A' },
  { id: 'dark-brown', label: 'Castanho Escuro', color: '#3B2314' },
  { id: 'light-brown', label: 'Castanho Claro', color: '#8B6347' },
  { id: 'blonde', label: 'Loiro', color: '#D4A95A' },
  { id: 'red', label: 'Ruivo', color: '#A03519' },
  { id: 'gray-white', label: 'Grisalho/Branco', color: '#C0C0C0' },
];

interface Props {
  skinTone: string | null;
  undertone: string | null;
  hairColor: string | null;
  onSkinTone: (id: string) => void;
  onUndertone: (id: string) => void;
  onHairColor: (id: string) => void;
}

export function QuizSkinTone({ skinTone, undertone, hairColor, onSkinTone, onUndertone, onHairColor }: Props) {
  const completedCount = [skinTone, undertone, hairColor].filter(Boolean).length;
  const allComplete = completedCount === 3;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-display text-gradient">
          Sua identidade física
        </h2>
        <p className="text-muted-foreground font-body text-sm md:text-base">
          Essas informações ajudam a IA a encontrar suas melhores cores
        </p>
      </div>

      {/* Skin Tone */}
      <Section title="Tom de pele">
        <div className="flex justify-center gap-3 flex-wrap">
          {SKIN_TONES.map((tone, i) => (
            <motion.button
              key={tone.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onSkinTone(tone.id)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={cn(
                  'w-12 h-12 md:w-14 md:h-14 rounded-full border-2 transition-all duration-300',
                  skinTone === tone.id
                    ? 'border-primary scale-110 shadow-glow'
                    : 'border-border hover:border-primary/40 hover:scale-105'
                )}
                style={{ backgroundColor: tone.color }}
              >
                {skinTone === tone.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-full h-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-foreground drop-shadow-md" />
                  </motion.div>
                )}
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground font-body">{tone.label}</span>
            </motion.button>
          ))}
        </div>
      </Section>

      {/* Undertone */}
      <Section title="Subtom">
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {UNDERTONES.map((ut, i) => (
            <motion.button
              key={ut.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              onClick={() => onUndertone(ut.id)}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300',
                undertone === ut.id
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-glow'
                  : 'border-border bg-card hover:border-primary/30'
              )}
            >
              <div
                className="w-8 h-8 rounded-full border border-border"
                style={{ backgroundColor: ut.color }}
              />
              <span className="font-body text-xs font-medium">{ut.label}</span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">{ut.description}</span>
            </motion.button>
          ))}
        </div>
      </Section>

      {/* Hair Color */}
      <Section title="Cor de cabelo">
        <div className="flex justify-center gap-3 flex-wrap">
          {HAIR_COLORS.map((hc, i) => (
            <motion.button
              key={hc.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.06 }}
              onClick={() => onHairColor(hc.id)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={cn(
                  'w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300',
                  hairColor === hc.id
                    ? 'border-primary scale-110 shadow-glow'
                    : 'border-border hover:border-primary/40 hover:scale-105'
                )}
                style={{ backgroundColor: hc.color }}
              >
                {hairColor === hc.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-full h-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white drop-shadow-md" />
                  </motion.div>
                )}
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground font-body">{hc.label}</span>
            </motion.button>
          ))}
        </div>
      </Section>

      {/* Celebration when all complete */}
      <AnimatePresence>
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary animate-pulse-soft" />
              <span className="text-sm font-body text-primary font-medium">
                Identidade física completa!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-center text-sm font-body font-medium text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      {children}
    </div>
  );
}
