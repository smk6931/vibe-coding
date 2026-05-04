import { useEffect, useState } from 'react';
import {
  useOperator,
  setOperatorOverride,
  clearOperatorOverride,
  saveOperatorToSiteJson,
} from '../lib/useOperator';

/**
 * 개발 모드(dev) 전용 운영자 정보 인라인 편집 패널.
 * - 우측 하단 ✏️ 버튼 → 패널 토글
 * - 입력 즉시 localStorage 오버라이드로 사이트 전역에 미리보기 반영
 * - "site.json에 저장" → public/data/site.json 영구 반영 (Vite dev 미들웨어 사용)
 * - "되돌리기" → 오버라이드 클리어
 *
 * import.meta.env.DEV 가 false 면 null 반환 → 빌드 산출물에는 흔적만 남고 동작 X.
 */
export default function DevOperatorEditor() {
  if (!import.meta.env.DEV) return null;

  const operator = useOperator();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(operator);
  const [status, setStatus] = useState(null);

  // 외부에서 operator가 바뀌면(저장/되돌리기) draft도 동기화
  useEffect(() => {
    setDraft(operator);
  }, [operator]);

  function patch(field, value) {
    const next = { ...draft, [field]: value };
    setDraft(next);
    setOperatorOverride(next);
  }
  function patchContact(field, value) {
    const next = {
      ...draft,
      contacts: { ...(draft.contacts ?? {}), [field]: value },
    };
    setDraft(next);
    setOperatorOverride(next);
  }
  function patchList(field, text) {
    const arr = text.split('\n').map((s) => s.trim()).filter(Boolean);
    patch(field, arr);
  }

  async function handleSave() {
    setStatus('saving');
    try {
      await saveOperatorToSiteJson(draft);
      clearOperatorOverride();
      setStatus('saved');
      setTimeout(() => setStatus(null), 1500);
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  }

  function handleReset() {
    clearOperatorOverride();
    setStatus(null);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed z-[60] bottom-4 right-4 w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg grid place-items-center"
        title="운영자 정보 편집 (dev only)"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      </button>

      {open && (
        <div className="fixed z-[60] inset-0 sm:inset-auto sm:top-4 sm:right-4 sm:bottom-4 sm:w-[420px] bg-white shadow-2xl border border-slate-200 sm:rounded-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <div>
              <div className="text-[13px] font-bold text-slate-900">운영자 정보 편집</div>
              <div className="text-[10px] text-rose-600 font-medium">DEV ONLY · 빌드에는 포함되지 않음</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-label="닫기">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-[12px]">
            <Field label="이름 (name)">
              <input
                value={draft.name ?? ''}
                onChange={(e) => patch('name', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="직함 (title)">
              <input
                value={draft.title ?? ''}
                onChange={(e) => patch('title', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="경험 (experience) — 이름 옆 회색 텍스트">
              <input
                value={draft.experience ?? ''}
                onChange={(e) => patch('experience', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="태그라인 (tagline) — 홈 카드 한 줄 소개">
              <textarea
                value={draft.tagline ?? ''}
                onChange={(e) => patch('tagline', e.target.value)}
                rows={2}
                className="input"
              />
            </Field>
            <Field label="인용구 (intro) — 큰 사진 옆 인사">
              <textarea
                value={draft.intro ?? ''}
                onChange={(e) => patch('intro', e.target.value)}
                rows={3}
                className="input"
              />
            </Field>
            <Field label="사진 경로 (photo)">
              <input
                value={draft.photo ?? ''}
                onChange={(e) => patch('photo', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="스토리 (story) — 빈 줄로 문단 구분">
              <textarea
                value={(draft.story ?? []).join('\n')}
                onChange={(e) => patchList('story', e.target.value)}
                rows={5}
                className="input"
              />
            </Field>
            <Field label="이력 (credentials) — 한 줄에 하나">
              <textarea
                value={(draft.credentials ?? []).join('\n')}
                onChange={(e) => patchList('credentials', e.target.value)}
                rows={5}
                className="input"
              />
            </Field>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">연락처</div>
              <Field label="인스타그램 URL">
                <input
                  value={draft.contacts?.instagram ?? ''}
                  onChange={(e) => patchContact('instagram', e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="카카오 오픈채팅 URL">
                <input
                  value={draft.contacts?.kakao ?? ''}
                  onChange={(e) => patchContact('kakao', e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="이메일">
                <input
                  value={draft.contacts?.email ?? ''}
                  onChange={(e) => patchContact('email', e.target.value)}
                  className="input"
                />
              </Field>
            </div>
          </div>

          <div className="border-t border-slate-200 px-4 py-3 space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={status === 'saving'}
                className="flex-1 btn bg-brand-600 text-white hover:bg-brand-700 py-2 text-[12px] font-semibold disabled:opacity-60"
              >
                {status === 'saving' ? '저장 중...' : 'site.json에 저장'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-2 text-[12px]"
              >
                되돌리기
              </button>
            </div>
            {status === 'saved' && (
              <div className="text-[11px] text-emerald-600">저장 완료. site.json에 반영됨.</div>
            )}
            {status === 'error' && (
              <div className="text-[11px] text-rose-600">저장 실패. 콘솔 확인.</div>
            )}
            <p className="text-[10px] text-slate-400 leading-relaxed">
              입력하면 즉시 사이트에 반영(localStorage)되고, "site.json에 저장"을 눌러야 영구 반영됩니다.
            </p>
          </div>
        </div>
      )}

      <style>{`
        .input {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 12px;
          color: #0f172a;
          background: white;
          line-height: 1.5;
        }
        .input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,0.2); }
      `}</style>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-[10px] font-medium text-slate-500 mb-1">{label}</div>
      {children}
    </label>
  );
}
