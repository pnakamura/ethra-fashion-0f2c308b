import { Crown, Sparkles, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanBadgeProps {
  planId: string | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const planConfig: Record<string, { 
  label: string; 
  icon: React.ComponentType<{ className?: string }>; 
  colors: string;
  glow?: string;
}> = {
  muse: {
    label: 'Muse',
    icon: Crown,
    colors: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950',
    glow: 'shadow-[0_0_12px_hsl(45_100%_50%_/_0.4)]',
  },
  icon: {
    label: 'Icon',
    icon: Sparkles,
    colors: 'bg-gradient-to-r from-violet-500 to-purple-400 text-white',
    glow: 'shadow-[0_0_12px_hsl(270_80%_60%_/_0.4)]',
  },
  trendsetter: {
    label: 'Trendsetter',
    icon: Zap,
    colors: 'bg-gradient-to-r from-rose-500 to-pink-400 text-white',
    glow: 'shadow-[0_0_12px_hsl(350_80%_60%_/_0.4)]',
  },
  free: {
    label: 'Iniciante',
    icon: Star,
    colors: 'bg-muted text-muted-foreground',
  },
};

export function PlanBadge({ planId, size = 'sm', showLabel = true, className }: PlanBadgeProps) {
  const plan = planConfig[planId || 'free'] || planConfig.free;
  const Icon = plan.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full whitespace-nowrap',
        sizeClasses[size],
        plan.colors,
        plan.glow,
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{plan.label}</span>}
    </span>
  );
}
