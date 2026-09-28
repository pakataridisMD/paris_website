'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { site } from '@/lib/site';
import headshot from '@/public/images/headshot.jpg';
import { ArrowButton } from './button';
import { useContact } from './contact';
import { EASE, Reveal } from './motion';
import { NextChapter } from './next-chapter';
import { PageHero } from './page-hero';

export function MedicinePage() {
  const t = useTranslations('Medicine');
  const openContact = useContact();
  const points = t.raw('points') as string[];

  const details = [
    { label: t('location'), value: t('locationValue') },
    { label: t('languages'), value: t('languagesValue') },
    { label: t('appointments'), value: t('appointmentsValue') },
    site.phone && { label: t('phone'), value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <>
      <PageHero
        tone='light'
        index='02'
        label={t('label')}
        title={t('heading')}
        titleAccent={t('headingAccent')}
        intro={t('intro')}
        image={headshot}
        imageAlt={t('label')}
        imagePosition='object-[50%_25%]'
      />

      <section className='bg-bone pb-24 text-ink md:pb-36'>
        <div className='mx-auto grid max-w-7xl gap-16 px-4 md:grid-cols-12 md:gap-10 md:px-8'>
          <div className='md:col-span-7'>
            <Heartbeat />
            <ul className='mt-6 border-t border-ink/10'>
              {points.map((point, i) => (
                <Reveal key={point} delay={i * 0.06} y={20}>
                  <li className='group flex items-center justify-between border-b border-ink/10 py-6'>
                    <span className='flex items-baseline gap-6'>
                      <span className='font-mono text-xs text-ink/35'>0{i + 1}</span>{' '}
                      <span className='font-serif text-2xl font-light transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:text-3xl'>
                        {point}
                      </span>
                    </span>
                    <ArrowRight className='h-5 w-5 -translate-x-3 text-brass opacity-0 transition duration-500 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100' />
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal>
              <p className='mt-10 max-w-lg leading-relaxed text-ink/55'>{t('about')}</p>
            </Reveal>
          </div>

          <div className='md:col-span-5'>
            <Reveal className='md:sticky md:top-28'>
              <div className='grain relative isolate overflow-hidden rounded-[28px] bg-ink p-8 text-bone shadow-[0_40px_80px_-40px_rgba(12,12,12,0.5)] md:p-10'>
                <div className='relative z-10'>
                  <p className='font-serif text-4xl font-light italic'>{t('contactTitle')}</p>
                  <dl className='mt-10 space-y-6'>
                    {details.map((d) => (
                      <div key={d.label} className='border-t border-white/10 pt-4'>
                        <dt className='font-mono text-[11px] tracking-[0.2em] text-bone/40 uppercase'>
                          {d.label}
                        </dt>
                        <dd className='mt-1.5 text-lg break-all'>
                          {d.href ? (
                            <a href={d.href} className='underline-offset-4 transition-colors hover:text-brass hover:underline'>
                              {d.value}
                            </a>
                          ) : (
                            d.value
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className='mt-10'>
                    <ArrowButton onClick={() => openContact('medical')}>{t('cta')}</ArrowButton>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <NextChapter to='education' tone='light' />
    </>
  );
}

/* ECG trace that draws itself, then a pulse keeps travelling along it. */
function Heartbeat() {
  const d =
    'M0 40 H170 L185 40 L197 22 L210 40 L222 40 L232 8 L246 72 L258 30 L268 40 L290 40 L302 32 L314 40 H600';
  return (
    <svg viewBox='0 0 600 80' className='h-16 w-full max-w-xl text-brass' fill='none' aria-hidden='true'>
      <motion.path
        d={d}
        stroke='currentColor'
        strokeOpacity={0.35}
        strokeWidth={1.25}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: EASE }}
      />
      <motion.path
        d={d}
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        initial={{ pathLength: 0.12, pathOffset: 0, opacity: 0 }}
        whileInView={{ pathOffset: [0, 1], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </svg>
  );
}
