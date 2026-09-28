import type { MetadataRoute } from 'next';
import { PRACTICES, site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', ...PRACTICES.map((p) => `/${p}`), '/privacy'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : path === '/privacy' ? 0.3 : 0.8,
    alternates: {
      languages: {
        en: `${site.url}${path}`,
        el: `${site.url}/el${path}`,
      },
    },
  }));
}
