import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import Modal, { CloseButton } from '../components/Modal';
import { CompanyCard, CompanyModal } from '../components/Company';
import { Reveal, Stagger, StaggerItem, EASE } from '../components/Motion';
import { POURQUOI } from '../data/home';
import { useSiteData } from '../lib/siteData';
import { asset } from '../lib/asset';

const FILTERS = [
  { value: 'all', key: 'PARTICIPATIONS.FILTERS.ALL', icon: 'fa-border-all' },
  { value: 'energie', key: 'PARTICIPATIONS.FILTERS.ENERGY', icon: 'fa-bolt' },
  { value: 'services', key: 'PARTICIPATIONS.FILTERS.SERVICES', icon: 'fa-handshake' },
  { value: 'industrie', key: 'PARTICIPATIONS.FILTERS.INDUSTRY', icon: 'fa-industry' },
];

/** Nos participations : filtres animés + grille de filiales. */
export function Participations() {
  const { t } = useTranslation();
  const { companies } = useSiteData();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const list = filter === 'all' ? companies : companies.filter((c) => c.sector === filter);

  return (
    <section id="entreprises" className="section relative bg-slate-50">
      <div className="bg-dots-dark absolute inset-x-0 top-0 h-64 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container-x relative">
        <SectionHeading eyebrow={t('NAVBAR.ENTREPRISES')} title={t('PARTICIPATIONS.TITLE')} description={t('PARTICIPATIONS.DESCRIPTION')} />

        <Reveal className="mb-12 flex justify-center">
          <LayoutGroup>
            <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full border border-slate-200 bg-white p-1.5 shadow-card">
              {FILTERS.map((f) => {
                const count = f.value === 'all' ? companies.length : companies.filter((c) => c.sector === f.value).length;
                const active = filter === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFilter(f.value)}
                    className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-6 ${
                      active ? 'text-white' : 'text-slate-500 hover:text-brand-blue'
                    }`}
                  >
                    {active && (
                      <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-brand-blue shadow-soft" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                    )}
                    <i className={`fa-solid ${f.icon} relative text-xs`} />
                    <span className="relative">{t(f.key)}</span>
                    <span className={`relative rounded-full px-2 py-0.5 text-[10px] ${active ? 'bg-white/20' : 'bg-slate-100'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </Reveal>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((company, i) => (
              <motion.div
                key={company.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.04, ease: EASE }}
              >
                <CompanyCard company={company} onOpen={setSelected} showSector />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <CompanyModal company={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

/** Projets accompagnés : cartes + fenêtre de détail. */
export function Projets() {
  const { t } = useTranslation();
  const { projets } = useSiteData();
  const [selected, setSelected] = useState(null);

  return (
    <section id="projets" className="section bg-white">
      <div className="container-x">
        <SectionHeading eyebrow={t('NAVBAR.PROJETS')} title={t('PROJETS.TITLE')} description={t('PROJETS.DESCRIPTION')} />
        <Stagger className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4" stagger={0.12}>
          {projets.map((p, i) => (
            <StaggerItem key={p.id ?? p.title}>
              <motion.article
                whileHover={{ y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
                onClick={() => setSelected(p)}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-brand-blue shadow-card transition-shadow duration-500 hover:shadow-soft"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={asset(p.image)} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/10 to-transparent" />
                  {p.tag && <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-blue">{p.tag}</span>}
                  <span className="absolute right-4 top-4 font-display text-4xl font-bold text-white/30">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex flex-1 flex-col p-6 pt-2 text-white">
                  <h3 className="text-lg font-bold uppercase leading-snug !text-white">{p.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/80">{p.description}</p>
                  <span className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 group-hover:gap-4 group-hover:shadow-glow">
                    {t('PROJETS_EXTRA.DETAILS')}
                    <i className="fa-solid fa-arrow-right" />
                  </span>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} size="max-w-3xl" label={selected?.title}>
        {selected && (
          <div>
            <div className="relative">
              <img src={asset(selected.image)} alt={selected.title} className="h-64 w-full object-cover sm:h-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
              <CloseButton light onClick={() => setSelected(null)} className="absolute right-5 top-5" />
              <div className="absolute bottom-6 left-6 right-6">
                {selected.tag && <span className="rounded-full bg-brand-red px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">{selected.tag}</span>}
                <h3 className="mt-3 text-2xl font-bold !text-white sm:text-3xl">{selected.title}</h3>
              </div>
            </div>
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
              {selected.figure && (
                <div className="shrink-0 rounded-2xl bg-brand-blue-light px-6 py-5 text-center">
                  <p className="font-display text-2xl font-bold text-brand-blue">{selected.figure}</p>
                </div>
              )}
              <p className="text-base leading-relaxed text-slate-600 sm:text-lg">{selected.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

/** Pourquoi choisir OSEOR ? */
export function Pourquoi() {
  const { t } = useTranslation();
  return (
    <section className="section overflow-hidden bg-slate-50">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal x={-40} y={0} className="relative order-2 lg:order-1">
          <div className="absolute -inset-4 -rotate-3 rounded-[2.5rem] bg-brand-blue/10" />
          <div className="absolute -bottom-6 -right-6 hidden h-40 w-40 rounded-full border-[14px] border-brand-red/15 sm:block" />
          <img src={asset('assets/images/about/about.jpg')} alt={t('POURQUOI.TITLE')} loading="lazy" className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-2xl" />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
            className="absolute -bottom-8 left-6 flex items-center gap-4 rounded-2xl bg-white p-4 pr-6 shadow-xl"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red text-white">
              <i className="fa-solid fa-award" />
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-brand-ink">2015</p>
              <p className="text-xs text-slate-500">OSEOR SA · Lomé</p>
            </div>
          </motion.div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading align="left" eyebrow="OSEOR" title={t('POURQUOI.TITLE')} className="!mb-10" />
          <Stagger className="space-y-5" stagger={0.15}>
            {POURQUOI.map((item, i) => (
              <StaggerItem key={item.titleKey}>
                <div className="group flex gap-5 rounded-3xl border border-transparent bg-white p-6 shadow-card transition-all duration-500 hover:border-brand-blue/20 hover:shadow-soft">
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue font-display text-xl font-bold text-white transition-all duration-500 group-hover:bg-brand-red group-hover:rotate-6">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="flex items-center gap-2 text-lg font-bold">
                      <i className={`fa-solid ${item.icon} text-sm text-brand-red`} />
                      {t(item.titleKey)}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 md:text-[15px]">{t(item.descKey)}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
