import { Link, useLocation } from 'react-router-dom';
import GuideSidebar from './GuideSidebar';

export default function GuideLayout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="md:grid md:gap-8 lg:gap-12" style={{ gridTemplateColumns: '200px 1fr' }}>
        {/* 사이드바 — md(768px) 이상에서 왼쪽 고정 */}
        <aside>
          <div className="md:sticky md:top-24">
            <GuideSidebar />
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="mt-4 md:mt-0 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
