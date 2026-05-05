// Curriculum index — Week1/2/3/4 meta 모음. curriculums.json 대체.
// 사용처: HomeClient (메인 폴백), /guide 인덱스, ClassRegistration (prerequisites), ClassEditor (dropdown).

import { META as week1 } from './Week1/meta';
import { META as week2 } from './Week2/meta';
import { META as week3 } from './Week3/meta';
import { META as week4 } from './Week4/meta';

export const CURRICULUMS = [week1, week2, week3, week4];

export function getCurriculum(id) {
  return CURRICULUMS.find((c) => c.id === id) ?? null;
}
