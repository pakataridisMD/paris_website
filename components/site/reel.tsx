'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { EASE, SplitWords, useEntranceDelay } from './motion';

/* How each frame arrives (keyframes in globals.css):
   explosive - slam, punch, shake, mega (the biggest hits), swipe (a whip pan)
   calm      - drift (slow dissolve), focus (pull into focus)
   space     - warp (accelerating zoom), finale (glow, rays, fade to black) */
export type Cut = 'slam' | 'punch' | 'shake' | 'mega' | 'swipe' | 'drift' | 'focus' | 'warp' | 'finale';

export type Scene = { src: StaticImageData; position: string; origin: string; cut: Cut; ms: number };

// Strength of the light burst on each kind of cut (none for calm ones).
const FLASH: Partial<Record<Cut, number>> = { slam: 0.55, punch: 0.5, shake: 0.45, mega: 0.85, swipe: 0.35 };
const CALM: Cut[] = ['drift', 'focus', 'warp'];
const PRELOAD_AHEAD = 3;

/* A looping, silent "film" built from still frames, cut like a trailer. The
   last two scenes should be a warp and a finale: stars stream in, the final
   frame glows, then everything fades to black before the loop bursts back. */
export function Reel({
  scenes,
  years,
  label,
  children,
}: {
  scenes: Scene[];
  years: string[];
  /** Screen-reader description of the film. */
  label: string;
  /** Overlaid content (title, intro). */
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.2 });
  // Monotonic step counter: keys each frame so its animation restarts even
  // when the same scene comes round again.
  const [step, setStep] = useState(0);
  const playing = !reduce && inView;
  const count = scenes.length;
  const index = step % count;
  const scene = scenes[index];
  const loop = Math.floor(step / count);
  const inSpace = index >= count - 2;
  const running: CSSProperties['animationPlayState'] = playing ? 'running' : 'paused';

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setStep((s) => s + 1), scenes[step % count].ms);
    return () => clearTimeout(id);
  }, [playing, step, count, scenes]);

  // The frame on screen plus the one it cut from (kept underneath so a frame
  // that lands small, dissolves in, or decodes a moment late never shows a gap).
  const layers = reduce ? [step] : step > 0 ? [step - 1, step] : [step];
  const flash = FLASH[scene.cut];

  return (
    <section ref={ref} className='relative h-[100svh] min-h-[560px] overflow-hidden bg-ink'>
      <p className='sr-only'>{label}</p>

      {layers.map((s) => {
        const frame = scenes[s % count];
        const stretch = frame.cut === 'warp' || frame.cut === 'finale' ? 1 : 1.15;
        return (
          <div
            key={s}
            aria-hidden='true'
            className='absolute inset-0 will-change-transform'
            style={
              reduce
                ? undefined
                : {
                    transformOrigin: frame.origin,
                    animation: `reel-${frame.cut} ${frame.ms * stretch}ms forwards`,
                    animationPlayState: running,
                  }
            }
          >
            <Image
              src={frame.src}
              alt=''
              fill
              sizes='100vw'
              priority={s < 2}
              className='object-cover'
              style={{ objectPosition: frame.position }}
            />
          </div>
        );
      })}

      {/* Light burst on explosive cuts, alternating ivory and champagne */}
      {!reduce && step > 0 && flash && (
        <div
          key={`flash-${step}`}
          aria-hidden='true'
          className={cn('pointer-events-none absolute inset-0 mix-blend-screen', step % 2 ? 'bg-bone' : 'bg-brass')}
          style={{
            ['--flash' as string]: flash,
            animation: `reel-flash ${scene.cut === 'mega' ? 450 : 320}ms ease-out forwards`,
            animationPlayState: running,
          }}
        />
      )}

      {/* Space: stars streak past during the warp, then drift and twinkle */}
      {!reduce && inSpace && <Starfield key={`stars-${loop}`} playing={playing} />}

      {/* Finale: a halo and slowly turning light rays around the last frame */}
      {!reduce && scene.cut === 'finale' && (
        <div key={`finale-${step}`} aria-hidden='true' className='pointer-events-none absolute inset-0 mix-blend-screen'>
          <div
            className='absolute top-1/2 left-1/2 aspect-square w-[85vmax] -translate-x-1/2 -translate-y-1/2'
            style={{ animation: `reel-rays ${scene.ms}ms linear forwards`, animationPlayState: running }}
          >
            <div className='h-full w-full rounded-full bg-[repeating-conic-gradient(rgba(212,178,120,0.22)_0deg_3deg,transparent_3deg_14deg)] [mask-image:radial-gradient(circle,black_8%,transparent_62%)] blur-[2px]' />
          </div>
          <div
            className='absolute top-1/2 left-1/2 aspect-square w-[70vmin] -translate-x-1/2 -translate-y-1/2'
            style={{ animation: `reel-glow ${scene.ms}ms ease-in-out forwards`, animationPlayState: running }}
          >
            <div className='h-full w-full rounded-full bg-[radial-gradient(circle,rgba(255,196,120,0.55)_0%,rgba(212,150,70,0.25)_35%,transparent_68%)] blur-2xl' />
          </div>
        </div>
      )}

      {/* Film treatment: vignette, grain and a dark base for the type */}
      <div aria-hidden='true' className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(12,12,12,0.75)_100%)]' />
      <div aria-hidden='true' className='pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30' />
      <div aria-hidden='true' className='grain pointer-events-none absolute inset-0' />

      {/* End of the finale: a slow fade to black before the loop bursts back */}
      {!reduce && scene.cut === 'finale' && (
        <div
          key={`black-${step}`}
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-ink'
          style={{ animation: `reel-blackout ${scene.ms}ms ease-in-out forwards`, animationPlayState: running }}
        />
      )}

      {/* Warm the cache for the next few frames so every cut is instant */}
      <div aria-hidden='true' className='pointer-events-none invisible absolute h-0 w-0 overflow-hidden'>
        {Array.from({ length: PRELOAD_AHEAD }, (_, k) => {
          const next = scenes[(index + 1 + k) % count];
          return <Image key={(step + 1 + k) % count} src={next.src} alt='' fill sizes='100vw' loading='eager' />;
        })}
      </div>

      <div className='relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-[max(3rem,calc(env(safe-area-inset-bottom)+2rem))] md:px-8 md:pb-16'>
        <div className='flex flex-col gap-8 md:flex-row md:items-end md:justify-between'>
          {/* Explicit width: the title inside sizes itself to this box */}
          <div className='w-full max-w-3xl min-w-0 md:flex-1'>{children}</div>

          <div aria-hidden='true' className='relative h-[1.15em] font-serif text-4xl leading-none font-light whitespace-nowrap text-brass italic md:min-w-[5.5em] md:text-7xl'>
            <YearLabel key={step} text={years[index]} cut={scene.cut} ms={scene.ms} still={!!reduce} playing={playing} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Page title set over a film: index, label, two-line heading and intro. */
