---
Title: Admin 인라인 편집 패턴 (Role-aware UI + JSON 영구 저장)
Description: 같은 페이지를 admin/일반 유저 공용으로 쓰되, role 에 따라 inline 편집 액션만 추가 노출하는 패턴. Phase 0 한정 (Vite dev only).
When-To-Read: 강의·운영자·다른 데이터의 admin CRUD 추가, AdminOnly 가드 사용, Vite dev 미들웨어 확장, role 기반 분기 UI
Keywords: AdminOnly, AdminDevOnly, useEvents, useOperator, RoleContext, ClassEditor, DevOperatorEditor, inline-editing, role-aware, save-events, save-operator, vite middleware, localStorage override
Priority: high
---

# Admin 인라인 편집 패턴

## 핵심 결정

**별도 admin 페이지를 만들지 않는다.** 같은 페이지를 모든 사용자가 보고, `role === 'admin'` 일 때만 inline 편집 액션을 추가 노출한다.

근거:
- 운영자 1인 + 강의 회차 N건 단위 → 별도 admin 표 페이지는 오버엔지니어링
- 운영자가 "사용자가 뭐 보는지" 그대로 보면서 즉시 수정하는 UX (Notion·GitHub README 식 inline editing)
- 이미 `DevOperatorEditor` 가 같은 패턴 → 일관성

`/admin` 라우트는 남기되 **보조 뷰**: 게시 안 된 강의 목록, 빠른 복제 등 운영자 전용 *집계* 화면.

## 권한 가드 — `AdminOnly`

```jsx
import AdminOnly, { AdminDevOnly, DevOnly } from '@/components/AdminOnly';

<AdminOnly>
  <button onClick={openEditor}>편집</button>
</AdminOnly>

<AdminDevOnly>
  {/* admin AND dev 동시 만족 — JSON 직접 저장하는 액션 진입점 */}
  <FloatingEditButton />
</AdminDevOnly>
```

| 가드 | 조건 | 용도 |
|------|------|------|
| `AdminOnly` | `role === 'admin'` | 일반적인 admin 전용 UI |
| `DevOnly` | `import.meta.env.DEV` | dev 미들웨어 의존 도구 (배포 산출물에 안 보임) |
| `AdminDevOnly` | 둘 다 만족 | **CRUD 액션 진입점에 권장** — 잘못된 역할이 운영 사이트에서 가짜 버튼 누르는 사고 방지 |

**한계 (Phase 0)**: `role` 은 `RoleContext.toggleRole()` 로 누구나 토글 가능 (localStorage). 진짜 인증 아님. Phase 1+ 백엔드·JWT 도입 시 `AdminOnly` 내부만 교체하면 호출부 무수정.

## 데이터 단일 소스 + 오버라이드

`useEvents()` (= `useOperator()` 동형 패턴):

```
events.json (seed) ─┐
                    ├─→ useEvents() → 컴포넌트
localStorage 오버라이드 ─┘
```

평소엔 events.json 그대로, admin 편집 중일 땐 localStorage 오버라이드 배열 반환. "영구 저장" 누르면 Vite dev 미들웨어 호출 → 파일 덮어쓰고 오버라이드 클리어.

### `src/lib/useEvents.js` — 공개 API

```js
import {
  useEvents,            // 훅 — 현재 events 배열
  addEvent,             // (event) → 맨 앞에 박음
  updateEvent,          // (id, patch) → 부분 머지
  deleteEvent,          // (id) → 제거
  togglePublish,        // (id) → isPublished 토글
  saveEventsToJson,     // (events) → 파일 영구 저장 (수동)
  commitEventsOverride, // () → 현재 오버라이드를 영구 저장 + 클리어 (권장)
  clearEventsOverride,  // () → 오버라이드 폐기 (되돌리기)
  hasPendingChanges,    // () → 미저장 변경 여부 (UI 배지용)
} from '@/lib/useEvents';
```

**호출 흐름**:
1. admin 모드 진입 → 카드/상세에 inline ✏️ 노출
2. 편집 액션 → `updateEvent`/`addEvent`/`deleteEvent` → localStorage 오버라이드 즉시 반영
3. 사이트 전역에서 변경 미리보기 (다른 컴포넌트도 `useEvents()` 통해 자동 갱신)
4. 만족하면 "영구 저장" 버튼 → `commitEventsOverride()` → events.json 덮어쓰기 + 오버라이드 클리어
5. git commit & push → 배포

## Vite dev 미들웨어 — `vite.config.js`

```
POST /__dev/save-operator   body: operator JSON       → site.json 의 operator 섹션 덮어쓰기
POST /__dev/save-events     body: events 배열 전체    → events.json 통째로 덮어쓰기
```

**`apply: 'serve'`** 라 빌드 산출물에는 절대 포함되지 않음 → 운영 사이트에서는 호출해도 404.

새 데이터 단일 소스를 추가할 때 같은 패턴으로 미들웨어 1개 추가:
```js
server.middlewares.use('/__dev/save-{name}', async (req, res, next) => {
  if (req.method !== 'POST') return next();
  try {
    const data = await readJson(req);
    /* validate */
    await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    ok(res);
  } catch (e) { fail(res, e); }
});
```

## 운영자 워크플로우 (Phase 0)

