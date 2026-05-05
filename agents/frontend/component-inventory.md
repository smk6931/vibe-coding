---
Title: 현재 components 인벤토리와 도메인 분류
Description: front/src/components 하위 실제 컴포넌트의 역할, 사용처, 목표 도메인 폴더, 리팩터링 판단
When-To-Read: components 폴더 정리, import 경로 변경, 컴포넌트 이동, 중복/삭제 판단, 새 컴포넌트 위치 결정 전
Keywords: component inventory, component domain, components classification, 도메인 분류, 리팩터링, components/home, components/events
Priority: high
---

# 현재 components 인벤토리와 도메인 분류

이 문서는 2026-05-05 기준 `front/src/components/*.jsx` 실제 파일을 도메인별로 분류한 표다.

현재는 대부분 루트 `components/`에 있지만, 새 파일은 `component-placement.md` 기준으로 도메인 하위 폴더에 둔다. 기존 파일 이동은 import 변경이 크므로 기능 작업과 분리해서 진행한다.

## 요약 분류

```text
components/common/
  Accordion.jsx
  Avatar.jsx
  ThemeToggle.jsx

components/layout/
  Header.jsx
  Footer.jsx

components/home/
  HomeClient.jsx
  NextClassHero.jsx
  GuidePreviewCard.jsx        # 현재 HomeClient 내부 함수
  RecommendedHero.jsx         # 현재 HomeClient 내부 함수
  CardsGrid.jsx               # 현재 HomeClient 내부 함수
  CalendarView.jsx            # 현재 HomeClient 내부 함수
  BeginnerGuide.jsx           # 현재 HomeClient 내부 함수
  NewClassCard.jsx            # 현재 HomeClient 내부 함수

components/events/
  EventCard.jsx
  ClassRegistration.jsx
  InstructorMicroCard.jsx
  EventLocationMap.jsx

components/admin/
  AdminOnly.jsx
  ClassEditor.jsx
  DevOperatorEditor.jsx

components/maps/
  KakaoMap.jsx

components/operator/
  OperatorIntroCard.jsx
  OperatorProfile.jsx

components/guide/
  GuideClient.jsx
  CurriculumGrid.jsx
  CurriculumPreviewCard.jsx
```

## 실제 파일별 분류표

| 현재 파일 | 목표 도메인 | 역할 | 주요 사용처 | 리팩터링 판단 |
|---|---|---|---|---|
| `Accordion.jsx` | `components/common/` | 모바일 접힘/펼침 섹션 | `HomeClient` | 단순 공용 UI. 이동만 하면 됨. |
| `AdminOnly.jsx` | `components/admin/` | `AdminOnly`, `DevOnly`, `AdminDevOnly` 가드 | `EventCard`, `HomeClient`, `EventDetail` | admin 도메인으로 이동. Phase 2 인증 붙을 때 내부만 교체. |
| `Avatar.jsx` | `components/common/` | 닉네임 기반 아바타 | 커뮤니티 쇼케이스/멤버 | 공용 UI. 이동만 하면 됨. |
| `ClassEditor.jsx` | `components/admin/` | 강의 회차 생성/수정 모달 | `EventCard`, `HomeClient`, `/admin`, `EventDetail` | admin 도메인. 크기가 커서 추후 `ClassEditor/fields`로 내부 분리 가능. |
| `ClassRegistration.jsx` | `components/events/` | 신청/결제/환불/준비물/교안 링크 박스 | `EventDetail` | 이벤트 상세 핵심. `ClassEditor`와 데이터 스키마 맞춰야 함. |
| `CurriculumGrid.jsx` | `components/guide/` | 커리큘럼 카드 그리드 | `/guide`, `HomeClient` 빈 목록 fallback | guide 도메인. `CurriculumPreviewCard`와 같이 이동. |
| `CurriculumPreviewCard.jsx` | `components/guide/` | 커리큘럼 카드 1개 | `CurriculumGrid` | guide 도메인. 단독 이동보다 `CurriculumGrid`와 묶어서 이동. |
| `DevOperatorEditor.jsx` | `components/admin/` | dev 전용 운영자 정보 편집 패널 | `app.jsx` 전역 | admin/dev 도메인. 운영 빌드에서는 동작 X. |
| `EventCard.jsx` | `components/events/` | 모임/강의 회차 카드 | `HomeClient` | events 도메인. admin 편집 버튼을 포함하므로 `AdminDevOnly`, `ClassEditor` import 경로 주의. |
| `EventLocationMap.jsx` | `components/events/` 또는 삭제 후보 | 이벤트 상세 단일 지도 래퍼 | 현재 사용 적음 | 상세 페이지 지도 붙일 거면 events에 유지. 안 쓰면 삭제 후보. |
| `Footer.jsx` | `components/layout/` | 전역 푸터 | `app.jsx` | layout 도메인. 이동만 하면 됨. |
| `GuideClient.jsx` | `components/guide/` | 사전 준비 가이드 UI | `/guide/oneday/install` | guide 도메인. 장기적으로 `pages/guide/oneday/Install.jsx` 옆으로 옮기는 것도 가능. |
| `Header.jsx` | `components/layout/` | 전역 헤더/네비/역할 토글/채팅 링크 | `app.jsx` | layout 도메인. `ThemeToggle` import 경로 주의. |
| `HomeClient.jsx` | `components/home/` | 메인 페이지 전체 UI, 필터, 지도, 카드, CTA | `/` | 최우선 분리 대상. 내부 함수들을 별도 파일로 먼저 뺀 뒤 이동. |
| `InstructorMicroCard.jsx` | `components/events/` 또는 `components/operator/` | 강의 상세 강사 미니 표시 | `EventDetail` | 사용 위치는 events, 데이터 성격은 operator. 현재는 이벤트 상세 전용이라 events 우선. |
| `KakaoMap.jsx` | `components/maps/` | 카카오맵 SDK 로드, 다중/단일 지도 | `HomeClient`, `EventLocationMap` | maps 도메인. Leaflet 재도입 시 같은 폴더에 둔다. |
| `NextClassHero.jsx` | `components/home/` | 홈의 다음 강의 강조 카드 | `HomeClient` | 이미 home 도메인으로 분리됨. |
| `OperatorIntroCard.jsx` | `components/operator/` | 홈 상단 운영자 명함 | `HomeClient` | operator 도메인. 홈에서 쓰지만 원산지는 운영자 프로필. |
| `OperatorProfile.jsx` | `components/operator/` | `/about` 운영자 소개 | `/about` | operator 도메인. |
| `ThemeToggle.jsx` | `components/common/` | 전역 다크/라이트 토글 | `Header` | common 도메인. 전역 CSS `preserve-color` 규칙과 같이 봐야 함. |

