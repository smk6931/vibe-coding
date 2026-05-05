import { Link } from 'react-router-dom';
import { formatKRW, dDay } from '@/lib/format';

/**
 * NextClassHero — 메인 진입점. 가장 가까운 자체 강의 1건의 카드.
 *
 * 구조: 사진 상단 + 텍스트 하단 (CLAUDE.md § 1-5-1 모바일 카드 그리드 표준).
 * 폭: 모바일 2열 / 데스크탑 2열 그리드 안에서 카드 1개. 좁은 폭 호환.
 *
 * Props:
 *   - event: events.json 의 자체 강의 1건 (`source==='internal'` + `isPublished` true)
 */
export default function NextClassHero({ event }) {
  if (!event) return null;
  const sold = event.remaining === 0;

  // 일자만 짧게 (5/10 형식)
  const date = new Date(event.startAt);
  const shortDate = `${date.getMonth() + 1}/${date.getDate()}`;

  return (
    <Link
      to={`/events/${event.id}`}
      className="block card overflow-hidden hover:border-brand-300 hover:shadow-md transition group h-full flex flex-col"
    >
      {/* 사진 상단 */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden shrink-0">
        {event.thumbnail && (
          <img
            src={event.thumbnail}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <span className="badge bg-warm-500 text-white text-[10px] font-bold shadow-sm">★ 다음 강의</span>
          <span className="badge bg-white/95 text-slate-800 backdrop-blur text-[10px] font-semibold shadow-sm">{dDay(event.startAt)}</span>
        </div>
      </div>

      {/* 텍스트 하단 */}
      <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-900 leading-snug line-clamp-2">
          {event.title}
        </h3>
        <p className="text-[11px] sm:text-[12px] text-slate-500 line-clamp-1">
          {shortDate} · {event.venue?.name?.split(' ')[0] ?? '장소 미정'}
        </p>

        <div className="flex items-end justify-between mt-auto pt-2">
          <span className="text-[13px] sm:text-[14px] font-bold text-brand-700">{formatKRW(event.price)}</span>
          <span className="text-[10px] sm:text-[11px] text-slate-500">
            {sold
              ? <span className="text-rose-600 font-medium">마감</span>
              : <>잔여 <strong className="text-slate-700">{event.remaining}</strong>/{event.capacity}</>}
          </span>
        </div>

        <span className="mt-1 text-[11px] sm:text-[12px] font-semibold text-brand-700 group-hover:gap-2 inline-flex items-center gap-1 transition-all">
          신청 페이지로 <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
