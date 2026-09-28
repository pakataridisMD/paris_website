import { setRequestLocale } from 'next-intl/server';
import { EducationPage } from '@/components/site/education';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return pageMetadata(locale, 'education');
}

export default async function Education({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id='content'>
      <EducationPage />
    </main>
  );
}
