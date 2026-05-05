import { Link } from 'react-router-dom';
import InfoLayout from '../../InfoLayout';
import { TIERS, getPatternsByTier } from '@/data/patterns';

const COLOR_MAP = {
  brand: { card: 'border-brand-200 hover:border-brand-400', badge: 'bg-brand-50 text-brand-700' },
  warm: { card: 'border-warm-200 hover:border-warm-400', badge: 'bg-warm-50 text-warm-600' },
  emerald: { card: 'border-emerald-200 hover:border-emerald-400', badge: 'bg-emerald-50 text-emerald-700' },
  rose: { card: 'border-rose-200 hover:border-rose-400', badge: 'bg-rose-50 text-rose-700' },
};

/**
 * /info/front/patterns — Frontend UX Pattern 카탈로그 인덱스.
 * 4 Tier 카드 → 각 Tier 안에서 패턴 1개 클릭 → 단일 패턴 페이지.
 */
export default function PatternsIndex() {
  return (
    <InfoLayout>
      <article>
        <header className="mb-6">
          <p className="text-[11px] font-bold tracking-widest text-brand-600 uppercase">
            Frontend · UX Patterns
          </p>
          <h1 className="mt-1 text-[20px] sm:text-3xl font-bold text-slate-900 leading-tight">
            프론트엔드 UX 패턴 카탈로그
          </h1>
          <p className="mt-2 text-[13px] sm:text-[15px] text-slate-600 leading-relaxed">
            37개 UX 패턴을 4단계로 묶었습니다. 각 패턴마다 라이브 데모 + 코드 + Claude 프롬프트.
            바이브코딩 할 때 "이런 게 필요한데 뭐라 부르지?" 싶을 때 바로 검색.
          </p>
        </header>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {TIERS.map((t) => {
            const c = COLOR_MAP[t.color];
            const patterns = getPatternsByTier(t.num);
            return (
              <Link
                key={t.num}
                to={`/info/front/patterns/${t.slug}/${patterns[0]?.id ?? ''}`}
                className={`block card overflow-hidden p-4 sm:p-5 hover:shadow-md transition group ${c.card}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`badge text-[11px] font-bold ${c.badge}`}>Tier {t.num}</span>
                  <span className="text-[11px] text-slate-400">{t.count}개</span>
                </div>
                <h2 className="text-[15px] sm:text-base font-bold text-slate-900 leading-snug">
                  {t.title}
                </h2>
                <p className="mt-1.5 text-[12px] sm:text-[13px] text-slate-600 leading-relaxed">
                  {t.desc}
                </p>

                <ul className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                  {patterns.slice(0, 4).map((p) => (
                    <li key={p.id} className="text-[12px] text-slate-700 line-clamp-1">
                      <span className="text-slate-400 mr-1.5">{String(p.num).padStart(2, '0')}.</span>
                      {p.title}
                    </li>
                  ))}
                  {patterns.length > 4 && (
                    <li className="text-[11px] text-slate-400">+ {patterns.length - 4}개 더</li>
                  )}
                </ul>

                <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-700 group-hover:gap-2 transition-all">
                  Tier {t.num} 진입 <span aria-hidden>→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </article>
    </InfoLayout>
  );
}
