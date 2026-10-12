import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Défilement après navigation :
 *  - lien avec ancre (/#entreprises…) : attend que la section existe puis y défile,
 *    avec une correction si la mise en page a bougé pendant le trajet (images chargées) ;
 *  - lien vers la page courante sans ancre (Accueil, logo…) : remonte en haut ;
 *  - changement de page : le retour en haut est fait dans App (onExitComplete).
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const prevPath = useRef(null);

  useEffect(() => {
    const firstRender = prevPath.current === null;
    const samePage = prevPath.current === pathname;
    prevPath.current = pathname;

    if (!hash) {
      if (samePage && !firstRender) window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const timers = [];
    let tries = 0;
    const interval = setInterval(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!el && ++tries < 40) return;
      clearInterval(interval);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      timers.push(
        setTimeout(() => {
          const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
          if (Math.abs(el.getBoundingClientRect().top - margin) > 12) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 1400)
      );
    }, 50);

    return () => {
      clearInterval(interval);
      timers.forEach(clearTimeout);
    };
  }, [pathname, hash, key]);

  return null;
}
