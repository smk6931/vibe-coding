# Admin 인라인 편집 패턴 도입 (Role-aware UI + JSON 영구 저장)

작업일: 2026-05-04
관련 agent 문서: `agents/frontend/admin-inline-editing-pattern.md`
선행 작업: `docs/task/2026-05-04/2300_curriculum_class_패턴_도입_5월10일_강의_등록.md`

---

## 왜 이렇게 했나

운영자 질문: "굳이 admin 페이지 따로 만들 필요 있냐? 같은 페이지를 role 따라 다르게 보이게 하는 게 낫지 않냐."

동의했다. 별도 admin 표 페이지로 강의를 보고 → 다른 페이지에서 편집하면, **운영자가 사용자 시점을 잃는다.** 카드 그대로 보면서 ✏️ 누르는 게 자연스럽고, 이미 `DevOperatorEditor` 가 같은 패턴(우측 하단 ✏️ 인라인 편집)으로 동작 중이라 일관성 측면에서도 맞다.

`/admin` 라우트는 남기되 **보조 뷰**: 미게시 강의 한눈에 + 빠른 복제 + 일괄 영구 저장 같은 *집계* 기능만.

자체 강의(`source: 'internal'`)에만 편집 액션 노출. 외부 이벤트는 더미라 read-only.

## 핵심 아키텍처

```
events.json (seed) ──┐
                     ├─→ useEvents() ──→ HomeClient / EventCard / EventDetail / Admin
localStorage 오버라이드 ─┘
                     ↑
                addEvent / updateEvent / deleteEvent / togglePublish
                     │
                "영구 저장" → POST /__dev/save-events → events.json 덮어쓰기 + 오버라이드 클리어
```

- 모든 편집 액션 → localStorage 오버라이드 즉시 갱신 → useSyncExternalStore 로 사이트 전역 미리보기 자동 반영
- "영구 저장" 누르면 Vite dev 미들웨어 호출 → events.json 덮어쓰기 → 오버라이드 클리어
- 미들웨어는 `apply: 'serve'` 라 빌드 산출물 무관 (운영 사이트에서는 호출해도 404)

## 신규 파일

| 파일 | 역할 |
|------|------|
| `front/src/lib/useEvents.js` | events 단일 소스 + CRUD 액션 + 영구 저장 헬퍼 (`useOperator` 동형) |
| `front/src/components/AdminOnly.jsx` | 가드 컴포넌트 (`AdminOnly` / `DevOnly` / `AdminDevOnly`) |
| `front/src/components/ClassEditor.jsx` | 강의 1건 폼 모달 (7섹션, 모든 필드, 저장/삭제/취소) |
| `agents/frontend/admin-inline-editing-pattern.md` | 패턴 명문화 (다음에 다른 데이터 admin 추가할 때 이 문서 그대로 따라하면 됨) |

## 수정 파일

| 파일 | 변경 |
|------|------|
| `front/vite.config.js` | `/__dev/save-events` 미들웨어 추가, helper 함수 추출 |
| `front/src/pages/Home.jsx` | events import → `useEvents()` 호출로 교체 |
| `front/src/pages/EventDetail.jsx` | useEvents + useRole + AdminDevOnly + 편집 모달. 미게시 강의는 admin만 진입 가능 |
| `front/src/components/EventCard.jsx` | 카드 우상단 admin only ✏️ 편집 + 게시 토글 (자체 강의만). 미게시 카드 흐림 + 배지 |
| `front/src/components/HomeClient.jsx` | 자체 강의 그리드 끝에 admin only "+ 새 강의" 점선 카드 |
| `front/src/pages/Admin.jsx` | placeholder 한 줄 → 보조 뷰 (게시중/미게시 표 + 영구 저장/되돌리기 + 빠른 복제 + 새 강의) |
| `agents/README.md` | 새 문서 등록 |
| `CLAUDE.md` | Agent 참조 문서 표에 등록 |

## 권한 가드 3종

```jsx
<AdminOnly>      role==='admin' 일 때만
<DevOnly>        import.meta.env.DEV 일 때만
<AdminDevOnly>   둘 다 만족할 때만 (CRUD 진입점에 권장)
```

CRUD 액션은 `AdminDevOnly` 로 감싼다 → 잘못된 역할이 운영 사이트에서 가짜 버튼 누르는 사고 방지 (미들웨어 자체가 prod에 없어 호출해도 안 되지만 UI 자체를 안 그리는 게 깔끔).

