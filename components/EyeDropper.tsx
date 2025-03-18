'use client'
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Pipette } from 'lucide-react';

interface EyeDropperProps {
  onColorSelect: (color: string) => void;
  compact?: boolean;
}

export function EyeDropper({ onColorSelect, compact = false }: EyeDropperProps) {
  const t = useTranslations('EyeDropper');
  // Use client-side state to determine EyeDropper support
  const [isSupported, setIsSupported] = useState(false);
  // Track the color picking state
  const [isPickingColor, setIsPickingColor] = useState(false);

  useEffect(() => {
    // Check EyeDropper support only on the client side
    setIsSupported(typeof window !== 'undefined' && 'EyeDropper' in window);
  }, []);

  const handleEyeDropper = async () => {
    try {
      setIsPickingColor(true);
      // @ts-ignore - EyeDropper API is not yet defined in TypeScript
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      onColorSelect(result.sRGBHex);
    } catch (error) {
      console.error('EyeDropper error:', error);
    } finally {
      setIsPickingColor(false);
    }
  };

  // Don't render if the browser doesn't support EyeDropper
  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={handleEyeDropper}
      disabled={isPickingColor}
      className={`${compact ? 'p-1' : 'p-2'} rounded-md border ${
        isPickingColor 
          ? 'bg-gray-100 cursor-not-allowed' 
          : 'hover:bg-gray-50'
      }`}
      title={t('tooltip')}
    >
      <Pipette className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
    </button>
  );
}