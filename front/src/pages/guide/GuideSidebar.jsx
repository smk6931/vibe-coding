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

function NavContent({ pathname, onNavigate }) {
  const isIndex = pathname === '/guide';
  return (
    <nav className="space-y-1">
      <Link
        to="/guide"
        onClick={onNavigate}
        className={`flex items-center px-2 py-2 rounded-lg text-[13px] transition-colors ${
          isIndex
            ? 'bg-brand-50 text-brand-700 font-semibold'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        가이드 홈
      </Link>

      <div className="space-y-4 pt-2">
        {NAV_GROUPS.map(g => {
          const isGroupActive = pathname.startsWith(g.base);
          return (
            <div key={g.base}>
              <Link
                to={g.items[0].to}
                onClick={onNavigate}
                className={`flex items-center gap-1.5 px-2 py-1 text-[12px] font-bold uppercase tracking-wide transition-colors ${
                  isGroupActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {isGroupActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                )}
                {g.label}
              </Link>
              <div className="mt-1 space-y-0.5">
                {g.items.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={`flex items-center justify-between pl-5 pr-3 py-2 rounded-lg text-[13px] transition-colors ${
                      pathname === item.to
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : item.soon
                        ? 'text-slate-400 pointer-events-none'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.soon && (
                      <span className="text-[10px] bg-slate-100 text-slate-400 rounded px-1.5 py-0.5 font-medium">
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
  const [open, setOpen] = useState(true);

  return (
    <div className="shrink-0 flex flex-col" style={{ width: open ? '13rem' : 'auto' }}>
      {/* 헤더 — 토글 버튼 포함 */}
      <div className="flex items-center justify-between mb-3 px-2 h-7">
        {open && (
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            강의 가이드
          </p>
        )}
        <button
          onClick={() => setOpen(v => !v)}
          title={open ? '목차 접기' : '목차 펼치기'}
          className="ml-auto p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          {open ? (
            /* 접기: 왼쪽 화살표 */
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          ) : (
            /* 펼치기: 목차 아이콘 */
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="15" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* 내비게이션 — 펼쳤을 때만 */}
      {open && (
        <NavContent
          pathname={pathname}
          /* 모바일처럼 작은 화면에서 링크 클릭 시 닫기 원하면 아래 주석 해제 */
          onNavigate={undefined}
        />
      )}
    </div>
  );
}
