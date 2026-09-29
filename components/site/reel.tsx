'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Pause, Play } from 'lucide-react';
import writing from '@/public/images/reel/01-writing.jpg';
import pyramids from '@/public/images/reel/02-pyramids.jpg';
import parthenon from '@/public/images/reel/03-parthenon.jpg';
import euclid from '@/public/images/reel/04-euclid.jpg';
import pantheon from '@/public/images/reel/05-pantheon.jpg';
import florence from '@/public/images/reel/06-florence.jpg';
import gutenberg from '@/public/images/reel/07-gutenberg.jpg';
import vitruvian from '@/public/images/reel/08-vitruvian.jpg';
import magellan from '@/public/images/reel/09-magellan.jpg';
import newton from '@/public/images/reel/10-newton.jpg';
import watt from '@/public/images/reel/11-watt.jpg';
import xray from '@/public/images/reel/12-xray.jpg';
import flight from '@/public/images/reel/13-flight.jpg';
import dam from '@/public/images/reel/14-dam.jpg';
import moon from '@/public/images/reel/15-moon.jpg';
import chip from '@/public/images/reel/16-chip.jpg';
import hubble from '@/public/images/reel/17-hubble.jpg';
import sun from '@/public/images/reel/18-sun.jpg';

/* Every frame is public domain or CC0, from Wikimedia Commons: Met Museum
   cuneiform tablet (CC0) · F. Bonfils, Giza (Museo Egizio, CC0) · Parthenon
   drawing, 1869 (Cooper Hewitt) · Raphael, The School of Athens · G. P. Panini,
   Interior of the Pantheon (NGA, CC0) · Photochrom of Florence (LoC) ·
   Gutenberg Bible, Genesis · Leonardo, Vitruvian Man · A. Ortelius, Maris
   Pacifici · Newton, Principia (1687) · Watt's rotative engine (c. 1782) ·
   Röntgen's first X-ray (1895) · Wright brothers, first flight (1903) ·
   Ansel Adams, Hoover Dam (NARA) · NASA, Apollo 11 · Intel 4004 layout (CC0)
   · NASA/Hubble Ultra Deep Field · NASA SDO, the Sun. */
const SCENES: { src: StaticImageData; position: string; origin: string }[] = [
  { src: writing, position: '50% 50%', origin: '50% 50%' },
  { src: pyramids, position: '45% 45%', origin: '45% 35%' },
  { src: parthenon, position: '40% 50%', origin: '40% 45%' },
  { src: euclid, position: '55% 60%', origin: '65% 70%' },
  { src: pantheon, position: '50% 30%', origin: '50% 20%' },
  { src: florence, position: '58% 40%', origin: '58% 40%' },
  { src: gutenberg, position: '35% 50%', origin: '40% 60%' },
  { src: vitruvian, position: '50% 45%', origin: '50% 35%' },
  { src: magellan, position: '62% 55%', origin: '60% 58%' },
  { src: newton, position: '50% 45%', origin: '50% 45%' },
  { src: watt, position: '60% 45%', origin: '65% 55%' },
  { src: xray, position: '40% 50%', origin: '40% 45%' },
  { src: flight, position: '40% 45%', origin: '35% 45%' },
  { src: dam, position: '35% 35%', origin: '35% 30%' },
  { src: moon, position: '48% 35%', origin: '48% 30%' },
  { src: chip, position: '50% 50%', origin: '50% 50%' },
  { src: hubble, position: '50% 50%', origin: '50% 50%' },
  { src: sun, position: '50% 50%', origin: '50% 50%' },
];

const SCENE_MS = 1000;
const PRELOAD_AHEAD = 3;
// Cut styles, rotated so consecutive hits feel different (see globals.css).
const IMPACTS = ['reel-slam', 'reel-punch', 'reel-shake'];

