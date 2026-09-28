'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { MotionConfig } from 'motion/react';
import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import { ContactProvider } from './contact';

export function Providers({ children }: { children: ReactNode }) {
  const [smooth, setSmooth] = useState(false);

  // Smooth scrolling only for people who haven't asked for reduced motion.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSmooth(!query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.09, smoothWheel: smooth }}>
      <ScrollReset />
      <MotionConfig reducedMotion='user'>
        <ContactProvider>{children}</ContactProvider>
      </MotionConfig>
    </ReactLenis>
  );
}

/* Start each new page at the top; Lenis keeps its own scroll target otherwise. */
function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);
  return null;
}
