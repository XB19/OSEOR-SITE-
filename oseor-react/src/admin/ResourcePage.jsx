import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Modal, { CloseButton } from '../components/Modal';
import { EASE } from '../components/Motion';
import { useSiteData, normalize } from '../lib/siteData';
import { FormField } from './FormFields';
import { Chips, ConfirmDialog, EmptyState, ErrorState, IconButton, PageHeader, RowsSkeleton, SearchInput, useCollection, useToast } from './ui';

/**
 * Page de gestion générique (liste, recherche, filtres, création, édition, suppression),
 * pilotée par une configuration de src/admin/resources.jsx.
 */
export default function ResourcePage({ config }) {
  const notify = useToast();
  const { reload: reloadSite } = useSiteData();
  const { items, loading, error, reload } = useCollection(config.api.list);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [params, setParams] = useSearchParams();

  // Raccourci « ?new=1 » (boutons du tableau de bord) : ouvre directement le formulaire d'ajout
  useEffect(() => {
    if (params.get('new') === '1') {
      setEditing('new');
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const filtered = useMemo(() => {
    const q = normalize(search);
    let list = [...items];
    if (config.sort) list.sort(config.sort);
    if (config.filter && filter !== 'all') list = list.filter((i) => config.filter.match(i, filter));
    if (q) list = list.filter((i) => config.searchKeys.some((k) => normalize(String(i[k] ?? '')).includes(q)));
    return list;
  }, [items, search, filter, config]);

  const afterChange = async (message) => {
    notify(message);
    await reload();
    reloadSite();
  };

  const save = async (values) => {
    setBusy(true);
    try {
      const payload = config.toPayload ? config.toPayload(values, editing) : values;
      if (editing === 'new') await config.api.create(payload);
      else await config.api.update(editing.id, payload);
      setEditing(null);
      await afterChange(editing === 'new' ? `${config.singular} ajouté(e) avec succès.` : 'Modifications enregistrées.');
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await config.api.remove(deleting.id);
      setDeleting(null);
      await afterChange(`${config.singular} supprimé(e).`);
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const quickToggle = async (item, key) => {
    try {
      await config.api.update(item.id, config.toPayload({ ...config.toForm(item), [key]: !item[key] }, item));
      await afterChange(!item[key] ? 'Élément publié.' : 'Élément dépublié.');
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  const filterOptions = config.filter
    ? [{ value: 'all', label: 'Tous', count: items.length }, ...config.filter.options.map((o) => ({ ...o, count: items.filter((i) => config.filter.match(i, o.value)).length }))]
    : null;

  return (
    <>
      <PageHeader
        icon={config.icon}
        title={config.title}
        description={config.description}
        count={loading ? undefined : items.length}
        action={
          config.canCreate !== false && (
            <button type="button" onClick={() => setEditing('new')} className="btn-red">
              <i className="fa-solid fa-plus" /> {config.addLabel || 'Ajouter'}
            </button>
          )
        }
      />

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput value={search} onChange={setSearch} />
          {filterOptions && <Chips options={filterOptions} value={filter} onChange={setFilter} />}
        </div>

        {loading && items.length === 0 ? (
          <RowsSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={config.icon}
            title={items.length ? 'Aucun résultat' : config.emptyTitle || 'Aucun élément'}
            description={items.length ? 'Essayez une autre recherche ou un autre filtre.' : 'Commencez par ajouter un premier élément.'}
            action={
              !items.length &&
              config.canCreate !== false && (
                <button type="button" onClick={() => setEditing('new')} className="btn-blue">
                  <i className="fa-solid fa-plus" /> {config.addLabel || 'Ajouter'}
                </button>
              )
            }
          />
        ) : (
          <>
            {/* Tableau (écrans larges) */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                    {config.columns.map((c) => (
                      <th key={c.label} className={`px-5 py-3 font-semibold ${c.className || ''}`}>
                        {c.label}
                      </th>
                    ))}
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {filtered.map((item, i) => (
                      <motion.tr
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(i, 10) * 0.025, ease: EASE }}
                        className="group border-b border-slate-50 transition-colors last:border-0 hover:bg-brand-blue-light/40"
                      >
                        {config.columns.map((c) => (
                          <td key={c.label} className={`px-5 py-4 align-middle ${c.className || ''}`}>
                            {c.render(item, { quickToggle })}
                          </td>
                        ))}
                        <td className="px-5 py-4 text-right">
                          <RowActions config={config} item={item} onEdit={() => setEditing(item)} onDelete={() => setDeleting(item)} />
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Cartes (mobile) */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filtered.map((item) => (
                <div key={item.id} className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">{config.columns[0].render(item, { quickToggle })}</div>
                    <RowActions config={config} item={item} onEdit={() => setEditing(item)} onDelete={() => setDeleting(item)} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {config.columns.slice(1).filter((c) => !c.desktopOnly).map((c) => (
                      <div key={c.label}>{c.render(item, { quickToggle })}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <FormModal config={config} editing={editing} busy={busy} onClose={() => !busy && setEditing(null)} onSave={save} />

      <ConfirmDialog
        open={!!deleting}
        busy={busy}
        title={`Supprimer ${config.singularArticle || 'cet élément'} ?`}
        message={deleting ? `« ${config.itemLabel(deleting)} » sera définitivement supprimé(e). Cette action est irréversible.` : ''}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}

function RowActions({ config, item, onEdit, onDelete }) {
  return (
    <div className="flex justify-end gap-1">
      {config.extraActions?.(item)}
      {config.canEdit !== false && <IconButton icon="fa-pen" label="Modifier" onClick={onEdit} />}
      {(config.canDelete ? config.canDelete(item) : true) && <IconButton icon="fa-trash-can" label="Supprimer" tone="red" onClick={onDelete} />}
    </div>
  );
}

function FormModal({ config, editing, busy, onClose, onSave }) {
  const isNew = editing === 'new';
  return (
    <Modal open={!!editing} onClose={onClose} size="max-w-2xl" label={config.title}>
      {editing && (
        <ResourceForm
          key={isNew ? 'new' : editing.id}
          config={config}
          initial={isNew ? config.defaults || {} : config.toForm(editing)}
          isNew={isNew}
          busy={busy}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </Modal>
  );
}

function ResourceForm({ config, initial, isNew, busy, onClose, onSave }) {
  const [values, setValues] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(0); // envois de fichiers en cours

  const fields = config.fields.filter((f) => !f.when || f.when({ isNew, values }));
  const errors = Object.fromEntries(
    fields.map((f) => {
      const v = values[f.name];
      const required = typeof f.required === 'function' ? f.required({ isNew }) : f.required;
      if (required && (v === undefined || v === null || String(v).trim() === '')) return [f.name, 'Ce champ est obligatoire'];
      if (f.validate) {
        // Un validateur renvoie true (ou rien) si la valeur est correcte, sinon le message d'erreur
        const result = f.validate(v, values);
        return [f.name, typeof result === 'string' ? result : null];
      }
      return [f.name, null];
    })
  );
  const invalid = Object.values(errors).some(Boolean);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!invalid && !uploading) onSave(values);
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
            <i className={`fa-solid ${isNew ? 'fa-plus' : 'fa-pen'}`} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-red">{config.title}</p>
            <h2 className="text-lg font-bold">{isNew ? config.addLabel || 'Nouvel élément' : 'Modifier'}</h2>
          </div>
        </div>
        <CloseButton onClick={onClose} />
      </div>

      <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
        {fields.map((f) => (
          <div key={f.name} className={f.half ? '' : 'sm:col-span-2'}>
            <FormField
              field={{ ...f, required: typeof f.required === 'function' ? f.required({ isNew }) : f.required }}
              value={values[f.name]}
              onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))}
              error={submitted ? errors[f.name] : null}
              onBusy={(b) => setUploading((n) => Math.max(0, n + (b ? 1 : -1)))}
            />
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur sm:px-8">
        <button type="button" onClick={onClose} disabled={busy} className="btn bg-slate-100 text-slate-600 hover:bg-slate-200">
          Annuler
        </button>
        <button type="submit" disabled={busy || uploading > 0} className="btn-blue">
          {busy ? <i className="fa-solid fa-spinner animate-spin" /> : <i className="fa-solid fa-check" />}
          {isNew ? 'Ajouter' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
