import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Counter from '../components/Counter';
import { EASE, Stagger, StaggerItem } from '../components/Motion';
import { api } from '../lib/api';
import { asset } from '../lib/asset';
import { useAuth } from './auth';
import { useAdminCounts } from './counts';
import { Badge, formatDate } from './ui';

const SECTEURS = [
  { name: 'Énergie', icon: 'fa-bolt' },
  { name: 'Industrie', icon: 'fa-industry' },
  { name: 'Services', icon: 'fa-handshake' },
];

function useDashboardData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const a = api.admin;
    Promise.allSettled([a.entreprises.list(), a.projets.list(), a.offres.list(), a.appelsOffres.list(), a.actualites.list(), a.candidatures.list()]).then((r) => {
      const v = (i) => (r[i].status === 'fulfilled' && Array.isArray(r[i].value) ? r[i].value : []);
      setData({ entreprises: v(0), projets: v(1), offres: v(2), appels: v(3), actualites: v(4), candidatures: v(5) });
    });
  }, []);
  return data;
}

function Kpi({ to, icon, label, value, hint, tone = 'blue' }) {
  return (
    <Link to={to} className="group card relative block overflow-hidden p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full transition-transform duration-700 group-hover:scale-[2.2] ${tone === 'red' ? 'bg-brand-red-light' : 'bg-brand-blue-light'}`} />
      <div className="relative flex items-start justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg text-white ${tone === 'red' ? 'bg-brand-red' : 'bg-brand-blue'}`}>
          <i className={`fa-solid ${icon}`} />
        </span>
        <i className="fa-solid fa-arrow-right text-sm text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-blue" />
      </div>
      <p className="relative mt-5 font-display text-4xl font-bold text-brand-ink">{value === null ? <span className="text-slate-300">–</span> : <Counter to={value} duration={1.4} />}</p>
      <p className="relative mt-1 text-sm font-semibold text-slate-600">{label}</p>
      {hint && <p className="relative mt-0.5 text-xs text-slate-400">{hint}</p>}
    </Link>
  );
}

