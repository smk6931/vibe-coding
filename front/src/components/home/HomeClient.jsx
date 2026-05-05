import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Accordion from '@/components/common/Accordion';
import OperatorIntroCard from '@/components/operator/OperatorIntroCard';
import CurriculumGrid from '@/components/guide/CurriculumGrid';
import NextClassHero from './NextClassHero';
import GuidePreviewCard from './GuidePreviewCard';
import { AdminDevOnly } from '@/components/admin/AdminOnly';
import ClassEditor from '@/components/admin/ClassEditor';
import dynamic from '@/lib/dynamic';

const KakaoMultiMap = dynamic(
  () => import('@/components/maps/KakaoMap').then(m => m.KakaoMultiMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[320px] rounded-xl border border-slate-200 bg-slate-50 grid place-items-center text-sm text-slate-400">
        지도 로딩 중...
      </div>
    ),
  }
);

const BEGINNER_STEPS = [
  { n: 1, t: '강의 페이지에서 일정·장소 확인' },
  { n: 2, t: '카톡 오픈채팅 입장 후 신청 메시지' },
  { n: 3, t: '입금 안내 받고 좌석 확정' },
];

/**
 * HomeClient — 홈 메인.
 *
 * 정체성: 강의 + 교안 + 위치·일정 정보. 모임 모집·외부 카탈로그는 사이트 밖(소모임/카톡).
 *
 * 섹션 (위→아래):
 *   1. HERO + 운영자 명함 (좁게 max-w-3xl)
 *   2. 다음 강의 hero 카드 + 지도 + 4주차 교안 + 캘린더(접힘) (중간폭 max-w-5xl)
 *   3. 처음이세요? + CTA (좁게 max-w-3xl)
 */
