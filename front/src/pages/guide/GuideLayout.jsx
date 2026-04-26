import { Link, useLocation } from 'react-router-dom';
import GuideSidebar from './GuideSidebar';

export default function GuideLayout({ children }) {
  const { pathname } = useLocation();
  const isIndex = pathname === '/guide';

  return (
    <div className="container-page py-6 sm:py-10" style={{ maxWidth: '900px' }}>
      {!isIndex && (
        <div className="mb-4 text-sm">
          <Link to="/guide" className="text-slate-500 hover:text-brand-700">
            ← 가이드 홈
          </Link>
        </div>
      )}

      <div className="flex gap-6 sm:gap-8">
        <GuideSidebar />
        <main className="flex-1 min-w-0" style={{ maxWidth: '640px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
