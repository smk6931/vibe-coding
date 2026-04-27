# 바이브 세션 — 프로젝트 룰 (Vibe Coding 모임 플랫폼)

선행 문서: `docs/plan/2026-04-25/1043_바이브코딩_소모임_플랫폼_1차기획안.md`, `docs/plan/2026-04-25/1121_프로토타입_데모_기획.md`

## Agent 참조 문서 (agents/)

작업 전 관련 문서만 골라 읽는다. 전체 목록: [`agents/README.md`](agents/README.md)

| 작업 상황 | 읽을 문서 |
|----------|----------|
| 카드 UI (썸네일+토글) 만들 때 | `agents/ui/card-thumbnail-toggle.md` |
| MiniHompy 수정/scale 조정 | `agents/ui/mini-hompy-demo.md` |
| 새 컴포넌트 파일 위치 결정 | `agents/frontend/component-placement.md` |
| 가이드 페이지 레이아웃 수정 | `agents/frontend/guide-page-structure.md` |

## 1. 디자인 원칙 — **모바일 우선**

이 사이트의 대다수 사용자는 휴대폰으로 진입한다 (인스타·당근·카톡 공유 → 모바일 클릭).
따라서 모든 화면 설계와 코드 결정은 **모바일을 1차, 데스크탑을 enhancement** 로 본다.

### 1-1. 작업 순서 (코드 짤 때마다 적용)
1. 먼저 **너비 360~430px 기준** 으로 디자인·코드를 짠다.
2. `sm:` (640+), `md:` (768+), `lg:` (1024+) 브레이크포인트로 데스크탑 강화.
3. 마우스 hover 의존하지 않는다 — 모바일은 hover 없음. 핵심 정보는 항상 보이게.
4. 데스크탑 미리 보고 설계하면 반드시 모바일에서 깨진다 — 순서 지킨다.

### 1-2. 컨테이너 / 폭
- 일반 페이지: `max-w-7xl mx-auto px-4 sm:px-6` (`.container-page` 클래스).
- 대시보드처럼 가로 폭을 최대한 써야 하는 페이지: 컨테이너 없이 풀폭 + 자체 inner padding.
- 어드민/마이 같은 데이터 헤비 페이지: `max-w-7xl` 유지하되 페이지 내부에 좌측 sub-nav 허용.

### 1-3. 헤더 / 네비게이션
- **상단 헤더 + 모바일 햄버거** 정책.
- 좌측 사이드바는 외부 노출 페이지에서는 **금지** (지도/캘린더가 좁아짐).
- 어드민/마이 같은 운영 페이지만 페이지 내부에 좌측 sub-nav 허용.

### 1-4. 컬러 / 톤
- 핵심 액션·자체 강조: `brand-600` (지정 팔레트).
- 본문 회색 계열은 `slate-*` 만 사용 (`gray-*` 금지 — 일관성).
- 상태색: 성공 `emerald-*`, 경고 `amber-*`, 위험 `rose-*`.
- 자체 이벤트와 외부 이벤트는 **색·아이콘 두 가지 모두로** 구분 (색약 사용자 고려).

### 1-5. 카드 / 간격
- 카드: `rounded-2xl border border-slate-200 shadow-sm bg-white` (`.card`).
- 카드 패딩 모바일 `p-4`, 데스크탑 `sm:p-5` 또는 `sm:p-6`.
- 섹션 사이 간격: 모바일 `py-8`, 데스크탑 `sm:py-12`.

### 1-5-1. 모바일 카드 그리드 (중요 — 2026-04-25 확정)
- **모바일 이미지 카드 썸네일은 가로 2장 (또는 작은 카드면 3장) 으로 나열**한다. 모바일에서 1열 풀폭은 금지 — 한 번에 너무 적게 보이고 스크롤 길이만 늘어남.
- 표준 그리드: `grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`. 작은 썸네일은 `grid-cols-3`도 OK.
- 카드 텍스트는 줄임표(`line-clamp-2`) + 핵심 정보(가격/D-day) 우선 노출. 2열에서 깨지지 않게 `text-[13~14px]` 유지.
- 카드 간 gap은 모바일 `gap-2` ~ `gap-3`, 데스크탑 `sm:gap-4`.

