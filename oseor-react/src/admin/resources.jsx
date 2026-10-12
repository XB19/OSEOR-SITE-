import { api } from '../lib/api';
import { faIcon } from '../lib/siteData';
import { previewSrc } from './FormFields';
import { Badge, formatDate } from './ui';

/* ───────── Aides ───────── */

const PARTNER_LOGOS = ['zih', 'zener', 'pls', 'pgs', 'diwa-indus', 'diwa-international', 'bluen', 'jcem', 'daba', 'kapiconsult', 'trfs', 'bonici', 'attogo', 'hospitality'].map(
  (n) => `assets/images/partners/${n}.png`
);
const SITE_IMAGES = [
  'assets/images/zener-sa.png',
  'assets/images/radisson-abidjan.png',
  'assets/images/sheraton-bamako.png',
  'assets/images/aeroport-gnassingbe-eyadema.png',
  'assets/images/energie.jpg',
  'assets/images/industrie.jpg',
  'assets/images/services.jpg',
  'assets/images/sectors/energie/energie-1.png',
  'assets/images/sectors/industrie/industrie-1.png',
  'assets/images/sectors/industrie/industrie-2.png',
  'assets/images/sectors/industrie/industrie-3.png',
  'assets/images/sectors/services/services-1.png',
  'assets/images/hero-business.jpg',
  'assets/images/about/about.jpg',
  'assets/images/investissement.jpg',
  'assets/images/conseil.jpg',
];
const ICONS = [
  'fas fa-chart-line', 'fas fa-calculator', 'fas fa-lightbulb', 'fas fa-tools', 'fas fa-building', 'fas fa-project-diagram',
  'fas fa-th-large', 'fas fa-tasks', 'fas fa-handshake', 'fas fa-bolt', 'fas fa-industry', 'fas fa-coins',
  'fas fa-globe-africa', 'fas fa-users', 'fas fa-briefcase', 'fas fa-seedling', 'fas fa-award', 'fas fa-shield-alt',
];
const SECTEURS = ['Énergie', 'Industrie', 'Services'];
const CONTRATS = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance', 'Consultance'];

// LocalDateTime (Spring) <-> <input type="datetime-local">
export const toInputDate = (v) => {
  if (!v) return '';
  if (Array.isArray(v)) {
    const [y, m, d, h = 0, min = 0] = v;
    const p = (n) => String(n).padStart(2, '0');
    return `${y}-${p(m)}-${p(d)}T${p(h)}:${p(min)}`;
  }
  return String(v).slice(0, 16);
};
const fromInputDate = (v) => (v ? (v.length === 16 ? `${v}:00` : v) : null);
const isUrl = (v) => !v || /^https?:\/\/\S+\.\S+/.test(v) || 'Adresse invalide (doit commencer par http:// ou https://)';

const Thumb = ({ src, round }) => (
  <span className={`flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden border border-slate-100 bg-white p-1 ${round ? 'rounded-xl' : 'rounded-lg'}`}>
    {src ? <img src={previewSrc(src)} alt="" loading="lazy" className="max-h-full max-w-full object-contain" /> : <i className="fa-solid fa-image text-slate-300" />}
  </span>
);

const Title = ({ children, sub }) => (
  <div className="min-w-0">
    <p className="truncate font-semibold text-slate-800">{children}</p>
    {sub && <p className="mt-0.5 line-clamp-1 max-w-md text-xs text-slate-500">{sub}</p>}
  </div>
);

const PublishBadge = ({ item, quickToggle }) => {
  if (item.archived) return <Badge tone="gray" icon="fa-box-archive">Archivé</Badge>;
  return (
    <button type="button" onClick={() => quickToggle(item, 'published')} title="Cliquer pour changer" className="transition hover:opacity-80">
      {item.published ? <Badge tone="green" icon="fa-circle-check">Publié</Badge> : <Badge tone="amber" icon="fa-pen-ruler">Brouillon</Badge>}
    </button>
  );
};

const statusFilter = {
  options: [
    { value: 'published', label: 'Publiés' },
    { value: 'draft', label: 'Brouillons' },
    { value: 'archived', label: 'Archivés' },
  ],
  match: (i, v) => (v === 'archived' ? i.archived : !i.archived && (v === 'published' ? i.published : !i.published)),
};
const publicationFields = [
  { name: 'published', label: 'Publié sur le site', type: 'toggle', help: 'Visible par les visiteurs', half: true },
  { name: 'archived', label: 'Archivé', type: 'toggle', help: 'Masqué du site, conservé ici', half: true },
];
const bySortDate = (key) => (a, b) => new Date(b[key] || 0) - new Date(a[key] || 0);

