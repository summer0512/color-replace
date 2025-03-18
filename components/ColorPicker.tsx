'use client'
import { useState, useRef, useCallback, useEffect } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { EyeDropper } from '@/components/EyeDropper';
import { useTranslations } from 'next-intl';

interface ColorPickerProps {
  onChange?: (color: string) => void;
  defaultColor?: string;
  label?: string;
  compact?: boolean;
}

export function ColorPicker({
  onChange,
  defaultColor = '#000000',
  label,
  compact = false
}: ColorPickerProps) {
  const t = useTranslations('ColorPicker');
  const [color, setColor] = useState(defaultColor);
  const [isTransparent, setIsTransparent] = useState(defaultColor === 'transparent');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleColorChange = useCallback((newColor: string) => {
    if (!isTransparent) {
      setColor(newColor);
      onChange?.(newColor);
    }
  }, [onChange, isTransparent]);

  const handleTransparentToggle = () => {
    const newIsTransparent = !isTransparent;
    setIsTransparent(newIsTransparent);
    if (newIsTransparent) {
      onChange?.('transparent');
      setIsPickerOpen(false);
    } else {
      onChange?.(color);
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
      setIsPickerOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div ref={pickerRef} className="relative">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 min-w-[4rem]">
          {label}
        </label>

        <div className="flex items-center space-x-1">
          {/* Color preview and input */}
          <div className={`flex items-center border rounded-md overflow-hidden ${isTransparent ? 'opacity-50' : ''}`}>
            <button
              className="w-6 h-6 border-r relative"
              style={{ backgroundColor: color }}
              onClick={() => !isTransparent && setIsPickerOpen(!isPickerOpen)}
              disabled={isTransparent}
            >
              {isTransparent && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </button>
            {isTransparent ? <span>{t('transparent')}</span> : <HexColorInput
              color={color}
              onChange={handleColorChange}
              className="px-1 py-0.5 w-20 text-sm focus:outline-none"
              prefixed

            />}
          </div>

          {/* Eyedropper button */}
          {!isTransparent && <EyeDropper
            onColorSelect={handleColorChange}
            compact

          />}

          {/* Transparent toggle button */}
          <button
            onClick={handleTransparentToggle}
            className={`px-2 py-1 text-sm rounded transition-colors ${
              isTransparent
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={isTransparent ? t('useColor') : t('useTransparent')}
          >
            <svg 
              className="w-4 h-4" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Color picker popup */}
      {isPickerOpen && !isTransparent && (
        <div className="absolute z-10 mt-1">
          <HexColorPicker color={color} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
}