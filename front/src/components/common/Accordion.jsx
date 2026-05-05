
import { useState, useId } from 'react';

/**
 * 모바일 아코디언 (CLAUDE.md 1-5-2)
 * - 모바일에서는 토글 가능 (접힘/펼침)
 * - lg+ 에서는 항상 펼친 상태로 두고 토글 버튼 숨김
 */
export default function Accordion({
  title,
  count,
  defaultOpen = true,
  alwaysOpenOnDesktop = true,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const panelId = `accordion-panel-${id}`;
  const btnId = `accordion-btn-${id}`;

  // 데스크탑에서는 toggle UI 숨기고 항상 펼침. 모바일에서만 open state 적용.
  return (
    <section className="border-b border-slate-100 lg:border-0">
      <button
        id={btnId}
        aria-controls={panelId}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between py-3 px-1 text-left ${
          alwaysOpenOnDesktop ? 'lg:hidden' : ''
        }`}
      >
        <span className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 text-[15px]">{title}</span>
          {count !== undefined && (
            <span className="text-xs text-slate-500 font-medium">{count}</span>
          )}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className={`${open ? 'block' : 'hidden'} ${alwaysOpenOnDesktop ? 'lg:block' : ''}`}
      >
        {children}
      </div>
    </section>
  );
}
