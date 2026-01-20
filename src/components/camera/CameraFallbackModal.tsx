import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmartCameraCapture } from '@/components/try-on/SmartCameraCapture';
import { blobToFile } from '@/lib/camera-fallback';

interface CameraFallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  mode?: 'garment' | 'avatar';
}

export function CameraFallbackModal({ 
  isOpen, 
  onClose, 
  onCapture, 
  mode = 'garment' 
}: CameraFallbackModalProps) {
  const [showCamera, setShowCamera] = useState(false);

  const handleCapture = (blob: Blob) => {
    const file = blobToFile(blob, `${mode}-capture-${Date.now()}.jpg`);
    onCapture(file);
    setShowCamera(false);
    onClose();
  };

  const handleStartCamera = () => {
    setShowCamera(true);
  };

  const handleCancel = () => {
    setShowCamera(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {showCamera ? (
            <SmartCameraCapture
              mode={mode}
              onCapture={handleCapture}
              onCancel={handleCancel}
            />
          ) : (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              />
              
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
              >
                <div className="bg-card rounded-2xl border border-border shadow-elevated p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-amber-500/10">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold">Câmera Alternativa</h3>
                        <p className="text-sm text-muted-foreground">
                          Use a câmera ao vivo
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Alguns dispositivos bloqueiam a câmera pelo seletor de arquivos. 
                      Use a câmera ao vivo como alternativa para capturar sua {mode === 'garment' ? 'peça' : 'foto'}.
                    </p>

                    <div className="bg-secondary/50 rounded-xl p-3 text-xs text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">💡 Dica:</p>
                      <p>
                        A câmera ao vivo oferece melhor qualidade e feedback em tempo real 
                        sobre iluminação e enquadramento.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleStartCamera}
                      className="flex-1 gradient-primary text-primary-foreground"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Abrir Câmera
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
