'use client';

import { useRef, useState } from 'react';
import Image, { type ImageProps, type StaticImageData } from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';

/* next/image that resolves from a soft blur to sharp once loaded, instead of
   popping in. */
export function SmoothImage({ alt, className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      alt={alt}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={cn(
        'transition-[filter,opacity,scale] duration-[1.4s] ease-out-expo',
        loaded ? 'scale-100 opacity-100 blur-0' : 'scale-[1.03] opacity-80 blur-xl',
        className,
      )}
    />
  );
}

/* A photo that grows from an inset, rounded card to full size as it reaches
   the middle of the screen, while the picture inside gently zooms out. */
export function ScrollMedia({
  src,
  alt,
  aspect,
  position = 'object-center',
  sizes = '100vw',
  caption,
  className,
  from = 0.88,
}: {
  src: StaticImageData;
  alt: string;
  /** Aspect-ratio class for the frame. */
  aspect: string;
  position?: string;
  sizes?: string;
  caption?: string;
  /** Placement of the figure in its layout. */
  className?: string;
  /** Starting scale of the frame. */
  from?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 24]);
  const zoom = useTransform(scrollYProgress, [0, 1], [1.18, 1]);

  return (
    <figure className={className}>
      <motion.div
        ref={ref}
        style={reduce ? { borderRadius: 24 } : { scale, borderRadius: radius }}
        className={cn('relative isolate overflow-hidden bg-ink-soft', aspect)}
      >
        <motion.div style={reduce ? undefined : { scale: zoom }} className='absolute inset-0'>
          <SmoothImage
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            quality={90}
            placeholder='blur'
            className={cn('object-cover', position)}
          />
        </motion.div>
      </motion.div>
      {caption && (
        <figcaption className='mt-4 font-mono text-[11px] tracking-[0.2em] uppercase opacity-45'>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
