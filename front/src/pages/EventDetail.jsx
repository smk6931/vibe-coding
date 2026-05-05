import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import siteData from '../../public/data/site.json';
import { formatDateTime, formatKRW, dDay, eventTypeLabel } from '../lib/format';
import OnedayClassCurriculum from '../components/OnedayClassCurriculum';
import InstructorMicroCard from '../components/InstructorMicroCard';
import ClassRegistration from '../components/ClassRegistration';
import ClassEditor from '../components/ClassEditor';
import { AdminDevOnly } from '../components/AdminOnly';
import { useEvents } from '../lib/useEvents';
import { useRole } from '../lib/RoleContext';
import MiniHompyLive from './guide/oneday/MiniHompyLive';

export default function EventDetail() {
  const { id } = useParams();
  const events = useEvents();
  const { role } = useRole();
  const [editorOpen, setEditorOpen] = useState(false);
  const found = events.find(e => e.id === id);
  // 미게시 강의는 admin 만 볼 수 있음 (편집·미리보기 목적)
  const event = found && (found.isPublished !== false || role === 'admin') ? found : null;
  const isHidden = event && event.isPublished === false;

  if (!event) {
    return (
      <div className="container-page py-20 text-center text-slate-500">
        이벤트를 찾을 수 없습니다.
        <br />
        <Link to="/" className="text-brand-600 hover:underline mt-4 inline-block">← 전체 모임</Link>
      </div>
    );
  }

  const isInternal       = event.source === 'internal';
  const sold             = event.remaining === 0;
  const showCurriculum   = isInternal && event.type === 'oneday_class';
  const showRegistration = isInternal && Boolean(event.curriculumId);

  return (
    <div className="container-page py-5 sm:py-8">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Link to="/" className="text-[13px] text-slate-400 hover:text-brand-700">← 전체 모임</Link>
        {isInternal && (
          <AdminDevOnly>
            <div className="flex items-center gap-1.5">
              {isHidden && (
                <span className="badge bg-slate-800 text-white text-[10px]">미게시</span>
              )}
              <button
                onClick={() => setEditorOpen(true)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
              >
                ✎ 강의 편집
              </button>
            </div>
          </AdminDevOnly>
        )}
      </div>

      {editorOpen && (
        <ClassEditor mode="edit" event={event} onClose={() => setEditorOpen(false)} />
      )}

      <article>
        {(event.thumbnail || showCurriculum) && (
          <div className={`relative aspect-[16/8] rounded-2xl overflow-hidden mb-5 ${showCurriculum ? 'bg-[#1a0824]' : 'bg-slate-100'}`}>
            {showCurriculum ? (
              <MinihomeBanner />
            ) : (
              <>
                <img src={event.thumbnail} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </>
            )}
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 z-10">
              <span className={`badge text-[11px] ${isInternal ? 'bg-brand-600 text-white' : 'bg-black/60 text-white'}`}>
                {isInternal ? '★ 자체 운영' : `외부 · ${event.externalSource}`}
              </span>
              <span className="badge bg-black/60 text-white text-[11px]">{dDay(event.startAt)}</span>
              <span className="badge bg-black/60 text-white text-[11px]">{eventTypeLabel(event.type)}</span>
            </div>
          </div>
        )}

        <div className="card p-4 sm:p-6">
          <h1 className="text-[18px] sm:text-2xl font-bold tracking-tight leading-snug">{event.title}</h1>
          {isInternal && (
            <div className="mt-3">
              <InstructorMicroCard />
            </div>
          )}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mt-4 text-[13px] sm:text-sm">
            <Field label="일시">{formatDateTime(event.startAt)} ~ {formatDateTime(event.endAt).slice(11)}</Field>
            <Field label="장소">{event.venue.name}</Field>
            <Field label="주소">{event.venue.address}</Field>
            <Field label="주최">{event.host.name}</Field>
            <Field label="난이도">{event.level}</Field>
            <Field label="가격" className="text-brand-700 font-semibold">{formatKRW(event.price)}</Field>
            <Field label="정원">
              {sold
                ? <span className="text-rose-600 font-medium">정원 마감</span>
                : <>잔여 <strong>{event.remaining}</strong> / {event.capacity}</>}
            </Field>
          </dl>

          <div className="mt-5 pt-5 border-t border-slate-100">
            <h2 className="text-[14px] font-bold text-slate-700 mb-2">소개</h2>
            <p className="whitespace-pre-line text-[13px] sm:text-sm text-slate-700 leading-relaxed">{event.description}</p>
          </div>

          {event.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {event.tags.map(t => (
                <span key={t} className="badge bg-slate-100 text-slate-600 text-[11px]">#{t}</span>
              ))}
            </div>
          )}

          {showRegistration && (
            <ClassRegistration event={event} />
          )}

          {showCurriculum && (
            <OnedayClassCurriculum kakaoUrl={siteData.kakaoOpenChatUrl} />
          )}
        </div>
      </article>
    </div>
  );
}

/* 16:8 배너 — banner 모드 (헤더 위 + 3열 가로). design width 1080px 기준 컨테이너 폭에 맞춰 스케일. */
function MinihomeBanner() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 origin-center pointer-events-none w-[1080px] -translate-x-1/2 -translate-y-1/2 scale-[0.34] sm:scale-[0.58] md:scale-[0.70] lg:scale-[0.94] xl:scale-[1.16]"
        >
          <MiniHompyLive mode="banner" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
    </>
  );
}

function Field({ label, children, className }) {
  return (
    <div className="flex gap-3">
      <dt className="w-14 shrink-0 text-slate-400 text-[12px] sm:text-[13px]">{label}</dt>
      <dd className={`text-[13px] sm:text-sm ${className ?? 'text-slate-700'}`}>{children}</dd>
    </div>
  );
}
