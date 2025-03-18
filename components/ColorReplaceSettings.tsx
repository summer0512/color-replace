'use client'
import { useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ColorPicker } from '@/components/ColorPicker';
// 添加 Trash2 图标导入
import { Plus, Download, Settings, Trash2 } from 'lucide-react';

// Define the structure for a color replacement pair
interface ColorPair {
  id: string;
  sourceColor: string;
  targetColor: string;
  tolerance: number;
}

// 添加 hasFiles 属性到接口
interface ColorReplaceSettingsProps {
  onChange?: (settings: ColorPair[]) => void;
  onHeightChange?: (height: number) => void;
  children?: ReactNode;
  defaultSettings?: ColorPair[];
  hasFiles?: boolean;
}

export function ColorReplaceSettings({ onChange, onHeightChange, children, defaultSettings, hasFiles }: ColorReplaceSettingsProps) {
  const settingsRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('ColorReplaceSettings');
  const [colorPairs, setColorPairs] = useState<ColorPair[]>([
    {
      id: '1',
      sourceColor: '#FFFFFF',
      targetColor: '#000000',
      tolerance: 15,
    }
  ]);

  // Update settings when defaultSettings changes
  useEffect(() => {
    if (defaultSettings && defaultSettings.length > 0) {
      setColorPairs(defaultSettings);
    }
  }, [defaultSettings]);

  // Notify parent of settings changes
  useEffect(() => {
    onChange?.(colorPairs);
  }, [colorPairs, onChange]);

  // Monitor height changes
  useEffect(() => {
    const updateHeight = () => {
      if (settingsRef.current) {
        const height = settingsRef.current.offsetHeight;
        onHeightChange?.(height);
      }
    };

    // Update height initially and when colorPairs change
    updateHeight();

    // Use ResizeObserver to detect height changes
    const resizeObserver = new ResizeObserver(updateHeight);
    if (settingsRef.current) {
      resizeObserver.observe(settingsRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [colorPairs, onHeightChange]);

  // Add a new color pair
  const handleAddPair = useCallback(() => {
    const newPair: ColorPair = {
      id: Date.now().toString(),
      sourceColor: '#FFFFFF',
      targetColor: '#000000',
      tolerance: 15,
    };
    setColorPairs(prev => [...prev, newPair]);
  }, []);

  // Remove a color pair by id
  const handleRemovePair = useCallback((id: string) => {
    setColorPairs(prev => prev.filter(pair => pair.id !== id));
  }, []);

  // Update a specific field of a color pair
  const handlePairChange = useCallback((id: string, field: keyof ColorPair, value: string | number) => {
    setColorPairs(prev => prev.map(pair => {
      if (pair.id === id) {
        return { ...pair, [field]: value };
      }
      return pair;
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    onChange?.(colorPairs);
  }, [colorPairs, onChange]);

  const handleDownload = useCallback(async () => {
    const event = new CustomEvent('downloadProcessedImages');
    window.dispatchEvent(event);
  }, []);

  const handleClearFiles = useCallback(() => {
    const event = new CustomEvent('clearUploadedFiles');
    window.dispatchEvent(event);
  }, []);

  return (
    <div ref={settingsRef} className="bg-background/95 backdrop-blur-sm rounded-lg py-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-2 mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Settings size={20} className="text-blue-500" /> 
          {t('title')}
        </h3>
        <div className="flex items-center gap-2">
          {hasFiles && (
            <button
              onClick={handleClearFiles}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-1"
            >
              <Trash2 size={16} /> {t('clearFiles')}
            </button>
          )}
          <button
            onClick={handleAddPair}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
          >
            <Plus size={16} /> {t('addColorPair')}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
          >
            <Download size={16} /> {t('download')}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {colorPairs.map((pair) => (
          <div
            key={pair.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-gray-50/80 hover:bg-gray-100/90 transition-colors shadow-md hover:shadow-lg"
          >

            <div className="flex-1 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 items-center">
              <ColorPicker
                label={t('sourceColor')}
                defaultColor={pair.sourceColor}
                onChange={(color) => handlePairChange(pair.id, 'sourceColor', color)}
                compact
              />
              <ColorPicker
                label={t('targetColor')}
                defaultColor={pair.targetColor}
                onChange={(color) => handlePairChange(pair.id, 'targetColor', color)}
                compact
              />

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{t('toleranceTitle')}</span>
                  <span className="font-medium">{pair.tolerance}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">{t('toleranceLow')}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={pair.tolerance}
                    onChange={(e) => handlePairChange(pair.id, 'tolerance', parseInt(e.target.value))}
                    className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">{t('toleranceHigh')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRemovePair(pair.id)}
              className="text-red-500 hover:text-red-600 p-1"
              title={t('removeColorPair')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}