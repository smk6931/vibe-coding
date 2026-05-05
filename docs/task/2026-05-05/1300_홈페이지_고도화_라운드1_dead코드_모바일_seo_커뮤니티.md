# 홈페이지 고도화 라운드 1 — Dead 정리 / 모바일 / SEO / 커뮤니티 숨김

작업일: 2026-05-05
선행: 라우트-파일 매핑 + Next.js 잔재 정리 (1130~1230)
컨텍스트: 백엔드(유저 기능) 도입 미루고 1차 강의(5/10) 전 사이트 다듬기로. P2(운영자 사진·계좌 등) 는 admin CRUD 패턴이 이미 처리해 별도 작업 불필요.

---

## 1. MiniHompyLive dead 정리

| 변경 | 결과 |
|------|------|
| `git rm front/src/pages/guide/oneday/components/MiniHompyLive.jsx` | 컴포넌트 import 0건이라 안전 삭제 |
| `front/src/data/curriculums.json` + `front/public/data/curriculums.json` | `"demoComponent": "MiniHompyLive"` 필드 제거 (실제 매핑 로직 없는 dead 필드) |
| `MiniHompyLive.module.css` | **보존** — `MiniHompyDemo.jsx` 가 import 중 (스타일 공유) |

## 2. 모바일 360~430px 검수 + 수정

### 검수 결과 — 손볼 곳 2건만

| 위치 | 문제 | 수정 |
|------|------|------|
| `pages/admin/index.jsx` 헤더 "events.json 영구 저장" 버튼 | 모바일에서 라벨이 너무 길어 깨짐 | 모바일에선 "영구 저장", 데스크탑에선 "events.json 영구 저장" 분기 |
| `components/ClassEditor.jsx` 모달 헤더 4버튼 | 모바일 폭에서 가로 overflow 가능 | `flex-wrap justify-end` + 모바일 padding/폰트 한 단계 줄임 + "미리보기 반영" → "미리보기" 단축 |

### 검수 결과 — 안전 확인 (수정 없음)

- `ClassRegistration` — 6박스 grid `gap-4 sm:grid-cols-2`, 모바일 1열로 자연 stack
- `Week1.jsx` UpcomingClasses — `grid gap-3 sm:grid-cols-2`, 회차 카드 1열 stack
- `OnedayClassCurriculum` 챕터 아코디언 — 기존 모바일 패턴 잘 잡혀있음
- `HomeClient` 카드 그리드 — 이미 모바일 2열 기본

> **운영자가 직접 확인 필요**: dev 서버 + 414×896(iPhone XR) viewport 로 `/`, `/events/evt-week1-2026-05-10`, `/admin`, `/guide/oneday/week1` 한 번씩 진입.

## 3. SEO + OG 태그 추가 (`front/index.html`)

추가:
- `<title>` 풍부화 — "바이브 세션 — Claude로 첫 웹사이트 만들기 원데이 클래스"
- `<meta name="description">` — 한국어 자연스러운 한 줄
- `<meta name="theme-color">` — `#4f46e5` (brand)
- **Open Graph 7건** (og:type, og:site_name, og:title, og:description, og:url, og:image, og:image:width/height, og:locale)
- **Twitter Card** (summary_large_image)
- `<link rel="canonical">` — `https://vibe.me.kr/`

OG 이미지: `https://vibe.me.kr/images/event-thumbnails/evt-001-minihome.png` (기존 미니홈피 썸네일 재사용. 향후 운영자 본인 사진으로 교체 가능).

검증: 카카오톡 입력창에 `https://vibe.me.kr/` 붙여넣어 미리보기 카드 확인. 안 보이면 카카오 캐시 무효화 필요 (https://developers.kakao.com/tool/clear/og 같은 도구).

## 4. community 숨김 처리

운영 시작 전 더미 데이터(가짜 멤버·QA·쇼케이스)가 사이트에서 그대로 노출되던 문제.

| 변경 | 효과 |
|------|------|
| `components/Header.jsx` MAIN_NAV 에서 `'/community'` 항목 주석 처리 | 헤더에서 "커뮤니티" 메뉴 사라짐 |
| `pages/community/CommunityLayout.jsx` 헤더에 "준비중 · 더미 데이터" 배지 + 안내 한 줄 | 직접 URL 진입 시 "운영 전" 명시 |

데이터 자체는 보존 — 운영자 향후 admin 으로 채울 자리.

활성화 트리거 (Header 주석 풀기):
- 1차 강의 1~3회 운영 + 진짜 멤버 가입 시작
- 또는 운영자 본인이 쇼케이스/QA 시드 콘텐츠 채우기 시작

## 안 한 것 / 보류

- **P4 홈 카드 필터·지도 UX 개선** — 빈 결과 안내·admin "+ 새 강의" 진입점 등 이미 충분. 큰 변경은 1차 운영 후 사용자 피드백 받고 결정.
- **백엔드 (유저 기능, 신청 폼, 결제)** — Phase 0/1 룰 + DB 도입 트리거 미도달. 1차 강의 + 회당 5명 이상 2~3회 연속 후 재검토.

## 다음 단계 후보

- 운영자 본인이 admin 모드 켜고 5/10 강의의 `payment.bank/account` 진짜 값으로 채우기 (TODO 마커 정리)
- 운영자 사진 다른 컷으로 교체 (현재 카페 컷)
- 2주차 교안 본문 작성 (`Week2.jsx` 채우기 + curriculums.json 에 oneday-week-2 추가)
- 인스타그램·당근 공유용 카드 이미지 별도 제작 (OG 이미지 교체)
