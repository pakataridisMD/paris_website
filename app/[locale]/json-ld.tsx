const BASE_URL = 'https://pakataridis.com';

const nameByLocale: Record<string, string> = {
  en: 'Dr. Paraskevas Pakataridis',
  el: 'Δρ. Παρασκευάς Πακαταρίδης',
  bg: 'Д-р Параскевас Пакатаридис',
};

const descriptionByLocale: Record<string, string> = {
  en: 'General surgeon in Sofia with international training at Mount Sinai (NYC) and Queen Elizabeth Hospital (Birmingham). Consultations in English, Greek, and Bulgarian.',
  el: 'Γενικός χειρουργός στη Σόφια με διεθνή εκπαίδευση στο Mount Sinai (Νέα Υόρκη) και το Queen Elizabeth Hospital (Μπέρμινχαμ). Συμβουλευτικές σε Αγγλικά, Ελληνικά και Βουλγαρικά.',
  bg: 'Общ хирург в София с международно обучение в Mount Sinai (Ню Йорк) и Queen Elizabeth Hospital (Бирмингам). Консултации на английски, гръцки и български.',
};

const jobTitleByLocale: Record<string, string> = {
  en: 'General Surgeon',
  el: 'Γενικός Χειρουργός',
  bg: 'Общ хирург',
};

export default function JsonLd({ locale }: { locale: string }) {
  const name = nameByLocale[locale] ?? nameByLocale.en;
  const description = descriptionByLocale[locale] ?? descriptionByLocale.en;
  const jobTitle = jobTitleByLocale[locale] ?? jobTitleByLocale.en;
  const url = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`;

  const medicalBusiness = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    'name': name,
    'description': description,
    'url': url,
    'telephone': '+359-XXX-XXX-XXX', // TODO: replace with real number
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'University Hospital Lozenetz',
      'addressLocality': 'Sofia',
      'addressCountry': 'BG',
    },
    'medicalSpecialty': 'GeneralSurgery',
    'availableLanguage': [
      { '@type': 'Language', 'name': 'English' },
      { '@type': 'Language', 'name': 'Greek' },
      { '@type': 'Language', 'name': 'Bulgarian' },
    ],
  };

  const physician = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    'name': name,
    'jobTitle': jobTitle,
    'url': url,
    'description': description,
    'medicalSpecialty': 'GeneralSurgery',
    'knowsLanguage': ['en', 'el', 'bg'],
    'worksFor': {
      '@type': 'Hospital',
      'name': 'University Hospital Lozenetz',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Sofia',
        'addressCountry': 'BG',
      },
    },
    'alumniOf': [
      {
        '@type': 'Hospital',
        'name': 'The Mount Sinai Hospital',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'New York',
          'addressCountry': 'US',
        },
      },
      {
        '@type': 'Hospital',
        'name': 'Queen Elizabeth Hospital',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Birmingham',
          'addressCountry': 'GB',
        },
      },
    ],
    'memberOf': [
      {
        '@type': 'MedicalOrganization',
        'name': 'Society of American Gastrointestinal and Endoscopic Surgeons',
      },
      {
        '@type': 'MedicalOrganization',
        'name': 'American College of Surgeons',
      },
    ],
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalBusiness),
        }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(physician),
        }}
      />
    </>
  );
}
