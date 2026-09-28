import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

const MASK: CSSProperties = {
  maskImage: 'url(/emblem.svg)',
  WebkitMaskImage: 'url(/emblem.svg)',
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
};

/* The lion-and-meander crest, drawn in the current text colour. */
export function Emblem({ className }: { className?: string }) {
  return (
    <span
      aria-hidden='true'
      className={cn('inline-block aspect-square shrink-0 bg-current', className)}
      style={MASK}
    />
  );
}
