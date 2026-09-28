'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PRACTICES, type Practice } from '@/lib/site';
import { cn } from '@/lib/utils';
import headshot from '@/public/images/headshot.jpg';
import { ArrowButton } from './button';
import { useContact } from './contact';
import { SmoothImage } from './media';
import { EASE, Reveal, ScrollLitText, SplitWords, useEntranceDelay } from './motion';

export function HomeHero() {
  const t = useTranslations('Home');
  const openContact = useContact();
  const delay = useEntranceDelay();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className='grain relative min-h-[100svh] overflow-hidden bg-ink'>
      <div className='relative z-10 mx-auto grid min-h-[100svh] max-w-7xl gap-12 px-4 pt-32 pb-12 md:grid-cols-12 md:gap-10 md:px-8 md:pt-36'>
        {/* @container: the name is sized to this column, so it never runs under the photo */}
        <motion.div style={{ y: textY, opacity: fade }} className='@container relative z-10 flex flex-col md:col-span-7'>
          <motion.p
            className='font-mono text-[11px] tracking-[0.25em] text-brass uppercase'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay, duration: 1 }}
          >
            {t('eyebrow')}
          </motion.p>

          <h1 className='mt-10 font-serif text-[min(14.5cqw,9.5rem)] leading-[0.95] font-light tracking-[-0.035em] md:mt-auto'>
            <SplitWords immediate delay={delay} text={t('firstName')} className='block' />{' '}
            <SplitWords
              immediate
              delay={delay + 0.12}
              text={t('lastName')}
              className='block text-brass italic'
            />
          </h1>

          <motion.div
            className='mt-10 flex flex-col gap-10 md:mt-14'
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.4, duration: 1.1, ease: EASE }}
          >
            <p className='max-w-md text-lg leading-relaxed text-bone/60'>{t('statement')}</p>
            <div className='flex flex-wrap items-center gap-x-8 gap-y-5'>
              <ArrowButton onClick={() => openContact('medical')}>{t('cta')}</ArrowButton>
              <span className='font-mono text-[11px] tracking-[0.2em] text-bone/40 uppercase'>
                {t('based')}
              </span>
            </div>
          </motion.div>
        </motion.div>

        <div className='md:col-span-5 md:self-end'>
          <motion.figure
            style={{ scale: photoScale }}
            className='relative isolate aspect-[4/5] origin-bottom overflow-hidden rounded-[28px] bg-ink-soft'
            initial={{ clipPath: 'inset(100% 0% 0% 0% round 28px)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
            transition={{ delay: delay - 0.1, duration: 1.6, ease: EASE }}
          >
            <motion.div
              style={{ y: photoY }}
              className='absolute inset-x-0 -top-[6%] -bottom-[6%]'
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay - 0.1, duration: 2.2, ease: EASE }}
            >
              <SmoothImage
                src={headshot}
                alt={t('portraitAlt')}
                fill
                priority
                quality={90}
                sizes='(min-width: 768px) 40vw, 100vw'
                placeholder='blur'
                className='object-cover object-[50%_25%]'
              />
            </motion.div>
            <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent' />
          </motion.figure>
          <motion.div
            className='mt-4 flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-bone/40 uppercase'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.8 }}
          >
            <span className='hidden whitespace-nowrap lg:inline'>P. Pakataridis, MD</span>
            <span className='flex items-center gap-3'>
              {t('scroll')}
              <span className='relative block h-px w-10 overflow-hidden bg-bone/15'>
                <motion.span
                  className='absolute inset-y-0 left-0 w-1/2 bg-bone/70'
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* Index of the three practices. Hovering one quietly dims the others. */
export function Practices() {
  const t = useTranslations('Home');
  const [active, setActive] = useState<Practice | null>(null);

  return (
    <section className='grain relative bg-ink pt-16 pb-32 md:pt-24 md:pb-44'>
      <div className='relative z-10 mx-auto max-w-7xl px-4 md:px-8'>
        <div className='flex flex-col justify-between gap-6 md:flex-row md:items-end'>
          <Reveal>
            <p className='font-mono text-[11px] tracking-[0.25em] text-brass uppercase'>
              {t('practicesLabel')}
            </p>
          </Reveal>
          <h2 className='font-serif text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] font-light tracking-[-0.02em] md:text-right'>
            <SplitWords text={t('practicesHeading')} className='block' />{' '}
            <SplitWords
              text={t('practicesHeadingAccent')}
              delay={0.1}
              className='block text-bone/50 italic'
            />
          </h2>
        </div>

        <ul className='@container mt-16 border-t border-white/10 md:mt-24' onPointerLeave={() => setActive(null)}>
          {PRACTICES.map((id, i) => (
            <li key={id} className='border-b border-white/10'>
              <Link
                href={`/${id}`}
                onPointerEnter={() => setActive(id)}
                className={cn(
                  'group relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 overflow-hidden py-8 transition-opacity duration-500 md:grid-cols-[4rem_minmax(0,1.5fr)_minmax(0,1fr)_auto] md:gap-8 md:py-12',
                  active && active !== id && 'md:opacity-35',
                )}
              >
                {/* Soft fill and a champagne rule sweep in from the left */}
                <span
                  aria-hidden='true'
                  className='absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-white/[0.035] to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-x-100'
                />
                <span
                  aria-hidden='true'
                  className='absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-brass/70 transition-transform duration-1000 ease-out-expo group-hover:scale-x-100'
                />
                <span className='relative font-mono text-xs text-bone/40'>0{i + 1}</span>{' '}
                <span className='relative font-serif text-[min(9cqw,2.9rem)] leading-none font-light tracking-[-0.03em] transition-all duration-700 ease-out-expo group-hover:translate-x-3 group-hover:text-brass group-hover:italic md:text-[min(5.6cqw,5.2rem)]'>
                  {t(`practices.${id}.title`)}
                </span>{' '}
                <span className='relative hidden text-bone/50 transition-colors duration-500 group-hover:text-bone/80 md:block'>
                  {t(`practices.${id}.desc`)}
                </span>
                <span className='relative flex h-12 w-12 items-center justify-center rounded-full ring-1 ring-white/15 transition-all duration-500 group-hover:bg-bone group-hover:text-ink md:h-14 md:w-14'>
                  <ArrowRight className='h-5 w-5 transition-transform duration-500 group-hover:-rotate-45' />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Principles() {
  const t = useTranslations('Home');
  const openContact = useContact();
  const principles = t.raw('principles') as { title: string; desc: string }[];

  return (
    <section className='relative z-10 -mt-10 rounded-t-[2.5rem] bg-bone py-28 text-ink md:-mt-14 md:rounded-t-[3.5rem] md:py-40'>
      <div className='mx-auto max-w-7xl px-4 md:px-8'>
        <Reveal>
          <p className='font-mono text-[11px] tracking-[0.25em] text-brass uppercase'>
            {t('principlesLabel')}
          </p>
        </Reveal>
        <ScrollLitText
          text={t('principlesText')}
          className='mt-10 max-w-5xl font-serif text-[clamp(1.8rem,3.8vw,3.4rem)] leading-[1.18] font-light tracking-[-0.02em]'
        />

        <div className='mt-20 grid gap-10 border-t border-ink/10 pt-10 md:mt-28 md:grid-cols-3'>
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <span className='font-mono text-xs text-ink/35'>0{i + 1}</span>
              <h3 className='mt-4 font-serif text-3xl font-light'>{p.title}</h3>
              <p className='mt-3 leading-relaxed text-ink/55'>{p.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className='mt-24 flex flex-col items-start justify-between gap-8 md:mt-32 md:flex-row md:items-end'>
          <div>
            <p className='font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-none font-light italic'>
              {t('appointment')}
            </p>
            <p className='mt-4 text-ink/55'>{t('appointmentText')}</p>
          </div>
          <ArrowButton tone='dark' onClick={() => openContact('other')}>
            {t('cta')}
          </ArrowButton>
        </Reveal>
      </div>
    </section>
  );
}
