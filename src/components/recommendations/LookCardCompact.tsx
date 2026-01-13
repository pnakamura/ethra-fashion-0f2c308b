import { motion } from 'framer-motion';
import { Sparkles, Camera } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LookItem {
  id: string;
  image_url?: string;
  imageUrl?: string;
  category?: string;
}

interface Look {
  name: string;
  items: LookItem[];
  occasion?: string;
  harmony_explanation?: string;
}

interface LookCardCompactProps {
  look: Look;
  index?: number;
  onTryOn?: () => void;
  onOpenCanvas?: () => void;
}

export function LookCardCompact({
  look,
  index = 0,
  onTryOn,
  onOpenCanvas,
}: LookCardCompactProps) {
  const displayItems = look.items.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-44 snap-start"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Visual stack of items */}
        <div className="relative h-32 bg-gradient-to-br from-secondary to-secondary/50">
          {displayItems.map((item, i) => {
            const imageUrl = item.image_url || item.imageUrl;
            return (
              <motion.img
                key={item.id}
                src={imageUrl}
                alt=""
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="absolute w-16 h-16 object-cover rounded-lg shadow-md border border-background"
                style={{
                  left: `${8 + i * 22}%`,
                  top: `${12 + i * 18}%`,
                  transform: `rotate(${-6 + i * 6}deg)`,
                  zIndex: i,
                }}
              />
            );
          })}
          
          {/* Item count badge */}
          {look.items.length > 3 && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-background/90 backdrop-blur rounded-full text-[10px] font-medium">
              +{look.items.length - 3}
            </div>
          )}
        </div>

        <div className="p-3 space-y-2">
          <div>
            <p className="font-medium text-sm truncate">{look.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">
              {look.items.length} peças • {look.occasion || 'Casual'}
            </p>
          </div>

          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-7 text-xs px-2"
              onClick={onOpenCanvas}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Canvas
            </Button>
            <Button
              size="sm"
              className="flex-1 h-7 text-xs px-2 gradient-primary"
              onClick={onTryOn}
            >
              <Camera className="w-3 h-3 mr-1" />
              Provar
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
