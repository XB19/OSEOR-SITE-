import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Counter from '../components/Counter';
import SectionHeading from '../components/SectionHeading';
import { Reveal, Stagger, StaggerItem, EASE } from '../components/Motion';
import { SECTORS } from '../data/companies';
import { useSiteData } from '../lib/siteData';
import { asset } from '../lib/asset';

/** Bandeau rouge de présentation (sous le hero). */
export function Bandeau() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-brand-red">
      <div className="bg-dots absolute inset-0 opacity-30" />
      <Reveal className="container-x relative flex flex-col items-center gap-4 py-7 text-center md:flex-row md:text-left" y={12}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
          <i className="fa-solid fa-seedling" />
        </span>
        <p className="text-sm font-medium leading-relaxed text-white md:text-base">{t('BANDEAU.TEXT')}</p>
      </Reveal>
    </section>
  );
}

/** Chiffres clés avec compteurs animés. */
export function Stats() {
  const { t } = useTranslation();
  const { stats } = useSiteData();
  return (
    <section id="stats" className="relative bg-white py-16 md:py-20">
      <Stagger className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
        {stats.map((stat) => {
          // « +100 entreprises accompagnées » → libellé sans le nombre (affiché par le compteur)
          const label = (stat.key ? t(stat.key) : stat.label).replace(/^\+?\s*\d+\s*/, '');
          return (
            <StaggerItem key={stat.id ?? stat.key}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative h-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 shadow-card transition-shadow duration-500 hover:shadow-soft"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-blue-light transition-transform duration-700 group-hover:scale-[2.5]" />
                <div className="relative">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-xl text-white shadow-soft transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <i className={stat.icon} />
                  </span>
                  <p className="mt-6 font-display text-5xl font-bold tracking-tight text-brand-ink">
                    <Counter to={stat.value} prefix="+" />
                  </p>
                  <span className="mt-3 block h-1 w-10 rounded-full bg-brand-red transition-all duration-500 group-hover:w-20" />
                  <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-brand-blue">{label}</p>
                </div>
              </motion.div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

/** Nos expertises : 4 cartes avec image, titre et description. */
export function Expertises() {
  const { t } = useTranslation();
  const { services } = useSiteData();
  return (
    <section id="expertises" className="section relative overflow-hidden bg-brand-blue">
      <div className="bg-dots absolute inset-0 opacity-40" />
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-brand-red/30 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading light eyebrow="OSEOR" title={t('EXPERTISES.TITLE')} description={t('EXPERTISES.SUBTITLE')} />
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
          {services.map((item, i) => (
            <StaggerItem key={item.id ?? item.titleKey}>
              <motion.article
                whileHover={{ y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-xl shadow-brand-navy/20"
              >
                <div className="relative h-48">
                  {/* Image rognée à part pour que le badge rouge puisse déborder sans être coupé */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img src={asset(item.image)} alt={item.titleKey ? t(item.titleKey) : item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent" />
                    <span className="absolute left-5 top-5 font-display text-sm font-bold text-white/90">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <span className="absolute -bottom-7 right-6 z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red text-xl text-white shadow-glow ring-4 ring-white transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <i className={item.icon} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 pt-8">
                  <h3 className="text-lg font-bold leading-snug transition-colors group-hover:text-brand-blue">{item.titleKey ? t(item.titleKey) : item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.descKey ? t(item.descKey) : item.description}</p>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/** Secteurs d'intervention : 3 grandes cartes cliquables. */
export function Secteurs() {
  const { t } = useTranslation();
  const { companies } = useSiteData();
  return (
    <section id="secteurs" className="section bg-white">
      <div className="container-x">
        <SectionHeading eyebrow={t('NAVBAR.SECTEURS')} title={t('SECTEURS.TITLE')} description={t('SECTEURS.DESCRIPTION')} />
        <Stagger className="grid gap-6 md:grid-cols-3" stagger={0.15}>
          {SECTORS.map((s) => {
            const count = companies.filter((c) => c.sector === s.slug).length;
            return (
              <StaggerItem key={s.slug}>
                <Link to={`/secteurs/${s.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] shadow-card">
                  <img src={asset(s.image)} alt={t(s.labelKey)} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-blue/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-xl text-white backdrop-blur transition-colors duration-500 group-hover:bg-brand-red">
                      <i className={`fa-solid ${s.icon}`} />
                    </span>
                    <h3 className="mt-5 text-3xl font-bold !text-white">{t(s.labelKey)}</h3>
                    <p className="mt-1 text-sm text-white/75">{t('SECTEURS_EXTRA.COMPANIES_COUNT', { count })}</p>
                    <span className="mt-6 inline-flex items-center gap-3 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-500 group-hover:gap-5">
                      {t('SECTEURS.ENERGY_PAGE.SEE_MORE')}
                      <i className="fa-solid fa-arrow-right text-xs" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
