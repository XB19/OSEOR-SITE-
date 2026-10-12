import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import PageHero from '../components/PageHero';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import { Field, Alert, SubmitButton, isEmail } from '../components/Form';
import { CONTACT } from '../lib/contact';
import { api } from '../lib/api';

const EMPTY = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const errors = {
    name: !form.name.trim() && t('CONTACT_PAGE.REQUIRED'),
    email: !form.email.trim() ? t('CONTACT_PAGE.REQUIRED') : !isEmail(form.email) && t('CONTACT_PAGE.INVALID_EMAIL'),
    subject: !form.subject.trim() && t('CONTACT_PAGE.REQUIRED'),
    message: !form.message.trim() && t('CONTACT_PAGE.REQUIRED'),
  };
  const invalid = Object.values(errors).some(Boolean);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const blur = (k) => () => setTouched((s) => ({ ...s, [k]: true }));
  const err = (k) => touched[k] && errors[k];

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (invalid) return;
    setStatus('sending');
    try {
      await api.sendContact(form);
      setStatus('success');
      setForm(EMPTY);
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const infos = [
    { icon: 'fa-location-dot', label: t('CONTACT_PAGE.ADDRESS'), lines: [t('TOPBAR.ADDRESS')] },
    { icon: 'fa-phone', label: t('CONTACT_PAGE.PHONE_LABEL'), lines: CONTACT.phones, hrefs: CONTACT.phoneLinks.map((p) => `tel:${p}`) },
    { icon: 'fa-envelope', label: t('CONTACT_PAGE.EMAIL_LABEL'), lines: [CONTACT.email, CONTACT.hrEmail], hrefs: [`mailto:${CONTACT.email}`, `mailto:${CONTACT.hrEmail}`] },
  ];

  return (
    <>
      <PageHero title={t('CONTACT_PAGE.TITLE')} subtitle={t('CONTACT_PAGE.INTRO')} crumbs={[{ label: t('NAVBAR.CONTACT') }]} />

      <section className="section bg-slate-50">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          <Stagger className="space-y-5 lg:col-span-2" stagger={0.1}>
            {infos.map((info) => (
              <StaggerItem key={info.label} className="group card flex items-start gap-5 p-6 transition-shadow duration-500 hover:shadow-soft">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-xl text-white transition-transform duration-500 group-hover:rotate-6 group-hover:bg-brand-red">
                  <i className={`fa-solid ${info.icon}`} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-red">{info.label}</p>
                  {info.lines.map((line, i) =>
                    info.hrefs ? (
                      <a key={line} href={info.hrefs[i]} className="mt-1.5 block font-medium text-slate-800 transition hover:text-brand-blue">
                        {line}
                      </a>
                    ) : (
                      <p key={line} className="mt-1.5 font-medium text-slate-800">{line}</p>
                    )
                  )}
                </div>
              </StaggerItem>
            ))}
            <StaggerItem className="overflow-hidden rounded-3xl border border-slate-100 shadow-card">
              <iframe
                title="OSEOR — Lomé"
                src={`https://www.google.com/maps?q=${encodeURIComponent(CONTACT.mapsQuery)}&output=embed`}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </StaggerItem>
          </Stagger>

          <Reveal className="lg:col-span-3" delay={0.1}>
            <form onSubmit={onSubmit} noValidate className="card space-y-6 p-6 sm:p-10">
              <div>
                <span className="eyebrow">{t('NAVBAR.CONTACT')}</span>
                <h2 className="mt-3 text-2xl font-bold md:text-3xl">{t('CONTACT_PAGE.SUBTITLE')}</h2>
              </div>
              <AnimatePresence>
                {status === 'success' && <Alert>{t('CONTACT_PAGE.SUCCESS')}</Alert>}
                {status === 'error' && (
                  <Alert type="error">
                    {t('CONTACT_PAGE.ERROR')}{' '}
                    <a href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(form.message)}`} className="font-bold underline">
                      {CONTACT.email}
                    </a>
                  </Alert>
                )}
              </AnimatePresence>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label={t('CONTACT_PAGE.NAME')} required error={err('name')}>
                  <input className={`field ${err('name') ? 'field-error' : ''}`} value={form.name} onChange={set('name')} onBlur={blur('name')} autoComplete="name" />
                </Field>
                <Field label={t('CONTACT_PAGE.EMAIL')} required error={err('email')}>
                  <input type="email" className={`field ${err('email') ? 'field-error' : ''}`} value={form.email} onChange={set('email')} onBlur={blur('email')} autoComplete="email" />
                </Field>
              </div>
              <Field label={t('CONTACT_PAGE.SUBJECT')} required error={err('subject')}>
                <input className={`field ${err('subject') ? 'field-error' : ''}`} value={form.subject} onChange={set('subject')} onBlur={blur('subject')} />
              </Field>
              <Field label={t('CONTACT_PAGE.MESSAGE')} required error={err('message')}>
                <textarea rows={6} className={`field resize-none ${err('message') ? 'field-error' : ''}`} value={form.message} onChange={set('message')} onBlur={blur('message')} />
              </Field>
              <div className="flex justify-end border-t border-slate-100 pt-6">
                <SubmitButton loading={status === 'sending'} loadingLabel={t('CONTACT_PAGE.SENDING')}>
                  {t('CONTACT_PAGE.SEND')}
                </SubmitButton>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
