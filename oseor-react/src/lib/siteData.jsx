import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api';
import { COMPANIES, SECTORS } from '../data/companies';
import { EXPERTISES, PROJETS, STATS } from '../data/home';

/**
 * Données du site public, gérées depuis le tableau de bord (backend Spring Boot).
 * Chaque collection retombe sur le contenu embarqué (src/data) si l'API est injoignable,
 * et les fiches enrichies (détails, catégories, images) sont rattachées par nom.
 */

export const normalize = (s = '') =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

export const sectorSlugFromName = (name = '') => SECTORS.find((s) => normalize(s.name) === normalize(name))?.slug || normalize(name);

const fixAsset = (path) => (path ? path.replace('zener .png', 'zener.png').replace(/^\//, '') : null);

// Ordre de création (l’API trie par nom) : on garde l’ordre d’origine, les ajouts arrivent à la fin
const byId = (a, b) => (a.id ?? 0) - (b.id ?? 0);

function mergeCompanies(list) {
  return [...list].sort(byId).map((e) => {
    const sector = sectorSlugFromName(e.secteur);
    const key = normalize(e.name);
    const base = COMPANIES.find(
      (c) => c.sector === sector && (normalize(c.name) === key || (c.aliases || []).some((a) => normalize(a) === key))
    );
    return {
      category: '',
      details: [],
      ...base,
      id: `db-${e.id}`,
      dbId: e.id,
      sector,
      name: e.name,
      description: e.description,
      logo: fixAsset(e.logoUrl) || base?.logo || null,
      site: e.officialSite || null,
    };
  });
}

function mergeProjets(list) {
  return [...list].sort(byId).map((p) => {
    const base = PROJETS.find((s) => normalize(s.title) === normalize(p.title));
    return {
      tag: '',
      figure: '',
      ...base,
      id: p.id,
      title: p.title,
      description: p.description,
      image: fixAsset(p.image) || base?.image || 'assets/images/projet-1.jpg',
    };
  });
}

const STAT_KEYS = { entreprises: 'STATS.ENTREPRISES', projets: 'STATS.PROJETS', secteurs: 'STATS.SECTEURS', missions: 'STATS.MISSIONS' };

export const faIcon = (icon, fallback = 'fa-solid fa-circle') => {
  if (!icon) return fallback;
  return /\bfa[srb]?\b|fa-(solid|regular|brands)\b/.test(icon) ? icon : `fa-solid ${icon}`;
};

function mergeStats(list) {
  const seen = new Set();
  return [...list]
    .sort(byId)
    .filter((s) => {
      const k = normalize(s.label);
      if (seen.has(k)) return false; // l'ancien script d'initialisation créait des doublons
      seen.add(k);
      return true;
    })
    .map((s) => {
      const known = Object.entries(STAT_KEYS).find(([word]) => normalize(s.label).includes(word));
      return {
        id: s.id,
        key: known?.[1],
        label: s.label,
        value: parseInt(String(s.value).replace(/\D/g, ''), 10) || 0,
        icon: faIcon(s.icon),
      };
    });
}

const EXPERTISE_TITLES = {
  investissementsstrategiques: 'EXPERTISES.STRATEGIC',
  investissementencapital: 'EXPERTISES.STRATEGIC',
  ingenieriefinanciere: 'EXPERTISES.FINANCIAL',
  gouvernanceperformance: 'EXPERTISES.GOVERNANCE',
  conseilstrategique: 'EXPERTISES.GOVERNANCE',
  digitalisationinfluence: 'EXPERTISES.DIGITAL',
  assistancetechnique: 'EXPERTISES.DIGITAL',
};

function mergeServices(list) {
  return [...list].sort(byId).map((s) => {
    const key = EXPERTISE_TITLES[normalize(s.title)];
    const base = EXPERTISES.find((e) => e.titleKey === key);
    // Texte d'origine non modifié : on garde les traductions ; sinon on affiche le texte saisi
    const sameDesc = base && normalize(s.description) === normalize(t_fr(base.descKey));
    return {
      id: s.id,
      title: s.title,
      description: s.description,
      titleKey: base && normalize(s.title) === normalize(t_fr(base.titleKey)) ? base.titleKey : undefined,
      descKey: sameDesc ? base.descKey : undefined,
      image: base?.image || 'assets/images/services.jpg',
      icon: faIcon(s.icon, base ? `fa-solid ${base.icon}` : undefined),
    };
  });
}

// Libellés français de référence pour savoir si un texte a été modifié dans l'admin
const FR_TEXT = {
  'EXPERTISES.STRATEGIC': 'Investissements Stratégiques',
  'EXPERTISES.FINANCIAL': 'Ingénierie financière',
  'EXPERTISES.GOVERNANCE': 'Gouvernance & Performance',
  'EXPERTISES.DIGITAL': 'Digitalisation & Influence',
  'EXPERTISES.STRATEGIC_DESC': 'Nous injectons des fonds propres pour soutenir votre croissance et renforcer votre structure financière.',
  'EXPERTISES.FINANCIAL_DESC': 'Conseils experts pour optimiser votre structure de capital et faciliter vos levées de fonds.',
  'EXPERTISES.GOVERNANCE_DESC': 'Accompagnement dans la définition et l’exécution de votre vision à long terme.',
  'EXPERTISES.DIGITAL_DESC': 'Renforcement de vos capacités opérationnelles et managériales pour une excellence durable.',
};
const t_fr = (key) => FR_TEXT[key] || '';

const STATIC = {
  companies: COMPANIES,
  projets: PROJETS,
  stats: STATS.map((s) => ({ ...s, icon: `fa-solid ${s.icon}` })),
  services: EXPERTISES.map((e) => ({ ...e, icon: `fa-solid ${e.icon}` })),
};

const SiteDataContext = createContext({ ...STATIC, source: 'static', reload: () => {} });

export function SiteDataProvider({ children }) {
  const [data, setData] = useState({ ...STATIC, source: 'static' });

  const reload = useCallback(async () => {
    const [companies, projets, stats, services] = await Promise.allSettled([
      api.getEntreprises(),
      api.getProjets(),
      api.getStats(),
      api.getServices(),
    ]);
    const ok = (r) => r.status === 'fulfilled' && Array.isArray(r.value);
    setData({
      companies: ok(companies) ? mergeCompanies(companies.value) : STATIC.companies,
      projets: ok(projets) ? mergeProjets(projets.value) : STATIC.projets,
      stats: ok(stats) ? mergeStats(stats.value) : STATIC.stats,
      services: ok(services) ? mergeServices(services.value) : STATIC.services,
      source: [companies, projets, stats, services].some(ok) ? 'api' : 'static',
    });
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo(() => ({ ...data, reload }), [data, reload]);
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export const useSiteData = () => useContext(SiteDataContext);
