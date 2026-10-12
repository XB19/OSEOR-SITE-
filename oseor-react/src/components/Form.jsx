import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

export function Field({ label, required, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="label">
        {label} {required && <span className="text-brand-red">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-xs font-medium text-brand-red">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Zone de dépôt de fichier (PDF, DOC, DOCX). */
export function FileInput({ label, required, file, onChange, error, className = '' }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  return (
    <Field label={label} required={required} error={error} className={className}>
      <input ref={ref} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => onChange(e.target.files?.[0] || null)} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`group flex w-full items-center gap-4 rounded-xl border-2 border-dashed px-4 py-4 text-left transition ${
          file ? 'border-brand-blue/40 bg-brand-blue-light/60' : 'border-slate-200 bg-slate-50/60 hover:border-brand-blue hover:bg-brand-blue-light/40'
        } ${error ? '!border-brand-red/50' : ''}`}
      >
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${file ? 'bg-brand-blue text-white' : 'bg-white text-slate-400 group-hover:text-brand-blue'}`}>
          <i className={`fa-solid ${file ? 'fa-file-circle-check' : 'fa-cloud-arrow-up'}`} />
        </span>
        <span className={`truncate text-sm ${file ? 'font-semibold text-brand-blue' : 'text-slate-500'}`}>{file?.name || t('CAREERS_PAGE.FORM.FILE_TYPE')}</span>
      </button>
    </Field>
  );
}

export function Alert({ type = 'success', children }) {
  const ok = type === 'success';
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-4 rounded-2xl border px-5 py-4 ${ok ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-brand-red/20 bg-brand-red-light text-brand-red'}`}
    >
      <i className={`fa-solid ${ok ? 'fa-circle-check' : 'fa-circle-exclamation'} text-xl`} />
      <p className="text-sm font-medium">{children}</p>
    </motion.div>
  );
}

export function SubmitButton({ loading, disabled, children, loadingLabel }) {
  return (
    <button type="submit" disabled={disabled || loading} className="btn-red w-full !py-4 uppercase tracking-wider md:w-auto">
      {loading ? <i className="fa-solid fa-spinner animate-spin" /> : <i className="fa-solid fa-paper-plane" />}
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