/* ───────── Configurations ───────── */

export const RESOURCES = {
  entreprises: {
    title: 'Filiales',
    singular: 'Filiale',
    singularArticle: 'cette filiale',
    icon: 'fa-building',
    description: 'Participations affichées sur l’accueil et dans les pages secteurs.',
    addLabel: 'Nouvelle filiale',
    api: api.admin.entreprises,
    searchKeys: ['name', 'description', 'secteur'],
    sort: (a, b) => SECTEURS.indexOf(a.secteur) - SECTEURS.indexOf(b.secteur) || a.id - b.id,
    filter: { options: SECTEURS.map((s) => ({ value: s, label: s })), match: (i, v) => i.secteur === v },
    itemLabel: (i) => i.name,
    columns: [
      { label: 'Filiale', render: (i) => <div className="flex items-center gap-4"><Thumb src={i.logoUrl} round /><Title sub={i.description}>{i.name}</Title></div> },
      { label: 'Secteur', render: (i) => <Badge icon={{ Énergie: 'fa-bolt', Industrie: 'fa-industry', Services: 'fa-handshake' }[i.secteur]}>{i.secteur}</Badge> },
      {
        label: 'Site officiel',
        desktopOnly: true,
        render: (i) =>
          i.officialSite ? (
            <a href={i.officialSite} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-blue hover:underline">
              {i.officialSite.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </a>
          ) : (
            <span className="text-slate-300">—</span>
          ),
      },
    ],
    defaults: { secteur: 'Énergie' },
    fields: [
      { name: 'name', label: 'Nom de la filiale', required: true, maxLength: 255, half: true },
      { name: 'secteur', label: 'Secteur', type: 'select', options: SECTEURS, required: true, half: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true, maxLength: 1000, rows: 4 },
      { name: 'logoUrl', label: 'Logo', type: 'image', presets: PARTNER_LOGOS },
      { name: 'officialSite', label: 'Site officiel', type: 'url', placeholder: 'https://', validate: isUrl },
    ],
    toForm: (i) => ({ name: i.name, secteur: i.secteur, description: i.description, logoUrl: i.logoUrl || '', officialSite: i.officialSite || '' }),
    toPayload: (v) => ({ ...v, logoUrl: v.logoUrl || null, officialSite: v.officialSite || null }),
  },

  projets: {
    title: 'Projets',
    singular: 'Projet',
    singularArticle: 'ce projet',
    icon: 'fa-diagram-project',
    description: 'Projets accompagnés présentés sur la page d’accueil.',
    addLabel: 'Nouveau projet',
    api: api.admin.projets,
    searchKeys: ['title', 'description'],
    sort: (a, b) => a.id - b.id,
    itemLabel: (i) => i.title,
    columns: [{ label: 'Projet', render: (i) => <div className="flex items-center gap-4"><Thumb src={i.image} /><Title sub={i.description}>{i.title}</Title></div> }],
    fields: [
      { name: 'title', label: 'Titre', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true, maxLength: 1000 },
      { name: 'image', label: 'Image', type: 'image', presets: SITE_IMAGES },
    ],
    toForm: (i) => ({ title: i.title, description: i.description, image: i.image || '' }),
  },

  services: {
    title: 'Expertises',
    singular: 'Expertise',
    singularArticle: 'cette expertise',
    icon: 'fa-lightbulb',
    description: 'Les métiers présentés dans la section « Nos expertises ».',
    addLabel: 'Nouvelle expertise',
    api: api.admin.services,
    searchKeys: ['title', 'description'],
    sort: (a, b) => a.id - b.id,
    itemLabel: (i) => i.title,
    columns: [
      {
        label: 'Expertise',
        render: (i) => (
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red text-white">
              <i className={faIcon(i.icon)} />
            </span>
            <Title sub={i.description}>{i.title}</Title>
          </div>
        ),
      },
    ],
    fields: [
      { name: 'title', label: 'Titre', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'icon', label: 'Icône', type: 'icon', presets: ICONS },
    ],
    toForm: (i) => ({ title: i.title, description: i.description, icon: i.icon || '' }),
  },

  stats: {
    title: 'Statistiques',
    singular: 'Statistique',
    singularArticle: 'cette statistique',
    icon: 'fa-chart-simple',
    description: 'Chiffres clés animés de la page d’accueil.',
    addLabel: 'Nouvelle statistique',
    api: api.admin.stats,
    searchKeys: ['label', 'value'],
    sort: (a, b) => a.id - b.id,
    itemLabel: (i) => i.label,
    columns: [
      {
        label: 'Chiffre',
        render: (i) => (
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-white">
              <i className={faIcon(i.icon)} />
            </span>
            <Title>{i.label}</Title>
          </div>
        ),
      },
      { label: 'Valeur', render: (i) => <span className="font-display text-xl font-bold text-brand-blue">{i.value}</span> },
    ],
    fields: [
      { name: 'label', label: 'Libellé', required: true, placeholder: '+100 entreprises accompagnées', help: 'Les libellés d’origine sont traduits automatiquement en anglais et portugais.' },
      { name: 'value', label: 'Valeur', required: true, half: true, placeholder: '100+', help: 'Le nombre est animé sur le site.' },
      { name: 'icon', label: 'Icône', type: 'icon', presets: ICONS },
    ],
    toForm: (i) => ({ label: i.label, value: i.value, icon: i.icon || '' }),
  },

  secteurs: {
    title: 'Secteurs',
    singular: 'Secteur',
    singularArticle: 'ce secteur',
    icon: 'fa-layer-group',
    description: 'Secteurs d’intervention utilisés pour classer les filiales.',
    addLabel: 'Nouveau secteur',
    api: api.admin.secteurs,
    searchKeys: ['name'],
    sort: (a, b) => a.id - b.id,
    itemLabel: (i) => i.name,
    columns: [{ label: 'Secteur', render: (i) => <div className="flex items-center gap-4"><Thumb src={i.imageUrl} /><Title>{i.name}</Title></div> }],
    fields: [
      { name: 'name', label: 'Nom', required: true },
      { name: 'imageUrl', label: 'Image', type: 'image', presets: SITE_IMAGES },
    ],
    toForm: (i) => ({ name: i.name, imageUrl: i.imageUrl || '' }),
  },

  actualites: {
    title: 'Actualités',
    singular: 'Actualité',
    singularArticle: 'cette actualité',
    icon: 'fa-newspaper',
    description: 'Articles publiés dans la rubrique Bon Plan › Actualité.',
    addLabel: 'Nouvelle actualité',
    api: api.admin.actualites,
    searchKeys: ['title', 'summary'],
    sort: bySortDate('date'),
    filter: statusFilter,
    itemLabel: (i) => i.title,
    columns: [
      { label: 'Article', render: (i) => <div className="flex items-center gap-4"><Thumb src={i.imageUrl} /><Title sub={i.summary}>{i.title}</Title></div> },
      { label: 'Date', desktopOnly: true, render: (i) => <span className="text-slate-500">{formatDate(i.date)}</span> },
      { label: 'Statut', render: (i, ctx) => <PublishBadge item={i} {...ctx} /> },
    ],
    defaults: { published: true, archived: false },
    fields: [
      { name: 'title', label: 'Titre', required: true },
      { name: 'summary', label: 'Résumé', type: 'textarea', rows: 2, required: true },
      { name: 'content', label: 'Contenu', type: 'textarea', rows: 8 },
      { name: 'imageUrl', label: 'Image', type: 'image', presets: SITE_IMAGES },
      { name: 'date', label: 'Date de publication', type: 'datetime', half: true },
      ...publicationFields,
    ],
    toForm: (i) => ({ ...i, date: toInputDate(i.date), imageUrl: i.imageUrl || '', content: i.content || '' }),
    toPayload: (v) => ({ ...v, date: fromInputDate(v.date) || new Date().toISOString().slice(0, 19) }),
  },

  offres: {
    title: 'Offres d’emploi',
    singular: 'Offre',
    singularArticle: 'cette offre',
    icon: 'fa-briefcase',
    description: 'Postes affichés sur la page Carrières › Offres d’emploi.',
    addLabel: 'Nouvelle offre',
    api: api.admin.offres,
    searchKeys: ['title', 'location', 'contractType'],
    sort: bySortDate('createdAt'),
    filter: statusFilter,
    itemLabel: (i) => i.title,
    columns: [
      { label: 'Poste', render: (i) => <Title sub={`${i.location || '—'} · ${i.contractType || '—'}`}>{i.title}</Title> },
      { label: 'Date limite', desktopOnly: true, render: (i) => <span className="text-slate-500">{formatDate(i.deadline)}</span> },
      { label: 'Statut', render: (i, ctx) => <PublishBadge item={i} {...ctx} /> },
    ],
    defaults: { published: true, archived: false, contractType: 'CDI', location: 'Lomé, Togo' },
    fields: [
      { name: 'title', label: 'Intitulé du poste', required: true },
      { name: 'location', label: 'Lieu', required: true, half: true },
      { name: 'contractType', label: 'Type de contrat', type: 'select', options: CONTRATS, required: true, half: true },
      { name: 'description', label: 'Description du poste', type: 'textarea', rows: 6, required: true },
      { name: 'deadline', label: 'Date limite de candidature', type: 'datetime', required: true, half: true },
      ...publicationFields,
    ],
    toForm: (i) => ({ ...i, deadline: toInputDate(i.deadline) }),
    toPayload: (v) => ({ ...v, deadline: fromInputDate(v.deadline) }),
  },

  appelsOffres: {
    title: 'Appels d’offres',
    singular: 'Appel d’offres',
    singularArticle: 'cet appel d’offres',
    icon: 'fa-file-contract',
    description: 'Consultations publiées sur la page Bon Plan › Appel d’offre.',
    addLabel: 'Nouvel appel d’offres',
    api: api.admin.appelsOffres,
    searchKeys: ['reference', 'title', 'description'],
    sort: bySortDate('createdAt'),
    filter: statusFilter,
    itemLabel: (i) => `${i.reference} — ${i.title}`,
    columns: [
      { label: 'Appel d’offres', render: (i) => <Title sub={`Réf. ${i.reference}`}>{i.title}</Title> },
      { label: 'Date limite', desktopOnly: true, render: (i) => <span className="text-slate-500">{formatDate(i.deadline)}</span> },
      { label: 'Statut', render: (i, ctx) => <PublishBadge item={i} {...ctx} /> },
    ],
    defaults: { published: true, archived: false },
    fields: [
      { name: 'reference', label: 'Référence', required: true, half: true, placeholder: 'AO-2026-001' },
      { name: 'deadline', label: 'Date limite', type: 'datetime', required: true, half: true },
      { name: 'title', label: 'Titre', required: true },
      { name: 'description', label: 'Description', type: 'textarea', rows: 6, required: true },
      { name: 'documentUrls', label: 'Dossier de l’appel d’offres (PDF, Word)', type: 'file' },
      ...publicationFields,
    ],
    toForm: (i) => ({ ...i, deadline: toInputDate(i.deadline), documentUrls: i.documentUrls || '' }),
    toPayload: (v) => ({ ...v, deadline: fromInputDate(v.deadline), documentUrls: v.documentUrls || null }),
  },

  users: {
    title: 'Utilisateurs',
    singular: 'Utilisateur',
    singularArticle: 'cet utilisateur',
    icon: 'fa-users-gear',
    description: 'Comptes ayant accès au tableau de bord.',
    addLabel: 'Nouvel utilisateur',
    api: api.admin.users,
    searchKeys: ['email', 'role'],
    sort: (a, b) => a.id - b.id,
    itemLabel: (i) => i.email,
    columns: [
      {
        label: 'Compte',
        render: (i) => (
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-navy font-bold uppercase text-white">
              {i.email?.[0]}
            </span>
            <Title>{i.email}</Title>
          </div>
        ),
      },
      { label: 'Rôle', render: (i) => (i.role === 'ADMIN' ? <Badge tone="red" icon="fa-shield-halved">Administrateur</Badge> : <Badge tone="gray">Utilisateur</Badge>) },
    ],
    defaults: { role: 'ADMIN' },
    fields: [
      { name: 'email', label: 'Adresse e-mail', type: 'email', required: true, validate: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Adresse e-mail invalide' },
      {
        name: 'role',
        label: 'Rôle',
        type: 'select',
        required: true,
        options: [
          { value: 'ADMIN', label: 'Administrateur (accès au tableau de bord)' },
          { value: 'USER', label: 'Utilisateur (sans accès)' },
        ],
      },
      {
        name: 'password',
        label: 'Mot de passe',
        type: 'password',
        required: ({ isNew }) => isNew,
        help: 'Laisser vide pour conserver le mot de passe actuel.',
        validate: (v) => !v || v.length >= 8 || '8 caractères minimum',
      },
    ],
    toForm: (i) => ({ email: i.email, role: i.role, password: '' }),
    toPayload: (v) => ({ ...v, password: v.password || null }),
  },
};
