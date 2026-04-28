
import { useMemo, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';
import Accordion from './Accordion';
import MiniHompy from '../pages/guide/oneday/MiniHompy';
import dynamic from '@/lib/dynamic';
import { formatDateTime, formatKRW, dDay, eventTypeLabel } from '@/lib/format';

const LeafletMultiMap = dynamic(
  () => import('./LeafletMap').then(m => m.LeafletMultiMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[320px] rounded-xl border border-slate-200 bg-slate-50 grid place-items-center text-sm text-slate-400">
        지도 로딩 중...
      </div>
    ),
  }
);

const DATE_FILTERS = [
  { v: 'all',       l: '날짜 전체' },
  { v: 'today',     l: '오늘' },
  { v: 'thisWeek',  l: '이번 주' },
  { v: 'nextWeek',  l: '다음 주' },
  { v: 'thisMonth', l: '이번 달' },
];

const REGIONS = ['전체', '수도권', '충청', '영남', '호남', '제주'];
const TYPES = [
  { v: 'all',          l: '전체 유형' },
  { v: 'oneday_class', l: '원데이 클래스' },
  { v: 'study',        l: '스터디' },
  { v: 'hackathon',    l: '해커톤' },
  { v: 'seminar',      l: '세미나' },
];
const PRICES = [
  { v: 'all',  l: '가격 전체' },
  { v: 'free', l: '무료' },
  { v: 'low',  l: '~1만원' },
  { v: 'mid',  l: '2~3만원' },
  { v: 'high', l: '4만원+' },
];

const BEGINNER_STEPS = [
  { n: 1, t: '지도 또는 카드에서 모임을 골라요', d: '동네·날짜로 필터링하면 빨라요.' },
  { n: 2, t: '상세 페이지에서 후기·난이도 확인', d: '"코딩 처음"인 분도 환영합니다.' },
  { n: 3, t: '신청 폼 작성 (이름·연락처·동기 한 줄)', d: '운영자가 카톡으로 안내드려요.' },
  { n: 4, t: '입금 안내 받고 토스 송금', d: '카드결제는 Phase 2에 도입 예정.' },
  { n: 5, t: '당일 모여서 함께 코딩', d: '구경만 하셔도 OK.' },
];

const TESTIMONIALS = [
  { name: '도리 / 출판사 기획자', text: '비전공자라 망설였는데 2시간 만에 사이드프로젝트 첫 화면이 나왔어요. 부담 없는 분위기가 좋았어요.' },
  { name: '수민 / 대학생', text: '강의도 좋았지만 같이 듣는 분들이랑 카톡방에서 이어가는 게 더 좋았어요.' },
  { name: '민지 / 마케터', text: '코딩 처음이었는데 운영자 분이 한 명 한 명 챙겨주셔서 끝까지 따라갈 수 있었어요.' },
];

function startOfDay(d) {
  const x = new Date(d); x.setHours(0, 0, 0, 0); return x;
}
function inDateRange(ed, filter, now) {
  if (filter === 'all') return true;
  const t = startOfDay(now);
  if (filter === 'today') {
    const t2 = new Date(t); t2.setDate(t.getDate() + 1);
    return ed >= t && ed < t2;
  }
  const dow = t.getDay();
  const sun0 = new Date(t); sun0.setDate(t.getDate() - dow);
  const sun1 = new Date(sun0); sun1.setDate(sun0.getDate() + 7);
  const sun2 = new Date(sun1); sun2.setDate(sun1.getDate() + 7);
  if (filter === 'thisWeek') return ed >= sun0 && ed < sun1;
  if (filter === 'nextWeek') return ed >= sun1 && ed < sun2;
  if (filter === 'thisMonth')
    return ed.getFullYear() === t.getFullYear() && ed.getMonth() === t.getMonth();
  return true;
}

