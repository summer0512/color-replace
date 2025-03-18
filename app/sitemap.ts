import type { MetadataRoute } from 'next'
import { languages } from '@/i18n/config'

const url = process.env.NEXT_PUBLIC_SITE_URL

export default function sitemap(): MetadataRoute.Sitemap {
  return (
    languages.map((item) => {
      let href = `${url}/${item.value}`;
      if (item.value == 'en') {
        href = `${url}`;
      }
      return {
        url: href,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: item.value === 'en' ? 1 : 0.9,
      };
    })
  )
}