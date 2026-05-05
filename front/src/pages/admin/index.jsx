import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useEvents,
  addEvent,
  togglePublish,
  commitEventsOverride,
  clearEventsOverride,
  hasPendingChanges,
} from '../../lib/useEvents';
import { useRole } from '../../lib/RoleContext';
import { formatDateTime, formatKRW, dDay } from '../../lib/format';
import ClassEditor from '../../components/ClassEditor';

/**
 * Admin — 자체 강의 운영 보조 뷰.
 *
 * 인라인 편집(EventCard ✏️ / EventDetail "강의 편집") 으로 대부분 처리하고,
 * 이 페이지는 다음 두 시나리오에 특화:
 *   1) 게시 안 된 강의(미게시·과거 회차) 한눈에 보기
 *   2) 기존 회차를 복제해 다음 회차 빠르게 만들기
 *   3) 오버라이드 일괄 저장/되돌리기
 *
 * 비-admin 진입 시 안내. dev 환경 아니면 저장 액션 비활성.
 */
export default function Admin() {
  const { role } = useRole();
  const events = useEvents();
  const [editor, setEditor] = useState(null); // { mode, event }
  const [pending, setPending] = useState(hasPendingChanges());
  const [status, setStatus] = useState(null);

  if (role !== 'admin') {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-slate-700 font-medium">관리자만 접근할 수 있는 페이지입니다.</p>
        <p className="mt-2 text-[13px] text-slate-500">
          헤더 우측의 역할 토글(교안/프롤로그 버튼)로 admin 모드 진입 후 다시 들어와주세요.
        </p>
        <Link to="/" className="mt-6 inline-block btn-primary">홈으로</Link>
      </div>
    );
  }

  const internal = events.filter(e => e.source === 'internal');
  const published = internal.filter(e => e.isPublished !== false);
  const hidden = internal.filter(e => e.isPublished === false);

  function duplicate(event) {
    const today = new Date().toISOString().slice(0, 10);
    const dup = {
      ...event,
      id: `${event.id}-copy-${today}`,
      title: `${event.title} (사본)`,
      isPublished: false,
      remaining: event.capacity,
    };
    addEvent(dup);
    setPending(true);
    setEditor({ mode: 'edit', event: dup });
  }

  async function commit() {
    setStatus('saving');
    try {
      await commitEventsOverride();
      setPending(false);
      setStatus('saved');
      setTimeout(() => setStatus(null), 1500);
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  }

  function discard() {
    if (!confirm('미저장 변경을 모두 되돌립니다. 계속하시겠습니까?')) return;
    clearEventsOverride();
    setPending(false);
  }

  return (
    <div className="container-page py-6 sm:py-10">
      <header className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="text-[11px] font-bold tracking-widest text-rose-600 uppercase">Admin</p>
          <h1 className="text-[22px] sm:text-2xl font-bold text-slate-900">강의 운영</h1>
          <p className="mt-1 text-[12px] text-slate-500">
            대부분 작업은 홈 카드 또는 강의 상세에서 inline 편집으로. 이 페이지는 미게시 + 빠른 복제용.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pending && (
            <>
              <span className="badge bg-amber-100 text-amber-700 text-[11px]">미저장 변경</span>
              <button onClick={discard} className="px-2.5 py-1.5 rounded-lg text-[12px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700">
                되돌리기
              </button>
            </>
          )}
          <button
            onClick={commit}
            disabled={!pending || status === 'saving'}
            className="px-3 py-1.5 rounded-lg text-[12px] font-bold bg-brand-600 text-white hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400"
          >
            {status === 'saving' ? '저장 중…' : status === 'saved' ? '저장됨' : (
              <>
                <span className="sm:hidden">영구 저장</span>
                <span className="hidden sm:inline">events.json 영구 저장</span>
              </>
            )}
          </button>
          <button
            onClick={() => setEditor({ mode: 'create' })}
            className="px-3 py-1.5 rounded-lg text-[12px] font-bold bg-rose-600 text-white hover:bg-rose-700"
          >
            + 새 강의
          </button>
        </div>
      </header>

      <Section title={`게시 중 (${published.length})`} subtitle="홈 카드 그리드에 노출되는 자체 강의">
        <ClassTable events={published} onEdit={(e) => setEditor({ mode: 'edit', event: e })} onDuplicate={duplicate} onTogglePublish={(id) => { togglePublish(id); setPending(true); }} />
      </Section>

      <Section title={`미게시 (${hidden.length})`} subtitle="홈에는 안 보이는 강의 (지난 회차·작성 중)">
        {hidden.length === 0
          ? <p className="text-[12px] text-slate-400 italic">미게시 강의 없음</p>
          : <ClassTable events={hidden} onEdit={(e) => setEditor({ mode: 'edit', event: e })} onDuplicate={duplicate} onTogglePublish={(id) => { togglePublish(id); setPending(true); }} />
        }
      </Section>

      {editor && (
        <ClassEditor
          mode={editor.mode}
          event={editor.event}
          onClose={() => { setEditor(null); setPending(hasPendingChanges()); }}
        />
      )}
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="mb-8">
      <div className="mb-3">
        <h2 className="text-[15px] font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function ClassTable({ events, onEdit, onDuplicate, onTogglePublish }) {
  if (events.length === 0) return null;
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-[13px]">
        <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase tracking-widest">
          <tr>
            <th className="text-left px-3 py-2 font-medium">제목</th>
            <th className="text-left px-3 py-2 font-medium hidden sm:table-cell">일시</th>
            <th className="text-right px-3 py-2 font-medium">정원</th>
            <th className="text-right px-3 py-2 font-medium hidden sm:table-cell">가격</th>
            <th className="text-right px-3 py-2 font-medium">액션</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {events.map(e => (
            <tr key={e.id}>
              <td className="px-3 py-2.5">
                <Link to={`/events/${e.id}`} className="font-medium text-slate-800 hover:text-brand-700 line-clamp-1">{e.title || <span className="text-slate-400 italic">제목 없음</span>}</Link>
                <div className="text-[11px] text-slate-400 mt-0.5">{e.id}</div>
              </td>
              <td className="px-3 py-2.5 hidden sm:table-cell text-[12px] text-slate-600">
                {e.startAt ? <>
                  {formatDateTime(e.startAt)}<span className="ml-1.5 text-slate-400">{dDay(e.startAt)}</span>
                </> : <span className="text-slate-300">—</span>}
              </td>
              <td className="px-3 py-2.5 text-right text-[12px]">
                <span className="font-medium text-slate-700">{e.remaining}</span>
                <span className="text-slate-400">/{e.capacity}</span>
              </td>
              <td className="px-3 py-2.5 text-right hidden sm:table-cell font-medium text-slate-700">{formatKRW(e.price)}</td>
              <td className="px-3 py-2.5 text-right">
                <div className="inline-flex gap-1">
                  <button onClick={() => onEdit(e)} className="px-2 py-1 rounded text-[11px] font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100">편집</button>
                  <button onClick={() => onDuplicate(e)} title="다음 회차로 복제" className="px-2 py-1 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">복제</button>
                  <button onClick={() => onTogglePublish(e.id)} className="px-2 py-1 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">
                    {e.isPublished === false ? '게시' : '숨김'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
