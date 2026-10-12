import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal, { CloseButton } from './Modal';
import { asset } from '../lib/asset';
import { sectorBySlug } from '../data/companies';
import { EASE } from './Motion';

const DEFAULT_LOGO = 'assets/images/default-logo.png';

export function CompanyLogo({ company, className = 'h-24 w-24' }) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 ${className}`}>
      <img
        src={asset(company.logo || DEFAULT_LOGO)}
        alt={company.name}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = asset(DEFAULT_LOGO);
        }}
        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
      />
    </div>
  );
}

function BlockTitle({ block, t, color = 'red' }) {
  const title = block.titleKey ? t(block.titleKey) : block.title;
  if (!title) return null;
  return (
    <h5 className={`mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] ${color === 'red' ? 'text-brand-red' : 'text-brand-blue'}`}>
      {block.icon ? <i className={`fa-solid ${block.icon}`} /> : <span className={`h-[2px] w-8 rounded-full ${color === 'red' ? 'bg-brand-red' : 'bg-brand-blue'}`} />}
      {title}
    </h5>
  );
}

/** Rendu des blocs de détail définis dans data/companies.js */
export function CompanyDetails({ details }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      {details.map((block, i) => {
        const key = `${block.kind}-${i}`;
        const anim = {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: 0.1 + i * 0.07, ease: EASE },
        };
        switch (block.kind) {
          case 'text':
            return (
              <motion.div key={key} {...anim}>
                <BlockTitle block={block} t={t} />
                <div className="space-y-4 text-[15px] leading-relaxed text-slate-600">
                  {block.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </div>
              </motion.div>
            );
          case 'facts':
            return (
              <motion.div key={key} {...anim} className="rounded-2xl border border-brand-blue/10 bg-brand-blue-light/60 p-6">
                <BlockTitle block={block} t={t} color="blue" />
                <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {block.items.map((item) => (
                    <div key={item.value} className="border-l-2 border-brand-blue/30 pl-4">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-brand-blue">{item.labelKey ? t(item.labelKey) : item.label}</dt>
                      <dd className="mt-1 text-sm font-medium text-slate-800">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            );
          case 'list':
            return (
              <motion.div key={key} {...anim}>
                <BlockTitle block={block} t={t} />
                <ul className={`grid gap-3 ${block.columns === 2 ? 'sm:grid-cols-2' : ''}`}>
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <i className="fa-solid fa-circle-check mt-0.5 text-brand-red" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          case 'steps':
            return (
              <motion.div key={key} {...anim} className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <BlockTitle block={block} t={t} color="blue" />
                <ol className="space-y-3">
                  {block.items.map((item, n) => (
                    <li key={item} className="flex items-start gap-4 text-sm text-slate-700">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">{n + 1}</span>
                      <span className="pt-1">{item}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            );
          case 'tags':
            return (
              <motion.div key={key} {...anim}>
                <BlockTitle block={block} t={t} />
                <div className="flex flex-wrap gap-2">
                  {block.items.map((item) => (
                    <span key={item} className="rounded-full border border-brand-blue/15 bg-brand-blue-light px-4 py-1.5 text-sm font-medium text-brand-blue">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          case 'specialties':
            return (
              <motion.div key={key} {...anim}>
                <BlockTitle block={block} t={t} color="blue" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {block.items.map((item) => (
                    <div key={item.label} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-red shadow-sm">
                        <i className={`fa-solid ${item.icon}`} />
                      </span>
                      <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          case 'highlights':
            return (
              <motion.div key={key} {...anim} className={`grid gap-3 ${block.items.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                {block.items.map((item) => (
                  <div key={item.value} className="rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue-dark p-5 text-white">
                    {item.icon && <i className={`fa-solid ${item.icon} mb-3 text-lg text-white/70`} />}
                    <p className="font-display text-xl font-bold">{item.value}</p>
                    <p className="mt-1 text-xs text-white/75">{item.label}</p>
                  </div>
                ))}
              </motion.div>
            );
          case 'quote':
            return (
              <motion.blockquote key={key} {...anim} className="relative rounded-2xl border-l-4 border-brand-red bg-brand-red-light/50 p-6 pr-12 text-[15px] italic leading-relaxed text-slate-700">
                <i className="fa-solid fa-quote-right absolute right-5 top-5 text-2xl text-brand-red/20" />
                {block.text}
              </motion.blockquote>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export function CompanyModal({ company, onClose }) {
  const { t } = useTranslation();
  const sector = company && sectorBySlug(company.sector);
  return (
    <Modal open={!!company} onClose={onClose} size="max-w-4xl" label={company?.name}>
      {company && (
        <>
          <div className="sticky top-0 z-10 flex items-start gap-5 border-b border-slate-100 bg-white/95 p-6 backdrop-blur sm:p-8">
            <CompanyLogo company={company} className="h-20 w-28 sm:h-24 sm:w-36" />
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-red">{company.category}</span>
              <h3 className="mt-1 text-xl font-bold sm:text-2xl">{company.name}</h3>
              {sector && (
                <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-blue-light px-3 py-1 text-xs font-semibold text-brand-blue">
                  <i className={`fa-solid ${sector.icon}`} /> {t(sector.labelKey)}
                </span>
              )}
            </div>
            <CloseButton onClick={onClose} />
          </div>
          {company.image && <img src={asset(company.image)} alt={company.name} className="h-56 w-full object-cover sm:h-72" />}
          <div className="space-y-8 p-6 sm:p-8">
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">{company.description}</p>
            {company.details.length > 0 && <CompanyDetails details={company.details} />}
            {company.site && (
              <a href={company.site} target="_blank" rel="noopener noreferrer" className="btn-blue">
                {t('SECTOR_PAGE.OFFICIAL_SITE')} <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
              </a>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}

/** Carte filiale : logo, catégorie, nom, description et actions. */
export function CompanyCard({ company, onOpen, showSector = false }) {
  const { t } = useTranslation();
  const sector = sectorBySlug(company.sector);
  const hasDetails = company.details.length > 0;

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card transition-shadow duration-500 hover:shadow-soft"
    >
      <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand-blue to-brand-red transition-transform duration-500 group-hover:scale-x-100" />
      {company.image && (
        <div className="relative h-44 overflow-hidden">
          <img src={asset(company.image)} alt={company.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 to-transparent" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center gap-4">
          <CompanyLogo company={company} className={`${company.image ? '-mt-14 h-20 w-32 shadow-lg' : 'h-20 w-32'} relative`} />
          {showSector && sector && (
            <span className="ml-auto inline-flex items-center gap-1.5 self-start rounded-full bg-brand-blue-light px-3 py-1 text-[11px] font-semibold text-brand-blue">
              <i className={`fa-solid ${sector.icon}`} /> {t(sector.labelKey)}
            </span>
          )}
        </div>
        <span className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-red">{company.category}</span>
        <h3 className="mt-1.5 text-lg font-bold leading-snug transition-colors group-hover:text-brand-blue">{company.name}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">{company.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-5">
          {hasDetails && (
            <button type="button" onClick={() => onOpen(company)} className="group/btn inline-flex items-center gap-2 text-sm font-bold text-brand-blue">
              {t('SECTEURS.ENERGY_PAGE.SEE_MORE')}
              <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover/btn:translate-x-1" />
            </button>
          )}
          {company.site && (
            <a href={company.site} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-brand-red">
              {hasDetails ? t('PARTICIPATIONS_EXTRA.VISIT') : t('SECTEURS.ENERGY_PAGE.SEE_MORE')}
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          )}
          {!hasDetails && !company.site && showSector && sector && (
            <Link to={`/secteurs/${sector.slug}`} className="group/btn inline-flex items-center gap-2 text-sm font-bold text-brand-blue">
              {t('SECTEURS_EXTRA.DISCOVER')}
              <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover/btn:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