export default function HomeClient({ events, kakaoOpenChatUrl }) {
  const [dateFilter, setDateFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [region, setRegion] = useState('전체');
  const [type, setType] = useState('all');
  const [price, setPrice] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [calModal, setCalModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const dateRef = useRef(null);

  const today = useMemo(() => new Date('2026-04-25T12:00:00+09:00'), []);

  // 날짜 드롭다운 바깥 클릭 닫기
  useEffect(() => {
    function handler(e) {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setDateOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    return events.filter(e => {
      const ed = new Date(e.startAt);
      if (sourceFilter !== 'all' && e.source !== sourceFilter) return false;
      if (region !== '전체' && e.region !== region) return false;
      if (type !== 'all' && e.type !== type) return false;
      if (price === 'free' && e.price !== 0) return false;
      if (price === 'low' && (e.price === 0 || e.price > 10000)) return false;
      if (price === 'mid' && (e.price < 20000 || e.price > 39999)) return false;
      if (price === 'high' && e.price < 40000) return false;
      if (!inDateRange(ed, dateFilter, today)) return false;
      return true;
    }).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [events, dateFilter, sourceFilter, region, type, price, today]);

  const internalCount = filtered.filter(e => e.source === 'internal').length;
  const externalCount = filtered.length - internalCount;

  const recommended = useMemo(() => {
    return events
      .filter(e => e.source === 'internal' && new Date(e.startAt) >= today)
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0] ?? null;
  }, [events, today]);

  const filterCount = (region !== '전체' ? 1 : 0) + (type !== 'all' ? 1 : 0) + (price !== 'all' ? 1 : 0);
  const activeDateLabel = DATE_FILTERS.find(f => f.v === dateFilter)?.l ?? '날짜 전체';

  return (
    <div>
      {/* === 캘린더 모달 === */}
      {calModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setCalModal(false)}
        >
          <div
            className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-bold text-[15px] text-slate-900">캘린더</span>
              <button onClick={() => setCalModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-label="닫기"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-4">
              <CalendarView events={filtered} today={today} />
            </div>
          </div>
        </div>
      )}

      {/* === 컴팩트 히어로 === */}
      <section className="bg-white border-b border-slate-100">
        <div className="container-wide pt-4 pb-3">
          <h1 className="text-[20px] sm:text-2xl font-bold tracking-tight text-slate-900">
            지금 이 동네에서, <span className="text-brand-600">뭐 하지</span>
          </h1>
          <p className="mt-0.5 text-[12px] text-slate-500">
            수원·서울 라이트 클래스 + 수도권 외부 모임을 지도·카드로 한눈에.
          </p>

          {/* 통계 + 자체/외부 토글 + 필터 */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-[12px] text-slate-500">
              <strong className="text-slate-800">{filtered.length}</strong>건
            </span>
            <span className="badge bg-warm-50 text-warm-600 border border-warm-100 text-[11px]">★ 자체 {internalCount}</span>
            <span className="badge bg-slate-100 text-slate-600 text-[11px]">외부 {externalCount}</span>

            <div className="ml-auto flex items-center gap-1.5">
              {/* 필터 버튼 */}
              <button
                onClick={() => setFilterOpen(o => !o)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium border transition-colors ${
                  filterCount > 0
                    ? 'border-brand-300 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FilterIcon className="w-3.5 h-3.5" />
                필터
                {filterCount > 0 && (
                  <span className="inline-block min-w-[14px] h-4 leading-4 px-1 rounded-full bg-brand-600 text-white text-[10px] text-center">{filterCount}</span>
                )}
              </button>

              {/* 자체/외부 토글 */}
              <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                {[['all', '전체'], ['internal', '★ 자체'], ['external', '외부']].map(([v, l]) => (
                  <button key={v} onClick={() => setSourceFilter(v)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      sourceFilter === v ? 'bg-brand-600 text-white' : 'text-slate-500'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 필터 상세 패널 */}
          {filterOpen && (
            <div className="card p-3 mt-2 space-y-2">
              <FilterRow label="지역">{REGIONS.map(r => (
                <button key={r} onClick={() => setRegion(r)} className={region === r ? 'chip-active' : 'chip'}>{r}</button>
              ))}</FilterRow>
              <FilterRow label="유형">{TYPES.map(o => (
                <button key={o.v} onClick={() => setType(o.v)} className={type === o.v ? 'chip-active' : 'chip'}>{o.l}</button>
              ))}</FilterRow>
              <FilterRow label="가격">{PRICES.map(o => (
                <button key={o.v} onClick={() => setPrice(o.v)} className={price === o.v ? 'chip-active' : 'chip'}>{o.l}</button>
              ))}</FilterRow>
              <div className="flex justify-end">
                <button onClick={() => { setRegion('전체'); setType('all'); setPrice('all'); }}
                  className="text-xs text-slate-400 hover:text-rose-500">초기화</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* === 운영자 추천 + 준비가이드 === */}
      <section className="container-wide pt-3">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <GuidePreviewCard />
          {recommended && <RecommendedHero event={recommended} />}
        </div>
      </section>

      {/* === 메인 콘텐츠 === */}
      <section className="container-wide pt-3 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_minmax(300px,1fr)] gap-4 sm:gap-5">

          {/* 왼쪽 */}
          <div className="order-2 lg:order-1 min-w-0 space-y-0">

            {/* 지도 — 모바일 아코디언 */}
            <div className="lg:hidden">
              <Accordion title="지도" count={filtered.length} defaultOpen={true}>
                <div className="h-[360px] pb-2">
                  <LeafletMultiMap events={filtered} selectedId={selectedId} onSelect={setSelectedId} fillHeight />
                </div>
                <MapLegend />
              </Accordion>
            </div>

            {/* 이벤트 목록 + 날짜 드롭다운 + 리스트/캘린더 토글 */}
            <Accordion title="이벤트 목록" count={filtered.length} defaultOpen={true}>
              <div className="flex items-center gap-2 pt-2 pb-3 flex-wrap">
                {/* 날짜 드롭다운 버튼 */}
                <div className="relative" ref={dateRef}>
                  <button
                    onClick={() => setDateOpen(o => !o)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${
                      dateFilter !== 'all'
                        ? 'border-brand-300 bg-brand-50 text-brand-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CalIcon className="w-3.5 h-3.5" />
                    {activeDateLabel}
                    <svg className={`w-3 h-3 transition-transform ${dateOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>

                  {/* 드롭다운 */}
                  {dateOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-30 min-w-[140px]">
                      {DATE_FILTERS.map(f => (
                        <button key={f.v} onClick={() => { setDateFilter(f.v); setDateOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-medium transition-colors ${
                            dateFilter === f.v ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                          }`}>
                          {f.l}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 캘린더 모달 버튼 */}
                <button
                  onClick={() => setCalModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[12px] font-medium hover:bg-slate-50 transition-colors"
                >
                  <CalIcon className="w-3.5 h-3.5" />
                  캘린더로 보기
                </button>
              </div>

              <CardsGrid events={filtered} selectedId={selectedId} onHover={setSelectedId} kakaoOpenChatUrl={kakaoOpenChatUrl} />
            </Accordion>

            {/* 처음이세요? — 모바일만 */}
            <div className="lg:hidden">
              <Accordion title="처음이세요?" defaultOpen={false}>
                <div className="py-2">
                  <BeginnerGuide kakaoOpenChatUrl={kakaoOpenChatUrl} />
                </div>
              </Accordion>
            </div>
          </div>

          {/* 오른쪽 sticky (데스크탑) */}
          <aside className="order-1 lg:order-2 hidden lg:flex flex-col gap-3 lg:sticky lg:top-[52px] lg:self-start lg:max-h-[calc(100vh-72px)]">
            <div className="flex-1 min-h-[300px] flex flex-col">
              <div className="flex-1 min-h-[300px]">
                <LeafletMultiMap events={filtered} selectedId={selectedId} onSelect={setSelectedId} fillHeight />
              </div>
              <MapLegend />
            </div>
            <div className="card p-4">
              <h3 className="text-[13px] font-bold text-slate-800 mb-2.5">처음이세요?</h3>
              <BeginnerGuide kakaoOpenChatUrl={kakaoOpenChatUrl} compact />
            </div>
          </aside>
        </div>
      </section>

      {/* === 후기 === */}
      <section className="bg-slate-50/60 border-y border-slate-100">
        <div className="container-wide py-8 sm:py-12">
          <h2 className="section-title mb-4">먼저 와 보신 분들 한 마디</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {TESTIMONIALS.map((t, i) => (
              <blockquote key={i} className="card p-4 sm:p-5 text-[13.5px] leading-relaxed">
                <p className="text-slate-800">"{t.text}"</p>
                <footer className="mt-3 text-xs text-slate-500">— {t.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="container-wide py-8 sm:py-12">
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-12 text-center">
          <h2 className="text-lg sm:text-2xl font-bold">"구경하러 왔어요" 한 줄이면 됩니다.</h2>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <a href={kakaoOpenChatUrl} target="_blank" rel="noreferrer"
              className="btn bg-white text-slate-900 hover:bg-slate-100 px-5 py-2.5 font-semibold">
              오픈채팅 들어가기
            </a>
            <Link to="/library" className="btn border border-white/30 text-white hover:bg-white/10 px-5 py-2.5">
              지식 보러 가기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================ */

function FilterRow({ label, children }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function MapLegend() {
  return (
    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 px-0.5">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-brand-600 inline-block" />★ 자체</span>
        <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />외부</span>
      </div>
      <span className="text-slate-400">카드 ⇄ 핀 동기화</span>
    </div>
  );
}

function GuidePreviewCard() {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden flex flex-col border-brand-200">
      <Link to="/guide/oneday/install" className="block relative overflow-hidden h-[150px] sm:h-[170px] shrink-0">
        <div style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%) scale(0.42)',
          transformOrigin: 'top center',
          width: '380px', pointerEvents: 'none',
        }}>
          <MiniHompy />
        </div>
        <span className="absolute top-2 left-2 badge bg-brand-600 text-white text-[9px] sm:text-[10px] font-semibold">수업 전 준비</span>
      </Link>
      <div className="p-2 sm:p-3 flex flex-col flex-1">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full text-left font-bold text-[12px] sm:text-[13px] text-slate-900 leading-snug flex items-start justify-between gap-1"
        >
          <span className="line-clamp-2">수업 전 준비 가이드 — VSCode · Claude Code 설치</span>
          <svg className={`w-3 h-3 shrink-0 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        {open ? (
          <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">
            GitHub · VSCode · Node.js 설치부터 Claude Code 또는 Codex 연결까지 단계별로 안내해 드려요.
          </p>
        ) : (
          <span className="mt-1 text-[10px] text-brand-600 font-medium">가이드 보러 가기 →</span>
        )}
      </div>
    </div>
  );
}

function RecommendedHero({ event }) {
  const [open, setOpen] = useState(false);
  const sold = event.remaining === 0;
  return (
    <div className="card overflow-hidden flex flex-col border-warm-200">
      <Link to={`/events/${event.id}`} className="block relative overflow-hidden h-[130px] sm:h-[160px] shrink-0">
        <div style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%) scale(0.42)',
          transformOrigin: 'top center',
          width: '380px', pointerEvents: 'none',
        }}>
          <MiniHompy />
        </div>
        <span className="absolute top-2 left-2 badge bg-warm-500 text-white text-[9px] sm:text-[10px] font-semibold z-10">★ 운영자 추천</span>
      </Link>
      <div className="p-2 sm:p-3 flex flex-col flex-1">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full text-left font-bold text-[12px] sm:text-[13px] text-slate-900 leading-snug flex items-start justify-between gap-1"
        >
          <span className="line-clamp-2">{event.title}</span>
          <svg className={`w-3 h-3 shrink-0 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        {open ? (
          <div className="mt-1.5 text-[11px] text-slate-500 space-y-1">
            <p className="line-clamp-3 leading-relaxed">{event.description}</p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <div className="min-w-0">
                <div className="truncate">📍 {event.venue?.name}</div>
                <div className="text-slate-400">{formatDateTime(event.startAt).slice(0, 10)}</div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <div className="font-bold text-slate-900 text-[12px]">{formatKRW(event.price)}</div>
                <div>{sold ? <span className="text-rose-500">마감</span> : <>잔여 <strong>{event.remaining}</strong>/{event.capacity}</>}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-1 flex items-center justify-between">
            <div className="text-[10px] text-slate-500 truncate">📍 {event.venue?.name}</div>
            <div className="text-[12px] font-bold text-slate-900 shrink-0 ml-1">{formatKRW(event.price)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function CardsGrid({ events, selectedId, onHover, kakaoOpenChatUrl }) {
  if (events.length === 0) {
    return (
      <div className="card p-8 text-center text-slate-500 text-sm">
        조건에 맞는 모임이 없어요.{' '}
        <a href={kakaoOpenChatUrl} target="_blank" rel="noreferrer" className="text-brand-700 font-medium">카톡으로 알려주세요 →</a>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
      {events.map(e => (
        <div key={e.id} onMouseEnter={() => onHover(e.id)} onMouseLeave={() => onHover(null)}
          className={`rounded-2xl transition-all ${selectedId === e.id ? 'ring-2 ring-brand-300 ring-offset-1' : ''}`}>
          <EventCard event={e} />
        </div>
      ))}
    </div>
  );
}

function BeginnerGuide({ kakaoOpenChatUrl, compact = false }) {
  return (
    <ol className="space-y-2">
      {BEGINNER_STEPS.map(s => (
        <li key={s.n} className="flex gap-2">
          <span className="shrink-0 w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold grid place-items-center">{s.n}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] sm:text-[13px] font-semibold text-slate-800 leading-snug">{s.t}</div>
            {!compact && <div className="text-[11px] text-slate-500">{s.d}</div>}
          </div>
        </li>
      ))}
      <li className="pt-1">
        <a href={kakaoOpenChatUrl} target="_blank" rel="noreferrer"
          className="block text-center btn bg-slate-900 text-white hover:bg-slate-800 py-2 text-[12px]">
          오픈채팅으로 인사 →
        </a>
      </li>
    </ol>
  );
}

function CalendarView({ events, today }) {
  const [month, setMonth] = useState(() => ({ year: today.getFullYear(), month: today.getMonth() }));

  const firstDay = new Date(month.year, month.month, 1);
  const lastDay = new Date(month.year, month.month + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ date: null, events: [] });
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEvents = events.filter(e => {
      const ed = new Date(e.startAt);
      return ed.getFullYear() === month.year && ed.getMonth() === month.month && ed.getDate() === d;
    });
    cells.push({ date: d, events: dayEvents });
  }

  function shift(delta) {
    let m = month.month + delta, y = month.year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth({ year: y, month: m });
  }

  return (
    <div className="card p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => shift(-1)} className="btn-ghost px-3 py-1 text-sm">‹</button>
        <h3 className="font-bold text-[14px] sm:text-base">{month.year}년 {month.month + 1}월</h3>
        <button onClick={() => shift(1)} className="btn-ghost px-3 py-1 text-sm">›</button>
      </div>
      <div className="grid grid-cols-7 text-[10px] text-slate-500 mb-1">
        {['일','월','화','수','목','금','토'].map((d, i) => (
          <div key={d} className={`text-center py-1 ${i===0?'text-rose-500':i===6?'text-blue-500':''}`}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((c, i) => (
          <div key={i} className={`min-h-[50px] sm:min-h-[80px] rounded p-0.5 text-[9px] sm:text-[10px] ${c.date ? 'bg-slate-50 border border-slate-100' : ''}`}>
            {c.date && (
              <>
                <span className={`block font-semibold mb-0.5 ${
                  c.date === today.getDate() && month.month === today.getMonth() && month.year === today.getFullYear()
                    ? 'text-brand-700' : 'text-slate-700'
                }`}>{c.date}</span>
                {c.events.slice(0, 2).map(e => (
                  <Link key={e.id} to={`/events/${e.id}`}
                    className={`block truncate px-0.5 py-px rounded mb-px ${e.source === 'internal' ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {e.title}
                  </Link>
                ))}
                {c.events.length > 2 && <span className="text-slate-400">+{c.events.length-2}</span>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* SVG Icons */
function FilterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
    </svg>
  );
}

function CalIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
