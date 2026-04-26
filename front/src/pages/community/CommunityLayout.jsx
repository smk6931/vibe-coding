import { Link, useLocation } from 'react-router-dom';

const TABS = [
  { href: '/community',         label: '쇼케이스' },
  { href: '/community/board',   label: '게시판' },
  { href: '/community/qa',      label: 'Q&A' },
  { href: '/community/members', label: '회원' },
];

export default function CommunityLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="container-wide py-5 sm:py-8">
      <header className="mb-4">
        <h1 className="page-title">커뮤니티</h1>
      </header>
      <nav className="flex gap-1 mb-5 border-b border-slate-100 pb-1">
        {TABS.map(t => {
          const active = pathname === t.href;
          return (
            <Link key={t.href} to={t.href}
              className={`px-4 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${
                active ? 'text-brand-700 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-800'
              }`}>
              {t.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