### 1-5-2. 모바일 아코디언 (섹션 접기/펼치기)
- **지도 / 카드 리스트 / 추천 / 캘린더 같이 큰 섹션은 모바일에서 아코디언(접기/펼치기) 가능해야** 한다. 한 페이지에 세로로 다 보여주되, 사용자가 필요 없는 섹션은 접어서 컴팩트하게.
- 컴포넌트: `components/Accordion.tsx`. 재사용. 데스크탑(`lg:`)에서는 항상 펼친 상태 유지(접기 버튼 숨김) — 데스크탑은 화면이 커서 접을 이유가 없음.
- 기본 펼침 상태:
  - 모바일: 첫 진입 시 핵심 1개 섹션(예: 카드 리스트)만 펼침. 나머지는 접힘.
  - 데스크탑: 모두 펼침.
- 아코디언 헤더에 섹션 이름 + 카운트(예: "지도 14") + chevron(▾/▸) 표시. 클릭으로 토글.
- 아코디언 내부 sticky는 금지(접힌 상태에서 sticky가 살아 있으면 깨짐).

### 1-6. 디자인 레퍼런스 / 톤 정책
- 톤 키워드: **거창하지 않고 / 친근하고 / 비싸 보이지 않으며 / 찍먹 가능한** 작은 코딩 모임.
- 레퍼런스: 토스(친근 미니멀) + 당근(따뜻 컬러) + Airbnb(사진 위주 카드) 의 혼합. 노션/Linear 같은 차가운 미니멀은 피한다.
- 카드는 **사진 상단 + 텍스트 하단** 구조. 더미 이미지는 Unsplash 직링크 사용, 운영 시 본인이 찍은 사진으로 교체.
- **이모지 금지** (마커의 ★ 와 위치 📍 같은 기능적 픽토그램만 예외). 회원 아바타는 `Avatar.tsx` 의 이니셜+컬러 사용.
- 컬러: brand(indigo) 주 + warm(amber) 보조. 자체 강의는 ★ + warm 톤으로 강조.
- 그라디언트는 사진 위 오버레이용으로만. 면 단위 큰 그라디언트는 비싸 보여서 피함.

### 1-7. 사진 정책
- Phase 1 (현재): Unsplash 직링크 (`https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w=800&q=80`). 외부 의존 OK, 키 불필요.
- Phase 2 (운영 후): 운영자 본인이 모임 현장에서 찍은 사진으로 교체. 자체 강의는 매 회차 1장 이상의 모임 후 사진 의무.
- `next.config.mjs` 의 `images.unoptimized: true` 정책 유지 (정적 export 호환).

## 2. 지도 정책

### 2-1. 1순위 (현행): OpenStreetMap + Leaflet
- **선택 이유**: 키 발급 0, 도메인 등록 0, 가입 0. 진입 장벽 0.
- 라이브러리: `leaflet` + `react-leaflet`. `next/dynamic({ ssr: false })` 로 클라이언트 전용 import (Leaflet은 window 의존).
- 컴포넌트: `front/components/LeafletMap.tsx` (`LeafletMultiMap`, `LeafletSingleMap`).
- 마커는 `L.divIcon` 으로 Tailwind 컬러(brand-600 / slate-500)와 ★ 표식 사용 → 자체/외부 시각 구분 그대로 유지.
- 모임 장소 이름(`venue.name`)은 마커 클릭 시 popup에서 강조 노출 ("📍 강남역 PLAY 스터디룸").

### 2-2. 한계 (인지하고 가기)
- 한국 POI 자동 라벨이 약함 (카페·스터디카페 자동 표시 X).
- "근처 스터디카페 추천" 같은 검색 API 없음 (카카오/네이버 places API 필요한 영역).
- 대신 **직접 등록한 venue.name + address + lat/lng만으로도 충분히 의미 전달**됨.

### 2-3. 후순위 (장차 필요 시): 카카오맵 / 네이버 NCP Maps
- 둘 다 도메인 등록 + 키 발급 필요.
- 도입 트리거: "근처 스터디카페 자동 추천" 같은 places 검색 기능이 필요해질 때.
- 카카오 도메인 검증은 포트까지 정확히 매칭. 네이버는 NCP 가입 + 카드 등록 필요.

