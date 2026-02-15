import { motion } from 'framer-motion';
import { Shield, CreditCard, RefreshCw, Lock } from 'lucide-react';

const badges = [
  { icon: Shield, label: 'Dados protegidos', description: 'Criptografia de ponta a ponta' },
  { icon: CreditCard, label: 'Sem cartão', description: 'Para começar, não pedimos nada' },
  { icon: RefreshCw, label: 'Cancele quando quiser', description: 'Sem multa, sem burocracia' },
  { icon: Lock, label: 'Privacidade total', description: 'Suas fotos nunca são compartilhadas' },
];

export function TrustBadges() {
  return (
    <section className="py-12 px-6 border-y border-border/30 bg-secondary/10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.label}
              className="text-center"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <badge.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium">{badge.label}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
