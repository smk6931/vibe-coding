import { Link } from 'react-router-dom';
import GuideLayout from './GuideLayout';

const SECTIONS = [
  {
    title: '원데이 클래스 — 4주차 미니홈피 시리즈',
    badge: '진행중',
    badgeColor: 'bg-amber-100 text-amber-700',
    desc: '1주차 수업을 베이스로 2~4주차까지 같은 프로젝트를 키워가는 연계 클래스. 1회만 들어도 결과물이 남고, 이어 들으면 본인 사이드프로젝트로 발전합니다.',
    links: [
      { label: '수업 전 준비 가이드', to: '/guide/oneday/install', active: true },
      { label: '1주차 교안 보기', to: '/guide/oneday/week1', active: true },
    ],
  },
];

const FOLDER_ROWS = [
  { depth: 0, icon: '📁', text: 'front/src/pages/guide/' },
  { depth: 1, icon: '📄', text: 'index.jsx', note: '← 지금 이 페이지', accent: true },
  { depth: 1, icon: '📄', text: 'GuideLayout.jsx', note: '공통 레이아웃' },
  { depth: 1, icon: '📁', text: 'oneday/' },
  { depth: 2, icon: '📄', text: 'Install.jsx', note: '→ /guide/oneday/install', to: '/guide/oneday/install' },
  { depth: 2, icon: '📄', text: 'Week1.jsx', note: '→ /guide/oneday/week1', to: '/guide/oneday/week1' },
  { depth: 2, icon: '📄', text: 'Week2~4.jsx', note: '→ /guide/oneday/week2~4 (준비중)' },
];

const NAV_ROWS = [
  { depth: 0, text: '지식', to: '/guide', active: true },
  { depth: 1, text: '원데이 클래스', group: true },
  { depth: 2, text: '수업 전 준비 가이드', to: '/guide/oneday/install' },
  { depth: 2, text: '1주차 — 미니홈피', to: '/guide/oneday/week1' },
  { depth: 2, text: '2~4주차', soon: true },
];

export default function GuideIndex() {
  return (
    <GuideLayout>
      <div>
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">강의 가이드</h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            바이브 코딩 모임에서 운영하는 강의 안내와 자료를 모아두었습니다.
          </p>
        </div>

        {/* 섹션 카드 */}
        <div className="space-y-3 mb-10">
          {SECTIONS.map(s => (
            <div key={s.title} className="card p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-1.5">
                <h2 className="font-bold text-slate-900 text-[15px]">{s.title}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.badgeColor}`}>{s.badge}</span>
              </div>
              <p className="text-slate-500 text-sm mb-3 leading-relaxed">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.links.map(l =>
                  l.active ? (
                    <Link key={l.to} to={l.to}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-brand-600 text-white text-[13px] font-semibold hover:bg-brand-700 transition-colors">
                      {l.label} →
                    </Link>
                  ) : (
                    <span key={l.to}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-[13px] font-semibold">
                      {l.label}
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 구조도 — 2열 (모바일 1열) */}
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">구조도</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 폴더 구조 */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <p className="text-[12px] font-semibold text-slate-500">폴더 구조</p>
            </div>
            <div className="p-4 bg-slate-900 font-mono text-[11px] leading-relaxed overflow-x-auto">
              {FOLDER_ROWS.map((row, i) => (
                <div
                  key={i}
                  className="flex items-baseline gap-1 min-w-max"
                  style={{ paddingLeft: `${row.depth * 14}px` }}
                >
                  <span className={row.accent ? 'text-amber-400' : row.depth === 0 ? 'text-slate-200' : 'text-slate-300'}>
                    {row.depth > 0 && <span className="text-slate-600 mr-1">{'├─'}</span>}
                    {row.text}
                  </span>
                  {row.note && (
                    row.to ? (
                      <Link to={row.to} className="text-emerald-400 hover:text-emerald-300 ml-1">{row.note}</Link>
                    ) : (
                      <span className={`ml-1 ${row.accent ? 'text-amber-600' : 'text-slate-600'}`}>{row.note}</span>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 사이드바 내비게이션 구조 */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <p className="text-[12px] font-semibold text-slate-500">사이드바 내비게이션</p>
            </div>
            <div className="p-4 font-mono text-[11px] leading-relaxed bg-white">
              {NAV_ROWS.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 py-0.5"
                  style={{ paddingLeft: `${row.depth * 14}px` }}
                >
                  {row.depth > 0 && (
                    <span className="text-slate-300 mr-0.5">{'├─'}</span>
                  )}
                  {row.to ? (
                    <Link to={row.to}
                      className={`hover:underline ${row.active ? 'text-brand-600 font-bold' : 'text-slate-700'}`}>
                      {row.text}
                    </Link>
                  ) : (
                    <span className={row.soon ? 'text-slate-400' : row.group ? 'text-slate-600 font-semibold' : 'text-slate-700'}>
                      {row.text}
                    </span>
                  )}
                  {row.soon && (
                    <span className="ml-1 text-[10px] text-slate-400">(준비중)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GuideLayout>
  );
}
