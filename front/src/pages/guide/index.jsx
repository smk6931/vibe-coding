import { Link } from 'react-router-dom';
import GuideLayout from './GuideLayout';
import CurriculumGrid from '../../components/guide/CurriculumGrid';

/**
 * /guide — "수업" 메뉴의 인덱스. 강의 교안만.
 *
 * 패턴 카탈로그·짧은 프로그래밍 정보는 /info 로 분리됨 (knowledge-hub-pattern.md 참조).
 */
export default function GuideIndex() {
  return (
    <GuideLayout>
      <div>
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            수업
          </h1>
          <p className="text-slate-500 mt-2 text-[13px] sm:text-sm leading-relaxed">
            바이브 세션이 운영하는 4주차 미니홈피 시리즈. 1주차 수업을 베이스로 같은 프로젝트를
            키워가는 연계 클래스입니다. 1회만 들어도 결과물이 남고, 이어 들으면 본인 사이드프로젝트로 발전.
          </p>
        </div>

        {/* 사전 준비 가이드 */}
        <div className="mb-8 rounded-2xl border border-brand-200 bg-brand-50/40 p-3 sm:p-4 flex items-center justify-between gap-3">
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

        {/* 강의 교안 카탈로그 */}
        <section className="mb-8">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            📚 4주차 미니홈피 시리즈
          </p>
          <CurriculumGrid />
        </section>

        {/* /info 진입 안내 */}
        <section>
          <Link
            to="/info"
            className="block card p-4 sm:p-5 hover:border-brand-300 hover:shadow-sm transition group"
          >
            <p className="text-[11px] font-bold tracking-widest text-brand-600 uppercase">짧은 지식</p>
            <p className="mt-1 text-[14px] sm:text-[15px] font-bold text-slate-900">
              UX 패턴 · 백엔드 · AI 코딩 노트
            </p>
            <p className="mt-1 text-[12px] sm:text-[13px] text-slate-500">
              강의 외에 바이브코딩 할 때 한 번씩 찾아보는 짧은 정보 모음 →
            </p>
          </Link>
        </section>
      </div>
    </GuideLayout>
  );
}
