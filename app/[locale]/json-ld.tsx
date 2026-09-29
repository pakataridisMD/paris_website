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

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': nameByLocale[locale] ?? nameByLocale.en,
    'jobTitle': jobTitleByLocale[locale] ?? jobTitleByLocale.en,
    'description': descriptionByLocale[locale] ?? descriptionByLocale.en,
    'url': url,
    'image': `${site.url}/images/headshot.jpg`,
    'knowsLanguage': ['en', 'el'],
    'address': { '@type': 'PostalAddress', 'addressCountry': 'GR' },
    ...(site.phone && { telephone: site.phone }),
    'memberOf': [
      { '@type': 'MedicalOrganization', 'name': 'Society of American Gastrointestinal and Endoscopic Surgeons' },
      { '@type': 'MedicalOrganization', 'name': 'American College of Surgeons' },
    ],
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
