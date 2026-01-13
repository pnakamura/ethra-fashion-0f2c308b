import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Share2, RotateCcw, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TryOnResult {
  id: string;
  result_image_url: string | null;
  garment_image_url: string;
  status: string;
  processing_time_ms: number | null;
  created_at: string;
}

interface TryOnCanvasProps {
  result: TryOnResult | null;
  avatarImageUrl?: string;
  isProcessing?: boolean;
  onRetry?: () => void;
  onSave?: () => void;
}

export function TryOnCanvas({
  result,
  avatarImageUrl,
  isProcessing = false,
  onRetry,
  onSave,
}: TryOnCanvasProps) {
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPosition, setComparisonPosition] = useState(50);
  const [imageRotation, setImageRotation] = useState(0);

  // Detect and correct image orientation if needed
  useEffect(() => {
    if (result?.result_image_url) {
      const img = new Image();
      img.onload = () => {
        // If image is landscape (wider than tall by 20%), it's likely rotated incorrectly
        if (img.width > img.height * 1.2) {
          console.log('Detected rotated image, applying correction');
          setImageRotation(90);
        } else {
          setImageRotation(0);
        }
      };
      img.src = result.result_image_url;
    } else {
      setImageRotation(0);
    }
  }, [result?.result_image_url]);

  const handleDownload = async () => {
    if (!result?.result_image_url) return;

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = result.result_image_url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // If rotation is needed, use canvas to apply it before download
      if (imageRotation !== 0) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // Swap dimensions for 90-degree rotation
        canvas.width = img.height;
        canvas.height = img.width;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((imageRotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `try-on-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      } else {
        // Direct download if no rotation needed
        const response = await fetch(result.result_image_url);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `try-on-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleShare = async () => {
    if (!result?.result_image_url) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Look Virtual',
          text: 'Confira como esta peça ficou em mim!',
          url: result.result_image_url,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <Card className="overflow-hidden shadow-elevated">
      {/* Canvas Area */}
      <div className="relative aspect-[3/4] bg-gradient-to-b from-secondary/50 to-secondary">
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4"
              >
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <p className="text-sm font-medium text-foreground">Processando prova virtual...</p>
              <p className="text-xs text-muted-foreground mt-1">Isso pode levar alguns segundos</p>
            </motion.div>
          ) : result?.result_image_url ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {showComparison && avatarImageUrl ? (
                <div className="relative w-full h-full">
                  {/* Before image */}
                  <img
                    src={avatarImageUrl}
                    alt="Antes"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* After image with clip */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${comparisonPosition}%` }}
                  >
                    <img
                      src={result.result_image_url}
                      alt="Depois"
                      className="w-full h-full object-cover"
                      style={{ width: `${100 / (comparisonPosition / 100)}%` }}
                    />
                  </div>
                  {/* Slider */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-primary-foreground cursor-ew-resize"
                    style={{ left: `${comparisonPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary-foreground shadow-lg flex items-center justify-center">
                      <ChevronLeft className="w-3 h-3 text-primary" />
                      <ChevronRight className="w-3 h-3 text-primary" />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={comparisonPosition}
                    onChange={(e) => setComparisonPosition(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                  />
                </div>
              ) : (
                <img
                  src={result.result_image_url}
                  alt="Resultado"
                  className="w-full h-full object-contain"
                  style={imageRotation ? { 
                    transform: `rotate(${imageRotation}deg)`,
                    maxWidth: '100%',
                    maxHeight: '100%'
                  } : undefined}
                />
              )}
            </motion.div>
          ) : avatarImageUrl ? (
            <motion.div
              key="avatar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src={avatarImageUrl}
                alt="Avatar"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-muted-foreground bg-background/80 px-4 py-2 rounded-full">
                  Selecione uma peça para provar
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Configure seu avatar primeiro
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing time badge */}
        {result?.processing_time_ms && !isProcessing && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-background/80 backdrop-blur rounded-full text-xs text-muted-foreground">
            {(result.processing_time_ms / 1000).toFixed(1)}s
          </div>
        )}
      </div>

      {/* Actions */}
      {result?.result_image_url && !isProcessing && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            {avatarImageUrl && (
              <Button
                variant={showComparison ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setShowComparison(!showComparison)}
              >
                Comparar
              </Button>
            )}
            
            <div className="flex-1" />
            
            <Button variant="ghost" size="icon" onClick={onRetry}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onSave}>
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
