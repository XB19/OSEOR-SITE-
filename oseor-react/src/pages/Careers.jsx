import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import { Reveal, Stagger, StaggerItem, EASE } from '../components/Motion';
import { Field, FileInput, Alert, SubmitButton, isEmail } from '../components/Form';
import { CloseButton } from '../components/Modal';
import { Skeleton, EmptyState, formatDate } from './AppelsOffres';
import { CONTACT } from '../lib/contact';
import { api } from '../lib/api';

function HrEmail({ textKey }) {
  const { t } = useTranslation();
  return (
    <Reveal className="card relative mb-10 overflow-hidden p-8 text-center">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-blue-light" />
      <i className="fa-solid fa-envelope-open-text relative text-3xl text-brand-red" />
      <p className="relative mt-4 text-slate-600">{t(textKey)}</p>
      <a href={`mailto:${CONTACT.hrEmail}`} className="relative mt-2 inline-block font-display text-2xl font-bold text-brand-blue transition hover:text-brand-red md:text-3xl">
        {t('CAREERS_PAGE.RH_EMAIL')}
      </a>
    </Reveal>
  );
}

/**
 * Formulaire de candidature (l'envoi est simulé, comme dans le projet d'origine :
 * le backend n'expose pas encore d'endpoint d'upload public).
 */
function ApplyForm({ spontaneous = false, onDone }) {
  const { t } = useTranslation();
  const fileKeys = spontaneous ? ['cv', 'dossier', 'lm'] : ['cv', 'lm', 'docs'];
  const requiredFiles = spontaneous ? ['cv', 'dossier', 'lm'] : ['cv', 'lm'];
  const fileLabels = {
    cv: t('CAREERS_PAGE.FORM.CV'),
    lm: t('CAREERS_PAGE.FORM.LM'),
    docs: t('CAREERS_PAGE.FORM.DOCS'),
    dossier: t('CAREERS_EXTRA.DOSSIER'),
  };
  const empty = { fullName: '', email: '', phone: '', position: '', presentation: '', acceptTerms: false };
  const [form, setForm] = useState(empty);
  const [files, setFiles] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const req = t('CAREERS_PAGE.FORM.REQUIRED');
  const errors = {
    fullName: !form.fullName.trim() && req,
    email: !form.email.trim() ? req : !isEmail(form.email) && t('CAREERS_PAGE.FORM.INVALID_EMAIL'),
    phone: !form.phone.trim() ? req : !/^[+\d\s().-]{6,}$/.test(form.phone) && t('CAREERS_PAGE.FORM.INVALID_PHONE'),
    position: spontaneous && !form.position.trim() && req,
    acceptTerms: !form.acceptTerms && req,
    ...Object.fromEntries(requiredFiles.map((k) => [k, !files[k] && t('CAREERS_PAGE.FORM.FILE_REQUIRED')])),
  };
  const err = (k) => submitted && errors[k];
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setSubmitted(false);
      setForm(empty);
      setFiles({});
      onDone?.();
    }, 1500);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 p-6 sm:p-10">
      <AnimatePresence>
        {success && <Alert>{t(spontaneous ? 'CAREERS_PAGE.SPONTANEOUS_CONFIRMATION' : 'CAREERS_PAGE.CONFIRMATION')}</Alert>}
      </AnimatePresence>
      <div className="grid gap-6 md:grid-cols-2">
        <Field label={t('CAREERS_PAGE.FORM.FULL_NAME')} required error={err('fullName')}>
          <input className={`field ${err('fullName') ? 'field-error' : ''}`} value={form.fullName} onChange={set('fullName')} autoComplete="name" />
        </Field>
        <Field label={t('CAREERS_PAGE.FORM.EMAIL')} required error={err('email')}>
          <input type="email" className={`field ${err('email') ? 'field-error' : ''}`} value={form.email} onChange={set('email')} autoComplete="email" />
        </Field>
        <Field label={t('CAREERS_PAGE.FORM.PHONE')} required error={err('phone')}>
          <input type="tel" className={`field ${err('phone') ? 'field-error' : ''}`} value={form.phone} onChange={set('phone')} autoComplete="tel" />
        </Field>
        {spontaneous && (
          <Field label={t('CAREERS_PAGE.FORM.POSITION')} required error={err('position')}>
            <input className={`field ${err('position') ? 'field-error' : ''}`} value={form.position} onChange={set('position')} />
          </Field>
        )}
      </div>
      {spontaneous && (
        <Field label={t('CAREERS_PAGE.FORM.PRESENTATION')}>
          <textarea rows={4} className="field resize-none" value={form.presentation} onChange={set('presentation')} />
        </Field>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {fileKeys.map((k, i) => (
          <FileInput
            key={k}
            label={fileLabels[k]}
            required={requiredFiles.includes(k)}
            file={files[k]}
            error={err(k)}
            onChange={(file) => setFiles((f) => ({ ...f, [k]: file }))}
            className={i === fileKeys.length - 1 ? 'md:col-span-2' : ''}
          />
        ))}
      </div>
      <label className={`flex cursor-pointer items-start gap-3 rounded-xl p-3 text-sm ${err('acceptTerms') ? 'bg-brand-red-light text-brand-red' : 'text-slate-600'}`}>
        <input type="checkbox" checked={form.acceptTerms} onChange={set('acceptTerms')} className="mt-0.5 h-4 w-4 accent-[#036eb1]" />
        {t('CAREERS_PAGE.FORM.ACCEPT_TERMS')}
      </label>
      <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 md:flex-row">
        <p className="text-xs text-slate-400">{t('CAREERS_EXTRA.REQUIRED_FIELDS')}</p>
        <SubmitButton loading={sending}>{t('CAREERS_PAGE.APPLY_NOW')}</SubmitButton>
      </div>
    </form>
  );
}

