import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMissions } from '@/hooks/useMissions';
import { CATEGORY_LABELS } from '@/data/missions';
import { cn } from '@/lib/utils';

export function MissionCard() {
  const navigate = useNavigate();
  const { currentMission, progress, isLoading, completedMissions, allMissions } = useMissions();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="p-5 border border-border dark:border-primary/12 bg-card animate-pulse">
          <div className="h-24" />
        </Card>
      </motion.div>
    );
  }

  // All missions complete
  if (!currentMission) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="p-5 border border-border dark:border-primary/12 bg-gradient-to-br from-gold-soft/30 via-card to-primary/10 dark:from-primary/15 dark:via-card dark:to-gold-soft/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-gold-soft dark:shadow-[0_0_20px_hsl(45_100%_55%_/_0.3)]">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-display text-lg font-semibold text-foreground mb-1">
                🎉 Parabéns, Mestre do Estilo!
              </h4>
              <p className="text-sm text-muted-foreground">
                Você completou todas as {allMissions.length} missões. Continue explorando o Aura!
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  const currentProgress = progress.get(currentMission.id);
  const percentage = currentProgress?.percentage ?? 0;
  const isNearComplete = percentage >= 80;
  const Icon = currentMission.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Card 
        className={cn(
          "p-5 border border-border dark:border-primary/12 bg-gradient-to-br from-primary/5 via-card to-gold-soft/20 dark:from-primary/10 dark:via-card dark:to-primary/5 transition-all duration-300",
          isNearComplete && "ring-2 ring-primary/30 dark:ring-primary/50"
        )}
      >
        <div className="flex items-start gap-4">
          <motion.div 
            className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20"
            animate={isNearComplete ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: isNearComplete ? Infinity : 0, duration: 2 }}
          >
            <Icon className="w-5 h-5 text-primary" />
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {CATEGORY_LABELS[currentMission.category]}
              </span>
              <span className="text-xs text-muted-foreground">
                Missão {currentMission.order}/{allMissions.length}
              </span>
            </div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-1">
              {currentMission.title}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {currentMission.description}
            </p>
            
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>
                  {currentProgress?.current ?? 0} de {currentProgress?.target ?? 0}
                  {currentMission.requirement.type === 'count' && ' itens'}
                </span>
                <span className="flex items-center gap-1">
                  {Math.round(percentage)}%
                  {isNearComplete && <span className="text-primary">✨</span>}
                </span>
              </div>
              <div className="h-2 bg-muted dark:bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    isNearComplete 
                      ? "bg-gradient-to-r from-primary via-gold-soft to-primary" 
                      : "gradient-primary"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1">
                🏆 +{currentMission.reward.points} pontos
              </span>
              <Button
                onClick={() => navigate(currentMission.ctaRoute)}
                size="sm"
                className="gradient-primary text-primary-foreground rounded-xl dark:shadow-[0_0_15px_hsl(45_100%_55%_/_0.2)]"
              >
                {currentMission.ctaLabel}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
