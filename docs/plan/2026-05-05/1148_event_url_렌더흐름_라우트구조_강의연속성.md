# `https://vibe.me.kr/events/evt-week1-2026-05-10` — 렌더 흐름 + 라우트/연속성 개선안

작성: 2026-05-05 11:48
대상 URL: https://vibe.me.kr/events/evt-week1-2026-05-10
이 문서는 (1) 그 한 페이지가 어떻게 완성되는지 추적하고 (2) 그 위에서 라우트 구조 / 강의 연속성 구조를 어떻게 바꾸면 좋을지 제안한다.

---

## Part 1 — 이 URL이 페이지가 되기까지

### 1-1. 네트워크 → React 부팅

```
브라우저 GET https://vibe.me.kr/events/evt-week1-2026-05-10
        ↓
Nginx (오라클 클라우드 VM, /var/www/vibe)
        ↓ try_files (파일 없음 → SPA fallback)
index.html  + dist/assets/index-{hash}.js  반환
        ↓
front/src/main.jsx
  ReactDOM.createRoot(#root).render(<React.StrictMode><App/></React.StrictMode>)
        ↓
front/src/app.jsx
  <BrowserRouter>
    <RoleProvider>             ← 운영자/일반/admin 역할 컨텍스트
      <Header />                ← 상단 nav (전역)
      <Suspense fallback={LoadingSpinner}>
        <Routes>
          <Route path="/events/:id" element={<EventDetail/>} />   ← 매칭
          ... (다른 라우트)
        </Routes>
      </Suspense>
      <Footer />                ← 전역 푸터 (도용 방지 시그니처 1)
      <DevOperatorEditor />     ← dev 환경 운영자 인라인 편집 floating
    </RoleProvider>
  </BrowserRouter>
```

### 1-2. EventDetail 컴포넌트 진입

`pages/EventDetail.jsx`

```js
const { id } = useParams();              // "evt-week1-2026-05-10"
const events = useEvents();              // events.json (+ admin localStorage override)
const { role } = useRole();
const found = events.find(e => e.id === id);
const event = found && (found.isPublished !== false || role === 'admin') ? found : null;
```

`events` 는 `lib/useEvents.js` 에서 옴 — `useSyncExternalStore` 로 평소엔 `public/data/events.json` 그대로, admin 인라인 편집 중이면 `localStorage.__dev_events_override` 우선.

### 1-3. 매칭된 events.json 객체 (요약)

```jsonc
{
  "id": "evt-week1-2026-05-10",
  "isPublished": true,
  "source": "internal",            // → isInternal=true → 자체 강의 분기 (★ 배지, 편집 버튼, ClassRegistration 노출)
  "type": "oneday_class",          // → showCurriculum=true → OnedayClassCurriculum 노출
  "curriculumId": "oneday-week-1", // → curriculums.json 의 "oneday-week-1" 매칭
  "title": "...", "host": {...}, "startAt": "...", "endAt": "...",
  "venue": { "name", "address", "lat", "lng", "url", "directions" },
  "price": 25000, "capacity": 4, "remaining": 4, "minHeads": 3,
  "description": "...", "tags": [...], "thumbnail": "...",
  "applyUrl": "https://open.kakao.com/o/suOWUYsi",
  "payment": { "method", "bank", "account", "holder", "memoFormat", "guide" },
  "policies": { "minHeadsNotice", "refund": [...] }
}
```

### 1-4. 화면 구성 (EventDetail 안에서 위→아래)

