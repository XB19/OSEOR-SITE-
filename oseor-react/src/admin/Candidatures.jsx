import { useMemo, useState } from 'react';
import { api } from '../lib/api';
import { normalize } from '../lib/siteData';
import { Badge, Chips, ConfirmDialog, EmptyState, ErrorState, IconButton, PageHeader, RowsSkeleton, SearchInput, formatDate, useCollection, useToast } from './ui';

const name = (c) => [c.firstName, c.lastName].filter(Boolean).join(' ') || c.email;

export default function Candidatures() {
  const notify = useToast();
  const { items, loading, error, reload } = useCollection(api.admin.candidatures.list);
  const offres = useCollection(api.admin.offres.list);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('active');
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const offerTitle = (id) => offres.items.find((o) => o.id === id)?.title;
  const list = useMemo(() => {
    const q = normalize(search);
    return [...items]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .filter((c) => (filter === 'archived' ? c.archived : !c.archived))
      .filter((c) => !q || [name(c), c.email, c.phone].some((v) => normalize(v || '').includes(q)));
  }, [items, search, filter]);

  const archive = async (c) => {
    try {
      await api.admin.candidatures.archive(c.id);
      notify('Candidature archivée.');
      reload();
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.admin.candidatures.remove(deleting.id);
      notify('Candidature supprimée.');
      setDeleting(null);
      reload();
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader icon="fa-user-tie" title="Candidatures" description="Candidatures reçues pour les offres d’emploi." count={loading ? undefined : items.length} />
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput value={search} onChange={setSearch} />
          <Chips
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'active', label: 'À traiter', count: items.filter((c) => !c.archived).length },
              { value: 'archived', label: 'Archivées', count: items.filter((c) => c.archived).length },
            ]}
          />
        </div>
        {loading && !items.length ? (
          <RowsSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : !list.length ? (
          <EmptyState icon="fa-user-tie" title="Aucune candidature" description="Les candidatures enregistrées par le backend apparaîtront ici." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {list.map((c) => (
              <li key={c.id} className="flex flex-col gap-4 px-5 py-5 transition hover:bg-brand-blue-light/30 md:flex-row md:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-navy font-bold uppercase text-white">{name(c)[0]}</span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{name(c)}</p>
                    <p className="truncate text-xs text-slate-500">
                      {c.email} {c.phone && `· ${c.phone}`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {c.offreId ? <Badge icon="fa-briefcase">{offerTitle(c.offreId) || `Offre #${c.offreId}`}</Badge> : <Badge tone="gray">Spontanée</Badge>}
                  <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>
                </div>
                <div className="flex gap-1">
                  {c.cvUrl && <IconButton icon="fa-file-pdf" label="Voir le CV" href={c.cvUrl} external />}
                  {c.coverLetterUrl && <IconButton icon="fa-file-lines" label="Voir la lettre de motivation" href={c.coverLetterUrl} external />}
                  <IconButton icon="fa-envelope" label="Écrire au candidat" href={`mailto:${c.email}`} />
                  {!c.archived && <IconButton icon="fa-box-archive" label="Archiver" onClick={() => archive(c)} />}
                  <IconButton icon="fa-trash-can" label="Supprimer" tone="red" onClick={() => setDeleting(c)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ConfirmDialog
        open={!!deleting}
        busy={busy}
        title="Supprimer cette candidature ?"
        message={deleting ? `La candidature de ${name(deleting)} sera définitivement supprimée.` : ''}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
