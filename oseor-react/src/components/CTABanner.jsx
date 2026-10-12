import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Reveal } from './Motion';

/** Bloc d'appel à l'action (« Vous êtes une entreprise à fort potentiel ? »). */
export default function CTABanner() {
  const { t } = useTranslation();
  return (
    <section id="contact" className="container-x py-20 md:py-24">
      <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-red via-brand-red to-brand-red-dark px-6 py-14 shadow-glow sm:px-12 md:py-16">
        <motion.div
          className="absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-white/10"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute -bottom-24 left-1/3 -z-10 h-64 w-64 rounded-full bg-brand-blue/40 blur-3xl" />
        <div className="bg-dots absolute inset-0 -z-10 opacity-40" />

        <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold leading-tight !text-white text-balance md:text-4xl">{t('CTA.TITLE')}</h2>
            <p className="mt-4 text-base text-white/85 md:text-lg">{t('CTA.DESC')}</p>
          </div>
          <Link to="/contact" className="btn group shrink-0 bg-white !px-9 !py-4 text-brand-red shadow-xl hover:-translate-y-1 hover:shadow-2xl">
            {t('CTA.BUTTON')}
            <i className="fa-solid fa-paper-plane transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
