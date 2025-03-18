import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ExampleCase {
  id: number;
  before: string;
  after: string;
  settings?: {
    sourceColor: string;
    targetColor: string;
    tolerance: number;
  }[];
  originImages?: string[]
}

interface UsageExamplesProps {
  onLoadExample?: (settings: { sourceColor: string; targetColor: string; tolerance: number; }[]) => void;
  onImagesUpload?: (images: string[]) => void;
}

const UsageExamples: React.FC<UsageExamplesProps> = ({ onLoadExample, onImagesUpload }) => {
  const t = useTranslations('UsageExamples');

  const examples: ExampleCase[] = [
    {
      id: 1,
      before: '/examples/empty-red.png',
      after: '/examples/empty-blue.png',
      settings: [
        { sourceColor: '#e8431c', targetColor: '#0584f6', tolerance: 35 },
        { sourceColor: '#f9f2ed', targetColor: '#d9f3ff', tolerance: 1 }
      ],
      originImages: [
        '/examples/empty-red.png'
      ]
    },
    {
      id: 2,
      before: '/examples/icons-blue.png',
      after: '/examples/icons-red.png',
      settings: [
        { sourceColor: '#3a78fc', targetColor: '#ff0000', tolerance: 30 }
      ],
      originImages: [
        '/examples/scale.png',
        '/examples/pen.png',
        '/examples/contact.png',
        '/examples/location.png',
      ]
    },
    {
      id: 3,
      before: '/examples/avatar.png',
      after: '/examples/avatar-transparent.png',
      settings: [
        { sourceColor: '#eeaa23', targetColor: 'transparent', tolerance: 20 }
      ],
      originImages: [
        '/examples/avatar.png'
      ]
    }
  ];

  const handleLoadExample = async (example: ExampleCase) => {
    // Step 1: Upload original images if they exist
    if (example.originImages && example.originImages.length > 0 && onImagesUpload) {
      onImagesUpload(example.originImages);
    }

    // Step 2: Load settings into ColorReplaceSettings
    if (example.settings && onLoadExample) {
      onLoadExample(example.settings);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        {t('title')}
      </h2>
      <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
        {t('description')}
      </p>

      <div className="space-y-4 sm:space-y-16">
        {examples.map((example) => (
          <div 
            key={example.id} 
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">
                  {t(`example${example.id}.title`)}
                </h3>
                {example.settings && (
                  <button
                    onClick={() => handleLoadExample(example)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    {t('loadExample')}
                  </button>
                )}
              </div>
              <p className="text-muted-foreground">
                {t(`example${example.id}.description`)}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-4 lg:gap-8">
              {/* Images comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Before image */}
                <div className="checkerboard-bg relative bg-card/50 rounded-lg overflow-hidden p-4">
                  <div className="aspect-video w-full h-full relative">
                    <Image
                      src={example.before}
                      alt={t(`example${example.id}.beforeAlt`)}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 30vw"
                    />
                    <div className="absolute top-0 left-0 bg-black/70 text-white px-3 py-1 rounded-br">
                      {t('before')}
                    </div>
                  </div>
                </div>

                {/* After image */}
                <div className="checkerboard-bg relative bg-card/50 rounded-lg overflow-hidden p-4">
                  <div className="aspect-video w-full h-full relative">
                    <Image
                      src={example.after}
                      alt={t(`example${example.id}.afterAlt`)}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 30vw"
                    />
                    <div className="absolute top-0 left-0 bg-black/70 text-white px-3 py-1 rounded-br">
                      {t('after')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings display */}
              {example.settings && (
                <div className="bg-card/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-3">{t('settingsTitle')}</h4>
                  <div className="space-y-2">
                    {example.settings.map((setting, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-2 rounded-md bg-card">
                        <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[110px]">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: setting.sourceColor }}
                          />
                          <span className="text-sm font-mono">{setting.sourceColor}</span>
                        </div>
                        <svg className="hidden sm:block w-4 h-4 text-muted-foreground flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[110px]">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: setting.targetColor }}
                          />
                          <span className="text-sm font-mono">{setting.targetColor}</span>
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap w-full sm:w-auto sm:ml-auto">
                          <span className="text-sm text-muted-foreground">{t('tolerance')}:</span>
                          <span className="text-sm font-medium">{setting.tolerance}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageExamples;