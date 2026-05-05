# /guide 지식 허브 + 프론트엔드 UX 패턴 카탈로그 — Phase A

작업일: 2026-05-05
범위: 인프라 + 시범 패턴 1개 (Skeleton). 나머지 36개 패턴은 점진 추가.
관련 문서: `agents/frontend/knowledge-hub-pattern.md` (신규)

---

## 왜 이렇게 했나

`source/front-patterns-guide-main` (37개 UX 패턴 React 데모) 가 사이트 정체성("강의 + 교안 + 지식")의 보류 상태였던 "지식 글 영역" 첫 콘텐츠로 정확히 들어맞음. SEO 잠재력 + 강의 후 학습자 동선 확보.

도메인 분기를 한 단계 더 둠 (`/guide/patterns/` → `/guide/front/patterns/`) — 향후 `back/`, `ai/`, `devops/` 추가될 때 이동 비용 0.

## 신규 / 수정 파일

### 신규
| 파일 | 역할 |
|------|------|
| `front/src/data/patterns.js` | 37개 패턴 메타 + 4 Tier 분류 + 헬퍼 (`getPattern`, `getPatternsByTier`, `getNeighbors`) |
| `front/src/pages/guide/front/patterns/index.jsx` | 4 Tier 카드 인덱스 (`/guide/front/patterns`) |
| `front/src/pages/guide/front/patterns/PatternDetail.jsx` | 단일 패턴 페이지 (37개 공용, useParams 분기) |
| `front/src/pages/guide/front/patterns/components/SkeletonDemo.jsx` | 시범 라이브 데모 1개 (Tier 1 / Skeleton) |
| `agents/frontend/knowledge-hub-pattern.md` | 지식 허브 + 도메인 확장 패턴 명문화 |

### 수정
| 파일 | 변경 |
|------|------|
| `front/src/routes/guide.jsx` | `/guide/front/patterns` + `/guide/front/patterns/:tier/:id` 라우트 2개 추가 |
| `front/src/pages/guide/index.jsx` | "강의 가이드" → "지식 허브" 정체성 변경. 강의 교안 + 프론트엔드 패턴 두 섹션 카드. 향후 도메인 늘면 카드 추가만 |
| `front/src/pages/guide/GuideSidebar.jsx` | `NAV_GROUPS` 에 "프론트엔드 UX 패턴" 그룹 추가 (4 Tier 진입점) |
| `agents/README.md` | 새 문서 등록 |
| `CLAUDE.md` Agent 표 | 등록 |

## 라우트 트리

```
/guide                                        ← 지식 허브 인덱스
  ├─ /guide/oneday/...                        ← 강의 교안 도메인 (기존)
  └─ /guide/front/patterns/                   ← 프론트엔드 지식 도메인 (신규)
      ├─ /guide/front/patterns                  → 4 Tier 카드 인덱스
      └─ /guide/front/patterns/:tier/:id        → 단일 패턴 페이지 (37개)
```

## 단일 패턴 페이지 폼팩터

```
헤더 (Tier · 번호 · 제목 · lead)
   ↓
라이브 데모 (DEMO_REGISTRY[id] lazy import, 없으면 "준비중" placeholder)
   ↓
Claude 프롬프트 (lead 자동 삽입된 복붙 박스)
   ↓
이전/다음 패턴 네비 (getNeighbors 자동)
```

## 라이브 데모 점진 추가 워크플로우 (3분 / 패턴)

1. `pages/guide/front/patterns/components/{Id}Demo.jsx` 신규 작성
2. `PatternDetail.jsx` 의 `DEMO_REGISTRY` 객체에 한 줄 추가:
   ```js
   {id}: lazy(() => import('./components/{Id}Demo'))
   ```
3. 끝. 데이터·라우트·인덱스 무수정.

## 새 도메인 추가 워크플로우 (10분)

예: 백엔드 지식 추가
1. `pages/guide/back/{section}/` 폴더 생성
2. `routes/guide.jsx` 에 lazy import + 라우트 등록
3. `pages/guide/index.jsx` 에 새 섹션 카드 그리드 추가
4. `GuideSidebar.jsx` `NAV_GROUPS` 에 새 그룹 객체 추가

## 검증 시나리오 (운영자 직접)

- [ ] `/guide` 진입 → 두 섹션 (강의 교안 + 프론트엔드 패턴 4 Tier 카드)
- [ ] "전체 카탈로그 →" 클릭 → `/guide/front/patterns` 진입 → 4 Tier 카드
- [ ] Tier 1 카드 클릭 → `/guide/front/patterns/tier1/skeleton` 진입
- [ ] Skeleton 데모 작동 (회색 박스 → 실제 데이터 fade in)
- [ ] "다시 로딩" 버튼 → 데모 reset
- [ ] "다음 →" 네비 → `/guide/front/patterns/tier1/empty` (데모 준비중 placeholder)
- [ ] GuideSidebar 두 그룹 (4주차 미니홈피 + 프론트엔드 UX 패턴) 정상 노출
- [ ] 모바일 360~430px 검수 — 4 Tier 카드 grid-cols-2 깨짐 없음

## 다음 단계 (Phase B 점진 추가)

운영자가 1차 강의 후 패턴 1~3개씩 추가:
- 우선순위: Tier 1 의 Skeleton(완료) → Empty State → Toast → Modal 순
- 각 패턴 = `components/{Id}Demo.jsx` + `DEMO_REGISTRY` 등록 두 줄 작업
- 추가 시 README 또는 별도 task log 짧게

## SEO 잠재력

- 정적 빌드 + 단일 패턴 URL 37개 = 검색 노출 자석
- "스켈레톤 로딩 react", "Optimistic update 패턴" 같은 검색어 일정 수요
- 각 페이지 메타(title/description) 설정은 추후 (현재 index.html 의 사이트 전역 메타만 적용됨)
