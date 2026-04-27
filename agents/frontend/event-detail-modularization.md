---
Title: EventDetail 페이지 모듈화 기획
Description: /events/:id 페이지를 강의안·신청·지도 컴포넌트로 분리하는 계획과 현재 임시 상태 기록
When-To-Read: EventDetail 수정, 신청 기능 추가, 지도 모달 작업, 강의안 컴포넌트 분리할 때
Keywords: EventDetail, OnedayClassCurriculum, 신청, 지도, 모달, 모듈화, aside, EventLocationMap
Priority: medium
---

# EventDetail 모듈화 기획

## 현재 상태 (2026-04-27)

- `/events/evt-001` 페이지에 강의안만 표시 (신청·지도 사이드바 일시 제거)
- `EventLocationMap` import 제거됨 (파일은 `components/EventLocationMap.jsx`에 보존)
- `OnedayClassCurriculum`이 강의안 + 신청 버튼을 함께 포함 → 추후 분리 대상

## 목표 구조

```
EventDetail.jsx  (라우트 진입점, 조립만 담당)
  ├── EventCurriculum.jsx     강의안 타임라인 (현 OnedayClassCurriculum)
  ├── EventApplyCard.jsx      신청 버튼·잔여석·환불 안내 (카드 or 모달)
  └── EventMapModal.jsx       지도 팝업 (클릭 시 열리는 모달, EventLocationMap 재사용)
```

## 분리 기준

| 컴포넌트 | 위치 | 노출 조건 |
|---------|------|----------|
| `EventCurriculum` | 메인 콘텐츠 영역 | `source=internal && type=oneday_class` |
| `EventApplyCard` | 플로팅 버튼 or 하단 sticky bar | 항상 (외부 이벤트는 원본 링크) |
| `EventMapModal` | 모달 (트리거: "지도 보기" 버튼) | `venue.lat/lng` 있을 때 |

## 작업 순서 (미착수)

- [ ] `OnedayClassCurriculum`에서 신청 버튼 블록 분리 → `EventApplyCard.jsx`
- [ ] `EventApplyCard`를 모바일 sticky 하단 바 or 사이드 카드로 배치
- [ ] "지도 보기" 버튼 → `EventMapModal.jsx` (내부에서 `EventLocationMap` 사용)
- [ ] `EventDetail`은 조립만: `<EventCurriculum>` + `<EventApplyCard>` + `<EventMapModal>`

## 비고

- `EventLocationMap.jsx`는 삭제하지 않고 보존 — 모달 내부에서 재사용 예정
- `OnedayClassCurriculum` 안의 카카오 신청 링크 블록도 함께 이동 대상
- 신청 플로우가 카카오 → 자체 폼으로 바뀌면 `EventApplyCard` 내부만 교체하면 됨
