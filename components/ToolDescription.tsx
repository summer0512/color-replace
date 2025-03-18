import React from 'react';
import { useTranslations } from 'next-intl';

const ToolDescription: React.FC = () => {
  const t = useTranslations('ToolDescription');

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">🛠️ {t('title')} 👏</h2>
      <div className="space-y-6">
        <p className="text-lg">{t('mainDescription')}</p>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">✨ {t('features.title')}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="bg-card p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                <h4 className="font-medium text-lg mb-2 flex items-center">
                  {num === 1 && "🎨 "}
                  {num === 2 && "🖼️ "}
                  {num === 3 && "💻 "}
                  {num === 4 && "📝 "}
                  {num === 5 && "🌈 "}
                  {num === 6 && "🔒 "}
                  {t(`features.feature${num}.title`)}
                </h4>
                <p className="text-muted-foreground">
                  {t(`features.feature${num}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-blue-50/80 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-100 dark:border-blue-900">
          <h3 className="text-xl font-semibold mb-4">🛡️ {t('privacyTitle')}</h3>
          <p className="text-muted-foreground">{t('privacyDescription')}</p>
        </div>
      </div>
    </div>
  );
};

export default ToolDescription;