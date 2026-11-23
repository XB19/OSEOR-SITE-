/**
 * Bon Plan API (central "Bons Plans & ZenCard" content of the OSEOR group).
 *
 * One setting: VITE_BONPLAN_URL, the connection link generated in the Bon Plan admin
 * (Sites → the site → Connexion du site), e.g. https://api.example/v1/sites/oseor?key=pk_…
 * When it is unset, or the API cannot be reached, the page keeps showing its own local content.
 * The page layout (texts, blocks, columns) is set per site in the admin and comes with the content.
 */
import { useEffect, useState } from 'react';

function parseLink(link) {
  try {
    const u = new URL(link);
    const m = u.pathname.match(/^(.*)\/v1\/sites\/([^/]+)\/?$/);
    return m ? { base: u.origin + m[1], site: decodeURIComponent(m[2]), key: u.searchParams.get('key') || '' } : null;
  } catch {
    return null;
  }
}

const env = import.meta.env;
const LINK = parseLink(env.VITE_BONPLAN_URL || '');
// The three separate variables are still accepted (older configuration).
const BASE = LINK ? LINK.base : (env.VITE_BONPLAN_API_URL || '').replace(/\/+$/, '');
const KEY = LINK ? LINK.key : env.VITE_BONPLAN_KEY || '';
const SITE = LINK ? LINK.site : env.VITE_BONPLAN_SITE || 'oseor';

export const bonPlanEnabled = Boolean(BASE && KEY);

/** Layout used until the API answers (or when it is off): everything shown, the site's own texts. */
export const DEFAULT_PAGE = {
  showCounter: true,
  showZencardButton: true,
  showCards: true,
  columns: 4,
  texts: {
    heroEyebrow: null,
    heroTitle: null,
    heroText: null,
    buttonLabel: null,
    sectionEyebrow: null,
    sectionTitle: null,
  },
};

/**
 * All visible promotions of this site, split into posters (image) and text cards, plus the page
 * layout. Returns null when the API is off or unavailable.
 */
export async function fetchBonPlan(locale = 'fr', signal) {
  if (!bonPlanEnabled) return null;
  try {
    const items = [];
    let cursor = null;
    let page = DEFAULT_PAGE;
    do {
      const q = new URLSearchParams({ locale, limit: '50' });
      if (cursor) q.set('cursor', cursor);
      const res = await fetch(`${BASE}/v1/sites/${SITE}/promotions?${q}`, {
        headers: { 'X-BonPlan-Key': KEY },
        signal,
      });
      if (!res.ok) throw new Error(`Bon Plan API: HTTP ${res.status}`);
      const data = await res.json();
      items.push(...data.items);
      cursor = data.nextCursor;
      if (data.page) page = data.page;
    } while (cursor);
    return {
      page,
      posters: items
        .filter((p) => p.kind === 'poster' && p.image)
        .map((p) => ({ id: p.id, title: p.title, image: p.image.url, badge: p.badge, url: p.ctaUrl })),
      cards: items
        .filter((p) => p.kind === 'card')
        .map((p) => ({
          id: p.id,
          title: p.title,
          text: p.excerpt,
          image: p.image ? p.image.url : null,
          badge: p.badge,
          url: p.ctaUrl,
          linkLabel: p.ctaLabel,
        })),
    };
  } catch (e) {
    if (e?.name !== 'AbortError') console.warn('[bon plan] API unavailable, showing local content', e);
    return null;
  }
}

/**
 * The page's content: from the API when it answers, else `fallback` ({ posters, cards }, same shape).
 * `page` is the layout set in the admin; `loading` is true only while the API is being asked.
 */
export function useBonPlan(fallback, locale = 'fr') {
  const [state, setState] = useState({ data: null, loading: bonPlanEnabled });
  useEffect(() => {
    if (!bonPlanEnabled) return undefined;
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true }));
    fetchBonPlan(locale, ctrl.signal).then((data) => {
      if (!ctrl.signal.aborted) setState({ data, loading: false });
    });
    return () => ctrl.abort();
  }, [locale]);
  const data = state.data ?? fallback ?? {};
  return {
    posters: data.posters ?? [],
    cards: data.cards ?? [],
    page: state.data?.page ?? DEFAULT_PAGE,
    fromApi: Boolean(state.data),
    loading: state.loading,
  };
}
