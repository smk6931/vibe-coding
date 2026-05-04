import { Link } from 'react-router-dom';
import { useOperator } from '../lib/useOperator';

/**
 * OperatorIntroCard — 홈 상단·사이드용 컴팩트 운영자 소개 카드.
 *
 * OperatorProfile (풀 모듈) 의 미니 변형. 한 줄 인사 + 아바타 + /about 링크.
 * 자체 강의 카드 옆이나 홈 첫 화면에서 "이 사이트 누가 운영하나" 시그니처 역할.
 *
 * Props:
 *   - className: 외부에서 패딩/마진 조정용 (기본 그대로 사용 OK)
 */
export default function OperatorIntroCard({ className = '' }) {
  const op = useOperator();

  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex gap-4 items-start ${className}`}
    >
      <img
        src={op.photo}
        alt={`운영자 ${op.name}`}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shrink-0 ring-2 ring-brand-100 bg-slate-100"
      />
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold text-slate-800">
          안녕하세요, 운영자 <span className="text-brand-700">{op.name}</span>입니다
        </div>
        <p className="mt-1 text-[13px] text-slate-600 leading-relaxed line-clamp-2">
          {op.tagline}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[12px] flex-wrap">
          {op.contacts?.instagram && (
            <a
              href={op.contacts.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 hover:text-brand-600"
            >
              인스타
            </a>
          )}
          {op.contacts?.kakao && (
            <>
              <span className="text-slate-300">·</span>
              <a
                href={op.contacts.kakao}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-brand-600"
              >
                카톡 오픈채팅
              </a>
            </>
          )}
          <span className="text-slate-300">·</span>
          <Link to="/about" className="text-brand-600 hover:underline">
            더 알아보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
