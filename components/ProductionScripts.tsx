'use client';

import Script from 'next/script';
import { useMediaQuery, useProductionSite } from '@/hooks/use-site-runtime';
import { DESKTOP_AD_QUERY, SITE_SCRIPTS } from '@/lib/site-scripts';

export function ProductionScripts() {
  const production = useProductionSite();
  const desktop = useMediaQuery(DESKTOP_AD_QUERY);
  if (!production) return null;

  return <>
    {SITE_SCRIPTS.googleAds && desktop ? (
      <Script id="google-adsense" strategy="afterInteractive" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2623631636848395" crossOrigin="anonymous" />
    ) : null}
    {SITE_SCRIPTS.googleAnalytics ? <>
      <Script strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-DJ2XMKT62S" />
      <Script id="google-analytics" strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-DJ2XMKT62S');
      ` }} />
    </> : null}
  </>;
}
