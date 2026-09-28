'use client';

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const EASE = [0.16, 1, 0.3, 1] as const;

let introPlayed = false;

/* Seconds to wait before hero entrances: long enough for the intro curtain
   on the first page of a visit, shorter for the page curtain afterwards. */
export function useEntranceDelay() {
  const [delay] = useState(() => (introPlayed ? 0.45 : 1.15));
  useEffect(() => {
    introPlayed = true;
  }, []);
  return delay;
}

/* Words slide up out of a mask as they enter the viewport. */
export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of on scroll into view. */
  immediate?: boolean;
}) {
  const words = text.split(' ');
  // The trigger sits on the wrapper: the words start clipped by their masks,
  // so they would never register as visible themselves.
  const trigger = immediate
    ? { animate: 'shown' }
    : {
        whileInView: 'shown',
        viewport: { once: true, margin: '0px 0px -10% 0px' },
      };

  return (
    <motion.span className={className} initial='hidden' {...trigger}>
      {words.map((word, i) => (
        <span key={i}>
          <span className='-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] pr-[0.06em] align-bottom'>
            <motion.span
              className={cn('inline-block will-change-transform', wordClassName)}
              variants={{
                hidden: { y: '115%' },
                shown: {
                  y: '0%',
                  transition: { duration: 1, ease: EASE, delay: delay + i * stagger },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </motion.span>
  );
}

/* Fade and lift a block into place when it enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* Paragraph whose words light up one by one as the reader scrolls through it. */
export function ScrollLitText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.45'],
  });
  const words = text.split(' ');

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <LitWord
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {word}
        </LitWord>
      ))}
    </p>
  );
}

function LitWord({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }}>
      {children}{' '}
    </motion.span>
  );
}

/* Child drifts toward the cursor while hovered. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const spring = { stiffness: 220, damping: 18, mass: 0.4 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* Image that drifts vertically inside its frame while scrolling. */
export function useParallax(distance = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${distance}%`, `${distance}%`],
  );
  return { ref, y, progress: scrollYProgress };
}
