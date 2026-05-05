import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DevOperatorEditor from './components/DevOperatorEditor';
import { communityRoutes, guideRoutes } from './routes';
import { RoleProvider } from './lib/RoleContext';

const Home        = lazy(() => import('./pages/index'));
const EventDetail = lazy(() => import('./pages/events/[id]'));
const Me          = lazy(() => import('./pages/me/index'));
const Admin       = lazy(() => import('./pages/admin/index'));
const About       = lazy(() => import('./pages/about/index'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[40vh] text-slate-400 text-sm">
      불러오는 중...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <RoleProvider>
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/me"         element={<Me />} />
          <Route path="/admin"      element={<Admin />} />
          <Route path="/about"      element={<About />} />
          {communityRoutes.map(r => <Route key={r.path} path={r.path} element={r.element} />)}
          {guideRoutes.map(r => <Route key={r.path} path={r.path} element={r.element} />)}
        </Routes>
      </Suspense>
      <Footer />
      <DevOperatorEditor />
      </RoleProvider>
    </BrowserRouter>
  );
}
