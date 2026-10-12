import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Modal from '../components/Modal';
import { EASE } from '../components/Motion';

/* ───────────────────────── Notifications ───────────────────────── */

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const notify = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const styles = {
    success: ['fa-circle-check', 'bg-emerald-500'],
    error: ['fa-circle-exclamation', 'bg-brand-red'],
    info: ['fa-circle-info', 'bg-brand-blue'],
  };

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[3000] flex w-[calc(100%-3rem)] max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl"
              role="status"
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-white ${styles[t.type][1]}`}>
                <i className={`fa-solid ${styles[t.type][0]}`} />
              </span>
              <p className="pt-1 text-sm font-medium text-slate-700">{t.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/* ───────────────────────── Données ───────────────────────── */

/** Charge une liste depuis l'API avec états chargement / erreur. */
export function useCollection(loader) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loaderRef.current();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, setItems, loading, error, reload };
}

export const formatDate = (value, withTime = false) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
};

/* ───────────────────────── Composants ───────────────────────── */

export function PageHeader({ icon, title, description, count, action }) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-4">
        {icon && (
          <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-xl text-white shadow-soft sm:flex">
            <i className={`fa-solid ${icon}`} />
          </span>
        )}
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold md:text-3xl">
            {title}
            {count !== undefined && (
              <span className="rounded-full bg-brand-blue-light px-3 py-1 font-sans text-sm font-semibold text-brand-blue">{count}</span>
            )}
          </h1>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Rechercher…' }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="field !rounded-full !bg-white !py-2.5 pl-11" />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Effacer" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-red">
          <i className="fa-solid fa-circle-xmark" />
        </button>
      )}
    </div>
  );
}

export function Chips({ options, value, onChange }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
            value === o.value ? 'bg-brand-blue text-white shadow-soft' : 'border border-slate-200 bg-white text-slate-500 hover:border-brand-blue hover:text-brand-blue'
          }`}
        >
          {o.label}
          {o.count !== undefined && <span className={`ml-2 text-xs ${value === o.value ? 'text-white/70' : 'text-slate-400'}`}>{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

const BADGE_TONES = {
  blue: 'bg-brand-blue-light text-brand-blue',
  red: 'bg-brand-red-light text-brand-red',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  gray: 'bg-slate-100 text-slate-500',
};

export function Badge({ tone = 'blue', icon, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${BADGE_TONES[tone]}`}>
      {icon && <i className={`fa-solid ${icon} text-[10px]`} />}
      {children}
    </span>
  );
}

export function EmptyState({ icon = 'fa-inbox', title, description, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-blue-light text-3xl text-brand-blue">
        <i className={`fa-solid ${icon}`} />
      </span>
      <h3 className="mt-6 text-lg font-bold">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-red-light text-3xl text-brand-red">
        <i className="fa-solid fa-triangle-exclamation" />
      </span>
      <h3 className="mt-6 text-lg font-bold">Chargement impossible</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{message}</p>
      <button type="button" onClick={onRetry} className="btn-outline mt-6">
        <i className="fa-solid fa-rotate-right" /> Réessayer
      </button>
    </div>
  );
}

export function RowsSkeleton({ rows = 5 }) {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-4 px-6 py-5">
          <div className="h-12 w-12 rounded-xl bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-slate-200" />
            <div className="h-3 w-2/3 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
      <span>
        <span className="block text-sm font-semibold text-slate-700">{label}</span>
        {description && <span className="block text-xs text-slate-500">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-brand-blue' : 'bg-slate-300'}`}
      >
        <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 32 }} className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${checked ? 'right-1' : 'left-1'}`} />
      </button>
    </label>
  );
}

/** Confirmation avant une action irréversible (suppression…). */
export function ConfirmDialog({ open, title, message, confirmLabel = 'Supprimer', onConfirm, onClose, busy }) {
  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} size="max-w-md" label={title}>
      <div className="p-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-red-light text-2xl text-brand-red">
          <i className="fa-solid fa-trash-can" />
        </span>
        <h2 className="mt-5 text-xl font-bold">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" onClick={onClose} disabled={busy} className="btn bg-slate-100 text-slate-600 hover:bg-slate-200">
            Annuler
          </button>
          <button type="button" onClick={onConfirm} disabled={busy} className="btn-red">
            {busy ? <i className="fa-solid fa-spinner animate-spin" /> : <i className="fa-solid fa-trash-can" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function IconButton({ icon, label, onClick, tone = 'blue', href, external }) {
  const cls = `flex h-9 w-9 items-center justify-center rounded-xl transition ${
    tone === 'red' ? 'text-slate-400 hover:bg-brand-red-light hover:text-brand-red' : 'text-slate-400 hover:bg-brand-blue-light hover:text-brand-blue'
  }`;
  if (href)
    return (
      <a href={href} title={label} aria-label={label} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        <i className={`fa-solid ${icon}`} />
      </a>
    );
  return (
    <button type="button" title={label} aria-label={label} onClick={onClick} className={cls}>
      <i className={`fa-solid ${icon}`} />
    </button>
  );
}
