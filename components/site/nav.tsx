'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'motion/react';
import { Link, usePathname, useRouter, type Locale } from '@/i18n/routing';
import { PRACTICES } from '@/lib/site';
import { cn } from '@/lib/utils';
import { useContact } from './contact';
import { Emblem } from './emblem';
import { EASE } from './motion';
import { usePauseScroll } from './scroll';

function useSwitchLocale() {
  const router = useRouter();
  const pathname = usePathname();
  return (code: Locale) => router.replace(pathname, { locale: code, scroll: false });
}

/* Pill-style language toggle, used on dark surfaces (footer, mobile menu). */
export function LocaleSwitch({ id, className }: { id: string; className?: string }) {
  const locale = useLocale() as Locale;
  const switchLocale = useSwitchLocale();
  return (
    <div
      className={cn(
        'flex items-center rounded-full bg-white/[0.06] p-1 font-mono text-[11px] tracking-wider',
        className,
      )}
    >
      {(['en', 'el'] as const).map((code) => (
        <button
          key={code}
          type='button'
          onClick={() => switchLocale(code)}
          aria-pressed={locale === code}
          aria-label={code === 'en' ? 'English' : 'Ελληνικά'}
          className={cn(
            'relative cursor-pointer rounded-full px-2.5 py-1 uppercase transition-colors',
            locale === code ? 'text-ink' : 'text-bone/50 hover:text-bone',
          )}
        >
          {locale === code && (
            <motion.span
              layoutId={`locale-pill-${id}`}
              className='absolute inset-0 rounded-full bg-bone'
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <span className='relative'>{code}</span>
        </button>
      ))}
    </div>
  );
}

export function Nav() {
  const t = useTranslations('Nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const switchLocale = useSwitchLocale();
  const openContact = useContact();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  usePauseScroll(menuOpen);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 300);
  });

  return (
    <>
      <motion.div
        className='fixed inset-x-0 top-0 z-[60] h-px origin-left bg-brass'
        style={{ scaleX: progress }}
      />

      {/* Difference blending keeps the bar legible over both ink and ivory */}
      <motion.header
        className='fixed inset-x-0 top-0 z-50 text-white mix-blend-difference'
        initial={{ y: -80 }}
        animate={{ y: hidden && !menuOpen ? -100 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <nav
          aria-label='Main'
          className='mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-6 md:px-8'
        >
          <Link
            href='/'
            onClick={() => setMenuOpen(false)}
            aria-label={t('home')}
            className='group flex items-center gap-3 font-serif text-xl tracking-tight whitespace-nowrap md:text-2xl'
          >
            <Emblem className='h-8 w-8 transition-transform duration-700 ease-out-expo group-hover:rotate-[20deg] md:h-9 md:w-9' />
            <span>P. Pakataridis</span>
          </Link>

          <ul className='hidden items-center gap-10 lg:flex'>
            {PRACTICES.map((id) => {
              const active = pathname === `/${id}`;
              return (
                <li key={id}>
                  <Link
                    href={`/${id}`}
                    className={cn(
                      'relative block py-1 font-mono text-[11px] tracking-[0.22em] uppercase transition-opacity',
                      active ? 'opacity-100' : 'opacity-60 hover:opacity-100',
                    )}
                  >
                    {t(id)}
                    {active && (
                      <motion.span
                        layoutId='nav-underline'
                        className='absolute inset-x-0 -bottom-0.5 h-px bg-white'
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className='flex items-center gap-5'>
            <div className='hidden items-center gap-2 font-mono text-[11px] tracking-[0.2em] sm:flex'>
              {(['en', 'el'] as const).map((code, i) => (
                <span key={code} className='flex items-center gap-2'>
                  {i > 0 && <span className='opacity-30'>/</span>}
                  <button
                    type='button'
                    onClick={() => switchLocale(code)}
                    aria-pressed={locale === code}
                    aria-label={code === 'en' ? 'English' : 'Ελληνικά'}
                    className={cn(
                      'cursor-pointer uppercase transition-opacity',
                      locale === code ? 'opacity-100' : 'opacity-40 hover:opacity-100',
                    )}
                  >
                    {code}
                  </button>
                </span>
              ))}
            </div>
            <button
              type='button'
              onClick={() => openContact()}
              className='hidden cursor-pointer rounded-full border border-white/40 px-5 py-2 text-sm whitespace-nowrap transition-colors hover:bg-white hover:text-black md:block'
            >
              {t('contact')}
            </button>
            <button
              type='button'
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t('close') : t('menu')}
              className='flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 lg:hidden'
            >
              <motion.span
                className='h-px w-6 bg-white'
                animate={menuOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className='h-px w-6 bg-white'
                animate={menuOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className='fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pt-32 pb-10 md:px-8 lg:hidden'
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <ul className='space-y-3'>
              {PRACTICES.map((id, i) => (
                <li key={id} className='overflow-hidden'>
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.07 }}
                  >
                    <Link
                      href={`/${id}`}
                      onClick={() => setMenuOpen(false)}
                      className='flex items-baseline gap-4 py-2'
                    >
                      <span className='font-mono text-xs text-bone/40'>0{i + 1}</span>{' '}
                      <span className='font-serif text-5xl font-light'>{t(id)}</span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              className='flex items-center justify-between'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <LocaleSwitch id='menu' />
              <button
                type='button'
                onClick={() => {
                  setMenuOpen(false);
                  openContact();
                }}
                className='cursor-pointer rounded-full bg-bone px-6 py-3 text-sm font-medium text-ink'
              >
                {t('contact')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
