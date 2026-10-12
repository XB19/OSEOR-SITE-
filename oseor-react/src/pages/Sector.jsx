import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHero from '../components/PageHero';
import CTABanner from '../components/CTABanner';
import { CompanyCard, CompanyModal } from '../components/Company';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import { SECTORS, sectorBySlug } from '../data/companies';
import { useSiteData } from '../lib/siteData';
import { asset } from '../lib/asset';

/** Pages Secteur Énergie / Industrie / Services (une seule page pilotée par les données). */
export default function Sector() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const { companies: allCompanies } = useSiteData();
  const sector = sectorBySlug(slug);
  if (!sector) return <Navigate to="/" replace />;

  const companies = allCompanies.filter((c) => c.sector === slug);
  const k = (key) => t(`SECTEURS.${sector.pageKey}.${key}`);
  const others = SECTORS.filter((s) => s.slug !== slug);

  return (
    <>
      <PageHero
        title={k('TITLE')}
        subtitle={k('DESC')}
        image={sector.hero}
        crumbs={[{ label: t('NAVBAR.SECTEURS'), to: '/#secteurs' }, { label: t(sector.labelKey) }]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/contact" className="btn-red !px-8 !py-4">
            {t('CTA.BUTTON')} <i className="fa-solid fa-arrow-right text-xs" />
          </Link>
          <span className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur">
            <i className={`fa-solid ${sector.icon}`} />
            {companies.length} {companies.length > 1 ? t('SECTOR_PAGE.COMPANIES') : t('SECTOR_PAGE.COMPANY')}
          </span>
        </div>
      </PageHero>

      <section className="section bg-slate-50">
        <div className="container-x">
          <Reveal className="mb-12 flex flex-col gap-6 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">{k('PORTFOLIO')}</span>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">{k('COMPANIES')}</h2>
            </div>
            <div className="mb-3 hidden h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent md:block" />
          </Reveal>

          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {companies.map((c) => (
              <StaggerItem key={c.id}>
                <CompanyCard company={c} onOpen={setSelected} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="pt-20">
        <div className="container-x">
          <Reveal>
            <h3 className="mb-8 text-2xl font-bold">{t('SECTOR_PAGE.OTHER_SECTORS')}</h3>
          </Reveal>
          <Stagger className="grid gap-6 md:grid-cols-2" stagger={0.12}>
            {others.map((s) => (
              <StaggerItem key={s.slug}>
                <Link to={`/secteurs/${s.slug}`} className="group relative flex h-48 items-end overflow-hidden rounded-3xl p-7">
                  <img src={asset(s.image)} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-blue/60 to-transparent" />
                  <div className="relative flex w-full items-center justify-between">
                    <div>
                      <i className={`fa-solid ${s.icon} text-white/70`} />
                      <p className="mt-2 font-display text-2xl font-bold text-white">{t(s.labelKey)}</p>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition group-hover:bg-brand-red">
                      <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CTABanner />
      <CompanyModal company={selected} onClose={() => setSelected(null)} />
    </>
  );
}
