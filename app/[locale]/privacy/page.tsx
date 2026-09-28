import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return pageMetadata(locale, 'privacy');
}

export default async function Privacy({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Privacy');
  const sections = t.raw('sections') as { heading: string; body: string }[];

  return (
    <main id='content' className='bg-bone pt-40 pb-40 text-ink md:pt-48 md:pb-52'>
      <div className='mx-auto grid max-w-7xl gap-14 px-4 md:grid-cols-12 md:px-8'>
        <header className='md:col-span-4'>
          <div className='md:sticky md:top-32'>
            <p className='font-mono text-[11px] tracking-[0.25em] text-brass uppercase'>{t('label')}</p>
            <h1 className='mt-6 font-serif text-5xl leading-[1.02] font-light tracking-[-0.02em] md:text-6xl'>
              {t('title')}
            </h1>
            <p className='mt-6 font-mono text-[11px] tracking-[0.15em] text-ink/40 uppercase'>{t('updated')}</p>
          </div>
        </header>
        <div className='md:col-span-8'>
          <ol className='border-t border-ink/10'>
            {sections.map((s, i) => (
              <li key={s.heading} className='grid gap-3 border-b border-ink/10 py-8 md:grid-cols-[4rem_1fr] md:py-10'>
                <span className='font-mono text-xs text-ink/35'>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className='font-serif text-2xl font-light'>{s.heading}</h2>
                  <p className='mt-3 max-w-2xl leading-relaxed text-ink/65'>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}
