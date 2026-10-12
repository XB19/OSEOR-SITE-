import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EASE } from '../components/Motion';
import { asset } from '../lib/asset';
import { SECTORS } from '../data/companies';
import { useSiteData } from '../lib/siteData';

const MotionLink = motion.create(Link);

export default function Hero() {
  const { t, i18n } = useTranslation();
  const { companies } = useSiteData();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const words = t('HERO.TITLE').split(' ');

  return (
    <section ref={ref} className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-brand-navy pt-[76px] md:min-h-screen md:pt-[124px]">
      {/* Image de fond en parallaxe + zoom lent */}
      <motion.div style={{ y: imageY }} className="absolute inset-0 -z-20">
        <img src={asset('assets/images/hero-business.jpg')} alt="" className="h-full w-full origin-[62%_25%] animate-kenburns object-cover object-[62%_12%]" />
      </motion.div>
      {/* Dégradé bleu OSEOR (repris de l'original) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(90deg, rgba(3,110,177,0.96) 0%, rgba(3,110,177,0.86) 34%, rgba(3,110,177,0.35) 54%, rgba(3,110,177,0.08) 72%, rgba(11,42,74,0.15) 100%)',
        }}
      />
      <div className="bg-dots absolute inset-0 -z-10 opacity-30" />
      <motion.div
        className="absolute -right-32 top-1/4 -z-10 h-[28rem] w-[28rem] rounded-full bg-brand-red/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-x grid items-center gap-10 py-10 md:py-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" />
            </span>
            {t('HERO.BADGE')}
          </motion.span>

          <h1 key={i18n.language} className="mt-5 max-w-[12.5em] text-4xl font-bold leading-[1.08] !text-white sm:text-5xl lg:text-[3.4rem] xl:text-[3.75rem]">
            {words.map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: EASE }}
                >
                  {word}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg"
          >
            {t('HERO.DESCRIPTION')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link to="/#expertises" className="btn-red group !px-8 !py-4">
              {t('HERO.BUTTON')}
              <i className="fa-solid fa-arrow-down transition-transform group-hover:translate-y-0.5" />
            </Link>
            <Link to="/#entreprises" className="btn-ghost !px-8 !py-4">
              {t('HERO.SECONDARY')}
            </Link>
          </motion.div>
        </div>

        {/* Carte flottante : aperçu du portefeuille */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: EASE }}
          className="hidden lg:col-span-4 lg:block lg:self-end"
        >
          <div className="ml-auto max-w-[19rem] animate-float rounded-3xl border border-white/20 bg-brand-navy/30 p-4 shadow-2xl backdrop-blur-xl">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-white/80">{t('PARTICIPATIONS.TITLE')}</p>
            <div className="mt-3 space-y-2">
              {SECTORS.map((s, i) => {
                const count = companies.filter((c) => c.sector === s.slug).length;
                return (
                  <motion.div
                    key={s.slug}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.12, duration: 0.6, ease: EASE }}
                  >
                    <Link
                      to={`/secteurs/${s.slug}`}
                      className="group flex items-center gap-3 rounded-2xl bg-white/95 px-3 py-2.5 transition hover:-translate-y-0.5 hover:bg-white"
                    >
                      <span className="flex h-9 w-9 text-sm items-center justify-center rounded-xl bg-brand-blue text-white transition group-hover:bg-brand-red">
                        <i className={`fa-solid ${s.icon}`} />
                      </span>
                      <span className="flex-1">
                        <span className="block font-display font-bold text-brand-ink">{t(s.labelKey)}</span>
                        <span className="text-xs text-slate-500">{t('SECTEURS_EXTRA.COMPANIES_COUNT', { count })}</span>
                      </span>
                      <i className="fa-solid fa-arrow-right text-sm text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-red" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Indicateur de défilement */}
      <MotionLink
        to="/#stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70 min-[1400px]:flex"
      >
        {t('HERO.SCROLL')}
        <span className="flex h-10 w-6 justify-center rounded-full border-2 border-white/40 pt-2">
          <motion.span className="h-2 w-1 rounded-full bg-white" animate={{ y: [0, 12, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
        </span>
      </MotionLink>
    </section>
  );
}
