import { Link } from 'react-router-dom';
import MiniHompy from '@/pages/guide/oneday/components/MiniHompy';

/**
 * GuidePreviewCard — 메인 페이지의 "수업 전 준비 가이드" 진입 카드.
 *
 * 구조: 사진 상단(MiniHompy 미니 데모) + 텍스트 하단 (CLAUDE.md § 1-5-1 표준).
 * NextClassHero 와 같은 카드 폼팩터 — 시각 일관성.
 */
export default function GuidePreviewCard() {
  return (
    <Link
      to="/guide/oneday/install"
      className="block card overflow-hidden border-brand-200 hover:border-brand-400 hover:shadow-md transition group h-full flex flex-col"
    >
      {/* 사진 상단 — MiniHompy 미니 데모 */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden shrink-0">
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%) scale(0.42)',
            transformOrigin: 'top center',
            width: '380px',
            pointerEvents: 'none',
          }}
        >
          <MiniHompy />
        </div>
        <span className="absolute top-2 left-2 badge bg-brand-600 text-white text-[10px] font-bold shadow-sm z-10">
          수업 전 준비
        </span>
      </div>

      {/* 텍스트 하단 */}
      <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-900 leading-snug line-clamp-2">
          VSCode · Claude Code 설치 가이드
        </h3>
        <p className="text-[11px] sm:text-[12px] text-slate-500 line-clamp-2 leading-relaxed">
          노트북 들고 오시면 됩니다. GitHub · Node.js · Claude Code 까지 단계별로.
        </p>

        <span className="mt-auto pt-2 text-[11px] sm:text-[12px] font-semibold text-brand-700 group-hover:gap-2 inline-flex items-center gap-1 transition-all">
          가이드 보기 <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
