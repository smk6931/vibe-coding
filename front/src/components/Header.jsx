import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../lib/RoleContext';

const MAIN_NAV = [
  { href: '/',          label: '모임' },
  { href: '/guide',     label: '지식' },
  { href: '/community', label: '커뮤니티' },
];

const KAKAO_URL = import.meta.env.VITE_KAKAO_OPENCHAT_URL || '#';

export default function Header() {
  const location = useLocation();
  const { role, toggleRole } = useRole();

  function isActive(href) {
    if (href === '/') return location.pathname === '/';
    return location.pathname === href || location.pathname.startsWith(href + '/');
  }

  return (
    <header className="bg-white/95 backdrop-blur border-b border-slate-100 sticky top-0 z-40">
      <div className="container-wide h-11 sm:h-13 flex items-center gap-1">
        <Link to="/" className="flex items-center gap-1.5 shrink-0 mr-1 sm:mr-2" aria-label="바이브 세션 홈">
          <img src="/favicon.svg" alt="" width={22} height={22} className="rounded" />
          <span className="hidden xs:inline text-slate-800 text-[13px] sm:text-[15px] font-bold tracking-tight">
            바이브 세션
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 flex-1" aria-label="메인 메뉴">
          {MAIN_NAV.map(n => (
            <Link
              key={n.href}
              to={n.href}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-[13px] sm:text-[14px] font-medium transition-colors ${
                isActive(n.href)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {import.meta.env.DEV && (
            <button
              onClick={toggleRole}
              title="뷰 전환 (로컬 전용)"
              className={`mr-1 px-2 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                role === 'admin'
                  ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {role === 'admin' ? '교안' : '프롤로그'}
            </button>
          )}
          <Link to="/me" title="마이" aria-label="마이"
            className={`p-1.5 rounded-lg transition-colors ${
              isActive('/me') ? 'bg-brand-50 text-brand-700' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
            }`}>
            <svg className="w-[17px] h-[17px] sm:w-[19px] sm:h-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>
          <Link to="/admin" title="어드민" aria-label="어드민"
            className={`p-1.5 rounded-lg transition-colors ${
              isActive('/admin') ? 'bg-brand-50 text-brand-700' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
            }`}>
            <svg className="w-[17px] h-[17px] sm:w-[19px] sm:h-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
          <a href={KAKAO_URL} target="_blank" rel="noreferrer"
            className="ml-1 inline-flex items-center px-2.5 py-1.5 rounded-lg text-[12px] sm:text-[13px] font-semibold bg-slate-900 text-white hover:bg-slate-700 transition-colors">
            채팅
          </a>
        </div>
      </div>
    </header>
  );
}
