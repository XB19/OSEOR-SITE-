import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import CTABanner from '../components/CTABanner';
import SectionHeading from '../components/SectionHeading';
import Counter from '../components/Counter';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import { SECTORS } from '../data/companies';
import { useSiteData } from '../lib/siteData';
import { asset } from '../lib/asset';

export default function About() {
  const { t } = useTranslation();
  const { companies } = useSiteData();

  // Chiffres tirés du texte « À propos » (fondation 2015, 15 sociétés partenaires, SA en 2020–2021)
  const figures = [
    { value: 2015, label: t('ABOUT_EXTRA.FOUNDED'), icon: 'fa-flag', counter: false },
    { value: 15, label: t('ABOUT_EXTRA.PARTNERS'), icon: 'fa-handshake', counter: true },
    { value: 'SA', label: t('ABOUT_EXTRA.SA'), icon: 'fa-scale-balanced', counter: false, sub: '2020–2021' },
    { value: SECTORS.length, label: t('ABOUT_EXTRA.SECTORS'), icon: 'fa-layer-group', counter: true },
  ];

  return (
    <>
      <PageHero title={t('ABOUT_PAGE.TITLE')} eyebrow={t('ABOUT_PAGE.BADGE')} image="assets/images/about/about.jpg" crumbs={[{ label: t('NAVBAR.ABOUT') }]} />

      {/* Présentation */}
      <section className="section">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal x={-40} y={0} className="relative">
            <div className="absolute -inset-4 -rotate-2 rounded-[2.5rem] bg-brand-blue/10" />
            <img src={asset('assets/images/about/about.png')} alt={t('ABOUT_PAGE.BADGE')} className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl sm:aspect-[4/3] lg:aspect-[4/5]" />
            <div className="absolute -bottom-6 -right-2 rounded-2xl bg-brand-red px-6 py-5 text-white shadow-glow sm:-right-6">
              <p className="font-display text-4xl font-bold">
                <Counter to={new Date().getFullYear() - 2015} prefix="+" />
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{t('COMMON.YEARS')}</p>
            </div>
          </Reveal>

          <div>
            <SectionHeading align="left" eyebrow={t('ABOUT_PAGE.BADGE')} title={t('ABOUT_PAGE.TITLE')} className="!mb-8" />
            <Stagger className="space-y-5 text-base leading-relaxed text-slate-600 md:text-lg" stagger={0.12}>
              {['P1', 'P2', 'P3'].map((k) => (
                <StaggerItem key={k} as="p">
                  {t(`ABOUT_PAGE.${k}`)}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="relative overflow-hidden bg-brand-blue py-16">
        <div className="bg-dots absolute inset-0 opacity-40" />
        <Stagger className="container-x relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {figures.map((f) => (
            <StaggerItem key={f.label} className="flex items-center gap-5 rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-xl text-brand-blue">
                <i className={`fa-solid ${f.icon}`} />
              </span>
              <div>
                <p className="font-display text-3xl font-bold">{f.counter ? <Counter to={f.value} /> : f.value}</p>
                <p className="text-sm text-white/80">
                  {f.label}
                  {f.sub && <span className="text-white/60"> · {f.sub}</span>}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Gouvernance */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <SectionHeading eyebrow={t('ABOUT_EXTRA.GOVERNANCE')} title={t('ABOUT_PAGE.GOV_TITLE')} />
          <Stagger className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2" stagger={0.15}>
            {[
              { key: 'GOV_P1', icon: 'fa-landmark', name: 'DAOU AKLESSO Yérima' },
              { key: 'GOV_P2', icon: 'fa-user-tie', name: 'Pascal PAMASSI' },
            ].map((g) => (
              <StaggerItem key={g.key} className="group card relative overflow-hidden p-8 transition-shadow duration-500 hover:shadow-soft">
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand-blue to-brand-red transition-transform duration-500 group-hover:scale-x-100" />
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue-light text-2xl text-brand-blue transition-colors duration-500 group-hover:bg-brand-blue group-hover:text-white">
                  <i className={`fa-solid ${g.icon}`} />
                </span>
                <h3 className="mt-6 text-xl font-bold">{g.name}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{t(`ABOUT_PAGE.${g.key}`)}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Secteurs */}
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow={t('NAVBAR.SECTEURS')} title={t('SECTEURS.TITLE')} description={t('SECTEURS.DESCRIPTION')} />
          <Stagger className="grid gap-6 md:grid-cols-3" stagger={0.12}>
            {SECTORS.map((s) => (
              <StaggerItem key={s.slug}>
                <Link to={`/secteurs/${s.slug}`} className="group card flex items-center gap-5 p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
                  <img src={asset(s.image)} alt="" className="h-20 w-20 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold group-hover:text-brand-blue">{t(s.labelKey)}</h3>
                    <p className="text-sm text-slate-500">{t('SECTEURS_EXTRA.COMPANIES_COUNT', { count: companies.filter((c) => c.sector === s.slug).length })}</p>
                  </div>
                  <i className="fa-solid fa-arrow-right text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-red" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