### 2-4. 환경변수
- 현재 OSM 사용에는 환경변수 불필요. `front/.env.local` 의 `NEXT_PUBLIC_KAKAO_MAP_KEY` 는 미사용 상태로 둠 (장차 카카오 전환 시 활성).
- `components/KakaoMap.tsx` 도 보존 (장차 재도입용 참고 코드). 활성 import 경로에서는 사용 안 함.

## 3. 결제 정책 (선행 기획안 5-A 참조)

- Phase 0 (지금): 소모임 앱 + 계좌 송금. 사이트 0줄.
- Phase 1: 사이트 + 토스 송금 링크 + 신청 폼 (PG 미도입).
- Phase 2: 토스페이먼츠 / 포트원 PG 도입. 트리거: 월 매출 100만 / 월 신청자 40~50 / 노쇼율 15~20% 중 하나라도 만족.
- 결제 코드 작성 시 **Phase 2 진입 시점까지 PG 자동 결제 흐름은 사이트에 박지 않는다**. 송금 안내 + 입금 확인 폼 정도.

## 4. 코드 룰

### 4-0. 프레임워크 (확정)
- 프론트엔드는 **React (Next.js 14, App Router)** 로 작성한다. 즉 모든 페이지·컴포넌트는 이미 React 컴포넌트.
- 다른 프레임워크(Svelte/Vue/순수 HTML 등) 도입 금지. 단일 스택 유지가 1인 운영자 유지보수에 유리.
- "리액트로 다시 짜야 하나" 같은 질문은 이미 React이니 불필요. 화면이 깨져 보이면 코드 문제가 아니라 **CSS/빌드/캐시/환경변수** 쪽을 먼저 의심.

### 4-1. `.next/` 동시 사용 금지
- 같은 프로젝트(`front/`)에 dev 서버를 **2개 이상 동시에 띄우지 않는다**. 같은 `.next/` 캐시를 공유해 manifest·CSS 해시가 깨짐.
- **dev 서버가 도는 동안 `npm run build` 도 돌리지 않는다**. build가 .next 매니페스트를 덮어써서 dev가 500 에러로 빠짐.
- **`output: 'export'` 빌드 직후 dev 를 시작하면 `Cannot find module './XX.js'` 가 뜬다**. export 빌드는 dev와 매니페스트 형식이 다름 → dev 시작 전 반드시 `.next` 삭제.
- 빌드 검증은 dev를 종료한 뒤 수행하거나, dev 재시작 전 `.next` 정리로 정합성 회복.
- 한 번에 한 포트만(예: 3200). 다른 포트가 필요하면 기존 dev를 먼저 종료.

### 4-1-1. 자주 헷갈리는 거 — 무시해도 되는 노이즈
- `GET /.well-known/appspecific/com.chrome.devtools.json 404` — Chrome DevTools가 워크스페이스 자동 매핑용으로 보내는 요청. 처리 안 해도 됨.

### 4-2. 환경변수 적용
- `.env.local` 변경 후엔 **반드시 dev 서버 재시작** (Hot reload 안 됨).
- `NEXT_PUBLIC_*` 만 클라이언트에 노출. 그 외는 서버 전용.

### 4-3. 컴포넌트 분리
- 클라이언트 인터랙션이 있는 화면(필터·뷰 토글·맵 핸들러)은 별도 클라이언트 컴포넌트(`'use client'`).
- 페이지 컴포넌트(`app/**/page.tsx`)는 가급적 서버 컴포넌트로 두고 데이터 import → props로 전달.

### 4-2. 데이터
- Phase 1: `public/data/*.json` 직접 import (정적 번들).
- Phase 2: 같은 스키마를 PostgreSQL로 그대로 옮긴다. 더미 JSON 필드명을 DB 컬럼명과 동일하게 유지.
- 자체/외부 이벤트는 같은 테이블에 `source = 'internal' | 'external'` 컬럼으로 구분.

### 4-3. 한국어 / 인코딩
- 모든 사용자 노출 텍스트는 한국어 우선. 영문 보조 OK.
- Windows 환경에서 한글 파일/콘솔 출력 시 글로벌 룰의 UTF-8 강제 정책 따름.

