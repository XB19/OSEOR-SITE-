import { useRef, useState } from 'react';
import { Field } from '../components/Form';
import { asset } from '../lib/asset';
import { uploadFile } from '../lib/api';
import { Toggle } from './ui';

export const previewSrc = (path) => (!path ? '' : /^(https?:|data:|\/)/.test(path) ? path : asset(path));

const KINDS = {
  image: {
    accept: 'image/jpeg,image/png,image/webp,image/gif',
    types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    hint: 'JPG, PNG, WEBP ou GIF · 10 Mo maximum',
    icon: 'fa-image',
    label: 'une image',
  },
  document: {
    accept: '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    hint: 'PDF, DOC ou DOCX · 10 Mo maximum',
    icon: 'fa-file-arrow-up',
    label: 'un document',
  },
};
const MAX_SIZE = 10 * 1024 * 1024;

/**
 * Envoi d'un fichier depuis l'ordinateur : glisser-déposer ou bouton « Choisir un fichier »,
 * barre de progression, aperçu, remplacement et retrait.
 */
function UploadField({ value, onChange, kind = 'image', presets = [], error, onBusy }) {
  const cfg = KINDS[kind];
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [showPresets, setShowPresets] = useState(false);

  const send = async (file) => {
    if (!file) return;
    setUploadError(null);
    if (!cfg.types.includes(file.type)) return setUploadError(`Format non accepté (${cfg.hint}).`);
    if (file.size > MAX_SIZE) return setUploadError('Fichier trop volumineux (10 Mo maximum).');
    setProgress(0);
    onBusy?.(true);
    try {
      const res = await uploadFile(file, setProgress);
      setFileName(res.name || file.name);
      onChange(res.url);
    } catch (e) {
      setUploadError(e.message);
    } finally {
      setProgress(null);
      onBusy?.(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    send(e.dataTransfer.files?.[0]);
  };

  const uploading = progress !== null;
  const shownName = fileName || (value ? decodeURIComponent(value.split('/').pop()) : '');

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={cfg.accept}
        className="hidden"
        onChange={(e) => {
          send(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {value && !uploading ? (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
          {kind === 'image' ? (
            <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1">
              <img src={previewSrc(value)} alt="" className="max-h-full max-w-full object-contain" />
            </div>
          ) : (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-red-light text-2xl text-brand-red">
              <i className="fa-solid fa-file-pdf" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-700">{shownName}</p>
            <p className="text-xs text-emerald-600">
              <i className="fa-solid fa-circle-check mr-1" /> Fichier enregistré
            </p>
            {kind === 'document' && (
              <a href={previewSrc(value)} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-brand-blue hover:underline">
                Ouvrir le document
              </a>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
            <button type="button" onClick={() => inputRef.current?.click()} className="btn-outline !px-4 !py-2 text-xs">
              <i className="fa-solid fa-arrows-rotate" /> Remplacer
            </button>
            <button
              type="button"
              onClick={() => {
                setFileName(null);
                onChange('');
              }}
              className="btn !px-4 !py-2 text-xs text-slate-500 hover:bg-brand-red-light hover:text-brand-red"
            >
              <i className="fa-solid fa-xmark" /> Retirer
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !uploading && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
            drag ? 'border-brand-blue bg-brand-blue-light' : error || uploadError ? 'border-brand-red/40 bg-brand-red-light/30' : 'border-slate-200 bg-slate-50/60 hover:border-brand-blue/50 hover:bg-brand-blue-light/40'
          }`}
        >
          {uploading ? (
            <div className="w-full max-w-xs">
              <i className="fa-solid fa-cloud-arrow-up text-3xl text-brand-blue" />
              <p className="mt-3 text-sm font-semibold text-slate-700">Envoi en cours… {progress} %</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-brand-blue transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <>
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition ${drag ? 'bg-brand-blue text-white' : 'bg-white text-brand-blue shadow-sm'}`}>
                <i className={`fa-solid ${cfg.icon}`} />
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-700">
                Glissez-déposez {cfg.label} ici ou <span className="text-brand-blue underline">choisissez un fichier</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">{cfg.hint}</p>
            </>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-xs font-medium text-brand-red">
          <i className="fa-solid fa-circle-exclamation mr-1" /> {uploadError}
        </p>
      )}

      {presets.length > 0 && (
        <div>
          <button type="button" onClick={() => setShowPresets((s) => !s)} className="text-xs font-semibold text-slate-500 hover:text-brand-blue">
            <i className={`fa-solid fa-chevron-${showPresets ? 'up' : 'down'} mr-1.5 text-[10px]`} />
            Ou reprendre une image déjà présente sur le site
          </button>
          {showPresets && (
            <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  title={p.split('/').pop()}
                  onClick={() => {
                    setFileName(null);
                    onChange(p);
                  }}
                  className={`flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-white p-1 transition ${
                    value === p ? 'border-brand-blue ring-2 ring-brand-blue/20' : 'border-slate-100 hover:border-brand-blue/40'
                  }`}
                >
                  <img src={asset(p)} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Choix d'une icône Font Awesome. */
function IconField({ value, onChange, presets = [], error }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-lg text-white">
          <i className={value || 'fa-solid fa-circle-question'} />
        </span>
        <input className={`field ${error ? 'field-error' : ''}`} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="fas fa-chart-line" />
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            title={p}
            onClick={() => onChange(p)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition ${
              value === p ? 'border-brand-blue bg-brand-blue-light text-brand-blue' : 'border-slate-100 text-slate-500 hover:border-brand-blue/40 hover:text-brand-blue'
            }`}
          >
            <i className={p} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function FormField({ field, value, onChange, error, onBusy }) {
  const common = { className: `field ${error ? 'field-error' : ''}`, value: value ?? '', onChange: (e) => onChange(e.target.value) };

  let input;
  switch (field.type) {
    case 'textarea':
      input = <textarea rows={field.rows || 4} maxLength={field.maxLength} {...common} className={`${common.className} resize-y`} />;
      break;
    case 'select':
      input = (
        <select {...common}>
          <option value="">— Choisir —</option>
          {field.options.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>
              {o.label ?? o}
            </option>
          ))}
        </select>
      );
      break;
    case 'datetime':
      input = <input type="datetime-local" {...common} />;
      break;
    case 'toggle':
      return <Toggle checked={!!value} onChange={onChange} label={field.label} description={field.help} />;
    case 'image':
      input = <UploadField kind="image" value={value} onChange={onChange} presets={field.presets} error={error} onBusy={onBusy} />;
      break;
    case 'file':
      input = <UploadField kind="document" value={value} onChange={onChange} error={error} onBusy={onBusy} />;
      break;
    case 'icon':
      input = <IconField value={value} onChange={onChange} presets={field.presets} error={error} />;
      break;
    default:
      input = <input type={field.type || 'text'} maxLength={field.maxLength} placeholder={field.placeholder} autoComplete="off" {...common} />;
  }

  return (
    <Field label={field.label} required={field.required} error={error}>
      {input}
      {field.help && <p className="mt-1.5 text-xs text-slate-400">{field.help}</p>}
      {field.maxLength && field.type === 'textarea' && (
        <p className="mt-1 text-right text-[11px] text-slate-400">
          {(value || '').length} / {field.maxLength}
        </p>
      )}
    </Field>
  );
}
