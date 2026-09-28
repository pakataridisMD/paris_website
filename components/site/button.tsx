'use client';

import type { ComponentProps } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Magnetic } from './motion';

const TONES = {
  light: { button: 'bg-bone text-ink hover:bg-white', dot: 'bg-ink text-bone' },
  dark: { button: 'bg-ink text-bone hover:bg-ink-soft', dot: 'bg-bone text-ink' },
  brass: { button: 'bg-brass text-ink hover:bg-bone', dot: 'bg-ink text-bone' },
};

/* Pill button with a rotating arrow, drifting toward the cursor. */
export function ArrowButton({
  tone = 'light',
  className,
  children,
  ...props
}: ComponentProps<'button'> & { tone?: keyof typeof TONES }) {
  return (
    <Magnetic>
      <button
        type='button'
        className={cn(
          'group flex cursor-pointer items-center gap-3 rounded-full py-2 pr-2 pl-6 text-sm font-medium whitespace-nowrap transition-colors duration-300',
          TONES[tone].button,
          className,
        )}
        {...props}
      >
        {children}
        <span
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45',
            TONES[tone].dot,
          )}
        >
          <ArrowUpRight className='h-4 w-4' />
        </span>
      </button>
    </Magnetic>
  );
}