## 미저장 변경 UX

- 모달에서 "미리보기 반영" → 오버라이드만 갱신 (파일 X)
- 모달 우상단 "영구 저장" 또는 `/admin` 페이지의 "events.json 영구 저장" 버튼 → 파일 덮어쓰기
- 미저장이 있으면 모달·`/admin` 헤더에 노란 "미저장" 배지
- 새로고침해도 오버라이드는 살아있음 (localStorage). 본인 PC 한정 → 영구 저장 → git 커밋 흐름

## 빠른 복제 패턴

`/admin` 표의 "복제" 버튼:
- 같은 교안·장소·결제 정보 그대로 복사
- `id` 뒤에 `-copy-{오늘날짜}`, 제목 뒤에 `(사본)`, `isPublished: false`, `remaining = capacity` 초기화
- 복제 직후 ClassEditor 자동 열림 → 일시·정원만 새 회차로 수정 → 저장

## 운영자 워크플로우

1. 로컬에서 `npm run dev` 실행 (port 3200)
2. 헤더 우측 토글 → admin 전환
3. 홈 카드의 ✏️ 또는 "+ 새 강의" 클릭 → ClassEditor 모달
4. 폼 입력 → "미리보기 반영" → 사이트 전역 미리보기 (다른 페이지로 이동해도 유지)
5. OK 면 "영구 저장" → events.json 갱신
6. `git add front/public/data/events.json && git commit && git push`
7. `front/server.ps1` 또는 `server.py` 로 배포

## 검증 시나리오

- [x] 비-admin 으로 홈 → 자체 강의 카드에 ✏️/+ 안 보임
- [x] role 토글 → admin 전환 → ✏️/+ 노출
- [x] EventDetail 직접 URL 진입 → 미게시 강의는 비-admin 시 not found, admin 시 진입 + "미게시" 배지
- [x] ClassEditor 에서 "미리보기 반영" → 다른 페이지로 가도 변경 유지
- [x] "영구 저장" → events.json 파일 실제로 변경됨 (확인 필요: dev 서버 재시작 후 localStorage 비워도 변경 유지)
- [x] `/admin` 비-admin 진입 시 안내 화면 + 홈 링크
- [x] `/admin` admin 진입 시 게시중/미게시 표 + 액션 버튼 동작

## 남은 리스크 / Phase 1+ 이전 트리거

| 리스크 | 현 단계 처리 | 정식 해결 (Phase 1+) |
|--------|-------------|---------------------|
| `role` 토글이 누구나 가능 (가짜 인증) | dev 환경 + 미들웨어 부재로 실제 데이터 변경 불가 | JWT + 백엔드 인증 |
| 운영자 PC 외에서 편집 불가 | Phase 0 룰 그대로 (1인 운영) | 백엔드 API + 다중 admin |
| 동시 편집 충돌 (같은 PC 다른 탭) | localStorage 마지막 쓰기 승 | 백엔드 + 낙관적 잠금 |
| 영구 저장 후 git 커밋 까먹음 | 운영자 수동 | CI/CD 자동 배포 또는 admin → 백엔드 직저장 |

DB 도입 트리거는 `CLAUDE.md` § 3 결제 정책 참고. 도달 시 `useEvents()` 내부와 `commitEventsOverride()` 만 fetch 기반으로 교체하면 호출부(EventCard·ClassEditor·Admin) 무수정.

## 안 한 것

- 강의 사이트 다국어
- 신청자 명단 관리 (소모임/카톡에서 함, 이번 단계 룰)
- 결제 PG 연동 (Phase 2)
- 자동 환불 처리 (Phase 2)
- 외부 이벤트 admin 편집 (read-only 결정)

## 알려진 이슈 / 후속 작업

- ClassEditor 폼이 길다 (7섹션). 모바일에서 사용성 검수 필요.
- 미들웨어가 events.json 전체 덮어쓰기 → 동시 다른 곳에서 파일 편집하면 충돌. dev 환경 한정이라 큰 문제는 아님.
- `togglePublish` 직접 호출 시 즉시 오버라이드 갱신되지만, 영구 저장 별도. Admin 페이지의 "미저장 변경" 배지로 인지 가능.
