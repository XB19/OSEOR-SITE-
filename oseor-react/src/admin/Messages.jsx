import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../lib/api';
import { normalize } from '../lib/siteData';
import { EASE } from '../components/Motion';
import { useAdminCounts } from './counts';
import { Chips, ConfirmDialog, EmptyState, ErrorState, IconButton, PageHeader, RowsSkeleton, SearchInput, formatDate, useCollection, useToast } from './ui';

const fullName = (m) => [m.firstName, m.name].filter(Boolean).join(' ');

export default function Messages() {
  const notify = useToast();
  const { seen, markRead, refresh } = useAdminCounts();
  const { items, loading, error, reload } = useCollection(api.admin.messages.list);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const sorted = useMemo(() => [...items].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || b.id - a.id), [items]);
  const list = useMemo(() => {
    const q = normalize(search);
    return sorted.filter(
      (m) => (filter === 'all' || !seen.has(m.id)) && (!q || [fullName(m), m.email, m.subject, m.message].some((v) => normalize(v || '').includes(q)))
    );
  }, [sorted, search, filter, seen]);
  const selected = items.find((m) => m.id === selectedId);

  // Sélectionne le plus récent sur grand écran
  useEffect(() => {
    if (!selectedId && sorted.length && window.innerWidth >= 1024) setSelectedId(sorted[0].id);
  }, [sorted, selectedId]);

  useEffect(() => {
    if (selected && !seen.has(selected.id)) markRead([selected.id]);
  }, [selected, seen, markRead]);

  const remove = async () => {
    setBusy(true);
    try {
      await api.admin.messages.remove(deleting.id);
      notify('Message supprimé.');
      setDeleting(null);
      setSelectedId(null);
      await reload();
      refresh();
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const unreadCount = items.filter((m) => !seen.has(m.id)).length;

  return (
    <>
      <PageHeader
        icon="fa-envelope"
        title="Messages"
        description="Demandes reçues via le formulaire de contact du site."
        count={loading ? undefined : items.length}
        action={
          unreadCount > 0 && (
            <button type="button" onClick={() => markRead(items.map((m) => m.id))} className="btn-outline">
              <i className="fa-solid fa-check-double" /> Tout marquer comme lu
            </button>
          )
        }
      />

      <div className="card grid overflow-hidden lg:min-h-[600px] lg:grid-cols-[380px_1fr]">
        {/* Liste */}
        <div className={`border-slate-100 lg:border-r ${selected ? 'hidden lg:block' : ''}`}>
          <div className="space-y-3 border-b border-slate-100 p-4">
            <SearchInput value={search} onChange={setSearch} />
            <Chips
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'Tous', count: items.length },
                { value: 'unread', label: 'Non lus', count: unreadCount },
              ]}
            />
          </div>
          {loading && !items.length ? (
            <RowsSkeleton rows={6} />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : !list.length ? (
            <EmptyState icon="fa-inbox" title={items.length ? 'Aucun résultat' : 'Aucun message'} description={items.length ? '' : 'Les messages du formulaire de contact apparaîtront ici.'} />
          ) : (
            <ul className="max-h-[640px] divide-y divide-slate-50 overflow-y-auto">
              {list.map((m) => {
                const unread = !seen.has(m.id);
                const active = m.id === selectedId;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(m.id)}
                      className={`relative flex w-full gap-3 px-4 py-4 text-left transition ${active ? 'bg-brand-blue-light/70' : 'hover:bg-slate-50'}`}
                    >
                      {active && <span className="absolute inset-y-0 left-0 w-1 bg-brand-blue" />}
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold uppercase text-white ${unread ? 'bg-brand-red' : 'bg-slate-300'}`}>
                        {(fullName(m) || m.email || '?')[0]}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className={`truncate text-sm ${unread ? 'font-bold text-brand-ink' : 'font-medium text-slate-600'}`}>{fullName(m) || m.email}</span>
                          <span className="shrink-0 text-[11px] text-slate-400">{formatDate(m.createdAt)}</span>
                        </span>
                        <span className={`block truncate text-sm ${unread ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>{m.subject}</span>
                        <span className="block truncate text-xs text-slate-400">{m.message}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Lecture */}
        <div className={selected ? '' : 'hidden lg:block'}>
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.article key={selected.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                  <div className="flex min-w-0 items-start gap-4">
                    <button type="button" onClick={() => setSelectedId(null)} aria-label="Retour" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 lg:hidden">
                      <i className="fa-solid fa-arrow-left" />
                    </button>
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold">{selected.subject}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        <span className="font-semibold text-slate-700">{fullName(selected)}</span> · {formatDate(selected.createdAt, true)}
                      </p>
                    </div>
                  </div>
                  <IconButton icon="fa-trash-can" label="Supprimer" tone="red" onClick={() => setDeleting(selected)} />
                </div>
                <div className="flex flex-wrap gap-3 border-b border-slate-100 px-6 py-4 text-sm">
                  <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-2 rounded-full bg-brand-blue-light px-4 py-2 font-medium text-brand-blue">
                    <i className="fa-solid fa-envelope" /> {selected.email}
                  </a>
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-600">
                      <i className="fa-solid fa-phone" /> {selected.phone}
                    </a>
                  )}
                </div>
                <p className="flex-1 whitespace-pre-line p-6 leading-relaxed text-slate-700">{selected.message}</p>
                <div className="border-t border-slate-100 p-6">
                  <a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`} className="btn-red">
                    <i className="fa-solid fa-reply" /> Répondre par e-mail
                  </a>
                </div>
              </motion.article>
            ) : (
              <EmptyState icon="fa-envelope-open-text" title="Aucun message sélectionné" description="Choisissez un message dans la liste pour le lire." />
            )}
          </AnimatePresence>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleting}
        busy={busy}
        title="Supprimer ce message ?"
        message={deleting ? `Le message de ${fullName(deleting) || deleting.email} sera définitivement supprimé.` : ''}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
