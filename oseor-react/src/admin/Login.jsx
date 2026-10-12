import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../components/Logo';
import { EASE } from '../components/Motion';
import { Alert } from '../components/Form';
import { asset } from '../lib/asset';
import { useAuth } from './auth';

export default function Login() {
  const { status, login, expired } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Connexion · Admin OSEOR';
  }, []);

  if (status === 'authenticated') return <Navigate to={location.state?.from || '/admin'} replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Renseignez votre e-mail et votre mot de passe.');
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.status === 0 ? err.message : err.status === 401 || err.status === 403 ? 'E-mail ou mot de passe incorrect.' : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Panneau visuel */}
      <div className="relative hidden overflow-hidden bg-brand-navy lg:block">
        <motion.img
          src={asset('assets/images/hero-business.jpg')}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[62%_15%]"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: EASE }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/95 via-brand-blue/75 to-brand-navy/80" />
        <div className="bg-dots absolute inset-0 opacity-40" />
        <motion.div
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-red/40 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="inline-flex w-fit rounded-2xl bg-white px-4 py-2 shadow-xl">
            <Logo className="h-12" />
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur">
              <i className="fa-solid fa-shield-halved" /> Espace administration
            </span>
            <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight !text-white xl:text-5xl">Gérez le site OSEOR en toute simplicité.</h1>
            <p className="mt-4 max-w-md text-white/80">Filiales, projets, offres d’emploi, appels d’offres, actualités et messages : tout se met à jour en direct sur le site.</p>
          </motion.div>
          <p className="text-xs text-white/50">© 2026 OSEOR SA · Lomé, Togo</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="w-full max-w-md">
          <Link to="/" className="mb-10 inline-block lg:hidden">
            <Logo className="h-14" />
          </Link>
          <span className="eyebrow">Admin OSEOR</span>
          <h2 className="mt-3 text-3xl font-bold">Connexion</h2>
          <p className="mt-2 text-slate-500">Connectez-vous pour gérer le contenu du site.</p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-5">
            <AnimatePresence>
              {error && <Alert type="error">{error}</Alert>}
              {!error && expired && <Alert type="error">Votre session a expiré, reconnectez-vous.</Alert>}
            </AnimatePresence>

            <div>
              <label className="label" htmlFor="email">E-mail professionnel</label>
              <div className="relative">
                <i className="fa-solid fa-envelope pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="field pl-11" placeholder="admin@oseor.tg" autoFocus />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="password">Mot de passe</label>
              <div className="relative">
                <i className="fa-solid fa-lock pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field pl-11 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:text-brand-blue"
                >
                  <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={busy} className="btn-blue w-full !py-4">
              {busy ? <i className="fa-solid fa-spinner animate-spin" /> : <i className="fa-solid fa-right-to-bracket" />}
              Se connecter
            </button>
          </form>

          <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-brand-blue">
            <i className="fa-solid fa-arrow-left text-xs" /> Retour au site
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
