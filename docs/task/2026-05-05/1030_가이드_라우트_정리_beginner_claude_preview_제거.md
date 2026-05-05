# 가이드 라우트 정리 — Preview / beginner / claude 제거 + 1주차 링크 갱신

작업일: 2026-05-05
관련 분석: `docs/plan/2026-05-05/1000_리팩토링_분석_죽은코드_구조위반.md` § 2 / § 3
방향: 1주차(`evt-week1-2026-05-10`)를 베이스로 2~4주차 연계 수업 만드는 게 다음 목표.
원데이 클래스를 "입문 / Cursor·Claude 활용" 같은 상세 카테고리로 나누는 건 **현 단계에서는 오버엔지니어링** 이라 일단 제거.

---

## 왜 이렇게 했나

1. **`/guide/oneday/preview`** — 사용처 0, 문서·인덱스에만 잔존. 분석 결과 P2 항목.
2. **`/guide/beginner`, `/guide/claude`** — 두 페이지 모두 "준비중" 상태이고 콘텐츠 없음. 카테고리 분기는 강의가 5개 이상 쌓일 때 의미 있음. 지금은 1주차 1개 + 2~4주차 라우트만 있으니 단일 카테고리로 충분.
3. **`/events/evt-001` 잔존 링크** — evt-001 은 데모 데이터(2026-04-27, isPublished:false). 가이드 페이지의 1강 링크는 진짜 1주차인 `evt-week1-2026-05-10` 로 가야 함.

## 수정 파일

### 삭제
| 경로 | 사유 |
|------|------|
| `front/src/pages/guide/oneday/Preview.jsx` | 라우트 미등록·콘텐츠 없음 |
| `front/src/pages/guide/beginner/index.jsx` (+ 폴더) | 준비중 placeholder, 카테고리 분기 시기 아님 |
| `front/src/pages/guide/claude/index.jsx` (+ 폴더) | 동일 |

### 변경
| 파일 | 변경 |
|------|------|
| `front/src/routes/guide.jsx` | `OnedayPreview`, `Beginner`, `ClaudeGuide` import 및 라우트 3개 제거 |
| `front/src/pages/guide/index.jsx` | SECTIONS / FOLDER_ROWS / NAV_ROWS 단순화. 원데이 클래스 1섹션만 + 1주차 진짜 링크(`/events/evt-week1-2026-05-10`) 박음 |
| `front/src/pages/guide/GuideSidebar.jsx` | 1주차 링크 `/events/evt-001` → `/events/evt-week1-2026-05-10`, 라벨 `1주차 (5/10)` |
| `front/src/pages/guide/oneday/Week2.jsx`, `Week3.jsx`, `Week4.jsx` | "← 1강 먼저 완료하기" 버튼의 evt-001 링크 → evt-week1-2026-05-10 |

## 검증 (잔존 참조 0)

```
grep "/guide/beginner|/guide/claude|/guide/oneday/preview|OnedayPreview|ClaudeGuide|evt-001"
→ No matches found
```

events.json의 `evt-001` 자체는 데모 데이터로 남아있음 (`isPublished: false`). 코드에서 깨진 링크로 가리키는 곳 0건. admin 토글로만 진입 가능.

## 다음 작업 — 2~4주차 연계 클래스 만들기 (다음 세션 진행 후보)

목표: 1주차 미니홈피 베이스 → 2주차 (사이드 추가, 라우팅) → 3주차 (Git/배포 심화) → 4주차 (사이드프로젝트 발표) 식의 **연속 커리큘럼**.

해야 할 것 (검토 대상):
- [ ] `curriculums.json` 에 `oneday-week-2/3/4` 객체 추가 (id·outline·prerequisites·outcomes 메타)
- [ ] events.json 에 회차 추가 시 `curriculumId` 만 다른 ID 로 매핑하면 끝 (이미 패턴 잡힘)
- [ ] `OnedayClassCurriculum.jsx` 의 콘텐츠 분기 — 현재 1주차 하드코딩 → curriculumId 별 콘텐츠 매핑 필요
- [ ] Week2/3/4.jsx 가 placeholder 상태인지 확인 후 본문 보강
- [ ] 운영자가 1주차 1회 운영 후 회고 → 2주차 콘텐츠 확정 → curriculums.json 추가 → 회차 events.json 추가

이 흐름은 `agents/frontend/class-registration-pattern.md` 의 **새 회차 추가 워크플로우(5분)** 그대로 적용 가능. 단 교안 본문(라이브 데모 등) 만 별도 작업.