/** Barres horizontales à une seule série : nombre de filiales par secteur. */
function SectorChart({ entreprises }) {
  const [hover, setHover] = useState(null);
  const rows = SECTEURS.map((s) => ({ ...s, value: entreprises.filter((e) => e.secteur === s.name).length }));
  const total = entreprises.length || 1;
  const max = Math.max(1, ...rows.map((r) => r.value));

  return (
    <div className="space-y-5" role="img" aria-label={`Filiales par secteur : ${rows.map((r) => `${r.name} ${r.value}`).join(', ')}`}>
      {rows.map((r, i) => (
        <div key={r.name} className="relative" onMouseEnter={() => setHover(r.name)} onMouseLeave={() => setHover(null)}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-semibold text-slate-700">
              <i className={`fa-solid ${r.icon} w-4 text-center text-slate-400`} /> {r.name}
            </span>
            <span className="font-display font-bold text-brand-ink">{r.value}</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100">
            <motion.div
              className={`h-3 rounded-full transition-colors ${hover && hover !== r.name ? 'bg-brand-blue/40' : 'bg-brand-blue'}`}
              initial={{ width: 0 }}
              animate={{ width: `${(r.value / max) * 100}%` }}
              transition={{ duration: 1, delay: 0.2 + i * 0.12, ease: EASE }}
            />
          </div>
          {hover === r.name && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none absolute -top-9 right-0 z-10 rounded-lg bg-brand-ink px-3 py-1.5 text-xs text-white shadow-lg"
            >
              {r.value} filiale{r.value > 1 ? 's' : ''} · {Math.round((r.value / total) * 100)} %
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { messages, unread, online } = useAdminCounts();
  const data = useDashboardData();
  const hour = new Date().getHours();
  const greeting = hour < 18 ? 'Bonjour' : 'Bonsoir';
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const n = (list) => (data ? list.length : null);
  const published = (list) => list.filter((i) => i.published && !i.archived);
  const recentMessages = [...messages].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);
  const latestPublications = data
    ? [
        ...data.offres.map((o) => ({ ...o, kind: 'Offre d’emploi', to: '/admin/offres', sortDate: o.createdAt })),
        ...data.appels.map((o) => ({ ...o, kind: 'Appel d’offres', to: '/admin/appels-offres', sortDate: o.createdAt })),
        ...data.actualites.map((o) => ({ ...o, kind: 'Actualité', to: '/admin/actualites', sortDate: o.date })),
      ]
        .sort((a, b) => new Date(b.sortDate || 0) - new Date(a.sortDate || 0))
        .slice(0, 5)
    : [];

  return (
    <div className="space-y-8">
      {/* Bannière d'accueil */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue to-brand-navy p-8 text-white shadow-soft md:p-10"
      >
        <img src={asset('assets/images/hero-business.jpg')} alt="" className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover object-[62%_15%] opacity-30 md:block [mask-image:linear-gradient(to_right,transparent,black_40%)]" />
        <div className="bg-dots absolute inset-0 opacity-30" />
        <div className="relative max-w-xl">
          <p className="text-sm capitalize text-white/70">{today}</p>
          <h1 className="mt-2 text-3xl font-bold !text-white md:text-4xl">
            {greeting} 👋
          </h1>
          <p className="mt-3 text-white/80">
            Bienvenue dans l’espace d’administration OSEOR{user?.email ? `, ${user.email}` : ''}. Toutes vos modifications sont visibles immédiatement sur le site.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/admin/filiales?new=1" className="btn bg-white !py-3 text-brand-blue hover:-translate-y-0.5">
              <i className="fa-solid fa-plus" /> Filiale
            </Link>
            <Link to="/admin/offres?new=1" className="btn-ghost !py-3">
              <i className="fa-solid fa-plus" /> Offre d’emploi
            </Link>
            <Link to="/admin/actualites?new=1" className="btn-ghost !py-3">
              <i className="fa-solid fa-plus" /> Actualité
            </Link>
          </div>
        </div>
      </motion.section>

      {online === false && (
        <div className="flex items-center gap-4 rounded-2xl border border-brand-red/20 bg-brand-red-light p-5 text-brand-red">
          <i className="fa-solid fa-plug-circle-xmark text-xl" />
          <p className="text-sm font-medium">Le serveur ne répond pas : les données ne peuvent pas être chargées ni enregistrées. Lancez le backend puis rechargez la page.</p>
        </div>
      )}

      {/* Indicateurs */}
      <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" stagger={0.07}>
        <StaggerItem><Kpi to="/admin/filiales" icon="fa-building" label="Filiales" value={n(data?.entreprises || [])} hint="Participations affichées sur le site" /></StaggerItem>
        <StaggerItem><Kpi to="/admin/projets" icon="fa-diagram-project" label="Projets accompagnés" value={n(data?.projets || [])} /></StaggerItem>
        <StaggerItem><Kpi to="/admin/messages" icon="fa-envelope" label="Messages non lus" value={online === null ? null : unread} hint={`${messages.length} message(s) au total`} tone="red" /></StaggerItem>
        <StaggerItem><Kpi to="/admin/offres" icon="fa-briefcase" label="Offres d’emploi publiées" value={data ? published(data.offres).length : null} hint={data ? `${data.offres.length} au total` : ''} /></StaggerItem>
        <StaggerItem><Kpi to="/admin/appels-offres" icon="fa-file-contract" label="Appels d’offres publiés" value={data ? published(data.appels).length : null} hint={data ? `${data.appels.length} au total` : ''} /></StaggerItem>
        <StaggerItem><Kpi to="/admin/candidatures" icon="fa-user-tie" label="Candidatures à traiter" value={data ? data.candidatures.filter((c) => !c.archived).length : null} tone="red" /></StaggerItem>
      </Stagger>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Derniers messages */}
        <section className="card p-6 lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold">Derniers messages</h2>
            <Link to="/admin/messages" className="text-sm font-semibold text-brand-blue hover:underline">
              Tout voir
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">Aucun message pour le moment.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentMessages.map((m) => (
                <li key={m.id}>
                  <Link to="/admin/messages" className="flex items-center gap-4 py-3.5 transition hover:opacity-80">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue-light font-bold uppercase text-brand-blue">{(m.name || m.email || '?')[0]}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-800">{m.subject}</span>
                      <span className="block truncate text-xs text-slate-500">
                        {[m.firstName, m.name].filter(Boolean).join(' ')} · {m.email}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-slate-400">{formatDate(m.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Répartition */}
        <section className="card p-6 lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Filiales par secteur</h2>
            <p className="text-sm text-slate-500">{data ? `${data.entreprises.length} filiales au total` : 'Chargement…'}</p>
          </div>
          {data && <SectorChart entreprises={data.entreprises} />}
        </section>
      </div>

      {/* Publications récentes */}
      <section className="card p-6">
        <h2 className="mb-5 text-lg font-bold">Publications récentes</h2>
        {latestPublications.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">Aucune offre, aucun appel d’offres ni aucune actualité publiés pour l’instant.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {latestPublications.map((p) => (
              <li key={`${p.kind}-${p.id}`}>
                <Link to={p.to} className="flex flex-col gap-2 py-3.5 transition hover:opacity-80 sm:flex-row sm:items-center">
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{p.title}</span>
                  <span className="flex items-center gap-2">
                    <Badge tone="gray">{p.kind}</Badge>
                    {p.archived ? <Badge tone="gray">Archivé</Badge> : p.published ? <Badge tone="green">Publié</Badge> : <Badge tone="amber">Brouillon</Badge>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
