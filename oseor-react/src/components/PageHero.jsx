import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { EASE } from './Motion';
import { asset } from '../lib/asset';

/** Bandeau d'en-tête des pages internes : image, fil d'Ariane, titre animé. */
export default function PageHero({ title, subtitle, image = 'assets/images/hero-business.jpg', crumbs = [], children, eyebrow }) {
  const { t } = useTranslation();
  return (
    <section className="relative isolate flex min-h-[420px] items-end overflow-hidden bg-brand-navy pb-16 pt-40 md:min-h-[480px] md:pt-48">
      <motion.img
        src={asset(image)}
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-blue/95 via-brand-blue/80 to-brand-navy/60" />
      <div className="bg-dots absolute inset-0 -z-10 opacity-50" />
      <div className="absolute -bottom-24 -right-24 -z-10 h-72 w-72 rounded-full bg-brand-red/30 blur-3xl" />

      <div className="container-x">
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-white/70"
          aria-label="breadcrumb"
        >
          <Link to="/" className="transition hover:text-white">
            <i className="fa-solid fa-house mr-1.5" />
            {t('SECTOR_PAGE.HOME')}
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <i className="fa-solid fa-chevron-right text-[8px] text-white/40" />
              {c.to ? (
                <Link to={c.to} className="transition hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </span>
          ))}
        </motion.nav>

        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="max-w-4xl text-4xl font-bold leading-tight !text-white text-balance md:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          className="mt-6 h-1.5 w-24 origin-left rounded-full bg-brand-red"
        />
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
