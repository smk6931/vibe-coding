---
Title: Curriculum-Class 패턴 + ClassRegistration 컴포넌트
Description: 교안(Curriculum) 1개에 회차(Class instance) N개를 매다는 Template-Instance 패턴 + 새 회차 추가 워크플로우
When-To-Read: 새 강의 회차 추가, ClassRegistration 컴포넌트 수정, 결제·환불·신청 박스 변경, 교안 1개로 여러 회차 열어야 할 때
Keywords: ClassRegistration, curriculum, class, cohort, session, template-instance, master-instance, 강의등록, 신청, 결제, 환불정책, 인원미달, 카톡오픈채팅, curriculumId, events.json, curriculums.json
Priority: high
---

# Curriculum-Class 패턴 + ClassRegistration 컴포넌트

## 패턴 이름과 정의

이 프로젝트의 강의 데이터 모델은 **Curriculum (Template) + Class (Instance)** 패턴이다.
LMS 업계에서 흔히 쓰이는 "Course + Cohort/Session" 모델, 일반화하면 **Master-Instance / Template-Instance 패턴**과 같다.

- **Curriculum** = 변하지 않는 콘텐츠 마스터. 교안 1개. (예: "1주차 — 미니홈피 만들기")
- **Class** = 한 번 열리는 회차 인스턴스. 일정·장소·가격·정원·결제·정책. (예: "5/10 14:00 서초")
- **관계**: Curriculum 1 : Class N (`curriculumId` foreign key 로 매칭)

같은 교안으로 5/10, 5/17, 5/24 다 다른 일정·장소·가격으로 N번 열 수 있다.
교안만 수정하면 미래 회차 전체에 자동 반영된다.

## 데이터 위치

| 파일 | 역할 |
|------|------|
| `front/public/data/curriculums.json` | 교안 마스터 배열 (id, title, summary, outline, prerequisites, outcomes, **guideRoute**) |
| `front/public/data/events.json` | 모든 이벤트 배열. 자체 강의는 `source: "internal"` + `curriculumId` 보유 |

### 라우트 분리 (2026-05-05 정착)

| 라우트 영역 | 책임 | 컴포넌트 |
|-----------|------|---------|
| `/guide/oneday/week{N}` | **Curriculum 본문** — 교안 콘텐츠, 챕터 가이드, 다음 회차 위젯 | `pages/guide/oneday/Week{N}.jsx` (GuideLayout 적용, 사이드바 노출) |
| `/events/{classId}` | **Class 신청** — 일정·장소·결제·신청·교안 링크 | `pages/EventDetail.jsx` (단일 페이지, 사이드바 없음) |

**양방향 연결**:
- 교안 → 회차: `Week1.jsx` 가 `events.json` 에서 `curriculumId === 'oneday-week-1' && startAt > now` 필터해서 "예정된 회차" 카드 위젯 자동 노출
- 회차 → 교안: `ClassRegistration` 의 `CurriculumLinkBox` 가 `curriculum.guideRoute` 로 이동하는 링크 자동 노출

## events.json — 자체 강의(Class instance) 필수 필드

```json
{
  "id": "evt-week1-2026-05-10",
  "isPublished": true,
  "source": "internal",
  "type": "oneday_class",
  "curriculumId": "oneday-week-1",        // ← 교안과 연결
  "title": "...",
  "host": { "name": "...", "handle": "..." },
  "startAt": "2026-05-10T14:00:00+09:00",
  "endAt":   "2026-05-10T17:00:00+09:00",
  "venue": {
    "name": "...", "address": "...",
    "lat": ..., "lng": ...,
    "url": "https://...",                  // 외부 예약 페이지 (선택)
    "directions": "..."                    // 출구·층·호실 안내 (선택)
  },
  "price": 25000,
  "capacity": 4,
  "remaining": 4,
  "minHeads": 3,                           // 최소 인원 (연기 정책 근거)
  "applyUrl": "https://open.kakao.com/...", // 카톡 오픈채팅 딥링크
  "payment": {
    "method": "계좌이체",
    "bank": "...", "account": "...", "holder": "...",
    "memoFormat": "이름+휴대폰뒷4자리",
    "guide": "신청 카톡 후 입금 안내드립니다."
  },
  "policies": {
    "minHeadsNotice": "최소 인원 3명 미만 시 다음 회차로 자동 연기, 입금액 100% 환불",
    "refund": [
      "강의 24시간 전까지: 100% 환불",
      "강의 24시간 이내: 50% 환불",
      "강의 시작 후 / 노쇼: 환불 불가"
    ]
  }
}
```

