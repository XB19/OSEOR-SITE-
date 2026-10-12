import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import Logo from './Logo';
import { LANGUAGES } from '../i18n';
import { CONTACT } from '../lib/contact';
import { SECTORS } from '../data/companies';
import { EASE } from './Motion';

function Topbar({ hidden }) {
  const { t } = useTranslation();
  return (
    // Repli en CSS pur : une animation framer-motion vers height:'auto' appelle
    // window.scrollTo() et interromprait le défilement doux vers les ancres.
    <div
      className={`hidden bg-brand-blue text-xs text-white transition-[grid-template-rows,opacity] duration-300 ease-out md:grid ${
        hidden ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
      }`}
    >
      <div className="overflow-hidden">
      <div className="container-x flex items-center justify-between py-2.5">
        <div className="flex items-center gap-6">
          <a href={`tel:${CONTACT.phoneLinks[0]}`} className="flex items-center gap-2 transition hover:text-white/80">
            <i className="fa-solid fa-phone text-[10px] text-white/70" />
            <span className="font-semibold">{t('TOPBAR.CONTACT')} :</span> 22518969 / +228 93170101
          </a>
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 transition hover:text-white/80">
            <i className="fa-solid fa-envelope text-[10px] text-white/70" />
            <span className="font-semibold">{t('TOPBAR.EMAIL')} :</span> {CONTACT.email}
          </a>
        </div>
        <span className="flex items-center gap-2">
          <i className="fa-solid fa-location-dot text-[10px] text-white/70" />
          <span className="font-semibold">{t('TOPBAR.LOCATION')} :</span> {t('TOPBAR.ADDRESS')}
        </span>
      </div>
      </div>
    </div>
  );
}

