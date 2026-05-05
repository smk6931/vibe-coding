import { Link } from 'react-router-dom';
import InfoLayout from './InfoLayout';
import { TIERS } from '@/data/patterns';

/**
 * /info — 지식 허브 인덱스.
 *
 * 정체성: 강의(/guide) 와 분리된 "짧은 프로그래밍 / 바이브코딩 정보" 영역.
 * 도메인 분류: front (37 패턴) / back (준비중) / ai (준비중) ...
 */
export default function InfoIndex() {
  return (
    <InfoLayout>
      <div>
        {/* 헤더 */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            지식
          </h1>
          <p className="text-slate-500 mt-2 text-[13px] sm:text-sm leading-relaxed">
            바이브코딩 할 때 한 번씩 찾아보는 짧은 프로그래밍 지식.
            프론트·백엔드·AI 코딩 패턴까지 도메인별로 정리합니다.
          </p>
        </header>

        {/* 1. 프론트엔드 — 활성 */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between gap-2 mb-3 flex-wrap">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              🧰 프론트엔드 — UX 패턴 카탈로그
            </p>
            <Link to="/info/front/patterns" className="text-[12px] font-semibold text-brand-600 hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {TIERS.map((t) => (
              <Link
                key={t.num}
                to="/info/front/patterns"
                className="card p-3 sm:p-4 hover:border-brand-300 hover:shadow-sm transition group"
              >
                <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-brand-600 uppercase">
                  Tier {t.num}
                </span>
                <p className="mt-1 text-[12px] sm:text-[13px] font-bold text-slate-900 leading-snug line-clamp-2">
                  {t.title}
                </p>
                <p className="mt-1.5 text-[10px] sm:text-[11px] text-slate-500">{t.count}개 패턴</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 2. 백엔드 — 준비중 */}
        <section className="mb-10">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            🛠 백엔드 (준비중)
          </p>
          <div className="card p-5 text-center bg-slate-50/50 border-dashed">
            <p className="text-[13px] text-slate-500">Django · PostgreSQL · 배포 트러블슈팅 — 1차 강의 후 첫 글 발행 예정</p>
          </div>
        </section>

        {/* 3. AI 코딩 — 준비중 */}
        <section>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            🤖 AI 코딩 (준비중)
          </p>
          <div className="card p-5 text-center bg-slate-50/50 border-dashed">
            <p className="text-[13px] text-slate-500">Claude · Cursor · 프롬프트 엔지니어링 — 1차 강의 후 첫 글 발행 예정</p>
          </div>
        </section>
      </div>
    </InfoLayout>
  );
}