**필드 의미·정합성 룰**:
- `curriculumId` 가 있어야 EventDetail 에서 `<ClassRegistration>` 자동 노출됨
- `remaining` 은 수동 갱신 (Phase 0 — DB 없음). 카톡 신청 받을 때마다 운영자가 직접 -1
- `applyUrl` 은 카톡 오픈채팅 등 외부 신청 채널. 사이트는 신청 폼 들고 있지 않음
- `payment`·`policies` 비어있어도 컴포넌트는 안전하게 무시 (Optional chaining)

## ClassRegistration 컴포넌트 구조

`front/src/components/ClassRegistration.jsx` — 한 파일, 6개 박스를 같은 파일 내 서브컴포넌트로 둠.

```
<ClassRegistration event={event} />
  ├─ DateVenueBox        일시·장소·D-Day·길찾기 링크
  ├─ PaymentBox          가격·은행·계좌·예금주·입금자명 규칙
  ├─ PoliciesBox         인원 미달 연기 + 환불 정책
  ├─ PrerequisitesBox    준비물 체크리스트 (curriculum.prerequisites 에서)
  ├─ CurriculumLinkBox   "강의 교안" → curriculum.guideRoute 로 이동 (양방향 연결)
  └─ ApplyCTA            카톡 오픈채팅 큰 버튼 (sold 시 "정원 마감")
```

**왜 분리 안 했나** — 5박스 모두 한 회차 신청 페이지에서만 같이 의미를 가짐. 다른 페이지에서 단독으로 재사용되지 않음. React 룰: 재사용 0이면 같은 파일 내 서브컴포넌트로 충분, 별도 컴포넌트로 빼지 마라.

**Props 인터페이스 (의도적으로 최소)**:
- `event` 1개만 받음 → 컴포넌트 내부에서 `curriculums.json` lookup
- 호출부는 `<ClassRegistration event={event} />` 한 줄로 끝

**EventDetail 통합 조건**:
```js
const showRegistration = isInternal && Boolean(event.curriculumId);
```
외부 이벤트(`source: "external"`)는 절대 노출 안 됨. 자체 강의에만 적용.

## 새 회차 추가 워크플로우 (5분이면 됨)

같은 교안으로 N번째 회차를 열 때:

1. **admin 모드**(헤더 토글) → 홈 자체 강의 그리드 끝의 "+ 새 강의" 카드 클릭 → `ClassEditor` 폼
2. 또는 `/admin` 페이지의 기존 회차 행에서 "복제" → 일정·장소만 새 회차로 수정
3. `curriculumId` 만 같으면 → **교안 페이지(`/guide/oneday/week{N}`) 의 "예정된 회차" 위젯에 자동 노출**
4. "영구 저장" → events.json 갱신 → git push → 배포

별도 컴포넌트·라우트 수정 0. 교안 페이지 코드도 안 건드림 (위젯이 자동 필터링).

## 새 교안(주차) 추가 워크플로우 (10분 + 본문 작성 시간)

1. `front/public/data/curriculums.json` 에 객체 1개 추가 (id, title, summary, outline, prerequisites, outcomes, guideRoute)
2. `front/src/pages/guide/oneday/Week{N}.jsx` 신규 — `Week1.jsx` 를 템플릿으로 복사 후 `CURRICULUM_ID` 만 교체
3. `front/src/routes/guide.jsx` 에 라우트 등록
4. `pages/guide/GuideSidebar.jsx` 의 `NAV_GROUPS` 에서 해당 주차의 `soon: true` 제거
5. 본문 컴포넌트 작성 (1주차의 `OnedayClassCurriculum` 같은 위치)
6. 끝. 새 회차는 위 "회차 추가 워크플로우" 그대로

## 인원/신청 자동화는 Phase 1+ (DB 도입 트리거 도달 시)

현재(Phase 0)는 의도적으로 수동:
- `remaining` 수동 -1
- 신청 받기 = 카톡 오픈채팅
- 입금 확인 = 운영자 카톡 1:1

DB·신청 폼·결제 PG 도입 트리거(`CLAUDE.md` § 3 결제 정책 참고):
- 회당 신청자 5명 이상이 2~3회 연속
- 카톡으로 신청 받기 번거로워지는 시점
- 노쇼율이 신경 쓰이는 시점

도달 전까지 사이트는 **안내·교안·신뢰**만 담당하고, **신청·결제·CS** 는 카톡/소모임이 담당한다.

## 관련 문서

- [`agents/frontend/event-detail-modularization.md`](./event-detail-modularization.md) — EventDetail 페이지 자체의 컴포넌트 분리 기획. ClassRegistration 은 거기서 말한 "EventApplyCard" 역할을 흡수한 형태.
- [`agents/ui/lecture-guide-component.md`](../ui/lecture-guide-component.md) — 교안 콘텐츠(Curriculum 본체) 컴포넌트 작성 가이드. 새 교안 추가 시 같이 읽기.
- `CLAUDE.md` § 3 결제 정책 — Phase 0 → 1 → 2 단계 진화 룰.
