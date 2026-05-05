# Curriculum-Class 본문 분리 — Week1 라우트 신설 + EventDetail 슬림화

작업일: 2026-05-05
선행: `docs/task/2026-05-04/2300_curriculum_class_패턴_도입_5월10일_강의_등록.md` (데이터 패턴 도입)
관련 agent 문서: `agents/frontend/class-registration-pattern.md` (보강 완료)

---

## 왜 이렇게 했나

이전 단계까지는 **데이터 모델은 Curriculum-Class 분리** 됐지만 **렌더링 책임은 EventDetail 한 곳에 다 있었다.**
- `OnedayClassCurriculum` (교안 본문) 이 `EventDetail` 안에서 렌더 → 신청 페이지가 교안 본문까지 통째로 들고 있음
- 사용자가 가이드 사이드바 "1주차" 클릭 → `/events/...` 로 점프 → 사이드바 사라짐 → 동선 끊김

운영자 의도(본인 표현 그대로):
> "1주차 교안이 guide/week1로 간 다음에, evt-001 페이지에서 guide/week1과 연동되어 교안이 선택되고, 장소·시간·일자가 같이 정해지면서 원데이클래스가 형성되면, guide/week1과 evt-001 페이지를 활용해 다른 날짜 강의도 유연하게 만들 수 있는 거 아니냐?"

→ 정확히 Curriculum-Class 패턴의 **렌더링 책임 분리** + **양방향 연결**. 이걸 코드로 실현.

## 새 라우트 매핑

| URL | 책임 | 컴포넌트 |
|-----|------|---------|
| `/guide/oneday/week1` (신규) | 교안 본문 + "예정된 회차" 위젯 | `pages/guide/oneday/Week1.jsx` |
| `/events/evt-week1-2026-05-10` | 신청·결제·교안 링크만 | `pages/EventDetail.jsx` (슬림) |

양방향 연결:
- `Week1` → events.json 에서 `curriculumId === 'oneday-week-1' && startAt > now` 필터해서 **다음 회차 카드 위젯** 자동 노출
- `EventDetail` → `ClassRegistration.CurriculumLinkBox` 가 `curriculum.guideRoute` 로 이동하는 큰 카드 자동 노출

## 신규 / 수정 파일

### 신규
| 파일 | 역할 |
|------|------|
| `front/src/pages/guide/oneday/Week1.jsx` | 1주차 교안 페이지 (GuideLayout + UpcomingClasses 위젯 + OnedayClassCurriculum 본문) |

### 수정
| 파일 | 변경 |
|------|------|
| `front/src/routes/guide.jsx` | `/guide/oneday/week1` 라우트 추가 |
| `front/src/pages/EventDetail.jsx` | OnedayClassCurriculum + MinihomeBanner + showCurriculum 가드 제거. 슬림화 (신청 정보만) |
| `front/src/components/ClassRegistration.jsx` | `CurriculumLinkBox` 신규 박스 — `curriculum.guideRoute` 로 큰 카드 링크 |
| `front/public/data/curriculums.json` | `guideRoute`: `/guide/oneday/install` → `/guide/oneday/week1` |
| `front/src/pages/guide/GuideSidebar.jsx` | 1주차 라벨/링크: `1주차 (5/10) → /events/evt-week1` → `1주차 — 미니홈피 → /guide/oneday/week1` |
| `front/src/pages/guide/index.jsx` | 1주차 카드 + FOLDER_ROWS + NAV_ROWS 갱신 |
| `front/src/pages/guide/oneday/Week2.jsx`, `Week3.jsx`, `Week4.jsx` | "1강 먼저 완료하기" 링크: `/events/evt-week1` → `/guide/oneday/week1` ("1강 교안 먼저 보기") |
| `agents/frontend/class-registration-pattern.md` | 라우트 분리 표 + 양방향 연결 설명 + CurriculumLinkBox 박스 추가 + 새 교안 워크플로우 |

## 검증 시나리오

- [x] `/guide/oneday/week1` 진입 → 좌측 가이드 사이드바 + 본문(예정된 회차 위젯 + OnedayClassCurriculum 챕터)
- [x] 위젯의 "5/10 회차" 카드 클릭 → `/events/evt-week1-2026-05-10` 신청 페이지
- [x] 신청 페이지의 "강의 교안" 박스 클릭 → `/guide/oneday/week1` 으로 회귀
- [x] `EventDetail` 에서 OnedayClassCurriculum 더 이상 렌더 안 됨 → 페이지 가벼워짐
- [x] 자체 강의 카드(evt-001 등 curriculumId 없는 미게시 데모)도 EventDetail 안전하게 렌더 (CurriculumLinkBox 가드)

## 유연성 확보 (운영자가 말한 "다른 날짜 강의도 유연하게")

같은 교안으로 5/17, 5/24 회차 추가하려면:
1. admin 모드 → 홈 "+ 새 강의" 카드 → ClassEditor 폼
2. `curriculumId: 'oneday-week-1'` 고정, 일정·장소·가격만 변경
3. "영구 저장"
4. → `/guide/oneday/week1` 페이지의 "예정된 회차" 위젯에 **카드 자동 추가** (코드 수정 0)

또는 `/admin` 의 기존 회차 행에서 "복제" 버튼 → 일정만 갱신해도 됨.

## 다음 단계 후보

- [ ] `Week1.jsx` 의 OnedayClassCurriculum 안에 CTA 두 개 ("카톡 신청" + "수업 전 준비 가이드") 가 있는데, "카톡 신청" 은 이제 회차 위젯과 중복. 정리 검토
- [ ] 2~4주차 본문 작성 시 같은 패턴 — `CURRICULUM_ID` 만 교체한 Week2/3/4.jsx 재작성, curriculums.json 에 메타 추가
- [ ] `OnedayClassCurriculum` 의 하드코딩된 1주차 콘텐츠를 `curriculumId` 분기 없이 Week1 전용으로 둘지, 아니면 컴포넌트명을 `Week1Body` 로 리네임할지 (의미 명확화)
