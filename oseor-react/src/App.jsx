import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ScrollManager from './components/ScrollManager';
import { PageTransition } from './components/Motion';
import { SiteDataProvider } from './lib/siteData';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Sector from './pages/Sector';
import BonPlan from './pages/BonPlan';
import AppelsOffres from './pages/AppelsOffres';
import { OffresEmploi, CandidatureSpontanee } from './pages/Careers';

// Le tableau de bord n'est chargé que lorsqu'on visite /admin
const AdminApp = lazy(() => import('./admin/AdminApp'));

// Mêmes routes que le projet Angular d'origine
const ROUTES = [
  { path: '/', element: <Home /> },
  { path: '/a-propos', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/bon-plan', element: <BonPlan /> },
  { path: '/appels-offres', element: <AppelsOffres /> },
  { path: '/carrieres/offres', element: <OffresEmploi /> },
  { path: '/carrieres/candidature', element: <CandidatureSpontanee /> },
  { path: '/secteurs/:slug', element: <Sector /> },
];

function PublicSite() {
  const location = useLocation();
  return (
    <>
      <Header />
      <ScrollManager />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
        <Routes location={location} key={location.pathname}>
          {ROUTES.map((r) => (
            <Route key={r.path} path={r.path} element={<PageTransition>{r.element}</PageTransition>} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <BackToTop />
    </>
  );
}

function AdminLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <i className="fa-solid fa-spinner animate-spin text-3xl text-brand-blue" />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SiteDataProvider>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route path="/*" element={<PublicSite />} />
        </Routes>
      </SiteDataProvider>
    </MotionConfig>
  );
}
