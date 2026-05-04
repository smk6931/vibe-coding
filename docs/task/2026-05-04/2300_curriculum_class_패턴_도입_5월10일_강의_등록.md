# Curriculum-Class 패턴 도입 + 5/10 강의 등록

작업일: 2026-05-04
관련 플랜: `docs/plan/2026-05-04/2230_5월10일_원데이클래스_오픈_플랜.md`
관련 후보 문서: `docs/plan/2026-05-04/2240_강남역_스터디룸_후보_5곳.md`
신규 agent 문서: `agents/frontend/class-registration-pattern.md`

---

## 왜 이렇게 했나

운영자가 "교안과 강의 등록 컴포넌트를 묶어서 진행 중인 강의 1개를 만드는 흐름"을 원했다.
이건 LMS·강의 플랫폼 표준 패턴인 **Curriculum (Template) + Class (Instance)** = Master-Instance 패턴.
같은 교안으로 N번 회차를 다른 일정·장소·가격으로 열 수 있어야 1회성이 아닌 **운영 가능한 구조**가 된다.

대안으로 검토했던 것:
1. **events.json에 모든 필드 박기 (단일 테이블)** → 현 구조와 호환은 좋으나, 같은 교안의 N회차마다 교안 메타(outline/prerequisites/outcomes)를 중복 저장하게 됨. 교안 1개 수정 시 N개 동기화 필요. **기각.**
2. **별도 `classes.json` 신설 (events.json과 분리)** → 가장 정석이지만, 자체/외부 이벤트가 같은 홈 카드 그리드에 노출되는 현 구조에서 `events.json` 단일 소스가 깨진다. 카드 컴포넌트·필터·지도까지 다 두 소스 섞어 처리해야 함. **현 단계 기각, Phase 2 DB 마이그레이션 시 재검토.**
3. **events.json 유지 + curriculums.json 신설 + foreign key (`curriculumId`)** → 채택. 자체 강의 객체에만 새 필드 추가하면 외부 이벤트는 무영향. 교안 메타는 단일 소스로 별도 관리. DB 정규화도 자연스럽게 이어짐. **선택.**

이 의사결정을 `agents/frontend/class-registration-pattern.md`에 명문화 → 다음 회차 추가 시 이 문서만 읽으면 됨.

## 컴포넌트 구조 결정 — 한 컴포넌트 vs 분리

운영자 질문: "결제·날짜·장소 따로 컴포넌트 X개로 나눌까, 하나로 묶을까?"

**결정: 하나(`ClassRegistration`)로 묶고 같은 파일 내 서브컴포넌트 5개로 분리.**

이유:
- 5박스(일시·장소 / 결제 / 환불·연기 / 준비물 / 신청 CTA) 모두 한 회차 신청 화면에서만 같이 의미가 있음
- 다른 페이지에서 단독으로 재사용되는 케이스 0
- 분리하면 prop drilling만 늘어나고 호출부 보일러플레이트 증가
- React 룰: 재사용 0이면 같은 파일 내 서브컴포넌트로 충분, 컴포넌트 파일 분리하지 마라

## 수정 파일

### 신규
- `front/public/data/curriculums.json` — 교안 마스터 (id, outline, prerequisites, outcomes 등)
- `front/src/components/ClassRegistration.jsx` — 한 컴포넌트, 5개 서브박스
- `agents/frontend/class-registration-pattern.md` — 패턴 명문화 + 새 회차 추가 워크플로우

### 수정
- `front/public/data/events.json`
  - `evt-001` (4/27 미니홈피, 데모 데이터) → `isPublished: false` 로 게시 해제
  - 신규 `evt-week1-2026-05-10` 추가 (curriculumId, payment, policies, applyUrl 등 풀 필드)
- `front/public/data/site.json` — `nextEventId` 를 새 회차 id로 변경
- `front/src/pages/EventDetail.jsx`
  - `ClassRegistration` import
  - `showRegistration = isInternal && Boolean(event.curriculumId)` 조건 추가
  - 강의 소개 아래 `<ClassRegistration event={event} />` 끼워넣기
- `agents/README.md` — 새 문서 등록
- `CLAUDE.md` — Agent 참조 문서 표에 등록

## 5/10 강의 메타 (현재 박혀있는 값)

| 필드 | 값 | 출처 |
|------|----|------|
| 장소 | 커피에스터디 서초 스터디룸 회의실 (Tall Room) | 운영자 선택 (스페이스클라우드 #69933) |
| 일시 | 2026-05-10(일) 14:00–17:00 | 추정 (운영자 변경 가능) |
| 정원 | 4명 | 룸 한도 (2~4인) |
| 가격 | 25,000원 | 운영자 미확정 — placeholder |
| 계좌 | TODO | 운영자 미입력 — `payment.bank/account` 둘 다 "TODO" 마커 |
| 신청 채널 | 카톡 오픈채팅 | site.json operator.contacts.kakao 재사용 |
| 좌표 | 37.4843, 127.0067 | 서초중학교 인근 근사치 (운영자 정확값 교체 권장) |

## 검증

- dev 서버에서 `/events/evt-week1-2026-05-10` 진입 시:
  - 상단 미니홈피 배너 + 강의 메타 + 소개 (기존)
  - **신규**: ClassRegistration 5박스 (일시·장소 / 결제 / 환불·연기 / 준비물 / 카톡 신청 CTA)
  - 하단 OnedayClassCurriculum 교안 (기존)
- 외부 이벤트 페이지(`evt-101` 등) 진입 시 ClassRegistration 노출 안 됨 확인 (`isInternal` 가드)
- 모바일 360~430px 검수는 운영자 확인 필요 (실측 필요)

## 남은 리스크 / 운영자 액션

- [ ] 운영자가 정확한 가격·계좌·시간을 결정해 events.json 1줄씩 수정
- [ ] 스페이스클라우드 호스트 환불 정책 확인 → 1일 전 환불률 50% 미만이면 다른 룸으로 교체
- [ ] 좌표(lat/lng)를 카카오맵 등에서 정확값으로 교체
- [ ] 모바일 360~430px 1차 검수 + 데스크탑 1024+ 검수
- [ ] 5/10 후 ClassRegistration 첫 회 운영 결과 회고 — 박스 순서/정보량 조정 여부

## 안 한 것 (Phase 1+ 트리거 도달 시)

- 신청 폼 (사이트 내 입력 → 백엔드 API)
- `remaining` 자동 갱신 (현재 수동 -1)
- 결제 PG (토스페이먼츠/포트원)
- 입금 자동 확인
- 신청자 카카오 자동 안내

이유는 `CLAUDE.md` § 3 결제 정책 Phase 0 룰 + DB 도입 트리거 미도달.
