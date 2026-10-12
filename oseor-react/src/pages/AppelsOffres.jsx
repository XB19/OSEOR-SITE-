import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHero from '../components/PageHero';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import { api } from '../lib/api';

export function Skeleton() {
  return (
    <div className="space-y-5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card animate-pulse p-8">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mt-4 h-6 w-2/3 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-full rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, desc, children }) {
  return (
    <Reveal className="card px-6 py-16 text-center">
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-blue/10" />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand-blue-light text-3xl text-brand-blue">
          <i className={`fa-solid ${icon}`} />
        </span>
      </div>
      {title && <h2 className="mt-8 text-xl font-bold">{title}</h2>}
      <p className="mx-auto mt-3 max-w-md text-slate-500">{desc}</p>
      {children}
    </Reveal>
  );
}

export const formatDate = (value, lang) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString(lang, { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function AppelsOffres() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState(null);

  useEffect(() => {
    // Sans backend joignable, on affiche l'état « aucun appel d'offre »
    api.getAppelsOffres().then((d) => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([]));
  }, []);

  return (
    <>
      <PageHero title={t('NAVBAR.TENDERS')} subtitle={t('TENDERS_PAGE.SUBTITLE')} crumbs={[{ label: t('NAVBAR.BON_PLAN') }, { label: t('NAVBAR.TENDERS') }]} />
      <section className="section bg-slate-50">
        <div className="container-x max-w-4xl">
          {items === null && <Skeleton />}
          {items?.length === 0 && (
            <EmptyState icon="fa-file-contract" title={t('TENDERS_PAGE.EMPTY_TITLE')} desc={t('TENDERS_PAGE.EMPTY_DESC')}>
              <Link to="/contact" className="btn-blue mt-8">
                {t('CTA.BUTTON')} <i className="fa-solid fa-arrow-right text-xs" />
              </Link>
            </EmptyState>
          )}
          {items?.length > 0 && (
            <Stagger className="space-y-5" stagger={0.08}>
              {items.map((o) => (
                <StaggerItem key={o.id ?? o.reference} className="group card p-6 transition-shadow duration-500 hover:shadow-soft md:p-8">
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                          {t('TENDERS_PAGE.REF')} : {o.reference}
                        </span>
                        <span className="text-sm font-medium text-brand-red">
                          <i className="fa-regular fa-calendar mr-1.5" />
                          {t('TENDERS_PAGE.DEADLINE')} : {formatDate(o.deadline, i18n.language)}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold group-hover:text-brand-blue">{o.title}</h2>
                      <p className="leading-relaxed text-slate-600">{o.description}</p>
                    </div>
                    {o.documentUrls && (
                      <a href={o.documentUrls} target="_blank" rel="noopener noreferrer" className="btn-blue shrink-0">
                        <i className="fa-solid fa-download" /> {t('TENDERS_PAGE.DOWNLOAD')}
                      </a>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </>
  );
}
