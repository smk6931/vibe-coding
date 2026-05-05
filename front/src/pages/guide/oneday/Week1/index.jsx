import { Link } from 'react-router-dom';
import GuideLayout from '../../GuideLayout';
import Curriculum from './Curriculum';
import { META } from './meta';
import { useEvents } from '../../../../lib/useEvents';
import siteData from '@/data/site.json';
import { formatDateTime, formatKRW, dDay } from '../../../../lib/format';

/**
 * Week1 — 1주차 교안 페이지 (라우트 진입점).
 * 같은 폴더의 다른 파일들과 짝:
 *   - meta.js       카드용 메타 (title, prerequisites, outline, ...)
 *   - Curriculum.jsx 교안 본문 (timeline + chapter accordion)
 *   - components/   Chapter 컴포넌트 3개 + PromptRef + CurriculumSignature
 *
 * 회차(events) 추가 = events.json 에 객체 1개 추가 (curriculumId === META.id 면 자동 노출).
 * 라우트: /guide/oneday/week1
 */
export default function Week1() {
  const events = useEvents();
  const now = new Date();
  const upcomingClasses = events
    .filter((e) =>
      e.curriculumId === META.id &&
      e.isPublished !== false &&
      new Date(e.startAt) >= now
    )
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

  return (
    <GuideLayout>
      <article>
        <header className="mb-6">
          <p className="text-[11px] font-bold tracking-widest text-brand-600 uppercase">
            1주차 교안 · Curriculum
          </p>
          <h1 className="mt-1 text-[20px] sm:text-3xl font-bold text-slate-900 leading-tight">
            {META.title}
          </h1>
          <p className="mt-2 text-[13px] sm:text-[15px] text-slate-600 leading-relaxed">
            {META.subtitle}
          </p>
        </header>

        <UpcomingClasses classes={upcomingClasses} />

        <Curriculum kakaoUrl={siteData.kakaoOpenChatUrl} />
      </article>
    </GuideLayout>
  );
}

/* ─────────────── 다음 회차 위젯 ─────────────── */
function UpcomingClasses({ classes }) {
  if (classes.length === 0) {
    return (
      <div className="mb-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center">
        <p className="text-[13px] text-slate-500">예정된 회차가 없습니다.</p>
        <p className="mt-1 text-[11px] text-slate-400">
          이 교안으로 새 회차가 열리면 여기에 카드로 노출됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <h2 className="text-[14px] font-bold text-slate-800">예정된 회차</h2>
        <span className="text-[11px] text-slate-400">{classes.length}개</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {classes.map((c) => (
          <Link
            key={c.id}
            to={`/events/${c.id}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-brand-300 hover:shadow-sm transition group"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge bg-brand-50 text-brand-700 text-[11px] font-semibold">{dDay(c.startAt)}</span>
              <span className="text-[15px] font-bold text-brand-700">{formatKRW(c.price)}</span>
              {c.remaining === 0 && (
                <span className="badge bg-rose-100 text-rose-700 text-[10px]">마감</span>
              )}
            </div>
            <p className="mt-2 text-[13px] font-semibold text-slate-900 leading-snug">
              {formatDateTime(c.startAt)}
            </p>
            <p className="mt-1 text-[12px] text-slate-500 leading-snug">
              {c.venue?.name ?? '장소 미설정'}
            </p>
            <p className="mt-3 text-[12px] text-brand-600 group-hover:underline">
              신청 페이지 →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
