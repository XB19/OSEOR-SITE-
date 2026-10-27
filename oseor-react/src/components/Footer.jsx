import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { CONTACT } from '../lib/contact';
import { SECTORS } from '../data/companies';
import { Reveal } from './Motion';

// Renseigner les URL des réseaux sociaux : sans URL, l'icône s'affiche sans être cliquable
// (le site d'origine pointait vers « # », ce qui faisait remonter la page).
const SOCIALS = [
  { icon: 'fa-linkedin-in', label: 'LinkedIn', url: null },
  { icon: 'fa-facebook-f', label: 'Facebook', url: null },
  { icon: 'fa-x-twitter', label: 'X / Twitter', url: null },
  { icon: 'fa-instagram', label: 'Instagram', url: null },
];

function SocialIcon({ icon, label, url }) {
  const cls = 'flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition';
  const content = <i className={`fa-brands ${icon} text-sm`} />;
  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`${cls} hover:-translate-y-1 hover:border-brand-red hover:bg-brand-red hover:text-white`}
    >
      {content}
    </a>
  ) : (
    <span aria-label={label} title={label} className={cls}>
      {content}
    </span>
  );
}

function Column({ title, children, delay, className = '' }) {
  return (
    <Reveal delay={delay} className={className}>
      <h4 className="relative mb-6 pb-3 text-xs font-bold uppercase tracking-[0.2em] !text-white">
        {title}
        <span className="absolute bottom-0 left-0 h-0.5 w-8 rounded-full bg-brand-red" />
      </h4>
      {children}
    </Reveal>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  const link = 'group inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white';
  const arrow = <i className="fa-solid fa-chevron-right text-[8px] text-brand-red transition-transform group-hover:translate-x-1" />;

  return (
    <footer className="relative overflow-hidden bg-brand-navy text-white">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-blue/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-red/20 blur-3xl" />
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" />

      <div className="container-x relative grid gap-12 pb-12 pt-20 md:grid-cols-2 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <Link to="/" className="inline-block rounded-2xl bg-white px-4 py-2 shadow-lg">
            <Logo className="h-14" />
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">{t('FOOTER.DESCRIPTION')}</p>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map((s) => (
              <SocialIcon key={s.icon} {...s} />
            ))}
          </div>
        </Reveal>

        <Column title={t('FOOTER.QUICK_LINKS')} delay={0.05} className="lg:col-span-2">
          <ul className="space-y-3">
            <li><Link to="/" className={link}>{arrow}{t('NAVBAR.HOME')}</Link></li>
            <li><Link to="/a-propos" className={link}>{arrow}{t('NAVBAR.ABOUT')}</Link></li>
            <li><Link to="/#entreprises" className={link}>{arrow}{t('NAVBAR.ENTREPRISES')}</Link></li>
            <li><Link to="/#projets" className={link}>{arrow}{t('NAVBAR.PROJETS')}</Link></li>
            <li><Link to="/carrieres/offres" className={link}>{arrow}{t('NAVBAR.CAREERS')}</Link></li>
            <li><Link to="/bon-plan" className={link}>{arrow}{t('NAVBAR.BON_PLAN')}</Link></li>
          </ul>
        </Column>

        <Column title={t('NAVBAR.SECTEURS')} delay={0.1} className="lg:col-span-2">
          <ul className="space-y-3">
            {SECTORS.map((s) => (
              <li key={s.slug}>
                <Link to={`/secteurs/${s.slug}`} className={link}>{arrow}{t(s.labelKey)}</Link>
              </li>
            ))}
            <li><Link to="/appels-offres" className={link}>{arrow}{t('NAVBAR.TENDERS')}</Link></li>
          </ul>
        </Column>

        <Column title={t('FOOTER.CONTACT')} delay={0.15} className="lg:col-span-4">
          <ul className="space-y-4 text-sm text-white/65">
            <li className="flex items-start gap-3">
              <i className="fa-solid fa-location-dot mt-1 w-4 text-brand-red" />
              <span>{t('TOPBAR.ADDRESS')}</span>
            </li>
            {CONTACT.phones.map((p, i) => (
              <li key={p}>
                <a href={`tel:${CONTACT.phoneLinks[i]}`} className="flex items-center gap-3 transition hover:text-white">
                  <i className="fa-solid fa-phone w-4 text-brand-red" /> {p}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 transition hover:text-white">
                <i className="fa-solid fa-envelope w-4 text-brand-red" /> {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.hrEmail}`} className="flex items-center gap-3 transition hover:text-white">
                <i className="fa-solid fa-user-tie w-4 text-brand-red" /> {CONTACT.hrEmail}
              </a>
            </li>
          </ul>
        </Column>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/50 md:flex-row">
          <p>© 2026 OSEOR. {t('FOOTER.RIGHTS')}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <span>{t('FOOTER.PRIVACY')}</span>
            <span>{t('FOOTER.TERMS')}</span>
            <span>{t('FOOTER.MENTIONS')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
