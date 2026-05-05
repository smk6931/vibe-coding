import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDateTime, formatKRW, dDay, eventTypeLabel } from '@/lib/format';
import { AdminDevOnly } from '@/components/admin/AdminOnly';
import ClassEditor from '@/components/admin/ClassEditor';
import { togglePublish } from '@/lib/useEvents';

const FALLBACK_GRADIENTS = [
  'from-brand-100 to-warm-50',
  'from-amber-50 to-rose-50',
  'from-sky-50 to-indigo-50',
  'from-emerald-50 to-sky-50',
];

export default function EventCard({ event }) {
  const isInternal = event.source === 'internal';
  const sold = event.remaining === 0;
  const gradient = FALLBACK_GRADIENTS[event.id.charCodeAt(event.id.length - 1) % FALLBACK_GRADIENTS.length];
  const [editorOpen, setEditorOpen] = useState(false);
  const isHidden = event.isPublished === false;

  return (
    <div className="relative">
      {isInternal && (
        <AdminDevOnly>
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
            {isHidden && (
              <span className="badge bg-slate-800 text-white text-[10px] shadow-md">미게시</span>
            )}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditorOpen(true); }}
              title="강의 편집"
              className="w-7 h-7 grid place-items-center rounded-full bg-white/95 text-rose-600 shadow-md hover:bg-rose-50 backdrop-blur"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); togglePublish(event.id); }}
              title={isHidden ? '게시 토글' : '게시 토글'}
              className="w-7 h-7 grid place-items-center rounded-full bg-white/95 text-slate-600 shadow-md hover:bg-slate-100 backdrop-blur"
            >
              {isHidden
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12A3 3 0 1 1 9.88 9.88M1 1l22 22"/></svg>}
            </button>
          </div>
        </AdminDevOnly>
      )}
      {editorOpen && (
        <ClassEditor mode="edit" event={event} onClose={() => setEditorOpen(false)} />
      )}
      <Link
        to={`/events/${event.id}`}
        className={`card overflow-hidden flex flex-col group ${isHidden ? 'opacity-70' : ''}`}
      >
      {/* Thumbnail */}
      <div className={`relative aspect-[16/10] bg-gradient-to-br ${gradient} overflow-hidden`}>
        {event.thumbnail && (
          <img
            src={event.thumbnail}
            alt={event.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {/* Top-left badge: source */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
          {isInternal ? (
            <span className="badge bg-white/95 text-slate-800 backdrop-blur shadow-sm">
              <span className="text-warm-600">★</span>&nbsp;자체
            </span>
          ) : (
            <span className="badge bg-black/55 text-white backdrop-blur">
              {event.externalSource ?? '외부'}
            </span>
          )}
        </div>
        {/* Top-right badge: D-day */}
        <span className="absolute top-2.5 right-2.5 badge bg-white/95 text-slate-700 backdrop-blur shadow-sm">
          {dDay(event.startAt)}
        </span>
        {/* Bottom-left: sold out overlay */}
        {sold && (
          <div className="absolute inset-0 bg-black/40 grid place-items-center">
            <span className="badge bg-white text-rose-600 px-3 py-1 text-sm font-semibold">정원 마감</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col gap-1.5">
        <h3 className="font-semibold text-[15px] leading-snug line-clamp-2 text-slate-900">
          {event.title}
        </h3>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span>{formatDateTime(event.startAt).slice(0, 16)}</span>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1 truncate">
          <span className="text-slate-400">📍</span>
          <span className="truncate">{event.venue.name}</span>
        </div>

        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="text-[15px] font-semibold text-slate-900">{formatKRW(event.price)}</div>
          <div className="text-[11px] text-slate-500">
            {sold ? <span className="text-rose-500">마감</span> : <>잔여 <strong className="text-slate-700">{event.remaining}</strong>/{event.capacity}</>}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-1">
          <span className="text-[10px] text-slate-500">{eventTypeLabel(event.type)}</span>
          <span className="text-[10px] text-slate-400">·</span>
          <span className="text-[10px] text-slate-500">{event.level}</span>
          {event.tags?.[0] && (
            <>
              <span className="text-[10px] text-slate-400">·</span>
              <span className="text-[10px] text-slate-500">#{event.tags[0]}</span>
            </>
          )}
        </div>
      </div>
      </Link>
    </div>
  );
}
