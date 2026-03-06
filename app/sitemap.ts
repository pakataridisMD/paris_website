import type { MetadataRoute } from 'next';

const BASE_URL = 'https://pakataridis.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: BASE_URL,
          el: `${BASE_URL}/el`,
          bg: `${BASE_URL}/bg`,
        },
      },
    },
  ];
}
