import { getTranslations } from 'next-intl/server';
import HeadInfo from '@/components/head-info';


export default async function PrivacyPage(props: {params: Promise<{locale: string}>}) {
  const params = await props.params;
  const locale = params.locale;
  const t = await getTranslations('Privacy');

  return (
    <>
      <HeadInfo 
        locale={locale} 
        page="privacy" 
        title={t('title')} 
        description={t('description')} 
        keywords={t('keywords')} 
      />
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
