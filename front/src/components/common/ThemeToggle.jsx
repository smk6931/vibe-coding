import { useEffect, useState } from 'react';

const STORAGE_KEY = 'vibe-coding-theme';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved === 'dark';
    // 라이트 기본 — 시스템 prefers-color-scheme 무시.
    // 본인 톤(친근·거창하지 않은) + 비전공자 첫 진입 친근감이 라이트에 부합.
    // 사용자 선호 다크는 토글 후 localStorage 에 영구 저장됨.
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark(v => !v)}
      title={dark ? '라이트 모드로' : '다크 모드로'}
      aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
    >
      <span aria-hidden className="block w-[17px] h-[17px] sm:w-[19px] sm:h-[19px] leading-none text-[15px] sm:text-[17px]">
        {dark ? '☀' : '☾'}
      </span>
    </button>
  );
}
