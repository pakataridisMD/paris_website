'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { TOPICS, type Topic } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Emblem } from './emblem';
import { EASE } from './motion';
import { usePauseScroll } from './scroll';

const ContactContext = createContext<(topic?: Topic) => void>(() => {});

/* Any component can open the appointment form, optionally preselecting a topic. */
export function useContact() {
  return useContext(ContactContext);
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<Topic>('medical');
  usePauseScroll(open);

  function openContact(next: Topic = 'other') {
    setTopic(next);
    setOpen(true);
  }

  return (
    <ContactContext.Provider value={openContact}>
      {children}
      <AppointmentPanel open={open} onOpenChange={setOpen} topic={topic} onTopicChange={setTopic} />
    </ContactContext.Provider>
  );
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

const fieldClass =
  'w-full border-0 border-b border-white/15 bg-transparent px-0 py-3 text-base text-bone placeholder:text-bone/25 outline-none transition-colors focus:border-brass';

function AppointmentPanel({
  open,
  onOpenChange,
  topic,
  onTopicChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: Topic;
  onTopicChange: (topic: Topic) => void;
}) {
  const t = useTranslations('Contact');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          phone: form.get('phone'),
          message: form.get('message'),
          consent: form.get('consent') === 'on',
          company: form.get('company'),
          topic,
          locale,
        }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    // Reset once the closing animation has finished.
    if (!next) setTimeout(() => setStatus('idle'), 500);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='panel-overlay fixed inset-0 z-[70] bg-ink/60 backdrop-blur-sm' />
        <DialogPrimitive.Content
          data-lenis-prevent
          className='panel-content grain fixed inset-y-0 right-0 z-[80] flex w-full max-w-xl flex-col overflow-y-auto overscroll-contain bg-ink-soft text-bone shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.6)] outline-none md:border-l md:border-white/10'
        >
          <div className='relative z-10 flex min-h-full flex-col px-6 pt-6 pb-10 sm:px-10 md:px-12'>
            <div className='flex items-center justify-between'>
              <span className='flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-brass uppercase'>
                <Emblem className='h-7 w-7' />
                {t('eyebrow')}
              </span>
              <DialogPrimitive.Close
                aria-label={t('close')}
                className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-full ring-1 ring-white/15 transition hover:bg-bone hover:text-ink'
              >
                <X className='h-4 w-4' />
              </DialogPrimitive.Close>
            </div>

            <AnimatePresence mode='wait' initial={false}>
              {status === 'sent' ? (
                <motion.div
                  key='sent'
                  className='flex flex-1 flex-col justify-center py-16'
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  <Emblem className='h-16 w-16 text-brass' />
                  <DialogPrimitive.Title className='mt-10 font-serif text-5xl font-light italic'>
                    {t('successTitle')}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className='mt-5 max-w-sm text-lg leading-relaxed text-bone/60'>
                    {t('successMessage')}
                  </DialogPrimitive.Description>
                  <DialogPrimitive.Close className='mt-12 w-fit cursor-pointer rounded-full border border-white/25 px-6 py-3 text-sm transition hover:bg-bone hover:text-ink'>
                    {t('close')}
                  </DialogPrimitive.Close>
                </motion.div>
              ) : (
                <motion.div
                  key='form'
                  className='flex flex-1 flex-col'
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogPrimitive.Title className='mt-14 font-serif text-[clamp(2.4rem,6vw,3.6rem)] leading-[1.02] font-light tracking-[-0.02em]'>
                    {t('title')}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className='mt-5 max-w-md leading-relaxed text-bone/55'>
                    {t('description')}
                  </DialogPrimitive.Description>

                  <form onSubmit={handleSubmit} className='mt-12 flex flex-1 flex-col gap-8'>
                    <fieldset>
                      <legend className='mb-3 font-mono text-[11px] tracking-[0.2em] text-bone/40 uppercase'>
                        {t('topicLabel')}
                      </legend>
                      <div className='grid grid-cols-2 gap-1 rounded-3xl bg-white/[0.05] p-1 sm:grid-cols-4 sm:rounded-full'>
                        {TOPICS.map((key) => (
                          <button
                            key={key}
                            type='button'
                            onClick={() => onTopicChange(key)}
                            aria-pressed={topic === key}
                            className={cn(
                              'relative cursor-pointer rounded-full px-3 py-2 text-xs font-medium transition-colors',
                              topic === key ? 'text-ink' : 'text-bone/55 hover:text-bone',
                            )}
                          >
                            {topic === key && (
                              <motion.span
                                layoutId='topic-pill'
                                className='absolute inset-0 rounded-full bg-bone'
                                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                              />
                            )}
                            <span className='relative'>{t(`topics.${key}`)}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <Field label={t('labelName')} required>
                      <input name='name' required maxLength={120} autoComplete='name' placeholder={t('placeholderName')} className={fieldClass} />
                    </Field>
                    <div className='grid gap-8 sm:grid-cols-2'>
                      <Field label={t('labelEmail')} required>
                        <input name='email' type='email' required maxLength={200} autoComplete='email' placeholder={t('placeholderEmail')} className={fieldClass} />
                      </Field>
                      <Field label={t('labelPhone')} hint={t('labelOptional')}>
                        <input name='phone' type='tel' maxLength={40} autoComplete='tel' placeholder={t('placeholderPhone')} className={fieldClass} />
                      </Field>
                    </div>
                    <Field label={t('labelMessage')} required>
                      <textarea
                        name='message'
                        required
                        rows={4}
                        maxLength={4000}
                        placeholder={t('placeholderMessage')}
                        className={cn(fieldClass, 'resize-none leading-relaxed')}
                      />
                    </Field>

                    {/* Honeypot: invisible to people, tempting to bots */}
                    <div aria-hidden='true' className='sr-only'>
                      <label>
                        Company
                        <input name='company' tabIndex={-1} autoComplete='off' />
                      </label>
                    </div>

                    <label className='flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-bone/60'>
                      <input name='consent' type='checkbox' required className='mt-1 h-4 w-4 shrink-0 cursor-pointer accent-brass' />
                      <span>
                        {t('consent')}{' '}
                        <Link
                          href='/privacy'
                          onClick={() => handleOpenChange(false)}
                          className='text-bone underline underline-offset-4 hover:text-brass'
                        >
                          {t('consentLink')}
                        </Link>
                        .
                      </span>
                    </label>

                    {status === 'error' && (
                      <p role='alert' className='border-l-2 border-red-400/70 pl-4 text-sm text-red-300'>
                        {t('errorGeneric')}
                      </p>
                    )}

                    <div className='mt-auto space-y-5 pt-4'>
                      <button
                        type='submit'
                        disabled={status === 'sending'}
                        className='group flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-bone px-6 py-4 text-sm font-medium text-ink transition-colors duration-300 hover:bg-brass disabled:cursor-wait disabled:opacity-60'
                      >
                        {status === 'sending' ? t('submitSending') : t('submitButton')}
                        <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                      </button>
                      <p className='flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.12em] text-bone/40 uppercase'>
                        <span className='h-1.5 w-1.5 rounded-full bg-red-400/80' />
                        {t('emergency')}
                      </p>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className='block'>
      <span className='block font-mono text-[11px] tracking-[0.2em] text-bone/45 uppercase'>
        {label}
        {required && <span className='text-brass'> *</span>}
        {hint && <span className='tracking-normal text-bone/25 normal-case'> ({hint})</span>}
      </span>
      {children}
    </label>
  );
}
