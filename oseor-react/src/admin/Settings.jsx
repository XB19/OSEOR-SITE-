import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { api, API_URL } from '../lib/api';
import { Field, Alert } from '../components/Form';
import { useAuth } from './auth';
import { useAdminCounts } from './counts';
import { Badge, PageHeader, useToast } from './ui';

export default function Settings() {
  const { user, logout } = useAuth();
  const { online } = useAdminCounts();
  const notify = useToast();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const errors = {
    password: !form.password ? 'Ce champ est obligatoire' : form.password.length < 8 ? '8 caractères minimum' : null,
    confirm: form.confirm !== form.password ? 'Les mots de passe ne correspondent pas' : null,
  };
  const err = (k) => submitted && errors[k];

  const changePassword = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.password || errors.confirm) return;
    setBusy(true);
    try {
      // Le backend modifie les comptes via /api/admin/users/{id} : on retrouve le compte connecté
      const users = await api.admin.users.list();
      const me = users.find((u) => u.email?.toLowerCase() === user.email.toLowerCase());
      if (!me) throw new Error('Compte introuvable.');
      await api.admin.users.update(me.id, { email: me.email, role: me.role, password: form.password });
      setForm({ password: '', confirm: '' });
      setSubmitted(false);
      setDone(true);
      notify('Mot de passe modifié.');
    } catch (e2) {
      notify(e2.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader icon="fa-gear" title="Paramètres" description="Votre compte et la connexion au serveur." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-8 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-red to-brand-red-dark text-3xl font-bold uppercase text-white shadow-glow">
              {user?.email?.[0]}
            </span>
            <p className="mt-4 font-display text-lg font-bold">{user?.email}</p>
            <div className="mt-2">
              <Badge tone="red" icon="fa-shield-halved">Administrateur</Badge>
            </div>
            <button type="button" onClick={() => logout()} className="btn-outline mt-8 w-full">
              <i className="fa-solid fa-right-from-bracket" /> Se déconnecter
            </button>
          </div>
        </div>

        <form onSubmit={changePassword} noValidate className="card space-y-5 p-8 lg:col-span-2">
          <div>
            <h2 className="flex items-center gap-3 text-lg font-bold">
              <i className="fa-solid fa-key text-brand-red" /> Changer le mot de passe
            </h2>
            <p className="mt-1 text-sm text-slate-500">Utilisez au moins 8 caractères, idéalement avec chiffres et symboles.</p>
          </div>
          <AnimatePresence>{done && <Alert>Votre mot de passe a été mis à jour.</Alert>}</AnimatePresence>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nouveau mot de passe" required error={err('password')}>
              <input type="password" autoComplete="new-password" className={`field ${err('password') ? 'field-error' : ''}`} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
            </Field>
            <Field label="Confirmation" required error={err('confirm')}>
              <input type="password" autoComplete="new-password" className={`field ${err('confirm') ? 'field-error' : ''}`} value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} />
            </Field>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={busy} className="btn-blue">
              {busy ? <i className="fa-solid fa-spinner animate-spin" /> : <i className="fa-solid fa-check" />} Mettre à jour
            </button>
          </div>
        </form>

        <div className="card p-8 lg:col-span-3">
          <h2 className="flex items-center gap-3 text-lg font-bold">
            <i className="fa-solid fa-server text-brand-red" /> Serveur
          </h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">État</dt>
              <dd className="mt-2">{online === false ? <Badge tone="red" icon="fa-circle-xmark">Hors ligne</Badge> : <Badge tone="green" icon="fa-circle-check">En ligne</Badge>}</dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Adresse de l’API</dt>
              <dd className="mt-2 font-mono text-sm text-slate-700">{API_URL}</dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Session</dt>
              <dd className="mt-2 text-sm text-slate-700">Expire 24 h après la connexion</dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