/** Menu déroulant desktop (ouverture au survol et au clic). */
function Dropdown({ label, items, align = 'left', button }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hovered = useRef(false);
  const location = useLocation();
  const active = items.some((i) => i.to && location.pathname.startsWith(i.to));

  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        hovered.current = true;
        setOpen(true);
      }}
      onMouseLeave={() => {
        hovered.current = false;
        setOpen(false);
      }}
    >
      <button
        type="button"
        // À la souris le survol ouvre déjà le menu : le clic ne doit pas le refermer
        onClick={() => setOpen((o) => (hovered.current ? true : !o))}
        aria-expanded={open}
        className={
          button ||
          `nav-link flex items-center gap-1.5 ${active ? 'text-brand-blue' : 'text-slate-700 hover:text-brand-blue'}`
        }
      >
        {label}
        <i className={`fa-solid fa-chevron-down text-[9px] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            className={`absolute top-full z-50 pt-3 ${align === 'right' ? 'right-0' : 'left-0'}`}
          >
            <div className="min-w-[230px] overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl shadow-brand-blue/10">
              {items.map((item) =>
                item.onClick ? (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      item.onClick();
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition hover:bg-brand-blue-light hover:text-brand-blue ${
                      item.active ? 'bg-brand-blue-light text-brand-blue' : 'text-slate-600'
                    }`}
                  >
                    {item.icon && <span className="w-5 text-center">{item.icon}</span>}
                    {item.label}
                    {item.active && <i className="fa-solid fa-check ml-auto text-xs" />}
                  </button>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-brand-blue-light hover:text-brand-blue"
                  >
                    {item.icon && <i className={`fa-solid ${item.icon} w-5 text-center text-brand-red`} />}
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileGroup({ label, items, onNavigate }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between py-4 font-semibold text-slate-800">
        {label}
        <i className={`fa-solid fa-chevron-down text-xs transition-transform ${open ? 'rotate-180 text-brand-blue' : 'text-slate-400'}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 pb-4 pl-3">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                tabIndex={open ? 0 : -1}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-brand-blue-light hover:text-brand-blue"
              >
                {item.icon && <i className={`fa-solid ${item.icon} w-4 text-brand-red`} />}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const sectors = SECTORS.map((s) => ({ to: `/secteurs/${s.slug}`, label: t(s.labelKey), icon: s.icon }));
  const careers = [
    { to: '/carrieres/offres', label: t('NAVBAR.JOB_OFFERS'), icon: 'fa-briefcase' },
    { to: '/carrieres/candidature', label: t('NAVBAR.SPONTANEOUS_CANDIDACY'), icon: 'fa-paper-plane' },
  ];
  const bonPlan = [
    { to: '/bon-plan', label: t('NAVBAR.NEWS'), icon: 'fa-newspaper' },
    { to: '/appels-offres', label: t('NAVBAR.TENDERS'), icon: 'fa-file-contract' },
  ];
  const languages = LANGUAGES.map((l) => ({
    label: l.label,
    icon: <span className="text-[10px] font-bold uppercase text-slate-400">{l.code}</span>,
    active: i18n.language === l.code,
    onClick: () => i18n.changeLanguage(l.code),
  }));

  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'nav-link-active text-brand-blue' : 'text-slate-700 hover:text-brand-blue'}`;
  const isHash = (hash) => location.pathname === '/' && location.hash === hash;

  const mainLinks = [
    { to: '/', label: t('NAVBAR.HOME'), end: true },
    { to: '/a-propos', label: t('NAVBAR.ABOUT') },
    { to: '/#entreprises', label: t('NAVBAR.ENTREPRISES'), hash: '#entreprises' },
    { to: '/#projets', label: t('NAVBAR.PROJETS'), hash: '#projets' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-[1000]">
      <Topbar hidden={scrolled} />
      <nav
        className={`border-b transition-all duration-500 ${
          scrolled ? 'border-slate-100 bg-white/90 shadow-lg shadow-brand-blue/5 backdrop-blur-xl' : 'border-transparent bg-white'
        }`}
      >
        <div className={`container-x flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-[68px]' : 'h-[76px] md:h-[84px]'}`}>
          <Link to="/" aria-label="OSEOR — Accueil" className="shrink-0 transition-transform duration-300 hover:scale-105">
            <Logo className={`transition-all duration-500 ${scrolled ? 'h-12' : 'h-14 md:h-16'}`} />
          </Link>

          {/* Menu desktop */}
          <div className="hidden items-center gap-7 text-[15px] font-medium xl:flex">
            {mainLinks.map((l) =>
              l.hash ? (
                <Link key={l.to} to={l.to} className={`nav-link ${isHash(l.hash) ? 'nav-link-active text-brand-blue' : 'text-slate-700 hover:text-brand-blue'}`}>
                  {l.label}
                </Link>
              ) : (
                <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                  {l.label}
                </NavLink>
              )
            )}
            <Dropdown label={t('NAVBAR.SECTEURS')} items={sectors} />
            <Dropdown label={t('NAVBAR.CAREERS')} items={careers} />
            <NavLink to="/contact" className={linkClass}>
              {t('NAVBAR.CONTACT')}
            </NavLink>
          </div>

          <div className="hidden items-center gap-3 xl:flex">
            <Dropdown
              label={<span className="text-xs font-bold uppercase">{i18n.language}</span>}
              items={languages}
              align="right"
              button="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-700 transition hover:border-brand-blue hover:text-brand-blue"
            />
            <Dropdown label={t('NAVBAR.BON_PLAN')} items={bonPlan} align="right" button="btn-blue !px-5 !py-2.5" />
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 xl:hidden">
            <div className="flex rounded-full border border-slate-200 bg-slate-50 p-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => i18n.changeLanguage(l.code)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase transition ${
                    i18n.language === l.code ? 'bg-brand-blue text-white' : 'text-slate-500'
                  }`}
                >
                  {l.code}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue text-white shadow-soft"
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-lg`} />
            </button>
          </div>
        </div>
        <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-gradient-to-r from-brand-blue to-brand-red" />
      </nav>

      {/* Tiroir mobile */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 top-0 z-[-1] bg-brand-ink/50 backdrop-blur-sm xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ top: scrolled ? 68 : 76 }}
              className="fixed bottom-0 right-0 w-full max-w-sm overflow-y-auto bg-white px-6 pb-10 shadow-2xl xl:hidden"
            >
              <div className="flex flex-col pt-2">
                {mainLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="border-b border-slate-100 py-4 font-semibold text-slate-800 hover:text-brand-blue">
                    {l.label}
                  </Link>
                ))}
                <MobileGroup label={t('NAVBAR.SECTEURS')} items={sectors} />
                <MobileGroup label={t('NAVBAR.CAREERS')} items={careers} />
                <Link to="/contact" className="border-b border-slate-100 py-4 font-semibold text-slate-800 hover:text-brand-blue">
                  {t('NAVBAR.CONTACT')}
                </Link>
                <MobileGroup label={t('NAVBAR.BON_PLAN')} items={bonPlan} />
              </div>
              <div className="mt-8 space-y-3 rounded-2xl bg-brand-blue-light p-5 text-sm">
                <a href={`tel:${CONTACT.phoneLinks[0]}`} className="flex items-center gap-3 text-slate-700">
                  <i className="fa-solid fa-phone w-4 text-brand-red" /> {CONTACT.phones[0]}
                </a>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 text-slate-700">
                  <i className="fa-solid fa-envelope w-4 text-brand-red" /> {CONTACT.email}
                </a>
                <p className="flex items-start gap-3 text-slate-700">
                  <i className="fa-solid fa-location-dot mt-1 w-4 text-brand-red" /> {t('TOPBAR.ADDRESS')}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
