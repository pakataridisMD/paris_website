'use client';

import type { ReactNode } from 'react';
import type { StaticImageData } from 'next/image';
import { motion, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';
import { SmoothImage } from './media';
import { EASE, SplitWords, useEntranceDelay, useParallax } from './motion';

/* Opening block shared by the practice pages: chapter label, serif title,
   intro and a portrait-format photo that unmasks itself. */
export function PageHero({
  index,
  label,
  title,
  titleAccent,
  intro,
  eyebrow,
  image,
  imageAlt,
  imagePosition = 'object-center',
  tone = 'dark',
}: {
  index: string;
  label: string;
  title: string;
  titleAccent: string;
  intro: string;
  eyebrow?: ReactNode;
  image: StaticImageData;
  imageAlt: string;
  imagePosition?: string;
  tone?: 'dark' | 'light';
}) {
  const delay = useEntranceDelay();
  const { ref, y, progress } = useParallax(8);
  // The photo settles back slightly as the page scrolls on.
  const frameScale = useTransform(progress, [0.5, 1], [1, 0.9]);
  const light = tone === 'light';

  return (
    <section
      className={cn(
        'relative pt-36 pb-24 md:pt-44 md:pb-32',
        light ? 'bg-bone text-ink' : 'grain bg-ink text-bone',
      )}
    >
      <div className='relative z-10 mx-auto grid max-w-7xl gap-14 px-4 md:grid-cols-12 md:items-end md:gap-10 md:px-8'>
        <div className='@container relative z-10 md:col-span-7'>
          <motion.div
            className='flex items-center gap-4 font-mono text-[11px] tracking-[0.25em] text-brass uppercase'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay, duration: 1 }}
          >
            <span>{index}</span>
            <motion.span
              className='h-px w-12 origin-left bg-current opacity-50'
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: delay + 0.2, duration: 1.2, ease: EASE }}
            />
            <span>{label}</span>
          </motion.div>

          {eyebrow && (
            <motion.div
              className='mt-8'
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.15, duration: 1, ease: EASE }}
            >
              {eyebrow}
            </motion.div>
          )}

          <h1 className='mt-8 font-serif text-[min(11.5cqw,7rem)] leading-[1] font-light tracking-[-0.03em]'>
            <SplitWords immediate delay={delay} text={title} className='block' />
            <SplitWords
              immediate
              delay={delay + 0.12}
              text={titleAccent}
              className='block text-brass italic'
            />
          </h1>

          <motion.p
            className={cn(
              'mt-10 max-w-xl text-lg leading-relaxed md:text-xl',
              light ? 'text-ink/60' : 'text-bone/60',
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.35, duration: 1, ease: EASE }}
          >
            {intro}
          </motion.p>
        </div>

        <div className='md:col-span-5'>
          <motion.div
            ref={ref}
            style={{ scale: frameScale }}
            className={cn(
              'relative isolate aspect-[4/5] overflow-hidden rounded-[28px]',
              light ? 'shadow-[0_40px_80px_-40px_rgba(12,12,12,0.45)]' : 'bg-ink-soft',
            )}
            initial={{ clipPath: 'inset(100% 0% 0% 0% round 28px)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
            transition={{ delay: delay + 0.1, duration: 1.5, ease: EASE }}
          >
            <motion.div
              style={{ y }}
              className='absolute inset-x-0 -top-[8%] -bottom-[8%]'
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.1, duration: 2, ease: EASE }}
            >
              <SmoothImage
                src={image}
                alt={imageAlt}
                fill
                priority
                quality={90}
                sizes='(min-width: 768px) 40vw, 100vw'
                placeholder='blur'
                className={cn('object-cover', imagePosition)}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
