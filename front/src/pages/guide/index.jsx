import { Link } from 'react-router-dom';
import GuideLayout from './GuideLayout';
import CurriculumGrid from '../../components/CurriculumGrid';

/**
 * /guide — 강의 커리큘럼 카탈로그.
 *
 * 메인(/)이 "지금 신청 가능한 회차" 중심이라면, 여기는 "전체 커리큘럼" 중심.
 * CurriculumGrid 가 active(1주차) → preparing(2~4주차) 순으로 정렬해서 4장 카드로.
 *
 * 카드 클릭 → 각 주차 교안 페이지(/guide/oneday/week{N}). 회차 신청은 교안 페이지 안의 위젯에서.
 */
export default function GuideIndex() {
  return (
    <GuideLayout>
      <div>
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            강의 가이드
          </h1>
          <p className="text-slate-500 mt-2 text-[13px] sm:text-sm leading-relaxed">
            바이브 코딩 모임에서 운영하는 4주차 미니홈피 시리즈.
            1주차 수업을 베이스로 같은 프로젝트를 키워가는 연계 클래스입니다.
            1회만 들어도 결과물이 남고, 이어 들으면 본인 사이드프로젝트로 발전합니다.
          </p>
        </div>

        {/* 사전 준비 가이드 — 별도 강조 띠 */}
        <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50/40 p-3 sm:p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-bold text-[13px] sm:text-[14px] text-slate-900">
              수업 전 준비 가이드
            </p>
            <p className="text-[11px] sm:text-[12px] text-slate-500 mt-0.5 leading-snug">
              VSCode · Claude Code 설치부터 강의 시작 전까지
            </p>
          </div>
          <Link
            to="/guide/oneday/install"
            className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-lg bg-brand-600 text-white text-[12px] sm:text-[13px] font-semibold hover:bg-brand-700"
          >
            가이드 보기 →
          </Link>
        </div>

        {/* 커리큘럼 카탈로그 */}
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          원데이 클래스 — 4주차 시리즈
        </p>
        <CurriculumGrid />
      </div>
    </GuideLayout>
  );
}
