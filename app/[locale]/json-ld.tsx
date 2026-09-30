import { site } from '@/lib/site';

const nameByLocale: Record<string, string> = {
  en: 'Dr. Paraskevas Pakataridis',
  el: 'Δρ. Παρασκευάς Πακαταρίδης',
};

const descriptionByLocale: Record<string, string> = {
  en: 'Personal physician based in Greece, with international clinical experience in New York and the United Kingdom. Educator and researcher.',
  el: 'Προσωπικός ιατρός με έδρα την Ελλάδα, με διεθνή κλινική εμπειρία στη Νέα Υόρκη και στο Ηνωμένο Βασίλειο. Εκπαιδευτής και ερευνητής.',
};

const jobTitleByLocale: Record<string, string> = {
  en: 'Physician',
  el: 'Ιατρός',
};

export default function JsonLd({ locale }: { locale: string }) {
  const url = locale === 'en' ? site.url : `${site.url}/${locale}`;
  const sameAs = Object.values(site.profiles).filter((p): p is string => Boolean(p));

  // The site name Google shows above results.
  const website = {
    '@type': 'WebSite',
    'name': 'Dr. Paraskevas Pakataridis',
    'alternateName': ['Dr. Pakataridis', 'drpakataridis.com'],
    'url': `${site.url}/`,
  };

  const person = {
    '@type': 'Person',
    'name': nameByLocale[locale] ?? nameByLocale.en,
    'honorificPrefix': locale === 'el' ? 'Δρ.' : 'Dr.',
    'honorificSuffix': 'MD, MMed',
    'jobTitle': jobTitleByLocale[locale] ?? jobTitleByLocale.en,
    'description': descriptionByLocale[locale] ?? descriptionByLocale.en,
    'url': url,
    'image': `${site.url}/images/headshot.jpg`,
    'knowsLanguage': ['en', 'el'],
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': locale === 'el' ? 'Αμαλιάδα' : 'Amaliada',
      'addressCountry': 'GR',
    },
    'areaServed': { '@type': 'Country', 'name': 'Greece' },
    ...(site.phone && { telephone: site.phone }),
    ...(sameAs.length > 0 && { sameAs }),
    'memberOf': [
      { '@type': 'MedicalOrganization', 'name': 'Panhellenic Medical Association' },
      { '@type': 'MedicalOrganization', 'name': 'Medical Association of Amaliada' },
      { '@type': 'MedicalOrganization', 'name': 'Society of American Gastrointestinal and Endoscopic Surgeons' },
      { '@type': 'MedicalOrganization', 'name': 'American College of Surgeons' },
    ],
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [website, person] }),
      }}
    />
  );
}
