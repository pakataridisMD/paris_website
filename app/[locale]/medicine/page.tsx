import { setRequestLocale } from 'next-intl/server';
import { MedicinePage } from '@/components/site/medicine';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return pageMetadata(locale, 'medicine');
}

export default async function Medicine({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id='content'>
      <MedicinePage />
    </main>
  );
}
