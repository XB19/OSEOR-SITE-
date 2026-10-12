import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

/**
 * Messages non lus et état du serveur, partagés par la barre latérale, l'en-tête et le tableau de bord.
 * Le backend ne stocke pas l'état « lu » : il est mémorisé dans ce navigateur.
 */
const SEEN_KEY = 'oseor_admin_seen_messages';

const readSeen = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'));
  } catch {
    return new Set();
  }
};

const CountsContext = createContext({ unread: 0, online: null, messages: [], seen: new Set(), markRead: () => {}, refresh: () => {} });

export function AdminCountsProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState(null);
  const [seen, setSeen] = useState(readSeen);

  const refresh = useCallback(async () => {
    try {
      const list = await api.admin.messages.list();
      setMessages(Array.isArray(list) ? list : []);
      setOnline(true);
    } catch (e) {
      if (e.status === 0) setOnline(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 60000);
    return () => clearInterval(timer);
  }, [refresh]);

  const markRead = useCallback((ids) => {
    setSeen((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      try {
        localStorage.setItem(SEEN_KEY, JSON.stringify([...next]));
      } catch {
        /* stockage indisponible */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ messages, online, seen, unread: messages.filter((m) => !seen.has(m.id)).length, markRead, refresh }),
    [messages, online, seen, markRead, refresh]
  );
  return <CountsContext.Provider value={value}>{children}</CountsContext.Provider>;
}

export const useAdminCounts = () => useContext(CountsContext);