### 4-4. Next.js
- 14.x App Router, `output: 'export'` (Phase 1 정적 빌드).
- `trailingSlash: true` 유지 (Nginx `try_files` 와 호환).
- 동적 라우트는 `generateStaticParams` 로 prerender.

## 5. 배포 정책

- 배포 대상: 오라클 클라우드 VM 단독 + Nginx 정적 호스팅.
- 1차 URL: IP 직주소 (`http://167.x.x.x/`). 도메인은 Phase 3.
- 배포 스크립트 — 같은 `deploy.config.json` 을 읽고 동일 동작:
  - `front/server.ps1` (Windows / PowerShell)
  - `front/server.py` (cross-platform / Python, 한글 출력 UTF-8 강제)
- 흐름: `npm run build` → `./out` → SSH로 `mkdir+chown` → rsync(없으면 scp) → `nginx -t && systemctl reload nginx` → `curl http://IP/` 응답 확인.
- **비밀값 분리**: `deploy.config.example.json` 만 git 트래킹. 본인 IP/SSH 키 경로가 들어간 `deploy.config.json` 과 `deploy.config.local.ps1` 은 `.gitignore` 로 절대 커밋 금지.
- 1주 내 세팅 필수: PostgreSQL(추후 백엔드 추가 시) 일일 백업, ufw + 오라클 Security List 동시 열기, SSL은 도메인 붙는 시점에.

## 6. 작업 진행 룰

- 글로벌 CLAUDE.md의 "확인 없이 바로 진행" 원칙 준수.
- 다만 모바일 우선·지도·결제 단계 진화 룰은 이 문서가 우선.
- 의미 있는 작업 후엔 `docs/task/YYYY-MM-DD/HHMM_*.md` 에 작업 로그 (글로벌 룰의 로그 기준 적용).

## 7. 폴더 구조

```
c:\GitHub\vibe_coding\
├── CLAUDE.md                     # 이 파일 (프로젝트 AI 룰)
├── README.md                     # 아키텍처 + 구조 + 실행법
├── server.py                     # 빌드 + Oracle VM 배포 스크립트
├── docs/
│   ├── plan/                     # 기획안 (YYYY-MM-DD/HHMM_*.md)
│   └── task/                     # 작업 로그 (YYYY-MM-DD/HHMM_*.md)
│
├── front/                        # React 프론트엔드 (Vite + React Router v6)
│   ├── src/
│   │   ├── app.jsx               # BrowserRouter + 라우트 조립 (routes/만 import)
│   │   ├── routes/               # ★ 라우트 정의 전용 폴더
│   │   │   ├── index.js          # 전체 라우트 re-export
│   │   │   ├── community.jsx     # /community/* 라우트
│   │   │   └── guide.jsx         # /guide/* 라우트
│   │   ├── pages/                # 페이지 UI 컴포넌트 (라우트 로직 없음)
│   │   │   ├── Home.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Me.jsx / Admin.jsx / About.jsx
│   │   │   ├── community/        # CommunityLayout + index/board/members/qa
│   │   │   └── guide/            # GuideLayout + GuideSidebar + oneday/beginner/claude
│   │   ├── components/           # 재사용 UI 컴포넌트
│   │   ├── client/               # 백엔드 API 통신 (axios)
│   │   ├── lib/                  # 유틸리티 함수
│   │   └── styles/               # Tailwind base CSS
│   └── public/data/              # Phase 1 더미 JSON → Phase 2에 PostgreSQL 이전
│
└── back/                         # Django 백엔드 (DRF + PostgreSQL)
    ├── config/settings/          # base / local / production
    ├── apps/                     # 도메인별 앱 (accounts / events / community)
    ├── manage.py
    ├── requirements.txt
    └── venv/                     # Python 가상환경 (git 제외)
```

### src/ 폴더 역할 요약

| 폴더 | 역할 | 새 파일 추가 시기 |
|------|------|------------------|
| `routes/` | URL → 컴포넌트 매핑 | 새 URL 경로 추가할 때 |
| `pages/` | 페이지 UI (라우트 정의 없음) | 새 화면 추가할 때 |
| `components/` | 2개 이상 페이지에서 재사용하는 컴포넌트 | 공통화 필요할 때 |
| `client/` | 백엔드 API 호출 함수 | 새 API 엔드포인트 연결할 때 |
