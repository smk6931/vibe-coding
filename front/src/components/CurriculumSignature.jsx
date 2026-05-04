import { Link } from 'react-router-dom';
import siteData from '../../public/data/site.json';

/**
 * CurriculumSignature — 교안 본문 마지막에 박는 강사 시그니처 1줄.
 *
 * 도용 방지 시그니처 분산의 본문 내부 버전. 교안을 끝까지 읽거나 복사하면
 * 자연스럽게 같이 따라가도록 본문 구조 안에 포함시킨다.
 *
 * 톤은 가볍게 (slate-500 muted) — 워터마크 느낌 X.
 *
 * 사용처:
 *   - OnedayClassCurriculum.jsx (1주차) 마지막
 *   - 향후 2주차 / 3주차 / 4주차 페이지 마지막에도 동일 마운트
 */
export default function CurriculumSignature() {
  const op = siteData.operator;

  return (
    <div className="mt-2 pt-6 border-t border-slate-200 flex items-center gap-3 text-[12px] text-slate-500">
      <img
        src={op.photo}
        alt={`강사 ${op.name}`}
        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 bg-slate-100 shrink-0"
      />
      <div className="min-w-0 leading-relaxed">
        <div>
          이 교안을 만든 사람 ·{' '}
          <span className="font-semibold text-slate-700">강사 {op.name}</span>
          <span className="text-slate-400"> · {siteData.brand}</span>
        </div>
        <div className="text-[11px] text-slate-400">
          출처 표기 시 자유 인용 (CC BY 4.0) ·{' '}
          <Link to="/about" className="hover:text-brand-600 underline-offset-2 hover:underline">
            운영자 소개 →
          </Link>
        </div>
      </div>
    </div>
  );
}
