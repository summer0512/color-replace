import { getTranslations } from 'next-intl/server';
import HeadInfo from '@/components/head-info';


export default async function TermsPage(props: {params: Promise<{locale: string}>}) {
  const t = await getTranslations('Terms');
  const params = await props.params;

  return (
    <>
      <HeadInfo 
        locale={params.locale} 
        page="terms" 
        title={t('title')} 
        description={t('description')} 
        keywords={t('keywords')} 
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('acceptance.title')}</h2>
            <p className="mb-4">{t('acceptance.description')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('service_description.title')}</h2>
            <p className="mb-4">{t('service_description.description')}</p>
            <ul className="list-disc pl-6 mb-4">
              <li>{t('service_description.color_replacement')}</li>
              <li>{t('service_description.image_processing')}</li>
              <li>{t('service_description.free_service')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('user_responsibilities.title')}</h2>
            <p className="mb-4">{t('user_responsibilities.description')}</p>
            <ul className="list-disc pl-6 mb-4">
              <li>{t('user_responsibilities.legal_content')}</li>
              <li>{t('user_responsibilities.copyright')}</li>
              <li>{t('user_responsibilities.appropriate_use')}</li>
              <li>{t('user_responsibilities.no_harmful_content')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('prohibited_uses.title')}</h2>
            <p className="mb-4">{t('prohibited_uses.description')}</p>
            <ul className="list-disc pl-6 mb-4">
              <li>{t('prohibited_uses.illegal_content')}</li>
              <li>{t('prohibited_uses.copyright_violation')}</li>
              <li>{t('prohibited_uses.malicious_use')}</li>
              <li>{t('prohibited_uses.system_abuse')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('intellectual_property.title')}</h2>
            <p className="mb-4">{t('intellectual_property.description')}</p>
            <p className="mb-4">{t('intellectual_property.user_content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('disclaimers.title')}</h2>
            <p className="mb-4">{t('disclaimers.description')}</p>
            <ul className="list-disc pl-6 mb-4">
              <li>{t('disclaimers.as_is')}</li>
              <li>{t('disclaimers.availability')}</li>
              <li>{t('disclaimers.accuracy')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('limitation_liability.title')}</h2>
            <p className="mb-4">{t('limitation_liability.description')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('termination.title')}</h2>
            <p className="mb-4">{t('termination.description')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('changes.title')}</h2>
            <p className="mb-4">{t('changes.description')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('governing_law.title')}</h2>
            <p className="mb-4">{t('governing_law.description')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('contact.title')}</h2>
            <p className="mb-4">{t('contact.description')}</p>
          </section>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('last_updated')}: {new Date().toLocaleDateString(params.locale)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
