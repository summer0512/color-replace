import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from 'next';
import { languages } from '@/i18n/config';
import { getTranslations } from 'next-intl/server';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout(props: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { children } = props;
  const { locale } = await props.params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Ensure important head tags render even when the page is a Client Component.
// This supplies canonical + hreflang for the localized root ("/" or "/{locale}").
export async function generateMetadata(
  { params }: any
): Promise<Metadata> {
  const DEFAULT_LOCALE = 'en';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://color-replace.com').replace(/\/+$/, '');
  const awaited = await Promise.resolve(params);
  const locale = awaited?.locale || DEFAULT_LOCALE;
  const isDefault = locale === DEFAULT_LOCALE;
  const canonicalPath = isDefault ? '/' : `/${locale}`;

  // Title/description fallback for the home page; page-level routes can override.
  // Using next-intl to localize defaults.
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const title = t('title');
  const description = t('description');

  // Build hreflang map
  const langMap: Record<string, string> = {};
  for (const { value, hrefLang } of languages) {
    const p = value === DEFAULT_LOCALE ? '/' : `/${value}`;
    langMap[hrefLang || value] = p;
  }
  // x-default points to default locale
  (langMap as any)['x-default'] = '/';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalPath,
      languages: langMap
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonicalPath,
      siteName: 'Color Replace',
      images: [{ url: '/logo.png' }],
      locale: locale.replace(/_/g, '-')
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo.png']
    }
  };
}
