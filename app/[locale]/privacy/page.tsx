import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { languages } from '@/i18n/config';


export default async function PrivacyPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations('Privacy');

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('information_collection.title')}</h2>
            <p className="mb-4">{t('information_collection.description')}</p>
            <ul className="list-disc pl-6 mb-4">
              <li>{t('information_collection.uploaded_images')}</li>
              <li>{t('information_collection.usage_data')}</li>
              <li>{t('information_collection.device_info')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('data_usage.title')}</h2>
            <p className="mb-4">{t('data_usage.description')}</p>
            <ul className="list-disc pl-6 mb-4">
              <li>{t('data_usage.provide_service')}</li>
              <li>{t('data_usage.improve_service')}</li>
              <li>{t('data_usage.analytics')}</li>
              <li>{t('data_usage.advertising')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('data_storage.title')}</h2>
            <p className="mb-4">{t('data_storage.description')}</p>
            <p className="mb-4">{t('data_storage.temporary')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('third_party.title')}</h2>
            <p className="mb-4">{t('third_party.description')}</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Google Analytics:</strong> {t('third_party.analytics')}</li>
              <li><strong>Google AdSense:</strong> {t('third_party.advertising')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('cookies.title')}</h2>
            <p className="mb-4">{t('cookies.description')}</p>
            <p className="mb-4">{t('cookies.control')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('user_rights.title')}</h2>
            <p className="mb-4">{t('user_rights.description')}</p>
            <ul className="list-disc pl-6 mb-4">
              <li>{t('user_rights.access')}</li>
              <li>{t('user_rights.correction')}</li>
              <li>{t('user_rights.deletion')}</li>
              <li>{t('user_rights.portability')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('contact.title')}</h2>
            <p className="mb-4">{t('contact.description')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('updates.title')}</h2>
            <p className="mb-4">{t('updates.description')}</p>
          </section>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('last_updated')}: {new Date().toLocaleDateString(locale)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateMetadata(
  { params }: any
): Promise<Metadata> {
  const DEFAULT_LOCALE = 'en';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://color-replace.com').replace(/\/+$/, '');
  const awaited = await Promise.resolve(params);
  const locale = awaited?.locale || DEFAULT_LOCALE;
  const isDefault = locale === DEFAULT_LOCALE;
  const canonicalPath = `${isDefault ? '' : '/' + locale}/privacy` || '/privacy';

  const t = await getTranslations({ locale, namespace: 'Privacy' });
  const langMap: Record<string, string> = {};
  for (const { value, hrefLang } of languages) {
    const p = value === DEFAULT_LOCALE ? '/privacy' : `/${value}/privacy`;
    langMap[hrefLang || value] = p;
  }
  (langMap as any)['x-default'] = '/privacy';

  return {
    metadataBase: new URL(siteUrl),
    title: t('title'),
    description: t('description'),
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalPath,
      languages: langMap
    },
    openGraph: {
      type: 'website',
      title: t('title'),
      description: t('description'),
      url: canonicalPath,
      siteName: 'Color Replace',
      images: [{ url: '/logo.png' }],
      locale: locale.replace(/_/g, '-')
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/logo.png']
    }
  };
}
