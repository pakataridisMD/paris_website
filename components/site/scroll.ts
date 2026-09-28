'use client';

import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

/* Freeze page scrolling while an overlay (dialog, menu) is open. */
export function usePauseScroll(paused: boolean) {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    if (paused) lenis.stop();
    else lenis.start();
  }, [lenis, paused]);
}

/* Scroll to a section id (or the top), smoothly when Lenis is active. */
export function useScrollTo() {
  const lenis = useLenis();
  return (id?: string) => {
    const target = id ? document.getElementById(id) : null;
    if (id && !target) return;
    if (lenis) {
      lenis.scrollTo(target ?? 0, { duration: 1.6 });
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
}
