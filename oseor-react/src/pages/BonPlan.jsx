import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import Modal, { CloseButton } from '../components/Modal';
import SectionHeading from '../components/SectionHeading';
import { Stagger, StaggerItem, EASE } from '../components/Motion';
import { BON_PLANS } from '../data/home';
import { asset } from '../lib/asset';
import { api } from '../lib/api';

const imgSrc = (p) => (!p ? asset('assets/bon-plan/storage/kapi/banner_articles.jpg') : /^(https?:|data:|\/)/.test(p) ? p : asset(p));

/** Actualités publiées depuis le tableau de bord (affichées seulement s'il y en a). */
function NewsSection() {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    api
      .getActualites()
      .then((d) => setNews(Array.isArray(d) ? [...d].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)) : []))
      .catch(() => setNews([]));
  }, []);

  if (!news.length) return null;
  const date = (v) => (v ? new Date(v).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }) : '');

  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHeading eyebrow={t('BON_PLAN_EXTRA.NEWS_TAG')} title={t('BON_PLAN_EXTRA.NEWS_TITLE')} />
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {news.map((n) => (
            <StaggerItem key={n.id}>
              <motion.button
                type="button"
                whileHover={{ y: -8 }}
                onClick={() => setOpen(n)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white text-left shadow-card transition-shadow duration-500 hover:shadow-soft"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={imgSrc(n.imageUrl)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  {n.date && <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-blue">{date(n.date)}</span>}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold leading-snug transition-colors group-hover:text-brand-blue">{n.title}</h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">{n.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-red">
                    {t('BON_PLAN_EXTRA.READ')} <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.button>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
      <Modal open={!!open} onClose={() => setOpen(null)} size="max-w-3xl" label={open?.title}>
        {open && (
          <article>
            <div className="relative">
              <img src={imgSrc(open.imageUrl)} alt="" className="h-64 w-full object-cover sm:h-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
              <CloseButton light onClick={() => setOpen(null)} className="absolute right-5 top-5" />
              <div className="absolute bottom-6 left-6 right-6">
                {open.date && <p className="text-sm text-white/80">{date(open.date)}</p>}
                <h3 className="mt-1 text-2xl font-bold !text-white sm:text-3xl">{open.title}</h3>
              </div>
            </div>
            <div className="space-y-4 p-6 sm:p-8">
              <p className="text-lg font-medium leading-relaxed text-slate-700">{open.summary}</p>
              {open.content && <p className="whitespace-pre-line leading-relaxed text-slate-600">{open.content}</p>}
            </div>
          </article>
        )}
      </Modal>
    </section>
  );
}

const CONFETTI = [
  ['🎊', '5%', 9, 0], ['✨', '15%', 11, -4], ['🎉', '28%', 8, -2], ['⭐', '42%', 10, -6],
  ['🎊', '58%', 12, -3], ['✨', '72%', 9, -5], ['🎉', '85%', 10, -1], ['⭐', '94%', 11, -7],
];

function AnniversaryBanner() {
  const { t } = useTranslation();
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#8a6514] via-[#b8892a] to-[#8a6514] pt-[76px] md:pt-[124px]">
      {CONFETTI.map(([emoji, left, duration, delay], i) => (
        <span
          key={i}
          className="pointer-events-none absolute top-[60px] text-lg md:top-[110px]"
          style={{ left, animation: `confetti-fall ${duration}s linear ${delay}s infinite` }}
        >
          {emoji}
        </span>
      ))}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="container-x relative flex flex-col items-center justify-center gap-3 py-4 text-center sm:flex-row sm:gap-5"
      >
        <span className="rounded-full bg-white px-4 py-1 font-display text-sm font-bold text-[#8a6514] shadow-lg">
          20 {t('COMMON.YEARS')}
        </span>
        <p className="text-sm font-semibold text-white md:text-base">{t('BON_PLAN_PAGE.BANNER_TEXT')}</p>
        <span className="hidden text-sm tracking-widest sm:inline">⭐⭐⭐</span>
      </motion.div>
    </div>
  );
}

export default function BonPlan() {
  const { t } = useTranslation();
  const [zencardOpen, setZencardOpen] = useState(false);
  const [index, setIndex] = useState(null);

  const go = useCallback((dir) => setIndex((i) => (i + dir + BON_PLANS.length) % BON_PLANS.length), []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  const current = index !== null ? BON_PLANS[index] : null;

  return (
    <>
      <AnniversaryBanner />

      {/* Hero */}
      <section className="relative isolate overflow-hidden py-24 text-center md:py-32">
        <motion.img
          src={asset('assets/bon-plan/storage/kapi/banner_articles.jpg')}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: EASE }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-blue/90 via-brand-blue/80 to-brand-navy/85" />
        <div className="absolute -right-20 -top-20 -z-10 h-96 w-96 rounded-full bg-[#b8892a]/25 blur-3xl" />

        <div className="container-x">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-xs font-bold uppercase tracking-[0.3em] text-[#f5d78e]">
            OSEOR
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-4 text-4xl font-bold !text-white md:text-6xl"
          >
            {t('BON_PLAN_EXTRA.TITLE')} <span className="text-gradient-gold">&</span> ZenCard
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mx-auto mt-5 max-w-lg text-lg text-white/80">
            {t('BON_PLAN_PAGE.HERO_DESC')}
          </motion.p>
          <motion.button
            type="button"
            onClick={() => setZencardOpen(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{ animation: 'pulse-ring 3s ease-in-out 2s infinite' }}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-[#d4a94a] to-[#b8892a] px-9 py-4 font-bold text-white shadow-xl"
          >
            <i className="fa-solid fa-credit-card" />
            {t('BON_PLAN_PAGE.ZENCARD_BTN')}
          </motion.button>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 flex flex-wrap items-center justify-center gap-8">
            <div>
              <p className="font-display text-3xl font-bold text-white">{BON_PLANS.length}</p>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-white/60">{t('BON_PLAN_PAGE.ACTIVE_OFFERS')}</p>
            </div>
            <span className="h-10 w-px bg-white/20" />
            <div>
              <p className="font-display text-3xl font-bold text-[#f5d78e]">ZenCard</p>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-white/60">{t('BON_PLAN_PAGE.ADVANTAGE_CARD')}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <NewsSection />

      {/* Galerie */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <SectionHeading eyebrow={t('BON_PLAN_PAGE.SECTION_TAG')} title={t('BON_PLAN_PAGE.SECTION_TITLE')} />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
            {BON_PLANS.map((bp, i) => (
              <StaggerItem key={bp.image}>
                <motion.button
                  type="button"
                  whileHover={{ y: -8 }}
                  onClick={() => setIndex(i)}
                  className="group block w-full overflow-hidden rounded-3xl bg-white text-left shadow-card transition-shadow duration-500 hover:shadow-soft"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={asset(bp.image)} alt={t(bp.titleKey)} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-[#d4a94a] to-[#b8892a] px-3 py-1 text-[11px] font-bold text-white shadow">ZenCard</span>
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-blue/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-500 group-hover:opacity-100">
                      <span className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-blue">
                        <i className="fa-solid fa-magnifying-glass-plus" /> {t('BON_PLAN_PAGE.ENLARGE')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <span className="text-sm font-semibold text-slate-800">{t(bp.titleKey)}</span>
                    <i className="fa-solid fa-arrow-right text-xs text-brand-blue transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.button>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Modale ZenCard */}
      <Modal open={zencardOpen} onClose={() => setZencardOpen(false)} size="max-w-md" label={t('BON_PLAN_PAGE.MODAL_TITLE')}>
        <div className="relative p-8 text-center">
          <CloseButton onClick={() => setZencardOpen(false)} className="absolute right-4 top-4" />
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#d4a94a] to-[#b8892a] text-3xl text-white shadow-xl">
            <i className="fa-solid fa-credit-card" />
          </div>
          <h2 className="mt-6 text-2xl font-bold">{t('BON_PLAN_PAGE.MODAL_TITLE')}</h2>
          <p className="mt-2 text-sm text-slate-500">{t('BON_PLAN_PAGE.MODAL_DESC')}</p>
          <div className="mt-6 rounded-2xl border border-[#f0c040] bg-gradient-to-br from-[#fffbea] to-[#fff3cc] p-5">
            <i className="fa-solid fa-person-digging text-2xl text-[#8b6914]" />
            <p className="mt-2 font-bold text-[#8b6914]">{t('BON_PLAN_PAGE.MODAL_STATUS')}</p>
            <p className="mt-1 text-sm text-[#a07820]">{t('BON_PLAN_PAGE.MODAL_STATUS_DESC')}</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-blue">
              <i className="fa-solid fa-phone" /> {t('BON_PLAN_PAGE.MODAL_CONTACT')}
            </Link>
            <button type="button" onClick={() => setZencardOpen(false)} className="btn bg-slate-100 text-slate-600 hover:bg-slate-200">
              {t('BON_PLAN_PAGE.MODAL_CLOSE')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Visionneuse */}
      <Modal open={current !== null} onClose={() => setIndex(null)} size="max-w-2xl" dark label={current ? t(current.titleKey) : ''}>
        {current && (
          <div className="flex flex-col items-center">
            <CloseButton light onClick={() => setIndex(null)} className="mb-4 self-end" />
            <div className="relative flex w-full items-center justify-center">
              <button type="button" onClick={() => go(-1)} aria-label="Précédent" className="absolute -left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/30 sm:-left-16">
                <i className="fa-solid fa-chevron-left" />
              </button>
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.image}
                  src={asset(current.image)}
                  alt={t(current.titleKey)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-[75vh] rounded-2xl object-contain shadow-2xl"
                />
              </AnimatePresence>
              <button type="button" onClick={() => go(1)} aria-label="Suivant" className="absolute -right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/30 sm:-right-16">
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>
            <p className="mt-5 rounded-full bg-black/40 px-5 py-2 text-sm font-semibold text-white/90">
              {t(current.titleKey)} · {index + 1}/{BON_PLANS.length}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
