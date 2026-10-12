import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from './Motion';

/** Fenêtre modale animée : fermeture par Échap, clic extérieur ou bouton. */
export default function Modal({ open, onClose, children, size = 'max-w-3xl', dark = false, label }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-[2000] flex items-end justify-center p-0 sm:items-center sm:p-6 ${dark ? 'bg-black/85' : 'bg-brand-ink/60'} backdrop-blur-sm`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <motion.div
            className={`relative w-full ${size} ${dark ? '' : 'max-h-[92vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl'}`}
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function CloseButton({ onClick, className = '', light = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Fermer"
      className={`flex h-10 w-10 items-center justify-center rounded-full transition hover:rotate-90 ${
        light ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-slate-100 text-slate-500 hover:bg-brand-red hover:text-white'
      } ${className}`}
    >
      <i className="fa-solid fa-xmark" />
    </button>
  );
}