export default function HomeClient({ events, kakaoOpenChatUrl }) {
  const today = useMemo(() => new Date(), []);

  // 자체 + 게시 + 미래 일정만. 가장 가까운 1건이 hero.
  const upcomingInternal = useMemo(() => {
    return events
      .filter(e =>
        e.source === 'internal' &&
        e.isPublished !== false &&
        new Date(e.endAt) >= today
      )
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [events, today]);

  const nextClass = upcomingInternal[0] ?? null;

  return (
    <div>
      {/* === 1. 인사 영역 (좁게) === */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-5 sm:pt-8 sm:pb-6">
          <h1 className="text-[20px] sm:text-2xl font-bold tracking-tight text-slate-900 break-keep">
            Claude로 코딩,&nbsp;<span className="text-brand-600 whitespace-nowrap">한 자리에서 두 시간</span>
          </h1>
          <p className="mt-1.5 text-[13px] sm:text-[14px] text-slate-500 leading-relaxed">
            비전공자도 두 시간 안에 첫 화면을 띄우고 진짜 URL로 공개합니다. 1주차부터 이어가는 4주 미니홈피 시리즈.
          </p>

          <div className="mt-4">
            <OperatorIntroCard />
          </div>
        </div>
      </section>

      {/* === 2. 메인 콘텐츠 (중간폭) === */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-10">

        {/* 2-1. 다음 강의 + 수업 전 준비 가이드 — 모바일·데스크탑 모두 가로 2열, 카드 안은 세로 (사진 위/텍스트 아래) */}
        {nextClass ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col">
              <SectionLabel>다음 강의</SectionLabel>
              <div className="flex-1">
                <NextClassHero event={nextClass} />
              </div>
            </div>
            <div className="flex flex-col">
              <SectionLabel>수업 전 준비</SectionLabel>
              <div className="flex-1">
                <GuidePreviewCard />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <EmptyHero kakaoOpenChatUrl={kakaoOpenChatUrl} />
            <GuidePreviewCard />
          </div>
        )}

        {/* 2-2. 지도 — 자체 강의 위치 */}
        {upcomingInternal.length > 0 && (
          <div>
            <SectionLabel>강의 위치 — 우리 동네에서 가까운지 한눈에</SectionLabel>
            <div className="rounded-2xl overflow-hidden border border-slate-200 h-[320px] sm:h-[400px]">
              <KakaoMultiMap events={upcomingInternal} fillHeight />
            </div>
          </div>
        )}

        {/* 2-3. 강의 교안 (CurriculumGrid 재사용) */}
        <div>
          <SectionLabel>
            강의 교안 — 4주차 미니홈피 시리즈
            <Link to="/guide" className="ml-auto text-[12px] font-semibold text-brand-600 hover:underline">
              전체 가이드 →
            </Link>
          </SectionLabel>
          <CurriculumGrid />
        </div>

        {/* 2-4. 캘린더 (접힘 기본) */}
        <div>
          <Accordion
            title="일정 캘린더"
            count={upcomingInternal.length}
            defaultOpen={false}
            alwaysOpenOnDesktop={false}
          >
            <div className="pt-2 pb-1">
              <CalendarView events={upcomingInternal} today={today} />
            </div>
          </Accordion>
        </div>

        {/* 2-5. admin only — 새 강의 추가 진입점 (자체 강의 0이거나 추가 시) */}
        <AdminDevOnly>
          <NewClassCTA />
        </AdminDevOnly>
      </section>

      {/* === 3. 처음이세요? + CTA (좁게) === */}
      <section className="bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <h2 className="text-[15px] sm:text-base font-bold text-slate-800 mb-3">처음이세요?</h2>
          <ol className="space-y-2.5 mb-5">
            {BEGINNER_STEPS.map(s => (
              <li key={s.n} className="flex gap-3 items-start">
                <span className="shrink-0 w-6 h-6 rounded-full bg-brand-600 text-white text-[11px] font-bold grid place-items-center mt-0.5">
                  {s.n}
                </span>
                <span className="text-[13px] sm:text-[14px] text-slate-700 leading-relaxed">{s.t}</span>
              </li>
            ))}
          </ol>
          <a
            href={kakaoOpenChatUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-center btn bg-slate-900 text-white hover:bg-slate-800 py-3 text-[14px] font-semibold rounded-xl"
          >
            카톡 오픈채팅 입장 →
          </a>
        </div>
      </section>
    </div>
  );
}

/* ============================================================ */

function SectionLabel({ children }) {
  return (
    <div className="flex items-baseline gap-2 mb-3">
      <h2 className="text-[12px] sm:text-[13px] font-bold tracking-widest text-slate-500 uppercase">
        {typeof children === 'string' ? children : children}
      </h2>
    </div>
  );
}

function EmptyHero({ kakaoOpenChatUrl }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <p className="text-slate-700 font-medium">예정된 강의가 없습니다</p>
      <p className="mt-1 text-[12px] text-slate-500">
        다음 회차 안내 받으려면{' '}
        <a href={kakaoOpenChatUrl} target="_blank" rel="noreferrer" className="text-brand-600 font-medium">
          카톡 오픈채팅 입장 →
        </a>
      </p>
    </div>
  );
}

function NewClassCTA() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-400 text-rose-600 py-4 sm:py-5 flex items-center justify-center gap-2 transition-colors group"
      >
        <span className="w-8 h-8 grid place-items-center rounded-full bg-rose-100 group-hover:bg-rose-200 text-rose-600 text-xl font-bold">+</span>
        <span className="text-[13px] font-bold">새 강의 추가</span>
        <span className="text-[10px] text-rose-400">admin · dev only</span>
      </button>
      {open && <ClassEditor mode="create" onClose={() => setOpen(false)} />}
    </>
  );
}

/* ─────────────── Calendar (인라인, 자체 강의만 표시) ─────────────── */
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
        <button onClick={() => shift(-1)} className="px-3 py-1 text-sm text-slate-500 hover:text-slate-800">‹ 이전</button>
        <h3 className="font-bold text-[14px] sm:text-base text-slate-800">{month.year}년 {month.month + 1}월</h3>
        <button onClick={() => shift(1)} className="px-3 py-1 text-sm text-slate-500 hover:text-slate-800">다음 ›</button>
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
                    className="block truncate px-0.5 py-px rounded mb-px bg-brand-600 text-white">
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