| # | 영역 | 컴포넌트 / 코드 | 사용 데이터 |
|---|------|----------------|-----------|
| 0 | 상단 헤더 (전역) | `components/Header.jsx` | - |
| 1 | "← 전체 모임" 링크 + admin 편집 버튼 | EventDetail 본문 + `AdminOnly.AdminDevOnly` | role |
| 2 | 16:8 배너 — 미니홈피 라이브 데모 | `MinihomeBanner` (같은 파일) → `pages/guide/oneday/MiniHompyLive.jsx` (mode="banner") | (자체 컴포넌트) |
| 3 | 좌상단 배지 3개 (★ 자체, D-day, 유형) | inline + `lib/format.js` (`dDay`, `eventTypeLabel`) | `event.startAt`, `event.type` |
| 4 | 제목 (h1) | inline | `event.title` |
| 5 | 강사 1줄 카드 (자체 강의에만) | `components/InstructorMicroCard.jsx` | `site.json.operator` (name, photo, title) |
| 6 | 소개 (description) | inline | `event.description` |
| 7 | 태그 칩들 | inline | `event.tags[]` |
| 8 | **신청 박스 5종** | `components/ClassRegistration.jsx` | `event` + `curriculums.json[event.curriculumId]` |
|   | ├ 일시·장소 | `DateVenueBox` | `event.startAt/endAt/venue/level` |
|   | ├ 결제 안내 (계좌이체) | `PaymentBox` | `event.payment` |
|   | ├ 환불·연기 정책 | `PoliciesBox` | `event.policies` |
|   | ├ 준비물 체크리스트 | `PrerequisitesBox` | `curriculum.prerequisites[]` |
|   | └ 신청 CTA (카톡 오픈채팅) | `ApplyCTA` | `event.applyUrl/remaining/capacity` |
| 9 | **1주차 교안** (oneday_class 만) | `components/OnedayClassCurriculum.jsx` (375줄) | TIMELINE/PREP 인라인 데이터 + `site.json.kakaoOpenChatUrl` |
|   | ├ 프롤로그 타임라인 | `PrologueTimeline` | TIMELINE 배열 |
|   | ├ 클래스 미리보기 (스크린샷) | `ClassPreview` | PREVIEW_SHOTS 배열 |
|   | ├ 사전 준비 안내 | `PrepSection` | PREP 배열 |
|   | ├ Chapter 아코디언 (1·2·3장) | `ChapterAccordion` 3개 | - |
|   | │   ├ Chapter 1 | `components/GitHubGuide.jsx` (237줄, `.module.css` 공유) | SECTIONS 인라인 |
|   | │   ├ Chapter 2 | `components/MiniHompyGuide.jsx` (212줄) → `MiniHompyLive` 임베드 | SECTIONS 인라인 |
|   | │   └ Chapter 3 | `components/VercelGuide.jsx` (291줄) | SECTIONS 인라인 |
|   | │       └ (셋 다 사용) | `components/PromptRef.jsx` (방금 추출, 32줄) | - |
|   | └ 본문 끝 시그니처 | `components/CurriculumSignature.jsx` | `site.json.operator` + CC BY |
| 10 | admin 편집 모달 (트리거 시) | `components/ClassEditor.jsx` (348줄) | event + curriculums |
| 11 | 전역 푸터 (도용 방지 시그니처) | `components/Footer.jsx` | `site.json.operator` |
| 12 | dev 운영자 인라인 편집 floating | `components/DevOperatorEditor.jsx` | `site.json.operator` |

### 1-5. 의존성 그래프 (한 화면 = 12개 컴포넌트 + 3개 JSON + 5개 lib)

```
EventDetail.jsx (140줄)
├── lib/useEvents.js ─────────► public/data/events.json
├── lib/RoleContext.jsx
├── lib/format.js (dDay, eventTypeLabel)
├── public/data/site.json (operator, kakaoOpenChatUrl)
├── components/InstructorMicroCard.jsx ───► site.json.operator
├── components/ClassRegistration.jsx (205줄)
│   ├── lib/format.js (formatDateTime, formatKRW, dDay)
│   └── public/data/curriculums.json
├── components/OnedayClassCurriculum.jsx (375줄)
│   ├── components/GitHubGuide.jsx (237줄)
│   │   └── PromptRef.jsx
│   ├── components/MiniHompyGuide.jsx (212줄)
│   │   ├── PromptRef.jsx
│   │   └── pages/guide/oneday/MiniHompyLive.jsx
│   ├── components/VercelGuide.jsx (291줄)
│   │   └── PromptRef.jsx
│   └── components/CurriculumSignature.jsx ───► site.json.operator
├── pages/guide/oneday/MiniHompyLive.jsx (배너 모드)
├── components/ClassEditor.jsx (348줄, admin 편집)
└── components/AdminOnly.jsx (AdminDevOnly)
```

### 1-6. 핵심 통찰

- **events.json (회차 메타)** + **curriculums.json (교안 메타)** 가 `curriculumId` 로 연결되는 **N:1 (Class:Curriculum)** 패턴.
  → 같은 교안으로 5/10, 5/24, 6/7 N회 열어도 curriculum 1건만 유지하면 됨.
- 1주차 교안 컴포넌트(`OnedayClassCurriculum`) 는 **현재 1주차 전용으로 하드코딩**돼 있음. 데이터(TIMELINE / PREP / 3개 Chapter SECTIONS)가 컴포넌트 안에 있음.
  → 2주차 교안을 만들 때 이 패턴이 그대로 복제될 위험 큼 (이미 GitHubGuide/MiniHompyGuide/VercelGuide 가 동형 패턴).
- 운영자 시그니처는 InstructorMicroCard / CurriculumSignature / Footer 3군데 분산 노출 (도용 방지).

---

## Part 2 — 라우트 구조 추천

### 2-1. 현재 구조

```
src/app.jsx
  Routes
    /            → Home              (인라인 lazy)
    /events/:id  → EventDetail       (인라인 lazy)         ← 묶을 그룹 없음
    /me          → Me                (인라인 lazy)
    /admin       → Admin             (인라인 lazy)
    /about       → About             (인라인 lazy)
    {communityRoutes.map(...)}       ← src/routes/community.jsx (4개)
    {guideRoutes.map(...)}           ← src/routes/guide.jsx (9개, 방금 demo 추가됨)
```

