import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { languages } from '@/i18n/config';
import { Github } from 'lucide-react';

export default async function Footer() {
  const t = await getTranslations('Footer');

  // Friend links (external). Set follow=true for dofollow links.
  const friendLinks: { name: string; href: string; follow?: boolean }[] = [
    { name: 'Time Card Calculator', href: 'https://time-card-calculator.work/', follow: true },
    { name: 'Wordle Hint', href: 'https://wordle-hint.net/', follow: true},
    { name: 'Termo Jogo', href: 'https://termo-jogo.com/', follow: true},
  ];

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-300">
      <div className="container mx-auto px-4 py-10">
        {/* Grid: brand/legal | languages | links | friends */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Brand / Copyright */}
          <div className="flex flex-col gap-2">
            <div className="text-base font-semibold text-neutral-100">
              Color Replace
            </div>
            <p className="text-sm text-neutral-400">© 2025 Color Replace. {t('rights_reserved')}</p>
            {/* Site Links */}
            <div className="mt-2">
              {/* <div className="text-xs uppercase tracking-wide text-neutral-400 mb-3">Links</div> */}
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    {t('privacy_policy')}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    {t('terms_of_service')}
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/summer0512/color-replace"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-2 text-sm font-medium hover:text-white transition-colors"
                    aria-label="Open GitHub repository"
                  >
                    <Github className="h-5 w-5" aria-hidden="true" />
                    <span className="hidden sm:inline">GitHub</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Languages */}
          <div className="text-left md:text-center">
            <div className="text-xs uppercase tracking-wide text-neutral-400 mb-3">Languages</div>
            <ul className="flex flex-wrap gap-x-3 gap-y-2 text-sm">
              {languages.map(({ value, label, hrefLang }) => {
                const href = value === 'en' ? '/' : `/${value}`;
                return (
                  <li key={value}>
                    <a
                      href={href}
                      hrefLang={hrefLang || value}
                      className="hover:text-white transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Friend Links */}
          <div className="md:text-right">
            <div className="text-xs uppercase tracking-wide text-neutral-400 mb-3">Friend Links</div>
            {friendLinks.length === 0 ? (
              <p className="text-sm text-neutral-500">Coming soon</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {friendLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel={l.follow ? 'noopener noreferrer' : 'nofollow noopener noreferrer'}
                      className="hover:text-white transition-colors"
                    >
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