1. **로컬에서 dev 서버 실행** (`npm run dev`, port 3200)
2. 사이트 우상단 토글로 **role → admin** 전환
3. 카드/상세 페이지의 inline ✏️ 또는 "+ 새 강의" 카드 누름 → ClassEditor 모달
4. 폼 입력 → 저장 → 사이트 전역에 미리보기 (오버라이드)
5. 미리보기 OK → 우상단 "영구 저장" 버튼 → events.json 갱신
6. `git add front/public/data/events.json && git commit && git push`
7. 배포 스크립트 실행 (`server.ps1` / `server.py`)

신청자/일반 유저는 사이트에서 카드 보고 → 상세 페이지의 카톡 오픈채팅 CTA 로 신청 (사이트는 신청 폼 안 받음, Phase 0 룰).

## 컴포넌트 책임 분리

| 파일 | 역할 |
|------|------|
| `lib/useEvents.js` | 데이터 단일 소스 + CRUD 액션 + 영구 저장 |
| `lib/useOperator.js` | 운영자 단일 소스 (동형 패턴) |
| `components/AdminOnly.jsx` | 가드 (`AdminOnly` / `DevOnly` / `AdminDevOnly`) |
| `components/ClassEditor.jsx` | 강의 1건 폼 모달. `mode="create"`/`"edit"`. 안에서 미리보기 반영 + 영구 저장 + 삭제 |
| `components/EventCard.jsx` | 카드 우상단에 admin only ✏️ 편집 + 게시 토글 (자체 강의만). 미게시는 카드 흐리게 + 배지 |
| `components/HomeClient.jsx` | 자체 강의 그리드 끝에 admin only "+ 새 강의" 점선 카드 |
| `pages/EventDetail.jsx` | admin 시 상세 상단에 "✎ 강의 편집" 버튼 + 미게시 배지. 미게시 강의는 비-admin 진입 시 not found |
| `pages/Admin.jsx` | 보조 뷰 — 게시 중/미게시 표 + 일괄 영구 저장/되돌리기 + 빠른 복제 + 새 강의 |
| `pages/Home.jsx` | events 데이터 단일 소스 = `useEvents()` |
| `vite.config.js` | dev 미들웨어 (`/__dev/save-events`, `/__dev/save-operator`) |

## UI 진입점 정리 (운영자 시점)

| 어디서 | 액션 | 노출 조건 |
|-------|------|----------|
| 홈 자체 강의 카드 우상단 | ✏️ 편집 / 👁️ 게시 토글 | admin AND dev AND `source==='internal'` |
| 홈 자체 강의 그리드 끝 | "+ 새 강의" 점선 카드 | admin AND dev |
| `/events/:id` 상단 | "✎ 강의 편집" + 미게시 배지 | admin AND dev AND `source==='internal'` |
| `/admin` 페이지 | 표 형태 + 영구 저장/되돌리기/복제 | admin (비-admin은 안내만) |
| 헤더 ⚙️ 아이콘 | `/admin` 라우트 진입 | 항상 보이지만 비-admin엔 안내 페이지 |

`role` 토글은 헤더 우측 "교안/프롤로그" 라벨 버튼으로 가능 (현재 라벨링은 모임 데모 컨텍스트용).

## 미저장 변경 (오버라이드) UX

- 편집 모달에서 "미리보기 반영" → localStorage 오버라이드만 갱신, **파일 X**
- 우상단 "영구 저장" 또는 `/admin` 페이지의 "events.json 영구 저장" 버튼 → 파일 덮어쓰기 + 오버라이드 클리어
- 미저장 변경이 있으면 모달과 `/admin` 헤더에 **"미저장"** 노란 배지 노출
- 새로고침해도 오버라이드는 살아있음 (localStorage). 다른 브라우저/PC 에서는 안 보임 → 본인 PC 에서만 작업 → 영구 저장 → git 커밋

## 빠른 복제 (다음 회차 만들기)

`/admin` 페이지의 강의 행 "복제" 버튼:
- 같은 교안·장소·결제 정보 그대로 복사
- `id` 뒤에 `-copy-{오늘날짜}`, 제목 뒤에 `(사본)`, `isPublished: false`, `remaining = capacity` 로 초기화
- 복제 직후 ClassEditor 가 자동 열림 → 일시·정원만 새 회차에 맞게 수정 → 저장

## 자체 강의만 편집

`source: 'internal'` 인 강의에만 admin 액션을 노출한다. 외부 이벤트(`source: 'external'`)는 더미 데이터라 read-only — UI 에서 ✏️ 아이콘 자체를 안 그림. `EventCard` 등 호출부에서:

```jsx
{event.source === 'internal' && (
  <AdminOnly>
    <InlineEditButton id={event.id} />
  </AdminOnly>
)}
```

## DB 도입 트리거 (Phase 1+)

이 패턴은 **로컬 dev 서버에서만 동작**. 배포된 사이트의 admin 은 미들웨어가 없어 저장 호출이 404.
DB 도입 트리거(`CLAUDE.md` § 3 결제 정책 참고) 도달 시:
- `useEvents()` 내부를 fetch 기반 데이터로 교체
- `commitEventsOverride()` → 백엔드 `PATCH /api/events/:id` 등으로 교체
- `AdminOnly` 가드 내부를 진짜 인증으로 교체
- 호출부(EventCard, ClassEditor, Admin) 무수정

## 관련 문서

- [`agents/frontend/class-registration-pattern.md`](./class-registration-pattern.md) — Curriculum-Class 데이터 모델 (편집 대상)
- [`agents/ui/operator-profile-module.md`](../ui/operator-profile-module.md) — DevOperatorEditor 의 동형 패턴 사례
- `CLAUDE.md` § 3 결제 정책 — Phase 0/1/2 트리거