/* A looping, silent "film" of human progress built from still frames: one
   milestone a second, each landing with a trailer-style hard cut. */
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
  // Monotonic step counter: keys each frame so its animation restarts even
  // when the same scene comes round again.
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = !reduce && !paused && inView;
  const count = SCENES.length;
  const index = step % count;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setStep((s) => s + 1), SCENE_MS);
    return () => clearInterval(id);
  }, [playing]);

  // The frame on screen plus the one it cut from (kept underneath so a frame
  // that lands small, or decodes a moment late, never shows a gap).
  const layers = reduce ? [step] : step > 0 ? [step - 1, step] : [step];

  return (
    <section ref={ref} className='relative h-[100svh] min-h-[560px] overflow-hidden bg-ink'>
      <p className='sr-only'>{label}</p>

      {layers.map((s) => {
        const scene = SCENES[s % count];
        return (
          <div
            key={s}
            aria-hidden='true'
            className='absolute inset-0 will-change-transform'
            style={
              reduce
                ? undefined
                : {
                    transformOrigin: scene.origin,
                    animation: `${IMPACTS[s % IMPACTS.length]} ${SCENE_MS * 1.15}ms forwards`,
                    animationPlayState: playing ? 'running' : 'paused',
                  }
            }
          >
            <Image
              src={scene.src}
              alt=''
              fill
              sizes='100vw'
              priority={s < 2}
              className='object-cover'
              style={{ objectPosition: scene.position }}
            />
          </div>
        );
      })}

      {/* Light burst on every cut, alternating ivory and champagne */}
      {!reduce && step > 0 && (
        <div
          key={`flash-${step}`}
          aria-hidden='true'
          className={cn(
            'pointer-events-none absolute inset-0 mix-blend-screen',
            step % 2 ? 'bg-bone' : 'bg-brass',
          )}
          style={{
            animation: 'reel-flash 320ms ease-out forwards',
            animationPlayState: playing ? 'running' : 'paused',
          }}
        />
      )}

      {/* Warm the cache for the next few frames so every cut is instant */}
      <div aria-hidden='true' className='pointer-events-none invisible absolute h-0 w-0 overflow-hidden'>
        {Array.from({ length: PRELOAD_AHEAD }, (_, k) => {
          const scene = SCENES[(index + 1 + k) % count];
          return <Image key={(step + 1 + k) % count} src={scene.src} alt='' fill sizes='100vw' loading='eager' />;
        })}
      </div>

      {/* Film treatment: vignette, grain and a dark base for the type */}
      <div aria-hidden='true' className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(12,12,12,0.75)_100%)]' />
      <div aria-hidden='true' className='pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30' />
      <div aria-hidden='true' className='grain pointer-events-none absolute inset-0' />

      <div className='relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-[max(3rem,calc(env(safe-area-inset-bottom)+2rem))] md:px-8 md:pb-16'>
        <div className='flex flex-col gap-10 md:flex-row md:items-end md:justify-between'>
          {/* Explicit width: the title inside sizes itself to this box */}
          <div className='w-full max-w-3xl min-w-0 md:flex-1'>{children}</div>

          <div className='flex flex-col gap-5 md:items-end'>
            {/* Year counter: punches in with every cut */}
            <div aria-hidden='true' className='relative h-[1.15em] font-serif text-4xl leading-none font-light whitespace-nowrap text-brass italic md:min-w-[5.5em] md:text-7xl'>
              <motion.span
                key={step}
                className='absolute inset-x-0 top-0 block origin-left md:origin-right md:text-right'
                initial={reduce ? false : { scale: 1.6, opacity: 0, filter: 'blur(10px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                {years[index]}
              </motion.span>
            </div>

            <div className='flex items-center gap-4'>
              {/* Timeline: fills as the film moves through history */}
              <div aria-hidden='true' className='flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-bone/60 tabular-nums'>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className='relative h-px w-28 overflow-hidden bg-bone/20 md:w-40'>
                  <span
                    className='absolute inset-y-0 left-0 bg-brass'
                    style={{
                      width: `${((index + 1) / count) * 100}%`,
                      transition: index === 0 ? 'none' : `width ${SCENE_MS}ms linear`,
                    }}
                  />
                </span>
                <span>{String(count).padStart(2, '0')}</span>
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
