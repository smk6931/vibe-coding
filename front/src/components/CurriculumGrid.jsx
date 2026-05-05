import { CURRICULUMS } from '../pages/guide/oneday/_curriculums';
import CurriculumPreviewCard from './CurriculumPreviewCard';

/**
 * CurriculumGrid — 커리큘럼 N장 카드 그리드.
 *
 * 정렬: active 우선 → preparing. 같은 status 내에서는 weekNumber 순.
 *
 * 사용처:
 *   - HomeClient: 카드 그리드 빈 자리 폴백
 *   - /guide 인덱스: 메인 카탈로그
 *
 * 모바일 2열 / 데스크탑 4열 (4주차 시리즈 한 줄).
 */
export default function CurriculumGrid() {
  const sorted = [...CURRICULUMS].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
    return a.weekNumber - b.weekNumber;
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {sorted.map((c) => (
        <CurriculumPreviewCard key={c.id} curriculum={c} />
      ))}
    </div>
  );
}