### 2-2. 결론 — **지금은 빼지 말고, 늘어나는 시점에 빼라**

`/events/:id` 1줄을 routes/events.jsx 로 빼면 파일 1개에 1줄짜리 오버헤드만 생김. routes/ 분리의 가치는 **2개 이상의 그룹**일 때 나옴 (community 4개·guide 9개가 좋은 사례).

### 2-3. 분리 트리거 (when X+ 라우트가 생기면)

| 그룹 | 분리 트리거 | 분리 시점 파일 예시 |
|------|-----------|-------------------|
| events | `/events/:id` 외에 `/events/new` 또는 `/events/:id/register`, `/events/:id/checkin` 등 2개 이상 추가될 때 | `routes/events.jsx` |
| account | `/me` 외에 `/me/applications`, `/me/saved`, `/login`, `/signup` 등 인증 흐름 들어올 때 (Phase 2) | `routes/account.jsx` |
| static | `/about` 만 있는 동안은 인라인. `/policies`, `/refund-policy`, `/legal` 추가 시 | `routes/static.jsx` |

### 2-4. (선택) 미리 정리 — `/library` 같은 미정의 데드 라우트는 routes에 두지 말 것

오늘 리팩토링에서 이미 `/library` Link → `/guide` 로 변경. routes/guide.jsx 안에 미정의 페이지를 두는 일은 피한다 (오늘 등록한 9개는 모두 페이지 코드 있음).

---

## Part 3 — 강의 연속성 구조 (1주차 → 2~4주차) 추천: **하이브리드 C**

### 3-1. 옵션 비교

| 옵션 | 모델 | 장점 | 단점 | CLAUDE.md 톤 부합 |
|------|------|------|------|-----------------|
| A. 독립 원데이 4개 | 각 주차 단독 신청. 들은 사람이 본인 의지로 다음 주차 신청 | 진입 부담 0. 신청 단순. 운영 부담 ↓ | 연속성 약함. 다음 주차 홍보가 따로 필요 | ◯ "찍먹" |
| B. 4주 코스 묶음 | 1주차 신청 = 4주 다 등록. 가격 묶음 | 연속성 최고. 매출 묶음 | 첫 진입 부담 ↑. 환불 복잡 | ✗ "찍먹" 위배 |
| **C. 하이브리드** ✅ | 1주차 단독 신청 가능 + EventDetail 하단에 "다음 주차 이어 듣기 →" 카드 (자율) | 진입 부담 0 + 자연스러운 연속 안내. 운영자도 1주차 본 뒤 결정 가능 | 데이터 모델 1필드 추가 | ◎ |

추천: **C**. 사용자 본인 의견("다음주차 엮을 수 있게") 과 일치하고, 톤 키워드("찍먹 가능한") 도 보존.

### 3-2. 데이터 모델 변경 (최소)

**curriculums.json — 1필드 추가**

```jsonc
[
  {
    "id": "oneday-week-1",
    "title": "Claude로 첫 웹사이트 만들기 — 1주차",
    // ... 기존 필드 ...
    "nextCurriculumId": "oneday-week-2",   // ← 신규: 다음 주차 curriculum id
    "seriesOrder": 1,                      // ← 신규: 시리즈 내 순번 (선택)
    "seriesId": "oneday-vibe-2026"         // ← 신규: 시리즈 묶음 id (선택, 향후 시리즈 페이지용)
  },
  {
    "id": "oneday-week-2",
    "title": "Claude로 첫 웹사이트 만들기 — 2주차 (인터랙션 추가하기)",
    "nextCurriculumId": "oneday-week-3",
    "seriesOrder": 2,
    "seriesId": "oneday-vibe-2026",
    // ... 새 교안 필드 ...
  }
]
```

이 하나로:
- 단방향 링크(이전 주차 → 다음 주차)는 `nextCurriculumId` 1필드면 끝
- 양방향 / 시리즈 전체 보기가 필요하면 `seriesId` 로 그룹화 가능 (옵션)

**events.json — 변경 없음**. 회차(이벤트)는 그대로 `curriculumId` 만 가지면 됨. 같은 교안의 N회차 = 같은 `curriculumId` (이미 패턴 일치).

### 3-3. UI 변경 (최소)

**EventDetail.jsx 하단 — `ClassRegistration` 박스 다음에 "다음 주차" 카드 1개 추가**

```jsx
{showCurriculum && curriculum?.nextCurriculumId && (
  <NextCurriculumCard
    nextCurriculumId={curriculum.nextCurriculumId}
    events={events}
  />
)}
```

