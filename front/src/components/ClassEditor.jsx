import { useEffect, useState } from 'react';
import curriculumsData from '../../public/data/curriculums.json';
import {
  addEvent,
  updateEvent,
  deleteEvent,
  commitEventsOverride,
  hasPendingChanges,
} from '../lib/useEvents';

/**
 * ClassEditor — 자체 강의 1건 인라인 편집 모달.
 *
 * 같은 모달이 두 모드를 다 처리:
 *   - mode="create"  → 새 강의 추가
 *   - mode="edit"    → 기존 id 수정
 *
 * 저장 흐름:
 *   1) 폼 입력 → 즉시 localStorage 오버라이드 반영 (사이트 전역 미리보기)
 *   2) 우상단 "영구 저장" → events.json 덮어쓰기 + 오버라이드 클리어
 *
 * dev 환경 전용 (Vite 미들웨어 의존). 호출부에서 <AdminDevOnly>로 감쌀 것.
 */
export default function ClassEditor({ mode, event = null, onClose }) {
  const initial = mode === 'edit' && event ? event : blankEvent();
  const [draft, setDraft] = useState(initial);
  const [status, setStatus] = useState(null);
  const [pending, setPending] = useState(hasPendingChanges());

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.(); }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function patch(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }
  function patchNested(field, sub, value) {
    setDraft((d) => ({ ...d, [field]: { ...(d[field] ?? {}), [sub]: value } }));
  }
  function patchArrayLines(field, text) {
    const arr = text.split('\n').map((s) => s.trim()).filter(Boolean);
    patch(field, arr);
  }
  function patchPoliciesRefund(text) {
    const arr = text.split('\n').map((s) => s.trim()).filter(Boolean);
    setDraft((d) => ({ ...d, policies: { ...(d.policies ?? {}), refund: arr } }));
  }

  function handleApplyToOverride() {
    const cleaned = normalize(draft);
    if (mode === 'create') addEvent(cleaned);
    else updateEvent(cleaned.id, cleaned);
    setPending(true);
    setStatus('preview');
    setTimeout(() => setStatus(null), 1200);
  }

  async function handleCommit() {
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

  function handleDelete() {
    if (mode !== 'edit') return;
    if (!confirm(`"${draft.title}" 강의를 삭제하시겠습니까?\n저장 전엔 되돌릴 수 있습니다.`)) return;
    deleteEvent(draft.id);
    setPending(true);
    onClose?.();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-stretch sm:items-center justify-center sm:p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="bg-white w-full sm:max-w-3xl sm:rounded-2xl shadow-xl flex flex-col max-h-screen sm:max-h-[92vh]">
        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-widest text-brand-600 uppercase">
              {mode === 'create' ? '새 강의' : '강의 편집'}
            </p>
            <h2 className="text-[15px] sm:text-base font-bold text-slate-900 truncate">
              {draft.title || '제목 없음'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {pending && (
              <span className="badge bg-amber-100 text-amber-700 text-[11px]">미저장</span>
            )}
            <button
              onClick={handleApplyToOverride}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              미리보기 반영
            </button>
            <button
              onClick={handleCommit}
              disabled={status === 'saving' || !pending}
              className="px-3 py-1.5 rounded-lg text-[12px] font-bold bg-brand-600 text-white hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400"
            >
              {status === 'saving' ? '저장 중…' : status === 'saved' ? '저장됨' : '영구 저장'}
            </button>
            <button onClick={onClose} className="ml-1 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100" aria-label="닫기">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
          <Section label="기본">
            <Field label="ID (URL slug)">
              <input
                value={draft.id}
                onChange={(e) => patch('id', e.target.value)}
                disabled={mode === 'edit'}
                placeholder="evt-week1-2026-05-10"
                className={inputCls}
              />
            </Field>
            <Field label="제목">
              <input value={draft.title} onChange={(e) => patch('title', e.target.value)} className={inputCls} />
            </Field>
            <Field label="소개">
              <textarea
                rows={3}
                value={draft.description}
                onChange={(e) => patch('description', e.target.value)}
                className={`${inputCls} font-mono text-[12px]`}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="난이도">
                <input value={draft.level} onChange={(e) => patch('level', e.target.value)} className={inputCls} />
              </Field>
              <Field label="유형">
                <select value={draft.type} onChange={(e) => patch('type', e.target.value)} className={inputCls}>
                  <option value="oneday_class">원데이 클래스</option>
                  <option value="study">스터디</option>
                  <option value="hackathon">해커톤</option>
                  <option value="seminar">세미나</option>
                  <option value="meetup">오프밋업</option>
                </select>
              </Field>
            </div>
            <Field label="태그 (쉼표 구분)">
              <input
                value={(draft.tags ?? []).join(', ')}
                onChange={(e) => patch('tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                className={inputCls}
              />
            </Field>
            <Field label="썸네일 URL">
              <input value={draft.thumbnail ?? ''} onChange={(e) => patch('thumbnail', e.target.value)} className={inputCls} />
            </Field>
          </Section>

          <Section label="일정 · 장소">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="시작 (ISO8601)">
                <input value={draft.startAt} onChange={(e) => patch('startAt', e.target.value)} placeholder="2026-05-10T14:00:00+09:00" className={inputCls} />
              </Field>
              <Field label="종료 (ISO8601)">
                <input value={draft.endAt} onChange={(e) => patch('endAt', e.target.value)} placeholder="2026-05-10T17:00:00+09:00" className={inputCls} />
              </Field>
            </div>
            <Field label="장소명">
              <input value={draft.venue?.name ?? ''} onChange={(e) => patchNested('venue', 'name', e.target.value)} className={inputCls} />
            </Field>
            <Field label="주소">
              <input value={draft.venue?.address ?? ''} onChange={(e) => patchNested('venue', 'address', e.target.value)} className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="lat">
                <input type="number" step="0.0001" value={draft.venue?.lat ?? ''} onChange={(e) => patchNested('venue', 'lat', parseFloat(e.target.value) || 0)} className={inputCls} />
              </Field>
              <Field label="lng">
                <input type="number" step="0.0001" value={draft.venue?.lng ?? ''} onChange={(e) => patchNested('venue', 'lng', parseFloat(e.target.value) || 0)} className={inputCls} />
              </Field>
            </div>
            <Field label="장소 URL (선택)">
              <input value={draft.venue?.url ?? ''} onChange={(e) => patchNested('venue', 'url', e.target.value)} className={inputCls} />
            </Field>
            <Field label="길찾기 안내 (선택)">
              <textarea rows={2} value={draft.venue?.directions ?? ''} onChange={(e) => patchNested('venue', 'directions', e.target.value)} className={inputCls} />
            </Field>
            <Field label="지역">
              <select value={draft.region} onChange={(e) => patch('region', e.target.value)} className={inputCls}>
                {['수도권', '충청', '영남', '호남', '제주'].map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
          </Section>

          <Section label="신청 · 정원">
            <div className="grid grid-cols-3 gap-3">
              <Field label="가격(원)"><input type="number" value={draft.price} onChange={(e) => patch('price', parseInt(e.target.value) || 0)} className={inputCls} /></Field>
              <Field label="정원"><input type="number" value={draft.capacity} onChange={(e) => patch('capacity', parseInt(e.target.value) || 0)} className={inputCls} /></Field>
              <Field label="잔여"><input type="number" value={draft.remaining} onChange={(e) => patch('remaining', parseInt(e.target.value) || 0)} className={inputCls} /></Field>
            </div>
            <Field label="최소 인원 (연기 기준)">
              <input type="number" value={draft.minHeads ?? ''} onChange={(e) => patch('minHeads', parseInt(e.target.value) || 0)} className={inputCls} />
            </Field>
            <Field label="신청 URL (카톡 오픈채팅 등)">
              <input value={draft.applyUrl ?? ''} onChange={(e) => patch('applyUrl', e.target.value)} className={inputCls} />
            </Field>
          </Section>

          <Section label="결제 (계좌이체)">
            <div className="grid grid-cols-2 gap-3">
              <Field label="은행"><input value={draft.payment?.bank ?? ''} onChange={(e) => patchNested('payment', 'bank', e.target.value)} className={inputCls} /></Field>
              <Field label="계좌번호"><input value={draft.payment?.account ?? ''} onChange={(e) => patchNested('payment', 'account', e.target.value)} className={inputCls} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="예금주"><input value={draft.payment?.holder ?? ''} onChange={(e) => patchNested('payment', 'holder', e.target.value)} className={inputCls} /></Field>
              <Field label="입금자명 규칙"><input value={draft.payment?.memoFormat ?? ''} onChange={(e) => patchNested('payment', 'memoFormat', e.target.value)} className={inputCls} /></Field>
            </div>
            <Field label="결제 안내 문구">
              <textarea rows={2} value={draft.payment?.guide ?? ''} onChange={(e) => patchNested('payment', 'guide', e.target.value)} className={inputCls} />
            </Field>
          </Section>

          <Section label="환불 · 연기 정책">
            <Field label="인원 미달 안내">
              <input value={draft.policies?.minHeadsNotice ?? ''} onChange={(e) => patchNested('policies', 'minHeadsNotice', e.target.value)} className={inputCls} />
            </Field>
            <Field label="환불 정책 (한 줄에 한 항목)">
              <textarea
                rows={4}
                value={(draft.policies?.refund ?? []).join('\n')}
                onChange={(e) => patchPoliciesRefund(e.target.value)}
                className={`${inputCls} font-mono text-[12px]`}
              />
            </Field>
          </Section>

          <Section label="연결 · 게시">
            <Field label="교안 (curriculumId)">
              <select value={draft.curriculumId ?? ''} onChange={(e) => patch('curriculumId', e.target.value || null)} className={inputCls}>
                <option value="">— 연결 없음 —</option>
                {curriculumsData.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.title}</option>)}
              </select>
            </Field>
            <Field label="게시 상태">
              <label className="flex items-center gap-2 text-[13px]">
                <input type="checkbox" checked={draft.isPublished !== false} onChange={(e) => patch('isPublished', e.target.checked)} />
                <span>{draft.isPublished !== false ? '게시 중' : '미게시 (홈에 안 보임)'}</span>
              </label>
            </Field>
          </Section>
        </div>

        {/* Footer */}
        <footer className="px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 sticky bottom-0">
          {mode === 'edit' ? (
            <button onClick={handleDelete} className="text-[12px] font-semibold text-rose-600 hover:text-rose-700">
              강의 삭제
            </button>
          ) : <span />}
          <div className="text-[11px] text-slate-500">
            {status === 'preview' && '✓ 사이트 전역에 미리보기 반영됨'}
            {status === 'saved' && '✓ events.json 영구 저장 완료'}
            {status === 'error' && <span className="text-rose-600">저장 실패 — 콘솔 확인</span>}
            {!status && pending && '미저장 변경 있음 — "영구 저장" 누르세요'}
            {!status && !pending && 'dev 서버 + admin 한정 — git push 후 배포'}
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ─────────────── 헬퍼 ─────────────── */

function blankEvent() {
  const id = `evt-week1-${new Date().toISOString().slice(0, 10)}`;
  return {
    id,
    isPublished: true,
    source: 'internal',
    type: 'oneday_class',
    curriculumId: 'oneday-week-1',
    title: '',
    host: { name: '손명관', handle: '@vibe_session' },
    startAt: '',
    endAt: '',
    venue: { name: '', address: '', lat: 0, lng: 0, url: '', directions: '' },
    region: '수도권',
    price: 25000,
    capacity: 4,
    remaining: 4,
    minHeads: 3,
    level: '비전공자 첫 강의',
    description: '',
    tags: [],
    thumbnail: '',
    applyUrl: 'https://open.kakao.com/o/suOWUYsi',
    payment: { method: '계좌이체', bank: '', account: '', holder: '손명관', memoFormat: '이름+휴대폰뒷4자리', guide: '' },
    policies: { minHeadsNotice: '', refund: [] },
    ctaUrl: null,
  };
}

/** number/빈 문자열 정리 */
function normalize(d) {
  return {
    ...d,
    price: Number(d.price) || 0,
    capacity: Number(d.capacity) || 0,
    remaining: Number(d.remaining) || 0,
    minHeads: d.minHeads ? Number(d.minHeads) : undefined,
    venue: d.venue ? { ...d.venue, lat: Number(d.venue.lat) || 0, lng: Number(d.venue.lng) || 0 } : d.venue,
  };
}

const inputCls = 'w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 disabled:bg-slate-50 disabled:text-slate-500';

function Section({ label, children }) {
  return (
    <section>
      <p className="text-[11px] font-bold tracking-widest text-brand-600 uppercase mb-2.5">{label}</p>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium text-slate-500 mb-1">{label}</span>
      {children}
    </label>
  );
}
