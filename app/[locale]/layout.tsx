import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Raleway,
  Playfair_Display,
  DM_Sans,
  Instrument_Serif,
  Outfit,
  Cormorant_Garamond,
  Source_Sans_3,
  Urbanist,
  Manrope,
  Lora,
  Nunito_Sans,
  Syne,
  Inter,
} from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import '../globals.css';

const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-raleway',
});
const syne = Syne({
  subsets: ['latin', 'greek'],
  variable: '--font-syne',
});
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Design 1 fonts
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

// Design 2 fonts
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument',
});
const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

// Design 3 fonts
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
});
const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
});

// Design 4 fonts
const urbanist = Urbanist({ subsets: ['latin'], variable: '--font-urbanist' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

// Design 5 fonts
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });
const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
});

export const metadata: Metadata = {
  title: 'Dr. Paraskevas Pakataridis, MD — General Surgery, Sofia',
  description:
    'International perspective. Local care. General surgery consultations in Sofia with Dr. Paraskevas Pakataridis.',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as 'en' | 'el' | 'bg')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      translate='no'
      className={`${raleway.variable} ${syne.variable} ${inter.variable} ${playfairDisplay.variable} ${dmSans.variable} ${instrumentSerif.variable} ${outfit.variable} ${cormorantGaramond.variable} ${sourceSans3.variable} ${urbanist.variable} ${manrope.variable} ${lora.variable} ${nunitoSans.variable}`}
    >
      <head>
        <meta name='google' content='notranslate' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
