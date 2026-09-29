'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import euclid from '@/public/images/reel/01-euclid.jpg';
import pantheon from '@/public/images/reel/02-pantheon.jpg';
import florence from '@/public/images/reel/03-florence.jpg';
import magellan from '@/public/images/reel/04-magellan.jpg';
import watt from '@/public/images/reel/05-watt.jpg';
import dam from '@/public/images/reel/06-dam.jpg';
import chip from '@/public/images/reel/07-chip.jpg';
import sun from '@/public/images/reel/08-sun.jpg';
import { EASE } from './motion';

/* All frames are public domain or CC0, from Wikimedia Commons:
   Raphael, The School of Athens · G. P. Panini, Interior of the Pantheon
   (NGA, CC0) · Photochrom of Florence (Library of Congress) · A. Ortelius,
   Maris Pacifici (1589) · Watt's rotative engine, lantern slide (c. 1782) ·
   Ansel Adams, Hoover Dam (National Archives) · Intel 4004 layout (CC0) ·
   NASA SDO, the Sun at 304 Å. */
const SCENES: { src: StaticImageData; position: string; origin: string }[] = [
  { src: euclid, position: '55% 60%', origin: '65% 70%' },
  { src: pantheon, position: '50% 30%', origin: '50% 20%' },
  { src: florence, position: '58% 40%', origin: '58% 40%' },
  { src: magellan, position: '62% 55%', origin: '60% 58%' },
  { src: watt, position: '60% 45%', origin: '65% 55%' },
  { src: dam, position: '35% 35%', origin: '35% 30%' },
  { src: chip, position: '50% 50%', origin: '50% 50%' },
  { src: sun, position: '50% 50%', origin: '50% 50%' },
];

const SCENE_MS = 4200;

/* A looping, silent "film" of human progress built from still frames:
   slow push-ins, crossfades and a year counter. */
export function Reel({
  years,
  label,
  pauseLabel,
  playLabel,
  children,
}: {
  years: string[];
  /** Screen-reader description of the film. */
  label: string;
  pauseLabel: string;
  playLabel: string;
  /** Overlaid content (title, intro). */
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.2 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = !reduce && !paused && inView;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SCENES.length), SCENE_MS);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <section ref={ref} className='relative h-[100svh] min-h-[560px] overflow-hidden bg-ink'>
      <p className='sr-only'>{label}</p>

      {SCENES.map((scene, i) => {
        const active = i === index;
        return (
          <motion.div
            key={i}
            aria-hidden='true'
            className='absolute inset-0'
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          >
            <motion.div
              className='absolute inset-0'
              style={{ transformOrigin: scene.origin }}
              initial={false}
              animate={{ scale: active ? 1 : 1.14 }}
              transition={{
                duration: active ? SCENE_MS / 1000 + 1.6 : 1.6,
                ease: active ? 'linear' : 'easeIn',
              }}
            >
              <Image
                src={scene.src}
                alt=''
                fill
                sizes='100vw'
                priority={i < 2}
                placeholder='blur'
                className='object-cover'
                style={{ objectPosition: scene.position }}
              />
            </motion.div>
          </motion.div>
        );
      })}

      {/* Film treatment: vignette, grain and a dark base for the type */}
      <div aria-hidden='true' className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(12,12,12,0.75)_100%)]' />
      <div aria-hidden='true' className='pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30' />
      <div aria-hidden='true' className='grain pointer-events-none absolute inset-0' />

      <div className='relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-[max(3rem,calc(env(safe-area-inset-bottom)+2rem))] md:px-8 md:pb-16'>
        <div className='flex flex-col gap-10 md:flex-row md:items-end md:justify-between'>
          {/* Explicit width: the title inside sizes itself to this box */}
          <div className='w-full max-w-3xl min-w-0 md:flex-1'>{children}</div>

          <div className='flex flex-col gap-5 md:items-end'>
            {/* Year counter */}
            <div aria-hidden='true' className='h-[1.15em] overflow-hidden font-serif text-4xl leading-none font-light whitespace-nowrap text-brass italic md:text-7xl'>
              <AnimatePresence mode='wait' initial={false}>
                <motion.span
                  key={index}
                  className='block'
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  {years[index]}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className='flex items-center gap-4'>
              {/* One segment per scene; the current one fills as it plays */}
              <div aria-hidden='true' className='flex gap-1.5'>
                {SCENES.map((_, i) => (
                  <span key={i} className='relative h-px w-5 overflow-hidden bg-bone/20 md:w-7'>
                    <span
                      key={i === index ? `${index}-${playing}` : i}
                      className={cn(
                        'absolute inset-0 origin-left bg-bone',
                        i < index && 'scale-x-100',
                        i > index && 'scale-x-0',
                      )}
                      style={
                        i === index
                          ? {
                              animation: `reel-progress ${SCENE_MS}ms linear forwards`,
                              animationPlayState: playing ? 'running' : 'paused',
                            }
                          : undefined
                      }
                    />
                  </span>
                ))}
              </div>
              <button
                type='button'
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? playLabel : pauseLabel}
                className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-full ring-1 ring-bone/25 transition hover:bg-bone hover:text-ink active:scale-95'
              >
                {paused ? <Play className='h-4 w-4' /> : <Pause className='h-4 w-4' />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
