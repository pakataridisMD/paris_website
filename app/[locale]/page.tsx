'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link as IntlLink, useRouter, usePathname } from '@/i18n/routing';

import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useRef, useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Globe,
  Shield,
  GraduationCap,
  Award,
  MapPin,
  Clock,
  Stethoscope,
  Users,
  Heart,
  Syringe,
  Activity,
  Microscope,
  HeartPulse,
  Brain,
} from 'lucide-react';
import {
  GeneralSurgery,
  Gastroenterology,
  Intestine,
  Stomach,
  Colon,
  Liver,
  Gallbladder,
  Pancreas,
  Stethoscope as HealthStethoscope,
  Spine,
  Diagnostics,
  ArtificialIntelligence,
  Communication,
  PalliativeCare,
  MedicalAdvice,
} from 'healthicons-react/filled';

/* ─────────────────────────────────────────────────
   VERTICAL ICON RIBBON — left-side strip of icons
   ───────────────────────────────────────────────── */
const RIBBON_ICONS = [
  { Icon: Gastroenterology, color: 'text-teal-600/50' },
  { Icon: Intestine, color: 'text-amber-700/50' },
  { Icon: Stomach, color: 'text-rose-600/50' },
  { Icon: Colon, color: 'text-violet-600/50' },
  { Icon: Liver, color: 'text-emerald-700/50' },
  { Icon: Gallbladder, color: 'text-sky-600/50' },
  { Icon: Pancreas, color: 'text-orange-600/50' },
  { Icon: HealthStethoscope, color: 'text-slate-600/50' },
  { Icon: Spine, color: 'text-indigo-600/50' },
];