`NextCurriculumCard` 컴포넌트 신규 (`components/NextCurriculumCard.jsx`, 50줄 이내):
- `curriculums.json` 에서 다음 주차 메타 가져옴 (제목, summary, level)
- `events.json` 에서 다음 주차 회차 중 가장 가까운 것 1건 (게시·미만석) 가져옴
- 카드 UI: "📚 이어서 들으면 좋은 다음 강의 — {2주차 제목}" + "다음 회차: {날짜} · {잔여석}" + 클릭 → 그 회차 EventDetail 로 이동
- 다음 회차 게시건이 없으면: "준비 중 — 카톡 오픈채팅에서 일정 안내" 폴백

**OnedayClassCurriculum.jsx 끝부분 — "다음 주차로 이어보기" 1줄 안내** (선택)
- 교안 본문 다 읽은 뒤 자연스러운 다음 액션 제시
- CurriculumSignature 위에 1줄 + 화살표

### 3-4. 1·2·3·4주차 교안 컴포넌트 어떻게 짤지 (장기)

현재: 1주차 = `OnedayClassCurriculum.jsx` 단일 (375줄, TIMELINE 등 데이터 인라인)

**문제**: 2주차도 같은 패턴(프롤로그 타임라인 + 미리보기 + 사전준비 + Chapter 아코디언 N개)일 텐데 그대로 복제하면 `OnedayClassCurriculumWeek2.jsx` (375줄) 가 또 생김 → 향후 4개의 주차 = 1500줄 + 데이터 갱신 시 4곳 수정.

**추천 (Phase: 2주차 교안 만들 때 같이)**:
- `components/curriculum/CurriculumGuide.jsx` 1개 (구조만, ~150줄) — props 로 timeline / preview / prep / chapters 받음
- `front/public/data/curriculum-week1.json`, `curriculum-week2.json`, ... — 데이터만
- 또는 `curriculums.json` 자체에 timeline / prep / chapters 필드 추가해서 단일 소스로
- Chapter 컴포넌트도 `components/curriculum/ChapterGuide.jsx` 1개로 통합 (현재 GitHubGuide/MiniHompyGuide/VercelGuide 동형 패턴)

이건 2주차 교안 작업 시작 시 함께 리팩토링하는 게 비용 효율적. 1주차 단독으로 미리 분리하면 작동하는 코드 건드리는 위험만 있음.

### 3-5. 시리즈 페이지 (선택, Phase 2급)

`seriesId` 도입 시 `/series/:seriesId` 라우트 추가 가능 — 4주 시리즈 전체 일정 + 진행도 + 신청 현황 한눈에. 단 1주차 운영 안정화(2~3회차 진행 + 후기 쌓임) 이후가 자연스러움.

---

## Part 4 — 액션 플랜

### 즉시 (다음 작업 세션)
1. `curriculums.json` 에 `nextCurriculumId` / `seriesOrder` / `seriesId` 필드 추가 (1주차에는 일단 빈 값 또는 null. 2주차 만들면서 채움).
2. `components/NextCurriculumCard.jsx` 신규 (50줄). EventDetail에 마운트.

### 2주차 교안 만들기 시작할 때 (장기 묶음)
3. `components/curriculum/CurriculumGuide.jsx` 통합 컴포넌트로 패턴 추출.
4. `OnedayClassCurriculum.jsx` 데이터 → `public/data/curriculum-week1.json` (또는 curriculums.json 안으로 흡수).
5. `GitHubGuide`/`MiniHompyGuide`/`VercelGuide` → `components/curriculum/ChapterGuide.jsx` 1개 + 데이터 외부화 (이미 0946 분석 보고서 2-2 항목).

### 4주차까지 다 만든 후 (Phase 2급)
6. (선택) `routes/events.jsx` 분리 — `/events/:id` + `/events/:id/register` 등 2개 이상 생기면.
7. (선택) `/series/:seriesId` 라우트 + 시리즈 진행도 페이지.

---

## 부록 — 결정 필요

| # | 결정 | 옵션 |
|---|------|------|
| 1 | 강의 연속성 모델 | (A) 독립 원데이 / (B) 4주 묶음 / **(C) 하이브리드 — 추천** |
| 2 | seriesId 도입 시점 | (A) 지금 1주차에 박아둠 / (B) 2주차 만들 때 같이 / (C) 4주차 다 만든 후 |
| 3 | NextCurriculumCard 의 다음 회차 못 찾았을 때 폴백 | (A) "준비중" 안내 / (B) 카톡 오픈채팅 CTA / (C) 카드 자체 숨김 |
| 4 | curriculum 안에 timeline/prep/chapters 통합 vs 별도 JSON | (A) curriculums.json 1개 (단일 소스) / (B) curriculum-week1.json 등 분리 (가독성) |

위 4건만 답해주면 1주차 → 2주차 연계 첫 PR 짤 수 있음.
