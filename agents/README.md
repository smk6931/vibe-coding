# Vibe Session — Agent 문서 인덱스

AI가 작업 시 필요한 컨텍스트만 골라 읽는 참조용 문서 모음.
파일별 Keywords를 보고 관련 있는 것만 읽는다.

---

## UI 패턴

| 문서 | 언제 읽나 |
|------|----------|
| [카드 썸네일+토글 패턴](ui/card-thumbnail-toggle.md) | 썸네일 있는 카드 UI 만들 때, 아코디언 토글 붙일 때 |
| [미니홈피 라이브 데모](ui/mini-hompy-demo.md) | MiniHompy / MiniHompyLive 수정, 썸네일 scale, 외부 React 프로젝트 컴포넌트 떼올 때 |
| [강의 교안 가이드 폼팩터](ui/lecture-guide-component.md) | 새 챕터/주차 강의 가이드 컴포넌트 만들 때, 단계별 카드 + 스크린샷 + 프롬프트 박스 + 라이브 데모 통합할 때 |
| [테마 토글 (filter invert) + 와이드 반응형](ui/theme-toggle-filter.md) | 다크 디자인에 라이트 모드 빠르게 추가, 와이드 데스크탑에서 #root 폭 고정 풀고 좌우 빈공간 제거 |
| [운영자/강사 프로필 모듈 + 도용 방지](ui/operator-profile-module.md) | 운영자/강사 프로필 위치 변경, 새 페이지에 강사 시그니처 추가, 도용 방지 카피·라이선스 문구 수정, site.json operator 스키마 확장 |

## 프론트엔드 구조

| 문서 | 언제 읽나 |
|------|----------|
| [컴포넌트 위치 규칙](frontend/component-placement.md) | 새 컴포넌트 파일 어디 만들지 결정할 때 |
| [가이드 페이지 구조](frontend/guide-page-structure.md) | 가이드 페이지 수정, 사이드바/레이아웃 손볼 때 |
| [EventDetail 모듈화 기획](frontend/event-detail-modularization.md) | EventDetail 수정, 신청·지도·강의안 컴포넌트 분리할 때 |
| [Curriculum-Class 패턴 + ClassRegistration](frontend/class-registration-pattern.md) | 새 강의 회차 추가, ClassRegistration 컴포넌트 수정, 같은 교안으로 N회차 열 때, 결제·환불·신청 박스 변경 |
| [Admin 인라인 편집 패턴 (Role-aware UI + JSON 영구 저장)](frontend/admin-inline-editing-pattern.md) | 강의 CRUD inline UI, AdminOnly 가드, useEvents 훅, ClassEditor 모달, /admin 보조 뷰, Vite dev 미들웨어 확장 |
