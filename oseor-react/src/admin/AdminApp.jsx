import { useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAuth, useAuth } from './auth';
import { AdminCountsProvider } from './counts';
import { ToastProvider } from './ui';
import AdminLayout from './AdminLayout';
import Login from './Login';
import Dashboard from './Dashboard';
import Messages from './Messages';
import Candidatures from './Candidatures';
import Settings from './Settings';
import ResourcePage from './ResourcePage';
import { RESOURCES } from './resources';

const RESOURCE_ROUTES = [
  ['filiales', 'entreprises'],
  ['projets', 'projets'],
  ['expertises', 'services'],
  ['statistiques', 'stats'],
  ['secteurs', 'secteurs'],
  ['actualites', 'actualites'],
  ['offres', 'offres'],
  ['appels-offres', 'appelsOffres'],
];

function UsersPage() {
  const { user } = useAuth();
  // On ne peut pas supprimer son propre compte
  const config = useMemo(() => ({ ...RESOURCES.users, canDelete: (i) => i.email?.toLowerCase() !== user?.email?.toLowerCase() }), [user]);
  return <ResourcePage config={config} />;
}

function Protected() {
  return (
    <RequireAuth>
      <AdminCountsProvider>
        <AdminLayout />
      </AdminCountsProvider>
    </RequireAuth>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<Protected />}>
            <Route index element={<Dashboard />} />
            {RESOURCE_ROUTES.map(([path, key]) => (
              // key : une instance par section, pour ne pas mélanger les listes en changeant de page
              <Route key={path} path={path} element={<ResourcePage key={key} config={RESOURCES[key]} />} />
            ))}
            <Route path="messages" element={<Messages />} />
            <Route path="candidatures" element={<Candidatures />} />
            <Route path="utilisateurs" element={<UsersPage />} />
            <Route path="parametres" element={<Settings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
