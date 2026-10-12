import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api, setUnauthorizedHandler, tokenStore } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: tokenStore.get() ? 'checking' : 'anonymous', user: null, expired: false });

  const logout = useCallback((expired = false) => {
    tokenStore.clear();
    setState({ status: 'anonymous', user: null, expired });
  }, []);

  // Vérifie le jeton enregistré au chargement
  useEffect(() => {
    if (!tokenStore.get()) return;
    api
      .me()
      .then((user) => setState({ status: 'authenticated', user, expired: false }))
      .catch((err) => (err.status === 0 ? setState({ status: 'offline', user: null, expired: false }) : logout(true)));
  }, [logout]);

  useEffect(() => {
    setUnauthorizedHandler(() => logout(true));
    return () => setUnauthorizedHandler(() => {});
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const res = await api.login(email.trim(), password);
    if (res?.role !== 'ADMIN') throw new Error('Ce compte n’a pas accès à l’administration.');
    tokenStore.set(res.token);
    setState({ status: 'authenticated', user: { email: res.email, role: res.role }, expired: false });
  }, []);

  const retry = useCallback(() => {
    setState((s) => ({ ...s, status: 'checking' }));
    api
      .me()
      .then((user) => setState({ status: 'authenticated', user, expired: false }))
      .catch((err) => (err.status === 0 ? setState({ status: 'offline', user: null, expired: false }) : logout(true)));
  }, [logout]);

  const value = useMemo(() => ({ ...state, login, logout, retry }), [state, login, logout, retry]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

/** Protège les pages du tableau de bord. */
export function RequireAuth({ children }) {
  const { status, retry } = useAuth();
  const location = useLocation();

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <i className="fa-solid fa-spinner animate-spin text-3xl text-brand-blue" />
      </div>
    );
  }
  if (status === 'offline') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-50 px-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-red-light text-3xl text-brand-red">
          <i className="fa-solid fa-plug-circle-xmark" />
        </span>
        <h1 className="text-2xl font-bold">Serveur injoignable</h1>
        <p className="max-w-md text-slate-500">
          Le backend OSEOR ne répond pas. Lancez-le avec <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">run-backend.ps1</code> puis réessayez.
        </p>
        <button type="button" onClick={retry} className="btn-blue">
          <i className="fa-solid fa-rotate-right" /> Réessayer
        </button>
      </div>
    );
  }
  if (status !== 'authenticated') return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}
