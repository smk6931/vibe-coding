import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TIERS, getPatternsByTier } from '@/data/patterns';

/**
 * InfoSidebar — /info/* 도메인 좌측 네비.
 * 각 Tier 가 아코디언 — 펼치면 그 안의 패턴 번호+제목이 트리로 노출.
 * 현재 진입한 패턴이 속한 Tier 는 자동 펼침.
 */

function getCurrentTier(pathname) {
  const m = pathname.match(/\/info\/front\/patterns\/(tier\d+)/);
  return m ? m[1] : null;
}

function NavContent({ pathname, onNavigate }) {
  const isHubIndex = pathname === '/info';
  const isPatternsIndex = pathname === '/info/front/patterns';
  const currentTierSlug = getCurrentTier(pathname);

  // 각 Tier 펼침 상태 (현재 진입한 Tier 는 기본 펼침)
  const [openTiers, setOpenTiers] = useState(() => {
    const init = {};
    TIERS.forEach((t) => { init[t.slug] = t.slug === currentTierSlug; });
    return init;
  });

  function toggle(slug) {
    setOpenTiers((s) => ({ ...s, [slug]: !s[slug] }));
  }

  return (
    <nav className="space-y-1">
      <Link
        to="/info"
        onClick={onNavigate}
        className={`flex items-center px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
          isHubIndex
            ? 'bg-brand-50 text-brand-700 font-semibold'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        지식 홈
      </Link>

      <div className="space-y-3 pt-3">
        {/* 프론트엔드 */}
        <div>
          <Link
            to="/info/front/patterns"
            onClick={onNavigate}
            className={`flex items-center gap-1.5 px-3 mb-1 text-[11px] font-bold uppercase tracking-widest hover:text-brand-700 transition-colors ${
              isPatternsIndex || currentTierSlug ? 'text-brand-500' : 'text-slate-400'
            }`}
          >
            {(isPatternsIndex || currentTierSlug) && (
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
            )}
            프론트엔드 — UX 패턴
          </Link>

          {/* 카탈로그 진입 */}
          <Link
            to="/info/front/patterns"
            onClick={onNavigate}
            className={`block pl-6 pr-3 py-1.5 rounded-lg text-[12px] transition-colors ${
              isPatternsIndex
                ? 'bg-brand-50 text-brand-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            카탈로그 (4 Tier)
          </Link>

          {/* 4 Tier 트리 아코디언 */}
          <div className="mt-1 space-y-0.5">
            {TIERS.map((t) => {
              const open = openTiers[t.slug];
              const patterns = getPatternsByTier(t.num);
              const isActiveTier = currentTierSlug === t.slug;
              return (
                <div key={t.slug}>
                  <button
                    type="button"
                    onClick={() => toggle(t.slug)}
                    className={`w-full flex items-center justify-between pl-6 pr-2 py-1.5 rounded-lg text-[12px] transition-colors ${
                      isActiveTier
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-left flex-1 truncate">
                      Tier {t.num} — {t.title.split(' / ')[0].split(' (')[0]}
                    </span>
                    <span className="flex items-center gap-1 shrink-0 ml-1">
                      <span className="text-[10px] text-slate-400">{patterns.length}</span>
                      <svg
                        width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                        aria-hidden
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  {open && (
                    <ul className="mt-0.5 mb-1 ml-4 border-l border-slate-200 space-y-px">
                      {patterns.map((p) => {
                        const to = `/info/front/patterns/${t.slug}/${p.id}`;
                        const active = pathname === to;
                        return (
                          <li key={p.id}>
                            <Link
                              to={to}
                              onClick={onNavigate}
                              className={`block pl-3 pr-2 py-1 text-[11px] leading-snug transition-colors ${
                                active
                                  ? 'text-brand-700 font-semibold'
                                  : 'text-slate-500 hover:text-slate-900'
                              }`}
                            >
                              <span className="text-slate-400 mr-1.5 font-mono">{String(p.num).padStart(2, '0')}.</span>
                              {p.title.replace(/^\d+\.\s*/, '').replace(/\s*\(.*\)\s*$/, '')}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 백엔드 — 준비중 */}
        <div>
          <p className="px-3 mb-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            백엔드 (준비중)
          </p>
          <div className="space-y-0.5">
            {['Django 기초', 'PostgreSQL', '배포 트러블슈팅'].map((label) => (
              <div key={label} className="flex items-center justify-between pl-6 pr-3 py-1.5 rounded-lg text-[12px] text-slate-300 cursor-default">
                <span>{label}</span>
                <span className="text-[10px] bg-slate-100 text-slate-400 rounded px-1.5 py-0.5 font-medium shrink-0">준비중</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI 코딩 — 준비중 */}
        <div>
          <p className="px-3 mb-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            AI 코딩 (준비중)
          </p>
          <div className="space-y-0.5">
            {['Claude 활용', 'Cursor vs Claude Code', '프롬프트 엔지니어링'].map((label) => (
              <div key={label} className="flex items-center justify-between pl-6 pr-3 py-1.5 rounded-lg text-[12px] text-slate-300 cursor-default">
                <span>{label}</span>
                <span className="text-[10px] bg-slate-100 text-slate-400 rounded px-1.5 py-0.5 font-medium shrink-0">준비중</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function InfoSidebar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentLabel = useMemo(() => {
    if (pathname === '/info') return '지식 홈';
    if (pathname === '/info/front/patterns') return '카탈로그 (4 Tier)';
    const tierSlug = getCurrentTier(pathname);
    if (tierSlug) {
      const tierNum = Number(tierSlug.replace('tier', ''));
      const t = TIERS.find((x) => x.num === tierNum);
      return `Tier ${tierNum} — ${t?.title.split(' (')[0] ?? ''}`;
    }
    return '지식';
  }, [pathname]);

  return (
    <div>
      {/* 모바일(< 768px): 접이식 드롭다운 */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-700 shadow-sm"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="16" y2="12" />
              <line x1="3" y1="18" x2="12" y2="18" />
            </svg>
            <span className="truncate">{currentLabel}</span>
          </span>
          <svg
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {mobileOpen && (
          <div className="mt-2 border border-slate-200 rounded-xl bg-white p-3 shadow-md max-h-[70vh] overflow-y-auto">
            <NavContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        )}
      </div>

      {/* 데스크탑(768px+): 왼쪽 사이드바 항상 표시 */}
      <div className="hidden md:block">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4 px-3">
          지식
        </p>
        <NavContent pathname={pathname} />
      </div>
    </div>
  );
}