export function OffresEmploi() {
  const { t, i18n } = useTranslation();
  const [offers, setOffers] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.getOffresEmploi().then((d) => setOffers(Array.isArray(d) ? d : [])).catch(() => setOffers([]));
  }, []);

  return (
    <>
      <PageHero title={t('CAREERS_PAGE.OFFERS_TITLE')} subtitle={t('CAREERS_PAGE.OFFERS_SUBTITLE')} image="assets/images/services.jpg" crumbs={[{ label: t('NAVBAR.CAREERS') }, { label: t('NAVBAR.JOB_OFFERS') }]} />
      <section className="section bg-slate-50">
        <div className="container-x max-w-5xl">
          <HrEmail textKey="CAREERS_PAGE.RH_EMAIL_TEXT" />
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key="form" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: EASE }} className="card overflow-hidden">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 sm:px-10">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-red">{t('CAREERS_EXTRA.APPLY_FOR')}</p>
                    <h3 className="mt-1 text-lg font-bold">{selected.title}</h3>
                  </div>
                  <CloseButton onClick={() => setSelected(null)} />
                </div>
                <ApplyForm onDone={() => setTimeout(() => setSelected(null), 5000)} />
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {offers === null && <Skeleton />}
                {offers?.length === 0 && (
                  <EmptyState icon="fa-briefcase" desc={t('CAREERS_PAGE.NO_OFFERS')}>
                    <Link to="/carrieres/candidature" className="btn-red mt-8">
                      {t('NAVBAR.SPONTANEOUS_CANDIDACY')} <i className="fa-solid fa-arrow-right text-xs" />
                    </Link>
                  </EmptyState>
                )}
                {offers?.length > 0 && (
                  <Stagger className="space-y-5" stagger={0.08}>
                    {offers.map((o) => (
                      <StaggerItem key={o.id} className="group card p-6 transition-shadow duration-500 hover:shadow-soft md:p-8">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-brand-blue-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-blue">{o.contractType}</span>
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                                <i className="fa-solid fa-location-dot mr-1" /> {o.location}
                              </span>
                            </div>
                            <h2 className="text-xl font-bold group-hover:text-brand-blue md:text-2xl">{o.title}</h2>
                            <p className="leading-relaxed text-slate-600">{o.description}</p>
                            <p className="text-sm font-medium text-brand-red">
                              <i className="fa-regular fa-calendar mr-2" />
                              {t('CAREERS_EXTRA.DEADLINE')} : {formatDate(o.deadline, i18n.language)}
                            </p>
                          </div>
                          <button type="button" onClick={() => setSelected(o)} className="btn-blue shrink-0 uppercase tracking-wider">
                            {t('CAREERS_PAGE.POSTULER')}
                          </button>
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

export function CandidatureSpontanee() {
  const { t } = useTranslation();
  return (
    <>
      <PageHero title={t('CAREERS_PAGE.SPONTANEOUS_TITLE')} subtitle={t('CAREERS_PAGE.SPONTANEOUS_SUBTITLE')} image="assets/images/conseil.jpg" crumbs={[{ label: t('NAVBAR.CAREERS') }, { label: t('NAVBAR.SPONTANEOUS_CANDIDACY') }]} />
      <section className="section bg-slate-50">
        <div className="container-x max-w-4xl">
          <HrEmail textKey="CAREERS_PAGE.RH_EMAIL_SPONTANEOUS_TEXT" />
          <Reveal className="card overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-5 sm:px-10">
              <h3 className="text-lg font-bold">{t('CAREERS_EXTRA.FORM_TITLE')}</h3>
            </div>
            <ApplyForm spontaneous onDone={() => window.scrollTo({ top: 400, behavior: 'smooth' })} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
