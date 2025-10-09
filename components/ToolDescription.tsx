import React from 'react';
import { useTranslations } from 'next-intl';

const featureOrder = [1, 2, 3, 4, 5, 6] as const;

const ToolDescription: React.FC = () => {
  const t = useTranslations('ToolDescription');

  return (
    <section
      className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 rounded-lg border border-border bg-gray-50 dark:bg-gray-900"
      aria-labelledby="tool-description-title"
    >
      <h2 id="tool-description-title" className="text-3xl font-bold mb-6">
        🛠️{t('title')}👏
      </h2>
      <div className="space-y-8">
        <p className="text-lg text-muted-foreground">
          {t('mainDescription')}
        </p>

        <div>
          <h3 className="text-xl font-semibold mb-4">
            ✨{t('features.title')}
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {featureOrder.map((num) => (
              <article
                key={`feature-${num}`}
                className="bg-card p-5 rounded-lg shadow-sm border border-border"
              >
                <h4 className="font-semibold text-lg mb-2">
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
              </article>
            ))}
          </div>
        </div>

        <aside className="bg-blue-50/80 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-100 dark:border-blue-900">
          <h3 className="text-xl font-semibold mb-3">
            🛡️{t('privacyTitle')}
          </h3>
          <p className="text-muted-foreground">
            {t('privacyDescription')}
          </p>
        </aside>
      </div>
    </section>
  );
};

export default ToolDescription;
