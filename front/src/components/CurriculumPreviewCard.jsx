import { Link } from 'react-router-dom';
import { useEvents } from '../lib/useEvents';
import { formatDateTime, formatKRW, dDay } from '../lib/format';

/**
 * CurriculumPreviewCard — 커리큘럼 1건 카드 (메인 폴백 / /guide 카탈로그 공용).
 *
 * 분기:
 *   - status='active' + 다음 회차 있음 → 회차 날짜·가격·D-day 노출
 *   - status='active' + 다음 회차 없음 → "다음 회차는 카톡으로 안내"
 *   - status='preparing' → "오픈 예정" 배지 + "교안 미리보기 →"
 *
 * 클릭은 항상 curriculum.guideRoute (교안 페이지) 로. 회차 신청은 교안 페이지 안 위젯에서.
 */
export default function CurriculumPreviewCard({ curriculum }) {
  const events = useEvents();
  const now = new Date();
  const nextEvent = events
    .filter(e =>
      e.curriculumId === curriculum.id &&
      e.isPublished !== false &&
      new Date(e.startAt) >= now
    )
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0] ?? null;

  const isPreparing = curriculum.status === 'preparing';

  return (
    <Link
      to={curriculum.guideRoute}
      className={`block rounded-2xl border p-3 sm:p-4 transition-all ${
        isPreparing
          ? 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
          : 'border-brand-200 bg-white hover:border-brand-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <span className={`badge text-[10px] font-bold ${
          isPreparing
            ? 'bg-slate-200 text-slate-600'
            : 'bg-brand-100 text-brand-700'
        }`}>
          {curriculum.weekNumber}주차
        </span>
        {isPreparing && (
          <span className="badge bg-amber-50 text-amber-700 text-[10px] border border-amber-100">
            오픈 예정
          </span>
        )}
        {!isPreparing && nextEvent && (
          <span className="badge bg-brand-600 text-white text-[10px]">
            {dDay(nextEvent.startAt)}
          </span>
        )}
      </div>

      <h3 className={`font-bold text-[13px] sm:text-[14px] leading-snug line-clamp-2 ${
        isPreparing ? 'text-slate-700' : 'text-slate-900'
      }`}>
        {curriculum.title}
      </h3>
      <p className="mt-1 text-[11px] text-slate-500 leading-snug line-clamp-2">
        {curriculum.summary}
      </p>

      <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
        {isPreparing && (
          <span className="text-slate-500">교안 미리보기 →</span>
        )}
        {!isPreparing && nextEvent && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-700 font-medium truncate">
              {formatDateTime(nextEvent.startAt).slice(0, 11)}
            </span>
            <span className="text-brand-700 font-bold shrink-0">
              {formatKRW(nextEvent.price)}
            </span>
          </div>
        )}
        {!isPreparing && !nextEvent && (
          <span className="text-slate-500">다음 회차 일정은 카톡으로 안내</span>
        )}
      </div>
    </Link>
  );
}
