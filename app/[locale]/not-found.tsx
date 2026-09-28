import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Emblem } from '@/components/site/emblem';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <main
      id='content'
      className='grain relative flex min-h-[100svh] items-center bg-ink px-4 pt-32 pb-40 md:px-8'
    >
      {/* React hoists this into <head>; not-found pages can't export metadata */}
      <title>{`${t('title')} — Dr. Paraskevas Pakataridis`}</title>
      <div className='relative z-10 mx-auto w-full max-w-7xl'>
        <Emblem className='h-16 w-16 text-brass' />
        <p className='mt-10 font-mono text-[11px] tracking-[0.25em] text-brass uppercase'>{t('label')}</p>
        <h1 className='mt-6 max-w-3xl font-serif text-[clamp(2.8rem,7vw,6.5rem)] leading-[1] font-light tracking-[-0.03em]'>
          {t('title')}
        </h1>
        <p className='mt-6 max-w-md text-lg text-bone/55'>{t('text')}</p>
        <Link
          href='/'
          className='group mt-12 inline-flex items-center gap-3 rounded-full border border-white/25 px-6 py-3 text-sm transition hover:bg-bone hover:text-ink'
        >
          <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
          {t('cta')}
        </Link>
      </div>
    </main>
  );
}
