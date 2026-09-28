import { setRequestLocale } from 'next-intl/server';
import { BusinessPage } from '@/components/site/business';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return pageMetadata(locale, 'business');
}

export default async function Business({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id='content'>
      <BusinessPage />
    </main>
  );
}
