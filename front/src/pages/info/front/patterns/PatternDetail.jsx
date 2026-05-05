import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import InfoLayout from '../../InfoLayout';
import { getPattern, getNeighbors, TIERS } from '@/data/patterns';

/**
 * /info/front/patterns/:tier/:id — 단일 패턴 상세.
 *
 * 37개 데모 모두 본 사이트로 이전 (source/front-patterns-guide-main → components/Tier{N}Demos.jsx).
 * Tier 단위 dynamic import (4 chunk) + 패턴 ID → 함수명 매핑.
 */

// Tier 단위 lazy 모듈 로더
const TIER_LOADERS = {
  1: () => import('./components/Tier1Demos'),
  2: () => import('./components/Tier2Demos'),
  3: () => import('./components/Tier3Demos'),
  4: () => import('./components/Tier4Demos'),
};

// 패턴 id → Tier{N}Demos.jsx 의 default export 객체 키 매핑 (37개)
const DEMO_NAME_MAP = {
  // Tier 1
  skeleton: 'SkeletonDemo', empty: 'EmptyStateDemo', toast: 'ToastDemo', pagination: 'PaginationDemo',
  micro: 'MicroDemo', focus: 'FocusDemo', modal: 'ModalDemo', drawer: 'DrawerDemo',
  dark: 'DarkModeDemo', zebra: 'ZebraDemo', sort: 'SortDemo', icon: 'IconDemo',
  // Tier 2
  'filter-chips': 'FilterChipsDemo', combobox: 'ComboboxDemo', 'date-range': 'DateRangeDemo',
  bulk: 'BulkActionDemo', sticky: 'StickyBarDemo', inline: 'InlineEditDemo',
  confirm: 'ConfirmDemo', undo: 'UndoSnackbarDemo', optimistic: 'OptimisticDemo',
  tabs: 'TabsDemo', segmented: 'SegmentedDemo', stepper: 'StepperDemo',
  master: 'MasterDetailDemo', tooltip: 'TooltipDemo', popover: 'PopoverDemo',
  cmdpal: 'CommandPaletteDemo', virtual: 'VirtualListDemo', debounce: 'DebounceDemo', lazy: 'LazyImageDemo',
  // Tier 3
  tokens: 'TokensDemo', grid: 'GridDemo', scale: 'ColorScaleDemo',
  // Tier 4
  'live-region': 'LiveRegionDemo', 'skip-link': 'SkipLinkDemo', 'color-blind': 'ColorBlindDemo',
};

function DemoRenderer({ tier, id }) {
  const [Demo, setDemo] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDemo(null);
    setError(false);
    const loader = TIER_LOADERS[tier];
    if (!loader) { setError(true); return; }
    loader()
      .then((mod) => {
        if (cancelled) return;
        const name = DEMO_NAME_MAP[id];
        const Comp = mod.default?.[name];
        if (Comp) setDemo(() => Comp);
        else setError(true);
      })
      .catch(() => !cancelled && setError(true));
    return () => { cancelled = true; };
  }, [tier, id]);

  if (error) {
    return (
      <div className="card p-4 sm:p-5 border-2 border-dashed border-rose-200 bg-rose-50 text-center">
        <p className="text-[13px] font-medium text-rose-700">데모 로드 실패</p>
        <p className="mt-1 text-[11px] text-rose-500">DEMO_NAME_MAP 또는 Tier 모듈 확인</p>
      </div>
    );
  }
  if (!Demo) return <div className="text-[12px] text-slate-400 p-4">데모 로딩…</div>;
  return <Demo />;
}

export default function PatternDetail() {
  const { tier: tierSlug, id } = useParams();
  const pattern = getPattern(id);

  if (!pattern) return <Navigate to="/info/front/patterns" replace />;

  // tierSlug 와 pattern.tier 정합 검증 (URL 잘못된 tier 면 올바른 tier 로 redirect)
  const expectedSlug = `tier${pattern.tier}`;
  if (tierSlug !== expectedSlug) {
    return <Navigate to={`/info/front/patterns/${expectedSlug}/${id}`} replace />;
  }

  const tier = TIERS.find((t) => t.num === pattern.tier);
  const { prev, next } = getNeighbors(id);

  return (
    <InfoLayout>
      <article>
        {/* 헤더 */}
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2 text-[12px]">
            <Link to="/info/front/patterns" className="text-brand-600 hover:underline">
              ← 패턴 카탈로그
            </Link>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">Tier {pattern.tier} · {tier?.title}</span>
          </div>
          <h1 className="text-[20px] sm:text-[26px] font-bold text-slate-900 leading-tight">
            <span className="text-slate-400 font-normal mr-2">{String(pattern.num).padStart(2, '0')}.</span>
            {pattern.title}
          </h1>
          <p className="mt-2 text-[13px] sm:text-[15px] text-slate-600 leading-relaxed">
            {pattern.lead}
          </p>
        </header>

        {/* 라이브 데모 — 본 사이트 React 컴포넌트 (Tier{N}Demos 동적 로드) */}
        <Section label="라이브 데모">
          <div className="card overflow-hidden bg-white">
            <DemoRenderer tier={pattern.tier} id={id} />
          </div>
        </Section>

        {/* Claude 프롬프트 */}
        <Section label="Claude 프롬프트 (이 패턴 적용할 때)">
          <div className="card p-4 sm:p-5 bg-brand-50/40 border-brand-200">
            <pre className="text-[12px] sm:text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed font-mono">{`내 [컴포넌트 이름]에 ${pattern.title} 패턴 적용해줘.
- 동작: ${pattern.lead}
- 라이브러리 추가 없이 React + CSS만으로
- 모바일 360~430px에서도 깨지지 않게`}</pre>
          </div>
        </Section>

        {/* 이전 / 다음 네비 */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              to={`/info/front/patterns/tier${prev.tier}/${prev.id}`}
              className="card p-3 sm:p-4 hover:border-brand-300 transition group"
            >
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-widest">← 이전</p>
              <p className="mt-1 text-[12px] sm:text-[13px] font-semibold text-slate-800 line-clamp-1">
                {String(prev.num).padStart(2, '0')}. {prev.title}
              </p>
            </Link>
          ) : <div />}
          {next ? (
            <Link
              to={`/info/front/patterns/tier${next.tier}/${next.id}`}
              className="card p-3 sm:p-4 hover:border-brand-300 transition group text-right"
            >
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-widest">다음 →</p>
              <p className="mt-1 text-[12px] sm:text-[13px] font-semibold text-slate-800 line-clamp-1">
                {String(next.num).padStart(2, '0')}. {next.title}
              </p>
            </Link>
          ) : <div />}
        </div>
      </article>
    </InfoLayout>
  );
}

function Section({ label, children }) {
  return (
    <section className="mb-6">
      <p className="text-[11px] font-bold tracking-widest text-brand-600 uppercase mb-2">{label}</p>
      {children}
    </section>
  );
}
