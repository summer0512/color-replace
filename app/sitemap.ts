import type { MetadataRoute } from 'next'
import { languages } from '@/i18n/config'

const url = process.env.NEXT_PUBLIC_SITE_URL

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return languages.flatMap((item) => {
    const isEn = item.value === 'en';
    const base = isEn ? `${url}` : `${url}/${item.value}`;

    return [
      {
        url: base,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: isEn ? 1 : 0.9,
      },
      {
        url: `${base}/privacy`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.8,
      },
      {
        url: `${base}/terms`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.8,
      }
    ];
  });
}
