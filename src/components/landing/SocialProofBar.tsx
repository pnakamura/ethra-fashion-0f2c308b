import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { Users, Star, Shirt } from 'lucide-react';

function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    latest >= 1000 ? `${(latest / 1000).toFixed(1)}k` : Math.round(latest).toLocaleString('pt-BR')
  );

  useEffect(() => {
    const controls = animate(count, target, { duration, ease: 'easeOut' });
    return controls.stop;
  }, [count, target, duration]);

  return <motion.span>{rounded}</motion.span>;
}

const stats = [
  { icon: Users, value: 12400, label: 'usuárias ativas', suffix: '+' },
  { icon: Star, value: 4.9, label: 'avaliação média', suffix: '' },
  { icon: Shirt, value: 87000, label: 'looks criados', suffix: '+' },
];

export function SocialProofBar() {
  return (
    <motion.section
      className="py-6 px-6 border-b border-border/30 bg-secondary/20"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-8 md:gap-16 flex-wrap">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2.5">
            <stat.icon className="w-4 h-4 text-primary" />
            <div className="text-sm">
              <span className="font-bold text-foreground">
                {typeof stat.value === 'number' && stat.value > 100 ? (
                  <AnimatedCounter target={stat.value} />
                ) : (
                  stat.value
                )}
                {stat.suffix}
              </span>{' '}
              <span className="text-muted-foreground">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
