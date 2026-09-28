import type { Metadata, Viewport } from 'next';
import { Inter_Tight, JetBrains_Mono, Noto_Serif_Display } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { hasLocale, NextIntlClientProvider, useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { site } from '@/lib/site';
import { Footer } from '@/components/site/footer';
import { IntroCurtain } from '@/components/site/intro';
import { Nav } from '@/components/site/nav';
import { Providers } from '@/components/site/providers';
import JsonLd from './json-ld';
import '../globals.css';

const interTight = Inter_Tight({
  subsets: ['latin', 'greek'],
  variable: '--font-inter-tight',
});
const notoSerifDisplay = Noto_Serif_Display({
  subsets: ['latin', 'greek'],
  style: ['normal', 'italic'],
  variable: '--font-noto-serif-display',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'greek'],
  variable: '--font-jetbrains-mono',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c0c0c',
  // Draw edge to edge on notched phones; spacing uses env(safe-area-inset-*).
  viewportFit: 'cover',
};

// Page-specific titles and URLs come from lib/metadata.ts in each page.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'index': true,
      'follow': true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

function SkipLink() {
  const t = useTranslations('A11y');
  return (
    <a
      href='#content'
      className='sr-only fixed top-4 left-4 z-[110] rounded-full bg-bone px-5 py-3 text-sm text-ink focus:not-sr-only'
    >
      {t('skip')}
    </a>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      translate='no'
      className={`${interTight.variable} ${notoSerifDisplay.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta name='google' content='notranslate' />
      </head>
      <body>
        <JsonLd locale={locale} />
        <NextIntlClientProvider>
          <SkipLink />
          <IntroCurtain />
          <Providers>
            <Nav />
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
