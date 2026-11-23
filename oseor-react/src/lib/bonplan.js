/**
 * Bon Plan API (central "Bons Plans & ZenCard" content of the OSEOR group).
 *
 * Switched on by VITE_BONPLAN_API_URL and VITE_BONPLAN_KEY (a publishable key, pk_…, created in
 * the Bon Plan admin for this site). When they are unset, or the API cannot be reached, the page
 * keeps showing its own local content, so it never breaks.
 */
import { useEffect, useState } from 'react';

const BASE = (import.meta.env.VITE_BONPLAN_API_URL || '').replace(/\/+$/, '');
const KEY = import.meta.env.VITE_BONPLAN_KEY || '';
const SITE = import.meta.env.VITE_BONPLAN_SITE || 'oseor';

export const bonPlanEnabled = Boolean(BASE && KEY);

/**
 * All visible promotions of this site, split into posters (image) and text cards.
 * Returns null when the API is off or unavailable.
 */
export async function fetchBonPlan(locale = 'fr', signal) {
  if (!bonPlanEnabled) return null;
  try {
    const items = [];
    let cursor = null;
    do {
      const q = new URLSearchParams({ locale, limit: '50' });
      if (cursor) q.set('cursor', cursor);
      const res = await fetch(`${BASE}/v1/sites/${SITE}/promotions?${q}`, {
        headers: { 'X-BonPlan-Key': KEY },
        signal,
      });
      if (!res.ok) throw new Error(`Bon Plan API: HTTP ${res.status}`);
      const page = await res.json();
      items.push(...page.items);
      cursor = page.nextCursor;
    } while (cursor);
    return {
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
 * `loading` is true only while the API is being asked.
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
  return { ...(state.data ?? fallback), fromApi: Boolean(state.data), loading: state.loading };
}
