import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_GROUPS = [
  {
    label: '원데이 클래스',
    base: '/guide/oneday',
    items: [
      { to: '/guide/oneday/install', label: '수업 전 준비 가이드' },
      { to: '/guide/oneday/preview', label: '강의 맛보기' },
    ],
  },
  {
    label: '4주차 미니홈피 클래스',
    base: '/guide/oneday/week',
    items: [
      { to: '/events/evt-001', label: '1강 — 환경세팅 + 첫 웹페이지' },
      { to: '/guide/oneday/week2', label: '2강 — 미니홈피 프로필', soon: true },
      { to: '/guide/oneday/week3', label: '3강 — 카드 + 다이어리', soon: true },
      { to: '/guide/oneday/week4', label: '4강 — 꾸미기 + 배포', soon: true },
    ],
  },
  {
    label: '입문',
    base: '/guide/beginner',
    items: [{ to: '/guide/beginner', label: '강의 목록', soon: true }],
  },
  {
    label: 'Claude 활용',
    base: '/guide/claude',
    items: [{ to: '/guide/claude', label: '강의 목록', soon: true }],
  },
];

function getCurrentLabel(pathname) {
  if (pathname === '/guide') return '가이드 홈';
  for (const g of NAV_GROUPS) {
    for (const item of g.items) {
      if (pathname === item.to) return item.label;
    }
    if (pathname.startsWith(g.base)) return g.label;
  }
  return '강의 가이드';
}

function NavContent({ pathname, onNavigate }) {
  const isIndex = pathname === '/guide';
  return (
    <nav className="space-y-1">
      <Link
        to="/guide"
        onClick={onNavigate}
        className={`flex items-center px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
          isIndex
            ? 'bg-brand-50 text-brand-700 font-semibold'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        가이드 홈
      </Link>

      <div className="space-y-5 pt-3">
        {NAV_GROUPS.map(g => {
          const isGroupActive = pathname.startsWith(g.base);
          return (
            <div key={g.base}>
              <div className={`flex items-center gap-1.5 px-3 mb-1 text-[11px] font-bold uppercase tracking-widest ${
                isGroupActive ? 'text-brand-500' : 'text-slate-400'
              }`}>
                {isGroupActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                )}
                {g.label}
              </div>
              <div className="space-y-0.5">
                {g.items.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={!item.soon ? onNavigate : undefined}
                    className={`flex items-center justify-between pl-6 pr-3 py-2 rounded-lg text-[13px] transition-colors ${
                      pathname === item.to
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : item.soon
                        ? 'text-slate-300 pointer-events-none cursor-default'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.soon && (
                      <span className="text-[10px] bg-slate-100 text-slate-400 rounded px-1.5 py-0.5 font-medium shrink-0">
                        준비중
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export default function GuideSidebar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentLabel = getCurrentLabel(pathname);

  return (
    <div>
      {/* 모바일(< 768px): 접이식 드롭다운 */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-700 shadow-sm"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="16" y2="12" />
              <line x1="3" y1="18" x2="12" y2="18" />
            </svg>
            <span>{currentLabel}</span>
          </span>
          <svg
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {mobileOpen && (
          <div className="mt-2 border border-slate-200 rounded-xl bg-white p-3 shadow-md">
            <NavContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        )}
      </div>

      {/* 데스크탑(768px+): 왼쪽 사이드바 항상 표시 */}
      <div className="hidden md:block">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4 px-3">
          강의 가이드
        </p>
        <NavContent pathname={pathname} />
      </div>
    </div>
  );
}
