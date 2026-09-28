'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { Practice } from '@/lib/site';
import { cn } from '@/lib/utils';

/* Large link at the end of a practice page leading to the next one. */
export function NextChapter({
  to,
  tone = 'dark',
}: {
  to: Practice;
  tone?: 'dark' | 'light';
}) {
  const t = useTranslations('Page');
  const nav = useTranslations('Nav');
  const light = tone === 'light';

  return (
    <section className={cn('pt-10 pb-36 md:pb-48', light ? 'bg-bone text-ink' : 'bg-ink text-bone')}>
      <div className='mx-auto max-w-7xl px-4 md:px-8'>
        <Link
          href={`/${to}`}
          className={cn(
            '@container group flex items-end justify-between gap-6 border-t pt-10',
            light ? 'border-ink/10' : 'border-white/10',
          )}
        >
          <span>
            <span className='font-mono text-[11px] tracking-[0.25em] text-brass uppercase'>
              {t('next')}
            </span>
            <span className='mt-4 block font-serif text-[min(11cqw,8rem)] leading-none font-light tracking-[-0.03em] transition-all duration-700 ease-out-expo group-hover:translate-x-4 group-hover:italic'>
              {nav(to)}
            </span>
          </span>
          <span
            className={cn(
              'mb-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-1 transition-all duration-500 md:h-20 md:w-20',
              light
                ? 'ring-ink/15 group-hover:bg-ink group-hover:text-bone'
                : 'ring-white/15 group-hover:bg-bone group-hover:text-ink',
            )}
          >
            <ArrowRight className='h-5 w-5 transition-transform duration-500 group-hover:-rotate-45 md:h-7 md:w-7' />
          </span>
        </Link>
      </div>
    </section>
  );
}
