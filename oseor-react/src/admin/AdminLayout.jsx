import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../components/Logo';
import { EASE } from '../components/Motion';
import { useAuth } from './auth';
import { useAdminCounts } from './counts';

export const NAV = [
  { group: 'Pilotage', items: [{ to: '/admin', label: 'Tableau de bord', icon: 'fa-gauge-high', end: true }] },
  {
    group: 'Contenu du site',
    items: [
      { to: '/admin/filiales', label: 'Filiales', icon: 'fa-building' },
      { to: '/admin/projets', label: 'Projets', icon: 'fa-diagram-project' },
      { to: '/admin/expertises', label: 'Expertises', icon: 'fa-lightbulb' },
      { to: '/admin/statistiques', label: 'Statistiques', icon: 'fa-chart-simple' },
      { to: '/admin/secteurs', label: 'Secteurs', icon: 'fa-layer-group' },
    ],
  },
  {
    group: 'Publications',
    items: [
      { to: '/admin/actualites', label: 'Actualités', icon: 'fa-newspaper' },
      { to: '/admin/offres', label: 'Offres d’emploi', icon: 'fa-briefcase' },
      { to: '/admin/appels-offres', label: 'Appels d’offres', icon: 'fa-file-contract' },
    ],
  },
  {
    group: 'Relations',
    items: [
      { to: '/admin/messages', label: 'Messages', icon: 'fa-envelope', badge: 'unread' },
      { to: '/admin/candidatures', label: 'Candidatures', icon: 'fa-user-tie' },
    ],
  },
  {
    group: 'Système',
    items: [
      { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: 'fa-users-gear' },
      { to: '/admin/parametres', label: 'Paramètres', icon: 'fa-gear' },
    ],
  },
];

function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const counts = useAdminCounts();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-brand-navy text-white">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-blue/30 blur-3xl" />

      <div className="relative px-6 pb-6 pt-7">
        <Link to="/admin" onClick={onNavigate} className="inline-flex items-center gap-3">
          <span className="rounded-xl bg-white px-2.5 py-1.5 shadow-lg">
            <Logo className="h-10" />
          </span>
          <span className="text-[11px] font-semibold uppercase leading-tight tracking-[0.2em] text-white/60">
            Espace
            <br />
            Admin
          </span>
        </Link>
      </div>

      <nav className="no-scrollbar relative flex-1 space-y-6 overflow-y-auto px-4 pb-6">
        {NAV.map((g) => (
          <div key={g.group}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{g.group}</p>
            <div className="space-y-1">
              {g.items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate} className="relative block">
                  {({ isActive }) => (
                    <span
                      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive ? 'text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <motion.span layoutId="admin-nav-active" className="absolute inset-0 rounded-xl bg-white/10" transition={{ type: 'spring', stiffness: 400, damping: 34 }}>
                          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-red" />
                        </motion.span>
                      )}
                      <i className={`fa-solid ${item.icon} relative w-5 text-center ${isActive ? 'text-brand-red' : ''}`} />
                      <span className="relative flex-1">{item.label}</span>
                      {item.badge && counts[item.badge] > 0 && (
                        <span className="relative rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-bold text-white">{counts[item.badge]}</span>
                      )}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-red to-brand-red-dark font-bold uppercase">
            {user?.email?.[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.email}</p>
            <p className="text-[11px] text-white/50">Administrateur</p>
          </div>
          <button type="button" onClick={() => logout()} title="Se déconnecter" aria-label="Se déconnecter" className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition hover:bg-brand-red hover:text-white">
            <i className="fa-solid fa-right-from-bracket" />
          </button>
        </div>
      </div>
    </div>
  );
}

const currentLabel = (pathname) => {
  for (const g of NAV) for (const i of g.items) if (i.end ? pathname === i.to || pathname === `${i.to}/` : pathname.startsWith(i.to)) return { ...i, group: g.group };
  return { label: 'Tableau de bord', group: 'Pilotage' };
};

export default function AdminLayout() {
  const location = useLocation();
  const [drawer, setDrawer] = useState(false);
  const counts = useAdminCounts();
  const page = currentLabel(location.pathname);
  // Élément figé pour que la page sortante reste affichée pendant l'animation
  const outlet = useOutlet();

  useEffect(() => setDrawer(false), [location.pathname]);
  useEffect(() => {
    document.title = `${page.label} · Admin OSEOR`;
  }, [page.label]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barre latérale fixe (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <Sidebar />
      </aside>

      {/* Tiroir (mobile / tablette) */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-brand-ink/60 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <Sidebar onNavigate={() => setDrawer(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/85 backdrop-blur-xl">
          <div className="flex h-[72px] items-center gap-4 px-4 sm:px-8">
            <button type="button" onClick={() => setDrawer(true)} aria-label="Menu" className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue text-white lg:hidden">
              <i className="fa-solid fa-bars-staggered" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{page.group}</p>
              <p className="truncate font-display text-lg font-bold text-brand-ink">{page.label}</p>
            </div>
            <span
              className={`hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex ${
                counts.online === false ? 'bg-brand-red-light text-brand-red' : 'bg-emerald-50 text-emerald-700'
              }`}
              title="État du serveur backend"
            >
              <span className="relative flex h-2 w-2">
                {counts.online !== false && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${counts.online === false ? 'bg-brand-red' : 'bg-emerald-500'}`} />
              </span>
              {counts.online === false ? 'Serveur hors ligne' : 'Serveur en ligne'}
            </span>
            <Link to="/admin/messages" className="relative flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition hover:bg-brand-blue-light hover:text-brand-blue" aria-label="Messages">
              <i className="fa-solid fa-bell" />
              {counts.unread > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand-red ring-2 ring-white" />}
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline !px-4 !py-2.5">
              <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
              <span className="hidden sm:inline">Voir le site</span>
            </a>
          </div>
        </header>

        <main className="px-4 py-8 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mx-auto max-w-7xl"
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
