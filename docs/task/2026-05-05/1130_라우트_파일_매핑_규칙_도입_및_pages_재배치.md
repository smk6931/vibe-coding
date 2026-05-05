# 라우트 ↔ 파일 매핑 규칙 도입 + pages/ 재배치

작업일: 2026-05-05
규칙 범위: **글로벌(추상 원칙) + 프로젝트(컨벤션 디테일)** 양쪽 등록.

---

## 왜 이렇게 했나

운영자: "주소창 보고 어떤 jsx 파일이 라우팅되는지 알 수 있어야 헷갈리지 않는다. 다른 프로젝트에도 적용 가치 있으니 글로벌에 박자."

동의. URL 은 공개 API, 파일 경로는 그 거울이어야 한다. 추상 원칙(폴더=URL, 파일=마지막 세그먼트)은 프레임워크 무관 → 글로벌. 컨벤션 디테일(`[id].jsx` vs `Detail.jsx` 등)은 프레임워크별 → 프로젝트 로컬.

## 새 라우트 ↔ 파일 매핑

| URL | 이전 | 현재 |
|-----|------|------|
| `/` | `pages/Home.jsx` | `pages/index.jsx` |
| `/about` | `pages/About.jsx` | `pages/about/index.jsx` |
| `/me` | `pages/Me.jsx` | `pages/me/index.jsx` |
| `/admin` | `pages/Admin.jsx` | `pages/admin/index.jsx` |
| `/events/:id` | `pages/EventDetail.jsx` | `pages/events/[id].jsx` |
| `/guide` | `pages/guide/index.jsx` | (기존 OK) |
| `/guide/oneday/install` | `pages/guide/oneday/Install.jsx` | (기존 OK) |
| `/guide/oneday/week1` | `pages/guide/oneday/Week1.jsx` | (기존 OK) |
| `/community/board` | `pages/community/board.jsx` | (기존 OK) |

## 신규 / 수정 파일

### 신규
| 파일 | 위치 | 역할 |
|------|------|------|
| `~/.claude/rules/route-file-mapping.md` | **글로벌** | 추상 원칙 — 폴더=URL, 파일=마지막 세그먼트. 모든 프로젝트 공통 |

### 수정
| 파일 | 변경 |
|------|------|
| `front/src/pages/Home.jsx` → `pages/index.jsx` | git mv |
| `front/src/pages/About.jsx` → `pages/about/index.jsx` | git mv + import depth +1 |
| `front/src/pages/Me.jsx` → `pages/me/index.jsx` | git mv (import 없음) |
| `front/src/pages/Admin.jsx` → `pages/admin/index.jsx` | git mv + import depth +1 |
| `front/src/pages/EventDetail.jsx` → `pages/events/[id].jsx` | git mv + import depth +1 |
| `front/src/app.jsx` | lazy import 5건 경로 갱신 |
| `~/.claude/CLAUDE.md` | "Route ↔ File Mapping" 섹션 1개 추가 (글로벌 룰 참조) |
| `agents/frontend/component-placement.md` | **§ A 라우트 ↔ 파일 매핑** 섹션 신규 추가 (이 프로젝트 컨벤션 디테일). 기존 컴포넌트 위치 룰은 § B 로 이동 |
| `CLAUDE.md` § 4-3-1 | "라우트 ↔ 파일 매핑" 한 단락 추가 (agents/ 와 글로벌 룰 둘 다 참조) |

### 변경 X
- `front/src/routes/community.jsx`, `routes/guide.jsx` — 라우트 정의 자체는 그대로 (이미 매핑 룰에 부합)

## 검증

```bash
grep -rn 'pages/(Home|About|Me|Admin|EventDetail)' front/
→ No matches found
```

5개 단일 라우트 파일 이동 + 21개 import 경로 갱신 (app.jsx 5줄 + 컴포넌트 내부 import 16줄). 잔존 구 경로 참조 0건.

## 운영자 입장 효과

URL 보면 즉시 파일 경로 추측 가능:
- `/events/evt-week1-2026-05-10` → `pages/events/[id].jsx` (`:id` 동적 파라미터)
- `/admin/classes` (향후 추가될 가능성) → `pages/admin/classes.jsx` 또는 `pages/admin/classes/index.jsx`
- `/guide/oneday/week2` → `pages/guide/oneday/Week2.jsx`

신규 라우트 추가 시 의사결정 0 — 이 표만 따르면 됨.

## 안 한 것

- 라우트 정의 자동 매핑(파일시스템 기반 라우팅) 도입 — 현재 명시적 import (lazy) 유지. Vite + React Router 명시적 매핑이 본인 통제권 잘 보임.
- 단일 파일 라우트 → 폴더화의 모든 케이스 검토. 향후 `pages/community/*` 도 같은 결로 정리 가능 (현재는 board/index/qa/members 가 폴더 안에 평행으로 있어 일부 매핑 어긋남) — 다음 정리 후보.

## 다음 작업 후보

- [ ] `pages/community/{board,index,members,qa}.jsx` → 각 폴더 + `index.jsx` 로 통일 (현재는 board.jsx 같은 평행 파일)
- [ ] `routes/community.jsx` 와 `routes/guide.jsx` 의 lazy import 도 동일 컨벤션 검토
