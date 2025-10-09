import { languages } from "@/i18n/config";

type HeadInfoProps = {
  locale: string;
  page?: string;
  title: string;
  description: string;
  keywords: string;
};

const DEFAULT_LOCALE = "en";
const FALLBACK_SITE_URL = "https://color-replace.com";

const normalizeSiteUrl = (rawUrl?: string) => {
  if (!rawUrl) {
    return FALLBACK_SITE_URL;
  }

  const trimmed = rawUrl.trim().replace(/\/+$/, "");
  if (!trimmed) {
    return FALLBACK_SITE_URL;
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
};

const buildLocalizedUrl = (locale: string, slug: string, siteUrl: string) => {
  const path = slug ? `/${slug}` : "";
  if (locale === DEFAULT_LOCALE) {
    return `${siteUrl}${path}`;
  }

  return `${siteUrl}/${locale}${path}`;
};

const HeadInfo = ({
  locale,
  page,
  title,
  description,
  keywords,
}: HeadInfoProps) => {
  const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const normalizedSlug = page?.replace(/^\/+|\/+$/g, "") ?? "";
  const canonicalUrl = buildLocalizedUrl(locale, normalizedSlug, siteUrl);
  const defaultHref = buildLocalizedUrl(DEFAULT_LOCALE, normalizedSlug, siteUrl);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    url: canonicalUrl,
    description,
    inLanguage: locale,
    applicationCategory: "ImageEditorApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Batch image color replacement",
      "Multi-color mapping in one pass",
      "Local browser processing for privacy",
    ],
  } as const;

  const ogImage = `${siteUrl}/logo.png`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Color Replace" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={locale.replace(/_/g, "-")} />
      {languages
        .filter(({ value }) => value !== locale)
        .map(({ value, hrefLang }) => (
          <meta
            key={`og-alt-${value}`}
            property="og:locale:alternate"
            content={(hrefLang ?? value).replace(/_/g, "-")}
          />
        ))}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:image" content={ogImage} />

      <link rel="canonical" href={canonicalUrl} />
      {languages.map(({ value, hrefLang }) => {
        const href = buildLocalizedUrl(value, normalizedSlug, siteUrl);
        const hrefAttribute = hrefLang ?? value;
        return (
          <link
            key={`alt-${value}`}
            rel="alternate"
            hrefLang={hrefAttribute}
            href={href}
          />
        );
      })}
      <link rel="alternate" hrefLang="x-default" href={defaultHref} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
};

export default HeadInfo;
