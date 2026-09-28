'use client';

import { useRef, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { cn } from '@/lib/utils';
import consulate from '@/public/images/consulate-portrait.jpg';
import meeting from '@/public/images/institutional-meeting.jpg';
import { ArrowButton } from './button';
import { useContact } from './contact';
import { SmoothImage } from './media';
import { Reveal } from './motion';
import { NextChapter } from './next-chapter';
import { PageHero } from './page-hero';

/* Deliberately spare: a signal of openness, not a list of services. */
export function BusinessPage() {
  const t = useTranslations('Business');
  const openContact = useContact();

  return (
    <>
      <PageHero
        index='01'
        label={t('label')}
        title={t('heading')}
        titleAccent={t('headingAccent')}
        intro={t('intro')}
        image={consulate}
        imageAlt={t('imageAlt')}
        imagePosition='object-[50%_30%]'
      />

      <CredoScene lines={t.raw('credo') as string[]} imageAlt={t('imageAlt')} />

      <section className='bg-ink pt-32 pb-24 md:pt-44 md:pb-36'>
        <div className='mx-auto max-w-7xl px-4 md:px-8'>
          <Reveal className='flex flex-col items-start justify-between gap-10 border-t border-white/10 pt-12 md:flex-row md:items-end'>
            <h2 className='font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[1] font-light tracking-[-0.03em] italic'>
              {t('ctaHeading')}
            </h2>
            <ArrowButton tone='brass' onClick={() => openContact('business')}>
              {t('cta')}
            </ArrowButton>
          </Reveal>
        </div>
      </section>

      <NextChapter to='medicine' />
    </>
  );
}

/* Pinned full-screen scene: the photo expands from an inset card to edge to
   edge, darkens, and the credo appears over it one line at a time. */
function CredoScene({ lines, imageAlt }: { lines: string[]; imageAlt: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const insetY = useTransform(p, [0, 0.3], [14, 0]);
  const insetX = useTransform(p, [0, 0.3], [16, 0]);
  const radius = useTransform(p, [0, 0.3], [36, 0]);
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;
  const zoom = useTransform(p, [0, 1], [1.22, 1.02]);
  const shade = useTransform(p, [0.25, 0.45], [0, 1]);

  return (
    <section ref={ref} className='relative h-[240vh] bg-ink md:h-[300vh]'>
      <div className='sticky top-0 h-[100svh] overflow-hidden'>
        <motion.div style={reduce ? undefined : { clipPath }} className='absolute inset-0'>
          <motion.div style={reduce ? undefined : { scale: zoom }} className='absolute inset-0'>
            <SmoothImage
              src={meeting}
              alt={imageAlt}
              fill
              quality={90}
              sizes='100vw'
              placeholder='blur'
              // Phones show a tall slice of this wide photo: keep Paraskevas (left) in frame.
              className='object-cover object-[19%_30%] md:object-[50%_35%]'
            />
          </motion.div>
          <motion.div
            style={{ opacity: reduce ? 1 : shade }}
            className='absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/5 md:bg-gradient-to-l md:from-ink/95 md:via-ink/60 md:to-transparent'
          />
        </motion.div>

        {/* Words stay clear of Paraskevas: low on phones, on the right elsewhere */}
        <div className='relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-[max(5rem,calc(env(safe-area-inset-bottom)+3rem))] md:items-end md:justify-center md:px-8 md:pb-0 md:text-right'>
          <h2 className='font-serif text-[clamp(2.6rem,7vw,6.5rem)] leading-[1.05] font-light tracking-[-0.03em]'>
            {lines.map((line, i) => (
              <SceneLine
                key={line}
                progress={p}
                range={[0.42 + i * 0.13, 0.54 + i * 0.13]}
                still={!!reduce}
                className={cn(
                  i === 1 && 'md:pr-[12%]',
                  i === lines.length - 1 && 'text-brass italic md:pr-[24%]',
                )}
              >
                {line}{' '}
              </SceneLine>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}

function SceneLine({
  children,
  progress,
  range,
  still,
  className,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
  className?: string;
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [48, 0]);
  const blur = useTransform(progress, range, [12, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  return (
    <motion.span
      style={still ? undefined : { opacity, y, filter }}
      className={cn('block will-change-transform', className)}
    >
      {children}
    </motion.span>
  );
}
