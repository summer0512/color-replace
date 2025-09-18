import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function Footer() {
  const t = await getTranslations('Footer');

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 Color Replace. {t('rights_reserved')}
          </div>
          <div className="flex gap-6 text-sm">
            <Link 
              href="/privacy" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('privacy_policy')}
            </Link>
            <Link 
              href="/terms" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('terms_of_service')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