## 실제 리팩터링 순서

### 1단계: HomeClient 내부 함수 분리

가장 먼저 `HomeClient.jsx` 안의 내부 컴포넌트를 파일로 분리한다.

```text
components/home/
  HomeClient.jsx
  NextClassHero.jsx
  GuidePreviewCard.jsx
  RecommendedHero.jsx
  CardsGrid.jsx
  CalendarView.jsx
  BeginnerGuide.jsx
  NewClassCard.jsx
```

이 단계는 UI 동작을 바꾸지 말고 import만 정리한다. `HomeClient`는 상태/필터/레이아웃 조립만 남긴다.

### 2단계: 도메인 폴더 생성 후 루트 파일 이동

다음 순서로 이동한다.

1. `components/common/`: `Accordion`, `Avatar`, `ThemeToggle`
2. `components/layout/`: `Header`, `Footer`
3. `components/events/`: `EventCard`, `ClassRegistration`, `InstructorMicroCard`, `EventLocationMap`
4. `components/admin/`: `AdminOnly`, `ClassEditor`, `DevOperatorEditor`
5. `components/maps/`: `KakaoMap`
6. `components/operator/`: `OperatorIntroCard`, `OperatorProfile`
7. `components/guide/`: `GuideClient`, `CurriculumGrid`, `CurriculumPreviewCard`

### 3단계: import 경로 정리

이동 후에는 상대경로가 깊어지므로 두 가지 중 하나를 고른다.

- 간단한 경우: `@/components/events/EventCard`
- 자주 쓰는 도메인: `components/events/index.js` barrel export 추가

처음 리팩터링에서는 barrel export를 남발하지 말고, import가 3곳 이상 반복되는 도메인에만 추가한다.

## 삭제/합치기 후보

| 대상 | 판단 |
|---|---|
| `EventLocationMap.jsx` | 현재 상세 페이지에 지도 UI가 없으면 미사용 래퍼. 상세에 지도 붙일 계획이면 유지, 아니면 삭제 가능. |
| `InstructorMicroCard.jsx` + `OperatorIntroCard.jsx` | 합치지 않는다. 하나는 강의 상세 시그니처, 하나는 홈 명함이라 역할이 다름. 같은 `operator` 또는 `events` 도메인 안에서 관리만 한다. |
| `CurriculumGrid.jsx` + `CurriculumPreviewCard.jsx` | 합치지 않는다. 카드 1개와 그리드는 분리 유지가 맞다. |
| `AdminOnly.jsx` + `DevOperatorEditor.jsx` | 합치지 않는다. 가드는 작은 인프라 컴포넌트, 에디터는 기능 모듈. |

## 주의사항

- 파일 이동은 반드시 import 경로 변경과 빌드 검증을 같이 한다.
- `ClassEditor`, `useEvents`, `vite.config.js`의 dev 저장 흐름은 함께 깨질 수 있으므로 admin 기능 이동 시 별도 검증한다.
- `HomeClient`는 화면 영향이 크므로 기능 변경 없이 구조 분리만 먼저 한다.
- `pages/guide/oneday/components/MiniHompy*`는 가이드 도메인 원산지이므로 `components/home/`으로 옮기지 않는다.