export function ReelTitle({
  index,
  label,
  heading,
  headingAccent,
  intro,
}: {
  index: string;
  label: string;
  heading: string;
  headingAccent: string;
  intro: string;
}) {
  const delay = useEntranceDelay();
  return (
    <div className='@container'>
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
      <h1 className='mt-6 font-serif text-[min(13cqw,7rem)] leading-[1] font-light tracking-[-0.03em]'>
        <SplitWords immediate delay={delay} text={heading} className='block' />{' '}
        <SplitWords immediate delay={delay + 0.12} text={headingAccent} className='block text-brass italic' />
      </h1>
      <motion.p
        className='mt-6 max-w-md text-lg leading-relaxed text-bone/70'
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.35, duration: 1, ease: EASE }}
      >
        {intro}
      </motion.p>
    </div>
  );
}

/* The year matches the cut: punched in on hits, eased in on calm frames, and
   for the finale "∞" glows in and fades out with the image. */
function YearLabel({
  text,
  cut,
  ms,
  still,
  playing,
}: {
  text: string;
  cut: Cut;
  ms: number;
  still: boolean;
  playing: boolean;
}) {
  const className = 'absolute inset-x-0 top-0 block origin-left md:origin-right md:text-right';
  if (still) return <span className={className}>{text}</span>;

  if (cut === 'finale') {
    return (
      <motion.span
        className={className}
        style={{ textShadow: '0 0 28px rgba(212,178,120,0.65)' }}
        initial={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
        animate={
          playing
            ? { opacity: [0, 1, 1, 0], scale: [0.85, 1, 1.04, 1.04], filter: ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(6px)'] }
            : undefined
        }
        transition={{ duration: ms / 1000, times: [0, 0.22, 0.6, 0.88], ease: 'easeInOut' }}
      >
        {text}
      </motion.span>
    );
  }

  const calm = CALM.includes(cut);
  return (
    <motion.span
      className={className}
      initial={calm ? { opacity: 0, filter: 'blur(8px)' } : { scale: 1.6, opacity: 0, filter: 'blur(10px)' }}
      animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: calm ? 0.6 : 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.span>
  );
}

/* Canvas starfield: stars rush past at warp speed, then slow to a drift and
   twinkle. Runs only while mounted (the last two scenes) and while playing. */
function Starfield({ playing }: { playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(playing);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 0.9 + 0.1 });
    const stars = Array.from({ length: 420 }, () => {
      const s = spawn();
      return { ...s, pz: s.z, twinkle: Math.random() * Math.PI * 2, warm: Math.random() < 0.35 };
    });

    let elapsed = 0;
    let last = performance.now();
    let raf = 0;
    const draw = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (playingRef.current) elapsed += dt / 1000;
      // Warp speed that decays into a slow drift.
      const speed = playingRef.current ? (0.0015 + 0.045 * Math.exp(-elapsed * 0.9)) * (dt / 16.7) : 0;
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.max(w, h) * 0.35;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed;
        if (s.z <= 0.02) {
          Object.assign(s, spawn(), { z: 1 });
          s.pz = 1;
        }
        const x = cx + (s.x / s.z) * scale;
        const y = cy + (s.y / s.z) * scale;
        const px = cx + (s.x / s.pz) * scale;
        const py = cy + (s.y / s.pz) * scale;
        const alpha = Math.min(1, (1 - s.z) * 1.5) * (0.65 + 0.35 * Math.sin(elapsed * 3 + s.twinkle));
        ctx.strokeStyle = s.warm ? `rgba(212,178,120,${alpha})` : `rgba(241,237,229,${alpha})`;
        ctx.lineWidth = Math.max(0.6, (1 - s.z) * 2.2);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x + 0.01, y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden='true'
      className='pointer-events-none absolute inset-0 h-full w-full mix-blend-screen'
      style={{ animation: 'reel-fade-in 600ms ease-out forwards' }}
    />
  );
}
