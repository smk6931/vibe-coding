import InfoSidebar from './InfoSidebar';

/**
 * InfoLayout — /info/* 도메인 공통 레이아웃.
 * GuideLayout 과 폼팩터 동일, 사이드바만 InfoSidebar.
 */
export default function InfoLayout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="md:grid md:gap-8 lg:gap-12" style={{ gridTemplateColumns: '200px 1fr' }}>
        <aside>
          <div className="md:sticky md:top-24">
            <InfoSidebar />
          </div>
        </aside>
        <main className="mt-4 md:mt-0 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
