'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { FileText, GraduationCap, Microscope, MonitorPlay, Presentation } from 'lucide-react';
import summit from '@/public/images/acs-summit-group.jpg';
import podium from '@/public/images/acs-summit-podium.jpg';
import simulator from '@/public/images/simulator-teaching.jpg';
import talk from '@/public/images/talk-portrait.jpg';
import { ArrowButton } from './button';
import { useContact } from './contact';
import { ScrollMedia } from './media';
import { Reveal, SplitWords } from './motion';
import { NextChapter } from './next-chapter';
import { PageHero } from './page-hero';

type Offer = { title: string; desc: string };
type Training = { name: string; place: string };

const OFFER_ICONS = [Microscope, FileText, MonitorPlay, Presentation];

export function EducationPage() {
  const t = useTranslations('Education');
  const openContact = useContact();
  const offers = t.raw('offers') as Offer[];
  const training = t.raw('training') as Training[];
  const memberships = t.raw('memberships') as string[];

  return (
    <>
      <PageHero
        index='03'
        label={t('label')}
        title={t('heading')}
        titleAccent={t('headingAccent')}
        intro={t('intro')}
        image={talk}
        imageAlt={t('photos.talk')}
        imagePosition='object-center'
        eyebrow={
          <span className='inline-flex items-center gap-2 rounded-full border border-brass/30 px-4 py-2 text-sm text-brass'>
            <GraduationCap className='h-4 w-4' />
            {t('eyebrow')}
          </span>
        }
      />

      {/* overflow-clip (not hidden) keeps the sticky cards below working */}
      <section className='grain relative overflow-clip bg-ink pb-24 md:pb-36'>
        <div className='relative z-10 mx-auto max-w-7xl px-4 md:px-8'>
          <div className='grid gap-10 text-bone md:grid-cols-12 md:gap-6'>
            <ScrollMedia
              src={summit}
              alt={t('photos.summit')}
              caption={t('photos.summit')}
              className='md:col-span-7'
              aspect='aspect-[760/792]'
              sizes='(min-width: 768px) 58vw, 100vw'
            />
            <ScrollMedia
              src={simulator}
              alt={t('photos.teaching')}
              caption={t('photos.teaching')}
              className='md:col-span-5 md:mt-32'
              aspect='aspect-[3/4]'
              sizes='(min-width: 768px) 42vw, 100vw'
            />
          </div>

          {/* At the podium: the photo speaks for itself */}
          <ScrollMedia
            src={podium}
            alt={t('featuredVenue')}
            className='mt-24 md:mt-36'
            aspect='aspect-[1179/378] min-h-56'
            position='object-left'
            sizes='(min-width: 1280px) 1216px, 100vw'
            from={0.82}
          />

          {/* What I teach — cards stack as you scroll */}
          <div className='mt-28 grid gap-10 md:mt-40 md:grid-cols-12'>
            <div className='md:col-span-4'>
              <div className='md:sticky md:top-28'>
                <h2 className='font-serif text-5xl font-light tracking-[-0.02em] md:text-6xl'>
                  <SplitWords text={t('offersTitle')} />
                </h2>
                <Reveal delay={0.1}>
                  <span className='mt-6 block h-px w-24 bg-brass/60' />
                </Reveal>
              </div>
            </div>
            <div className='md:col-span-8'>
              {offers.map((offer, i) => {
                const Icon = OFFER_ICONS[i % OFFER_ICONS.length];
                return (
                  <div key={offer.title} className='sticky pb-4' style={{ top: `${104 + i * 22}px` }}>
                    <Reveal y={60}>
                      <div className='flex min-h-56 flex-col justify-between gap-10 rounded-[28px] bg-ink-soft p-8 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10 md:p-10'>
                        <div className='flex items-start justify-between'>
                          <span className='font-serif text-5xl leading-none font-light text-brass italic'>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <Icon className='h-5 w-5 text-bone/35' />
                        </div>
                        <div>
                          <h3 className='font-serif text-3xl font-light'>{offer.title}</h3>
                          <p className='mt-3 max-w-lg leading-relaxed text-bone/55'>{offer.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical experience & memberships */}
          <div className='mt-24 grid gap-14 md:mt-36 md:grid-cols-2'>
            <CredentialList title={t('trainingTitle')}>
              {training.map((item) => (
                <li key={item.name} className='flex items-baseline justify-between gap-6 py-5'>
                  <span className='font-serif text-xl font-light'>{item.name}</span>
                  <span className='shrink-0 font-mono text-[11px] tracking-[0.2em] text-bone/40 uppercase'>
                    {item.place}
                  </span>
                </li>
              ))}
            </CredentialList>
            <CredentialList title={t('membershipsTitle')}>
              {memberships.map((item) => (
                <li key={item} className='py-5 font-serif text-xl font-light'>
                  {item}
                </li>
              ))}
            </CredentialList>
          </div>

          {/* Mentoring call to action */}
          <Reveal className='mt-24 md:mt-36'>
            <div className='relative isolate overflow-hidden rounded-[32px] bg-bone p-8 text-ink md:p-16'>
              <motion.div
                aria-hidden='true'
                className='absolute -right-24 -bottom-48 h-[32rem] w-[32rem] rounded-full border border-ink/10'
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              >
                <span className='absolute top-1/2 -left-1.5 h-3 w-3 rounded-full bg-brass' />
              </motion.div>
              <div className='relative max-w-2xl'>
                <h2 className='font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.02] font-light italic'>
                  {t('ctaHeading')}
                </h2>
                <p className='mt-6 text-lg leading-relaxed text-ink/60'>{t('ctaText')}</p>
                <div className='mt-10'>
                  <ArrowButton tone='dark' onClick={() => openContact('academic')}>
                    {t('cta')}
                  </ArrowButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <NextChapter to='medicine' />
    </>
  );
}

function CredentialList({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <p className='font-mono text-[11px] tracking-[0.25em] text-brass uppercase'>{title}</p>
      <ul className='mt-4 divide-y divide-white/10 border-y border-white/10'>{children}</ul>
    </Reveal>
  );
}
