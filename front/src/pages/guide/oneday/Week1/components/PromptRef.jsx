import { useState } from 'react';

export default function PromptRef({ text }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          이 단계 프롬프트 (참고)
        </span>
        <button
          onClick={copy}
          className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-white font-semibold hover:bg-slate-900 transition-colors"
        >
          {copied ? '복사됨 ✓' : '복사'}
        </button>
      </div>
      <p className="text-[12px] text-slate-700 leading-relaxed font-mono whitespace-pre-wrap break-words">
        {text}
      </p>
    </div>
  );
}