function VerticalIconRibbon() {
  const tripled = [...RIBBON_ICONS, ...RIBBON_ICONS, ...RIBBON_ICONS];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 1.2 }}
      className='absolute left-2 top-0 z-20 hidden h-full w-24 flex-col items-center overflow-hidden xl:flex xl:left-3 xl:w-32'
    >
      {/* Top fade-out gradient */}
      <div
        className='pointer-events-none absolute top-0 left-0 right-0 z-10 h-28'
        style={{
          background:
            'linear-gradient(to bottom, #FAF7F2 0%, transparent 100%)',
        }}
      />
      {/* Bottom fade-out gradient */}
      <div
        className='pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-28'
        style={{
          background: 'linear-gradient(to top, #FAF7F2 0%, transparent 100%)',
        }}
      />

      <div
        className='flex shrink-0 flex-col items-center gap-8 py-6 will-change-transform'
        style={{
          animation: 'ribbonScrollVertical 40s linear infinite',
        }}
      >
        {tripled.map(({ Icon, color }, i) => (
          <div
            key={i}
            className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#2D6A4F]/[0.07] bg-[#FAF7F2]/90 shadow-sm xl:h-16 xl:w-16'
          >
            <Icon className={`h-6 w-6 xl:h-7 xl:w-7 ${color}`} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────
   CURVED WORD RIBBON — text flowing on a gentle
   S-curve at the VERY BOTTOM of the hero, well
   below heading, subtitle, and CTA buttons.
   ───────────────────────────────────────────────── */
function CurvedWordRibbon({ words }: { words: string }) {
  const repeatedWords = words.repeat(6);

  // Gentle wave in the BOTTOM of the viewBox (y 710–780)
  const CURVE_PATH =
    'M -400 740 C -100 700, 200 780, 500 730 C 800 680, 1100 780, 1400 730 C 1700 680, 2000 770, 2300 720 C 2600 670, 2900 770, 3200 730';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.6 }}
      className='pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-28 overflow-hidden md:h-32'
    >
      <svg
        className='absolute inset-0 h-full w-full'
        viewBox='-400 650 3600 150'
        preserveAspectRatio='none'
        aria-hidden='true'
      >
        <defs>
          <path id='wordCurve' d={CURVE_PATH} />
        </defs>

        {/* Dark band backdrop */}
        <use
          href='#wordCurve'
          fill='none'
          stroke='rgba(10,26,20,0.88)'
          strokeWidth='80'
          strokeLinecap='round'
        />

        {/* Single flowing text — long string ensures full coverage */}
        <text
          fill='rgba(255,255,255,0.35)'
          fontSize='18'
          fontFamily='var(--font-outfit), sans-serif'
          letterSpacing='0.15em'
          style={{ textTransform: 'uppercase' }}
        >
          <textPath href='#wordCurve'>
            {repeatedWords}
            <animate
              attributeName='startOffset'
              from='0%'
              to='-50%'
              dur='50s'
              repeatCount='indefinite'
            />
          </textPath>
        </text>
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────
   WORDFLOW — Cycling hero word animation
   ───────────────────────────────────────────────── */

function Wordflow({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className='relative inline-flex h-[1.3em] items-end overflow-y-clip overflow-x-visible align-bottom'>
      <AnimatePresence mode='wait'>
        <motion.span
          key={words[index]}
          initial={{ y: 50, opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -50, opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className='absolute bottom-0 left-0 whitespace-nowrap italic text-[#2D6A4F]'
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ─────────────────────────────────────────────────
   Reveal section wrapper
   ───────────────────────────────────────────────── */
function RevealSection({
  children,
  className = '',
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────
   Floating card with hover lift
   ───────────────────────────────────────────────── */
function FloatingCard({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 80, damping: 18, delay }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────
   CONSULTATION CARD — single CTA with dialog form
   ───────────────────────────────────────────────── */
function ConsultationCard() {
  const t = useTranslations('Contact');
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError('');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement)
        .value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Something went wrong');
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send.');
    } finally {
      setSending(false);
    }
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setSent(false);
        setError('');
      }, 300);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className='text-left'>
        <FloatingCard className='group max-w-lg cursor-pointer rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center backdrop-blur-sm transition hover:border-[#52B788]/25 hover:bg-white/10 md:p-10'>
          <div className='mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#52B788]/15'>
            <Stethoscope className='h-6 w-6 text-[#52B788]' />
          </div>
          <h3
            className='text-2xl text-white'
            style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
          >
            {t('cardTitle')}
          </h3>
          <p className='mt-3 text-sm text-white/50'>{t('cardDescription')}</p>
          <motion.span
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='mt-8 inline-flex items-center gap-3 rounded-full bg-[#52B788] px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#2D6A4F]/20 transition hover:bg-[#40A070]'
          >
            {t('cardCta')}
            <ArrowRight className='h-4 w-4' />
          </motion.span>
        </FloatingCard>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md bg-[#1a1a1a] border-white/10 text-white rounded-2xl p-0 overflow-hidden'>
        {sent ? (
          <div className='flex flex-col items-center gap-4 px-6 py-12 text-center'>
            <div className='flex h-14 w-14 items-center justify-center rounded-full bg-[#52B788]/15'>
              <Heart className='h-6 w-6 text-[#52B788]' />
            </div>
            <h3
              className='text-xl font-medium'
              style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
            >
              {t('successTitle')}
            </h3>
            <p className='text-sm text-white/50'>{t('successMessage')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className='border-b border-white/10 px-6 py-5'>
              <DialogTitle
                className='text-base font-medium text-white'
                style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
              >
                {t('dialogTitle')}
              </DialogTitle>
              <DialogDescription className='mt-1 text-xs text-white/40'>
                {t('dialogDescription')}
              </DialogDescription>
            </div>

            <div className='space-y-4 px-6 py-5'>
              <div>
                <label
                  htmlFor='name'
                  className='mb-1.5 block text-xs font-medium text-white/60'
                >
                  {t('labelName')} <span className='text-[#52B788]'>*</span>
                </label>
                <input
                  id='name'
                  name='name'
                  type='text'
                  required
                  className='w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#52B788]/50 focus:ring-1 focus:ring-[#52B788]/25'
                  placeholder={t('placeholderName')}
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='mb-1.5 block text-xs font-medium text-white/60'
                >
                  {t('labelEmail')} <span className='text-[#52B788]'>*</span>
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  className='w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#52B788]/50 focus:ring-1 focus:ring-[#52B788]/25'
                  placeholder={t('placeholderEmail')}
                />
              </div>

              <div>
                <label
                  htmlFor='phone'
                  className='mb-1.5 block text-xs font-medium text-white/60'
                >
                  {t('labelPhone')}{' '}
                  <span className='text-white/25'>
                    {t('labelPhoneOptional')}
                  </span>
                </label>
                <input
                  id='phone'
                  name='phone'
                  type='tel'
                  className='w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#52B788]/50 focus:ring-1 focus:ring-[#52B788]/25'
                  placeholder={t('placeholderPhone')}
                />
              </div>

              <div>
                <label
                  htmlFor='message'
                  className='mb-1.5 block text-xs font-medium text-white/60'
                >
                  {t('labelMessage')} <span className='text-[#52B788]'>*</span>
                </label>
                <textarea
                  id='message'
                  name='message'
                  required
                  rows={4}
                  className='w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#52B788]/50 focus:ring-1 focus:ring-[#52B788]/25'
                  placeholder={t('placeholderMessage')}
                />
              </div>

              {error && (
                <p className='rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400'>
                  {error}
                </p>
              )}
            </div>

            <div className='border-t border-white/10 px-6 py-4'>
              <button
                type='submit'
                disabled={sending}
                className='w-full rounded-full bg-[#52B788] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#40A070] disabled:cursor-not-allowed disabled:opacity-50'
              >
                {sending ? t('submitSending') : t('submitButton')}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ══════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════ */
export default function MarketingDesign2() {
  const locale = useLocale();
  const nav = useTranslations('Nav');
  const hero = useTranslations('Hero');
  const ribbon = useTranslations('CurvedRibbon');
  const about = useTranslations('About');
  const patients = useTranslations('Patients');
  const approach = useTranslations('Approach');
  const academic = useTranslations('Academic');
  const philosophy = useTranslations('Philosophy');
  const contact = useTranslations('Contact');
  const footer = useTranslations('Footer');

  // Extract translated arrays
  const heroWords = hero.raw('words') as string[];
  const aboutHospitals = about.raw('hospitals') as {
    name: string;
    location: string;
  }[];
  const patientCategories = patients.raw('categories') as string[];
  const approachSteps = approach.raw('steps') as {
    title: string;
    desc: string;
  }[];
  const academicOrgs = academic.raw('organizations') as string[];
  const academicSidebarItems = academic.raw('sidebarItems') as string[];
  const philosophyItems = philosophy.raw('items') as string[];
  return (
    <div
      className='min-h-screen overflow-x-hidden'
      style={{
        fontFamily:
          locale === 'el'
            ? 'var(--font-syne), sans-serif'
            : locale === 'bg'
              ? 'var(--font-inter), sans-serif'
              : 'var(--font-sans), sans-serif',
        background: '#FAF7F2',
        color: '#1A1A1A',
      }}
    >
      {/* CSS keyframes for ribbon scroll animations */}
      <style>{`
        @keyframes ribbonScrollVertical {
          from { transform: translateY(0); }
          to { transform: translateY(-33.333%); }
        }
        @keyframes dotPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,191,167,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(201,191,167,0); }
        }
      `}</style>

      {/* ── NAVIGATION ── */}
      <nav className='fixed top-0 left-0 right-0 z-50'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10'
        >
          <div className='flex items-center gap-3 rounded-full border border-[#1A1A1A]/[0.06] bg-[#FAF7F2]/80 px-5 py-2.5 backdrop-blur-xl'>
            <div className='flex h-7 w-7 items-center justify-center rounded-full bg-[#2D6A4F]'>
              <Stethoscope className='h-3.5 w-3.5 text-white' />
            </div>
            <span
              className='text-sm font-medium tracking-wide'
              style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
            >
              {nav('brand')}
            </span>
          </div>

          <div className='hidden items-center gap-1 rounded-full border border-[#1A1A1A]/[0.06] bg-[#FAF7F2]/80 px-2 py-1.5 text-sm backdrop-blur-xl md:flex'>
            {(
              ['about', 'patients', 'approach', 'academic', 'contact'] as const
            ).map((key) => (
              <a
                key={key}
                href={`#${key}`}
                className='rounded-full px-4 py-1.5 text-[#1A1A1A]/50 transition hover:bg-[#2D6A4F]/8 hover:text-[#2D6A4F]'
              >
                {nav(key)}
              </a>
            ))}
          </div>

          <motion.a
            href='#contact'
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className='hidden rounded-full bg-[#2D6A4F] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#245A42] md:block'
          >
            {nav('book')}
          </motion.a>

          {/* Language switcher — dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='flex items-center gap-1.5 rounded-full border border-[#1A1A1A]/8 bg-[#FAF7F2]/80 px-3 py-2 text-xs font-medium uppercase text-[#1A1A1A]/60 backdrop-blur-xl transition hover:border-[#2D6A4F]/20 hover:text-[#2D6A4F] outline-none cursor-pointer'>
                <Globe className='h-3.5 w-3.5' />
                {locale}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              sideOffset={8}
              className='min-w-[120px] rounded-xl border border-[#1A1A1A]/8 bg-[#FAF7F2] p-1 shadow-lg'
            >
              {(
                [
                  {
                    code: 'en',
                    label: 'EN',
                    flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ec-1f1e7.svg',
                  },
                  {
                    code: 'el',
                    label: 'EL',
                    flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ec-1f1f7.svg',
                  },
                  {
                    code: 'bg',
                    label: 'BG',
                    flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1e7-1f1ec.svg',
                  },
                ] as const
              ).map((item) => (
                <DropdownMenuItem
                  key={item.code}
                  className={`flex items-center gap-2.5 cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium ${
                    locale === item.code
                      ? 'text-[#2D6A4F] bg-[#2D6A4F]/8'
                      : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                  }`}
                  onClick={() => {
                    window.location.href =
                      item.code === 'en' ? '/' : `/${item.code}`;
                  }}
                >
                  <img
                    src={item.flag}
                    alt=''
                    className='h-5 w-5 rounded-full object-cover'
                    style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}
                  />
                  {item.label}
                  {locale === item.code && (
                    <span className='ml-auto text-[#2D6A4F]'>✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </nav>

      {/* ══ HERO ══ */}
      <section className='relative flex min-h-[85vh] overflow-hidden md:min-h-screen'>
        {/* Vertical icon ribbon — left side */}
        <VerticalIconRibbon />

        {/* Curved word ribbon — dark band with flowing text at the bottom */}
        <CurvedWordRibbon words={ribbon('words')} />

        {/* Hero main area — offset by the left ribbon */}
        <div className='relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-6 pb-16 pt-24 md:px-10'>
          {/* Text content — left side */}
          <div className='flex flex-1 flex-col items-start'>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className='mb-6 inline-flex items-center gap-2 rounded-full border border-[#2D6A4F]/15 bg-[#2D6A4F]/5 px-5 py-2 text-sm text-[#2D6A4F]'
            >
              <GeneralSurgery className='h-4 w-4' />
              {hero('badge')}
            </motion.div>

            {/* Heading with wordflow */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className='max-w-3xl text-left text-[2.25rem] font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-5xl lg:text-6xl xl:text-[4rem] 2xl:text-[5.5rem]'
              style={{ fontFamily: 'var(--font-sans), sans-serif' }}
            >
              {hero('headingPrefix')}
              <br />
              <Wordflow words={heroWords} />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className='mt-8 max-w-md text-left text-base text-[#1A1A1A]/45 md:text-lg'
            >
              {hero('subtitle')}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className='mt-10 flex flex-col items-start gap-4 sm:flex-row'
            >
              <motion.a
                href='#contact'
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className='group inline-flex items-center gap-3 rounded-full bg-[#2D6A4F] px-8 py-4 text-sm font-medium text-white shadow-lg shadow-[#2D6A4F]/20 transition hover:bg-[#245A42]'
              >
                Book a Consultation
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </motion.a>
              <a
                href='#about'
                className='inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/8 px-6 py-3.5 text-sm text-[#1A1A1A]/50 transition hover:border-[#2D6A4F]/20 hover:text-[#2D6A4F]'
              >
                {hero('ctaLearn')}
                <ArrowUpRight className='h-3.5 w-3.5' />
              </a>
            </motion.div>
          </div>

          {/* Wanghaf SVG — anchored at bottom behind the curved ribbon, expanding upward */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className='pointer-events-none absolute bottom-0 -right-8 z-20 hidden max-w-[38%] xl:block 2xl:-right-12 2xl:max-w-[42%]'
          >
            <Image
              src='/wanghaf.svg'
              alt='Decorative'
              width={480}
              height={1080}
              priority
              className='h-auto max-h-[82vh] w-auto'
            />
          </motion.div>
        </div>
      </section>

      {/* ══ INTERNATIONAL PERSPECTIVE ══ */}
      <div
        style={{
          background: 'oklch(0.2178 0 0)',
          borderRadius: '3rem 3rem 0 0',
        }}
      >
        <RevealSection id='about' className='px-6 py-24 md:px-10'>
          <div className='mx-auto max-w-6xl'>
            <div className='mb-16 text-center'>
              <span className='mb-3 inline-block rounded-full bg-[#52B788]/15 px-4 py-1.5 text-xs font-medium tracking-wide uppercase text-[#52B788]'>
                {about('badge')}
              </span>
              <h2
                className='mt-4 text-3xl text-white md:text-5xl'
                style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
              >
                {about('heading')}{' '}
                <span className='italic text-[#52B788]'>
                  {about('headingAccent')}
                </span>
              </h2>
              <p className='mx-auto mt-4 max-w-lg text-base text-white/60'>
                {about('description')}
              </p>
            </div>

            <div className='grid gap-5 md:grid-cols-3'>
              {aboutHospitals.map((inst, i) => {
                const flags = [
                  'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1fa-1f1f8.svg',
                  'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ec-1f1e7.svg',
                  'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1e7-1f1ec.svg',
                ];
                return (
                  <FloatingCard
                    key={inst.name}
                    delay={i * 0.1}
                    className='group rounded-3xl border border-white/[0.08] bg-white/[0.06] p-8 backdrop-blur-sm transition hover:border-[#52B788]/25 hover:bg-white/[0.1]'
                  >
                    <div className='mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#52B788]/15'>
                      <img src={flags[i]} alt='' className='h-7 w-7' />
                    </div>
                    <h3
                      className='text-lg text-white'
                      style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
                    >
                      {inst.name}
                    </h3>
                    <p className='mt-2 text-sm text-white/55'>
                      {inst.location}
                    </p>
                  </FloatingCard>
                );
              })}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className='mx-auto mt-12 max-w-2xl text-center text-lg leading-relaxed text-white/45'
            >
              {about('tagline')}
            </motion.p>
          </div>
        </RevealSection>

        {/* ══ FOR INTERNATIONAL PATIENTS — dark ══ */}
        <RevealSection id='patients' className='px-6 py-24 md:px-10'>
          <div className='mx-auto max-w-6xl'>
            <div className='grid gap-12 lg:grid-cols-2 lg:gap-16'>
              <div>
                <span className='mb-3 inline-block rounded-full bg-[#52B788]/15 px-4 py-1.5 text-xs font-medium tracking-wide uppercase text-[#52B788]'>
                  {patients('badge')}
                </span>
                <h2
                  className='mt-4 text-3xl text-white md:text-4xl lg:text-5xl'
                  style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
                >
                  {patients('heading1')}
                  <br />
                  {patients('heading2')}{' '}
                  <span className='italic text-[#52B788]'>
                    {patients('headingAccent')}
                  </span>
                </h2>
                <p className='mt-6 max-w-md text-base leading-relaxed text-white/60'>
                  {patients('description')}
                </p>
                <p className='mt-6 text-sm font-medium text-[#52B788]'>
                  {patients('languages')}
                </p>
              </div>

              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                {[
                  { label: patientCategories[0], icon: Globe },
                  { label: patientCategories[1], icon: Shield },
                  { label: patientCategories[2], icon: Award },
                  { label: patientCategories[3], icon: GraduationCap },
                  { label: patientCategories[4], icon: MapPin },
                  { label: patientCategories[5], icon: Users },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.06,
                      type: 'spring',
                      stiffness: 100,
                    }}
                    className='flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.06] p-5 backdrop-blur-sm transition hover:border-[#52B788]/25 hover:bg-white/[0.1]'
                  >
                    <item.icon className='h-5 w-5 text-[#52B788]/60' />
                    <span className='text-sm text-white/70'>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>
      </div>

      {/* ══ CONSULTATION APPROACH ══ */}
      <div className='bg-[#FAF7F2]'>
        <RevealSection id='approach' className='px-6 py-24 md:px-10'>
          <div className='mx-auto max-w-6xl'>
            <div className='mb-16 max-w-2xl'>
              <span className='mb-3 inline-block rounded-full bg-[#2D6A4F]/8 px-4 py-1.5 text-xs font-medium tracking-wide uppercase text-[#2D6A4F]'>
                {approach('badge')}
              </span>
              <h2
                className='mt-4 text-3xl md:text-5xl'
                style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
              >
                {approach('heading1')}
                <br />
                {approach('heading2')}{' '}
                <span className='italic text-[#2D6A4F]'>
                  {approach('headingAccent')}
                </span>
              </h2>
            </div>

            <div className='space-y-3'>
              {[
                Diagnostics,
                ArtificialIntelligence,
                Communication,
                PalliativeCare,
                GeneralSurgery,
              ].map((StepIcon, i) => {
                const step = approachSteps[i];
                const num = `0${i + 1}`;
                return (
                  <FloatingCard
                    key={step.title}
                    delay={i * 0.08}
                    className='group flex items-center gap-6 rounded-2xl border border-[#1A1A1A]/[0.05] bg-white/70 p-6 transition hover:border-[#2D6A4F]/15 hover:shadow-lg hover:shadow-[#2D6A4F]/5 md:gap-8 md:p-8'
                  >
                    <span
                      className='text-3xl font-semibold text-[#2D6A4F]/70 md:text-4xl'
                      style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
                    >
                      {num}
                    </span>
                    <div className='flex-1'>
                      <h3 className='text-lg font-medium md:text-xl'>
                        {step.title}
                      </h3>
                      <p className='mt-1 text-sm text-[#1A1A1A]/55'>
                        {step.desc}
                      </p>
                    </div>
                    <StepIcon className='hidden h-7 w-7 text-[#2D6A4F]/70 transition group-hover:text-[#2D6A4F] md:block' />
                  </FloatingCard>
                );
              })}
            </div>

            {/* ── Prominent Quote with geometric clipart ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='relative mt-16 overflow-hidden rounded-3xl border border-[#2D6A4F]/15 bg-linear-to-br from-[#2D6A4F]/8 via-[#2D6A4F]/4 to-[#52B788]/6 px-8 py-12 md:px-14 md:py-16'
            >
              {/* Geometric clipart shapes */}
              <svg
                className='pointer-events-none absolute inset-0 h-full w-full'
                viewBox='0 0 800 300'
                preserveAspectRatio='xMidYMid slice'
                aria-hidden='true'
              >
                {/* Large diamond — top left */}
                <polygon
                  points='60,30 110,80 60,130 10,80'
                  fill='none'
                  stroke='rgba(45,106,79,0.12)'
                  strokeWidth='1.5'
                />
                {/* Small rotated square — top right */}
                <rect
                  x='700'
                  y='20'
                  width='50'
                  height='50'
                  rx='4'
                  fill='rgba(82,183,136,0.06)'
                  stroke='rgba(45,106,79,0.1)'
                  strokeWidth='1'
                  transform='rotate(45 725 45)'
                />
                {/* Circle cluster — bottom left */}
                <circle
                  cx='80'
                  cy='260'
                  r='35'
                  fill='rgba(45,106,79,0.04)'
                  stroke='rgba(45,106,79,0.08)'
                  strokeWidth='1'
                />
                <circle cx='55' cy='235' r='12' fill='rgba(82,183,136,0.06)' />
                {/* Hexagon — bottom right */}
                <polygon
                  points='720,240 750,225 780,240 780,270 750,285 720,270'
                  fill='rgba(45,106,79,0.04)'
                  stroke='rgba(45,106,79,0.1)'
                  strokeWidth='1'
                />
                {/* Dotted arc — top center */}
                <path
                  d='M 300 10 Q 400 -20 500 10'
                  fill='none'
                  stroke='rgba(45,106,79,0.08)'
                  strokeWidth='1.5'
                  strokeDasharray='4 6'
                />
                {/* Small triangle — right side */}
                <polygon
                  points='760,140 790,180 730,180'
                  fill='none'
                  stroke='rgba(82,183,136,0.12)'
                  strokeWidth='1'
                />
                {/* Cross / plus — left center */}
                <line
                  x1='20'
                  y1='150'
                  x2='50'
                  y2='150'
                  stroke='rgba(45,106,79,0.1)'
                  strokeWidth='1.5'
                />
                <line
                  x1='35'
                  y1='135'
                  x2='35'
                  y2='165'
                  stroke='rgba(45,106,79,0.1)'
                  strokeWidth='1.5'
                />
                {/* Small dots cluster — scattered */}
                <circle cx='200' cy='50' r='2.5' fill='rgba(45,106,79,0.15)' />
                <circle cx='220' cy='40' r='1.5' fill='rgba(82,183,136,0.12)' />
                <circle cx='600' cy='260' r='2' fill='rgba(45,106,79,0.12)' />
                <circle cx='620' cy='250' r='3' fill='rgba(82,183,136,0.08)' />
              </svg>

              {/* Quote content */}
              <div className='relative z-10 flex flex-col items-center gap-6 text-center'>
                {/* Large decorative open-quote */}
                <span
                  className='text-6xl leading-none text-[#2D6A4F]/25 md:text-8xl'
                  style={{ fontFamily: 'Georgia, serif' }}
                  aria-hidden='true'
                >
                  &ldquo;
                </span>
                <p
                  className='-mt-6 max-w-2xl text-2xl font-medium leading-relaxed text-[#1A1A1A]/75 md:text-3xl lg:text-4xl'
                  style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
                >
                  {approach('quote1')}
                  <br />
                  {approach('quote2')}
                  <br />
                  <span className='italic text-[#2D6A4F]'>
                    {approach('quoteAccent')}
                  </span>
                </p>
                {/* Thin separator line */}
                <div className='mt-2 h-px w-16 bg-[#2D6A4F]/20' />
                <MedicalAdvice className='h-6 w-6 text-[#2D6A4F]/40' />
              </div>
            </motion.div>
          </div>
        </RevealSection>
      </div>

      {/* ══ STUDENTS & ACADEMIC ══ */}
      <div
        className='relative'
        style={{
          background:
            'linear-gradient(160deg, #0A1A14 0%, #1A3A2A 40%, #2D6A4F 100%)',
          borderRadius: '3rem 3rem 0 0',
        }}
      >
        {/* Grain texture overlay */}
        <svg
          className='pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]'
          aria-hidden='true'
        >
          <filter id='grain'>
            <feTurbulence
              type='fractalNoise'
              baseFrequency='0.65'
              numOctaves='3'
              stitchTiles='stitch'
            />
          </filter>
          <rect width='100%' height='100%' filter='url(#grain)' />
        </svg>

        {/* Decorative geometric shapes */}
        <svg
          className='pointer-events-none absolute inset-0 h-full w-full'
          viewBox='0 0 1200 800'
          preserveAspectRatio='xMidYMid slice'
          aria-hidden='true'
        >
          {/* Large circle — top right */}
          <circle
            cx='1050'
            cy='80'
            r='120'
            fill='none'
            stroke='rgba(82,183,136,0.06)'
            strokeWidth='1'
          />
          <circle
            cx='1050'
            cy='80'
            r='80'
            fill='none'
            stroke='rgba(82,183,136,0.04)'
            strokeWidth='0.5'
          />
          {/* Dotted arc — left */}
          <path
            d='M -20 300 Q 80 200 80 400'
            fill='none'
            stroke='rgba(82,183,136,0.06)'
            strokeWidth='1'
            strokeDasharray='4 8'
          />
          {/* Small crosses */}
          <line
            x1='200'
            y1='100'
            x2='220'
            y2='100'
            stroke='rgba(82,183,136,0.08)'
            strokeWidth='1'
          />
          <line
            x1='210'
            y1='90'
            x2='210'
            y2='110'
            stroke='rgba(82,183,136,0.08)'
            strokeWidth='1'
          />
          <line
            x1='950'
            y1='600'
            x2='970'
            y2='600'
            stroke='rgba(82,183,136,0.06)'
            strokeWidth='1'
          />
          <line
            x1='960'
            y1='590'
            x2='960'
            y2='610'
            stroke='rgba(82,183,136,0.06)'
            strokeWidth='1'
          />
          {/* Scattered dots */}
          <circle cx='400' cy='60' r='2' fill='rgba(82,183,136,0.1)' />
          <circle cx='420' cy='50' r='1.5' fill='rgba(82,183,136,0.07)' />
          <circle cx='800' cy='700' r='2.5' fill='rgba(82,183,136,0.08)' />
          <circle cx='150' cy='650' r='1.5' fill='rgba(82,183,136,0.06)' />
          {/* Hexagon — bottom right */}
          <polygon
            points='1100,500 1130,485 1160,500 1160,530 1130,545 1100,530'
            fill='none'
            stroke='rgba(82,183,136,0.05)'
            strokeWidth='1'
          />
          {/* Diamond — center left */}
          <rect
            x='60'
            y='480'
            width='30'
            height='30'
            rx='2'
            fill='none'
            stroke='rgba(82,183,136,0.05)'
            strokeWidth='1'
            transform='rotate(45 75 495)'
          />
        </svg>

        <RevealSection
          id='academic'
          className='relative z-10 px-6 py-24 md:px-10'
        >
          <div className='mx-auto max-w-6xl'>
            <div className='grid gap-12 lg:grid-cols-5 lg:gap-8'>
              <div className='lg:col-span-3'>
                <span className='mb-3 inline-block rounded-full bg-[#C9BFA7]/15 px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-[#C9BFA7]'>
                  {academic('badge')}
                </span>
                <h2
                  className='mt-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl'
                  style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
                >
                  {academic('heading1')}
                  <br />
                  {academic('heading2')}{' '}
                  <span
                    className='italic text-[#C9BFA7]'
                    style={{ textShadow: '0 0 40px rgba(201,191,167,0.3)' }}
                  >
                    {academic('headingAccent')}
                  </span>
                </h2>
                <p className='mt-6 max-w-md text-base leading-relaxed text-white/55'>
                  {academic('description')}
                </p>

                <div className='mt-8 space-y-3'>
                  {academicOrgs.map((org, i) => (
                    <motion.div
                      key={org}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 }}
                      className='flex items-start gap-3 rounded-xl border-l-2 border-[#C9BFA7]/50 bg-white/[0.05] px-5 py-4 backdrop-blur-md transition hover:bg-white/[0.09]'
                    >
                      <Award className='mt-0.5 h-4 w-4 shrink-0 text-[#C9BFA7]' />
                      <p className='text-sm text-white/65'>{org}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className='flex flex-col justify-center lg:col-span-2'>
                <div
                  className='rounded-3xl p-6 md:p-8'
                  style={{ background: 'oklch(0.2178 0 0)' }}
                >
                  <p className='mb-5 text-xs font-medium tracking-wider uppercase text-white/35'>
                    {academic('sidebarTitle')}
                  </p>
                  <div className='space-y-3'>
                    {academicSidebarItems.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.1,
                          type: 'spring',
                          stiffness: 80,
                        }}
                        className='flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.04] p-4 transition hover:border-[#C9BFA7]/20 hover:bg-white/[0.07]'
                      >
                        <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9BFA7]/12'>
                          <span className='text-xs font-semibold text-[#C9BFA7]'>
                            0{i + 1}
                          </span>
                        </div>
                        <p
                          className='text-base text-white/75'
                          style={{
                            fontFamily: 'var(--font-raleway), sans-serif',
                          }}
                        >
                          {item}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className='mt-6 text-base italic text-[#C9BFA7]/55'
                    style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
                  >
                    {academic('sidebarQuote')}
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Thin divider */}
        <div className='mx-auto max-w-4xl px-6 md:px-10'>
          <div className='h-px bg-gradient-to-r from-transparent via-[#C9BFA7]/20 to-transparent' />
        </div>

        {/* ══ PHILOSOPHY — git chain ══ */}
        <RevealSection className='px-6 py-12 md:px-10'>
          <div className='mx-auto max-w-6xl'>
            <div
              className='relative overflow-hidden rounded-[2rem] border border-white/8 p-12 md:p-20 lg:p-24'
              style={{ background: 'oklch(0.2178 0 0)' }}
            >
              {/* Radial spotlight glow */}
              <div
                className='pointer-events-none absolute inset-0'
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 0%, rgba(201,191,167,0.06) 0%, transparent 60%)',
                }}
              />
              <div className='relative text-center'>
                <h2
                  className='text-3xl text-white md:text-5xl lg:text-6xl'
                  style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
                >
                  {philosophy('heading')}
                </h2>
                <p className='mx-auto mt-6 max-w-xl text-lg text-white/50'>
                  {philosophy('description')}
                </p>

                {/* Git chain */}
                <div className='relative mx-auto mt-12 inline-flex flex-col items-start'>
                  {/* Continuous vertical line behind dots */}
                  <div
                    className='absolute left-[9px] top-[10px] w-px bg-[#C9BFA7]/30'
                    style={{ bottom: '50px' }}
                  />

                  {philosophyItems.map((word, i) => (
                    <motion.div
                      key={word}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.15,
                        type: 'spring',
                        stiffness: 100,
                      }}
                      className={`flex items-center gap-4 ${i > 0 ? 'mt-6 md:mt-8' : ''}`}
                    >
                      {/* Dot — fixed 20px column */}
                      <div className='relative z-10 flex h-5 w-5 shrink-0 items-center justify-center'>
                        <div
                          className='absolute h-5 w-5 rounded-full border-2 border-[#C9BFA7]/50'
                          style={{
                            background: 'oklch(0.2178 0 0)',
                            animation: 'dotPulse 3s ease-in-out infinite',
                            animationDelay: `${i * 0.4}s`,
                          }}
                        />
                        <div className='relative h-2.5 w-2.5 rounded-full bg-[#C9BFA7]' />
                      </div>
                      {/* Label */}
                      <span
                        className='text-xl text-white/80 md:text-2xl'
                        style={{
                          fontFamily: 'var(--font-raleway), sans-serif',
                        }}
                      >
                        {word}
                      </span>
                    </motion.div>
                  ))}

                  {/* Final merge commit — the quote */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
                    className='mt-6 flex items-center gap-3 border border-[#C9BFA7]/20 bg-[#C9BFA7]/8 py-3 pr-5 md:mt-8'
                    style={{ paddingLeft: '0px' }}
                  >
                    {/* Diamond marker — aligned with dot column */}
                    <div className='relative z-10 flex h-5 w-5 shrink-0 items-center justify-center'>
                      <div className='h-3.5 w-3.5 rotate-45 rounded-sm border-2 border-[#C9BFA7] bg-[#C9BFA7]/20' />
                    </div>
                    <p
                      className='text-base font-medium italic text-[#C9BFA7] md:text-lg lg:text-xl'
                      style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
                    >
                      {philosophy('mergeQuote')}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>

      {/* ══ CTA / CONTACT — charcoal ══ */}
      <div style={{ background: 'oklch(0.2178 0 0)' }}>
        <RevealSection id='contact' className='px-6 py-24 md:px-10'>
          <div className='mx-auto max-w-6xl'>
            <div className='text-center'>
              <span className='mb-3 inline-block rounded-full bg-[#52B788]/15 px-4 py-1.5 text-xs font-medium tracking-wide uppercase text-[#52B788]'>
                {contact('badge')}
              </span>
              <h2
                className='mt-4 text-3xl text-white md:text-5xl'
                style={{ fontFamily: 'var(--font-raleway), sans-serif' }}
              >
                {contact('heading')}{' '}
                <span className='italic text-[#52B788]'>
                  {contact('headingAccent')}
                </span>
              </h2>
              <p className='mx-auto mt-6 max-w-lg text-lg text-white/60'>
                {contact('description')}
              </p>
            </div>

            <div className='mt-12 flex justify-center'>
              <ConsultationCard />
            </div>

            <div className='mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/45'>
              <div className='flex items-center gap-2'>
                <Clock className='h-4 w-4 text-white/50' />
                {contact('infoEvaluation')}
              </div>
              <div className='h-4 w-px bg-white/15' />
              <div className='flex items-center gap-2'>
                <Globe className='h-4 w-4 text-white/50' />
                {contact('infoLanguages')}
              </div>
              <div className='h-4 w-px bg-white/15' />
              <div className='flex items-center gap-2'>
                <MapPin className='h-4 w-4 text-white/50' />
                {contact('infoLocation')}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ── FOOTER ── */}
        <footer className='border-t border-white/[0.1] px-6 py-10 md:px-10'>
          <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row'>
            <div className='flex items-center gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[#2D6A4F]'>
                <Stethoscope className='h-3.5 w-3.5 text-white' />
              </div>
              <span className='text-sm text-white/60'>{footer('name')}</span>
            </div>
            <p className='text-xs text-white/35'>
              {footer('copyright')} {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
