/**
 * Camera Fallback Utilities
 * Handles fallback to WebRTC when input file capture fails silently
 */

import { toast } from 'sonner';
import { isCameraAvailable, checkCameraPermission, showPermissionDeniedToast } from './camera-permissions';

export interface CameraFallbackOptions {
  facingMode?: 'user' | 'environment';
  onFile?: (file: File) => void;
  onFallbackNeeded?: () => void;
  timeoutMs?: number;
}

/**
 * Attempt to open camera via file input, falling back to WebRTC if it fails silently
 * 
 * Many devices (especially iOS Safari) silently fail to open the camera picker.
 * This utility detects that and triggers a fallback callback.
 */
export async function openCaptureInputWithFallback(options: CameraFallbackOptions): Promise<void> {
  const {
    facingMode = 'environment',
    onFile,
    onFallbackNeeded,
    timeoutMs = 1500,
  } = options;

  // First check camera availability
  const hasCamera = await isCameraAvailable();
  if (!hasCamera) {
    toast.error('Câmera não encontrada', {
      description: 'Nenhuma câmera foi detectada no seu dispositivo.',
      duration: 5000,
    });
    return;
  }

  // Check permission status
  const permissionStatus = await checkCameraPermission();
  if (permissionStatus === 'denied') {
    showPermissionDeniedToast();
    return;
  }

  console.log('[CameraFallback] Opening capture input with fallback...');

  // Track if file selection happened
  let fileSelected = false;
  let inputClicked = false;

  // Create a new input element
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.setAttribute('capture', facingMode);

  // Handle file selection
  input.onchange = (e) => {
    fileSelected = true;
    console.log('[CameraFallback] File selected via input');
    
    const target = e.target as HTMLInputElement;
    if (target.files?.[0] && onFile) {
      onFile(target.files[0]);
    }
  };

  // Listen for focus return (user cancelled or completed)
  const handleFocus = () => {
    // Small delay to allow onchange to fire first
    setTimeout(() => {
      if (!fileSelected && inputClicked) {
        console.log('[CameraFallback] No file selected after focus return');
      }
      window.removeEventListener('focus', handleFocus);
    }, 300);
  };

  window.addEventListener('focus', handleFocus);

  // Trigger the click
  input.click();
  inputClicked = true;

  // Set timeout for fallback - if nothing happens, trigger fallback
  setTimeout(() => {
    if (!fileSelected && onFallbackNeeded) {
      console.log('[CameraFallback] Timeout reached without file selection, triggering fallback');
      
      // Check if WebRTC is available before offering fallback
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        onFallbackNeeded();
      } else {
        console.warn('[CameraFallback] WebRTC not available, cannot offer fallback');
        toast.error('Câmera não disponível', {
          description: 'Seu navegador não suporta acesso à câmera. Tente usar a galeria.',
          duration: 6000,
        });
      }
    }
  }, timeoutMs);
}

/**
 * Convert a Blob from WebRTC capture to a File object
 */
export function blobToFile(blob: Blob, filename: string = 'camera-capture.jpg'): File {
  return new File([blob], filename, { type: blob.type || 'image/jpeg' });
}

/**
 * Convert a data URL to a File object
 */
export function dataUrlToFile(dataUrl: string, filename: string = 'camera-capture.jpg'): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}
