import { useTranslations } from 'next-intl';
import { Emblem } from './emblem';

/* Name card shown once when the site first loads (animated in globals.css). */
export function IntroCurtain() {
  const t = useTranslations('Home');
  return (
    <div
      aria-hidden='true'
      className='intro-curtain fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-ink'
    >
      <span className='intro-emblem block'>
        <Emblem className='h-14 w-14 text-brass' />
      </span>
      <div className='overflow-hidden'>
        <span className='intro-word block font-serif text-4xl font-light text-bone italic md:text-5xl'>
          {t('firstName')} {t('lastName')}
        </span>
      </div>
      <span className='intro-line block h-px w-40 origin-left bg-brass' />
    </div>
  );
}
