import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dDay, eventTypeLabel } from '../../lib/format';
import InstructorMicroCard from '../../components/events/InstructorMicroCard';
import ClassRegistration from '../../components/events/ClassRegistration';
import ClassEditor from '../../components/admin/ClassEditor';
import { AdminDevOnly } from '../../components/admin/AdminOnly';
import { useEvents } from '../../lib/useEvents';
import { useRole } from '../../lib/RoleContext';

/**
 * EventDetail — 한 회차(Class instance)의 신청 페이지.
 *
 * Curriculum-Class 패턴의 "Class" 측 — 일정·장소·결제·신청만 담당.
 * 교안 본문(Curriculum body)은 별도 라우트(/guide/oneday/week{N})에 있고,
 * ClassRegistration 안에 "교안 보러가기" 링크로 연결됨.
 */
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
  // 자체 강의는 무조건 ClassRegistration 박스로 정보 표시 (ClassEditor 와 단일 소스).
  // 내부 박스들이 각자 가드해서 빈 필드는 안전하게 처리됨.
  const showRegistration = isInternal;

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
        {event.thumbnail && (
          <div className="relative aspect-[16/8] rounded-2xl overflow-hidden mb-5 bg-slate-100">
            <img src={event.thumbnail} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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

          {event.description && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <h2 className="text-[14px] font-bold text-slate-700 mb-2">소개</h2>
              <p className="whitespace-pre-line text-[13px] sm:text-sm text-slate-700 leading-relaxed">{event.description}</p>
            </div>
          )}

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
        </div>
      </article>
    </div>
  );
}
