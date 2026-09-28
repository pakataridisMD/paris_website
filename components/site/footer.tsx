'use client';

import { useTranslations } from 'next-intl';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PRACTICES } from '@/lib/site';
import { ArrowButton } from './button';
import { useContact } from './contact';
import { Emblem } from './emblem';
import { SplitWords } from './motion';
import { LocaleSwitch } from './nav';
import { useScrollTo } from './scroll';

export function Footer() {
  const t = useTranslations('Footer');
  const nav = useTranslations('Nav');
  const openContact = useContact();
  const scrollTo = useScrollTo();

  return (
    <footer className='grain relative z-30 -mt-10 rounded-t-[2.5rem] bg-ink px-4 pt-24 pb-8 md:-mt-14 md:rounded-t-[3.5rem] md:px-8 md:pt-32'>
      <div className='relative z-10 mx-auto max-w-7xl'>
        <button
          type='button'
          onClick={() => openContact()}
          className='@container group flex w-full cursor-pointer items-end justify-between gap-6 text-left'
        >
          <span className='font-serif text-[min(13cqw,11rem)] leading-[0.95] font-light tracking-[-0.04em] transition-colors duration-500 group-hover:text-brass'>
            <SplitWords text={t('heading')} wordClassName='italic' />
          </span>
          <span className='mb-3 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-bone text-ink transition-all duration-700 ease-out-expo group-hover:rotate-45 group-hover:bg-brass md:mb-6 md:h-28 md:w-28'>
            <ArrowUpRight className='h-6 w-6 md:h-10 md:w-10' />
          </span>
        </button>

        <div className='mt-16 grid gap-12 border-t border-white/10 pt-12 md:grid-cols-12 md:gap-10'>
          <div className='md:col-span-6'>
            <p className='font-mono text-[11px] tracking-[0.25em] text-brass uppercase'>
              {t('appointmentsLabel')}
            </p>
            <p className='mt-4 max-w-sm leading-relaxed text-bone/60'>{t('appointmentsText')}</p>
            <div className='mt-8'>
              <ArrowButton onClick={() => openContact()}>{t('cta')}</ArrowButton>
            </div>
          </div>
          <nav aria-label='Footer' className='md:col-span-3'>
            <ul className='space-y-3'>
              {PRACTICES.map((id, i) => (
                <li key={id}>
                  <Link
                    href={`/${id}`}
                    className='group flex items-baseline gap-4 font-serif text-2xl font-light text-bone/75 transition-colors hover:text-bone'
                  >
                    <span className='font-mono text-[11px] text-bone/35'>0{i + 1}</span>
                    <span className='transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:italic'>
                      {nav(id)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className='flex md:col-span-3 md:justify-end'>
            <Emblem className='h-24 w-24 text-bone/15 md:h-28 md:w-28' />
          </div>
        </div>

        <div className='mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 text-sm text-bone/45 md:flex-row md:items-center md:justify-between'>
          <div>
            <p className='text-bone/75'>{t('name')}</p>
            <p className='mt-1'>
              {t('based')} · © {new Date().getFullYear()} {t('rights')} ·{' '}
              <Link href='/privacy' className='underline-offset-4 transition-colors hover:text-bone hover:underline'>
                {t('privacy')}
              </Link>
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <LocaleSwitch id='footer' />
            <button
              type='button'
              onClick={() => scrollTo()}
              aria-label={t('top')}
              className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/[0.06] text-bone/70 transition hover:bg-bone hover:text-ink'
            >
              <ArrowUp className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
