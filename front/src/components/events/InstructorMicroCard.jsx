import { Link } from 'react-router-dom';
import siteData from '@/data/site.json';

/**
 * InstructorMicroCard — 강의(이벤트) 페이지 상단 1줄 강사 표기.
 *
 * 자체 운영 강의에 박는 미세 시그니처. 강의별로 반복 노출되어
 * 도용자가 강의마다 일일이 갈아치워야 하는 부담을 만든다.
 *
 * 사용처:
 *   - EventDetail.jsx (event.source === 'internal' 일 때만)
 *
 * Props:
 *   - className: 외부 마진 조정
 */
export default function InstructorMicroCard({ className = '' }) {
  const op = siteData.operator;

  return (
    <Link
      to="/about"
      className={`group inline-flex items-center gap-2.5 text-[12px] text-slate-600 hover:text-brand-700 transition-colors ${className}`}
    >
      <img
        src={op.photo}
        alt={`강사 ${op.name}`}
        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 bg-slate-100"
      />
      <span>
        <span className="font-semibold text-slate-800 group-hover:text-brand-700">
          강사 {op.name}
        </span>
        <span className="text-slate-400"> · {op.title}</span>
      </span>
    </Link>
  );
}
