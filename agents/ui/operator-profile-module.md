---
Title: 운영자/강사 프로필 모듈 — 도용 방지 시그니처 분산 패턴
Description: site.json operator 단일 소스를 3개 변형 컴포넌트(OperatorProfile / OperatorIntroCard / InstructorMicroCard)로 분기해 홈·About·강의 페이지·Footer에 분산 배치. 한 곳에 크게 박지 않고 여러 곳에 자연스럽게 박아 도용자가 모든 인스턴스를 갈아끼우는 비용 > 새로 만드는 비용이 되도록 설계.
When-To-Read: 운영자/강사 프로필 위치를 옮기거나 제거할 때, 새 페이지에 강사 시그니처를 추가할 때, 도용 방지 카피·라이선스 문구를 수정할 때, site.json operator 스키마를 확장할 때, About 페이지 레이아웃을 손볼 때
Keywords: operator profile, instructor profile, anti-plagiarism, signature distribution, OperatorProfile, OperatorIntroCard, InstructorMicroCard, Footer, site.json operator, CC BY 4.0, /about, attribution, plagiarism prevention
Priority: medium
---

# 운영자/강사 프로필 모듈

도용 방지를 위해 운영자 정체성을 사이트 여러 곳에 **분산 배치**하는 패턴.
한 곳에 크게 박는 대신 5군데에 자연스럽게 박아 도용자가 다 떼는 작업량을
의도적으로 늘린다.

## 1. 핵심 전략 — 시그니처 분산

```
홈 풀 프로필 섹션  ──┐
About 페이지       ──┼─→ 모두 같은 site.json operator 사용 (단일 소스)
강의 마이크로 카드  ──┤   → 정보 갱신 시 site.json 한 곳만 수정
Footer (전역)      ──┘
```

도용자 입장에서:
- 1군데 지우면 4군데 남음
- 다 지우려면 사이트 통째 재디자인
- → 그럴 바엔 안 베끼는 게 합리적

## 2. 단일 소스 — `front/public/data/site.json`

```json
{
  "operator": {
    "name": "운영자",
    "title": "운영자 / 강사",
    "experience": "10년차 개발자",
    "tagline": "Claude로 첫 웹사이트 만들기 모임을 운영합니다",
    "intro": "한 줄 인용/철학",
    "photo": "/images/operator-photo.png",
    "credentials": ["이력 1", "이력 2", "이력 3"],
    "contacts": {
      "instagram": "...",
      "kakao": "...",
      "email": "..."
    }
  }
}
```

**모든 프로필 컴포넌트는 이 객체만 참조한다.** 이름·사진·연락처를 바꾸려면
이 파일 한 곳만 수정하면 5군데가 동시에 갱신됨.

## 3. 3개 변형 컴포넌트

| 컴포넌트 | 파일 | 크기 | 용도 |
|---------|------|------|------|
| `OperatorAboutHero` | `components/OperatorAboutHero.jsx` | 가로 hero (사진 좌 + 텍스트 우) | /about 최상단 헤더. 도용 방지 안내 prop 토글 |
| `OperatorProfile` | `components/OperatorProfile.jsx` | 풀 섹션/카드 (사진 위 + 본문 아래) | /about 본문 (현재 단독), 향후 /me 사이드 등 |
| `OperatorIntroCard` | `components/OperatorIntroCard.jsx` | 명함형 카드 (사진 좌 + 텍스트 우 + 인스타/카톡/더 알아보기 인라인 링크) | 홈 히어로 컴팩트 섹션 안 (h1+tagline 아래), 향후 사이드바/마이페이지에도 재사용 |
| `InstructorMicroCard` | `components/InstructorMicroCard.jsx` | 1줄 인라인 | EventDetail (자체 강의에만), 가이드 페이지 상단 |
| `CurriculumSignature` | `components/CurriculumSignature.jsx` | 본문 끝 1줄 시그니처 (아바타 + 강사명 + CC BY) | 교안 컴포넌트 끝 (OnedayClassCurriculum, 향후 주차별 교안) |
| `Footer` | `components/Footer.jsx` | 전역 푸터 | app.jsx에 1번만 마운트, 모든 페이지에 노출 |

### OperatorProfile props

```jsx
<OperatorProfile
  variant="section"            // 'section' | 'card' (기본 'section')
  showAntiPlagiarismNotice     // boolean (기본 false). About에서만 true
  operator={...}               // 기본 siteData.operator. 외부 강사 노출 시 override 가능
/>
```

### OperatorAboutHero props

```jsx
<OperatorAboutHero
  showAntiPlagiarismNotice    // boolean (기본 true). 도용 방지 1줄 안내. 톤 가볍게 가려면 false
/>
```

`showAntiPlagiarismNotice` — 도용 방지 안내 노출.
- `OperatorProfile`: 박스 형태 (긴 문단). About 본문에서만 true.
- `OperatorAboutHero`: 1줄 인용 형태 (헤더 톤). About 최상단에서 기본 true, 부담스러우면 false.
홈 등 다른 페이지에서는 두 컴포넌트 모두 false 권장.

## 4. 현재 마운트 지점 (2026-05-01 기준)

| 위치 | 사용 컴포넌트 | 조건 |
|------|--------------|------|
| `pages/About.jsx` 최상단 | `OperatorAboutHero` (`showAntiPlagiarismNotice`) | 항상 |
| `pages/About.jsx` 본문 | `OperatorProfile` (`showAntiPlagiarismNotice`) | 항상 |
| `components/HomeClient.jsx` 컴팩트 히어로 안 (h1+tagline 아래) | `OperatorIntroCard` (`max-w-md`) | 항상 (명함 톤) |
| `pages/EventDetail.jsx` (제목 아래) | `InstructorMicroCard` | `event.source === 'internal'` 일 때만 |
| `components/OnedayClassCurriculum.jsx` 끝 | `CurriculumSignature` | 항상 (교안 본문 마지막) |
| `app.jsx` (전역) | `Footer` | 항상 |

> **이력:**
> - 2026-05-01 (1차): 홈(`HomeClient.jsx`) 후기 섹션 위에 `OperatorProfile` 풀 섹션 배치 → 콘텐츠 흐름 깨고 도용 방지엔 기여 X로 판단해 제거. 그 무게는 `CurriculumSignature`(교안 본문 끝)로 이동.
> - 2026-05-01 (2차): 홈 히어로 안에 `OperatorIntroCard`(명함 톤) 재배치. 풀 섹션이 아니라 작은 카드라 콘텐츠 흐름 안 깨고 신뢰감 + 시그니처 동시 확보.
> - 정리: **홈 = 명함 / about = 풀 / 교안 = 본문 끝 1줄 / footer = 전역.** 같은 정보를 톤만 다르게 4단계로 분산.

`OperatorIntroCard` 는 현재 어디에도 마운트되어 있지 않다. 모듈로만 보존 —
향후 마이페이지 사이드바, 가이드 사이드바, 카톡 공유 OG 등에서 재사용.

## 5. 변경 감지 체크리스트

**프로필 위치를 옮기거나 컴포넌트를 수정하면 이 문서도 같이 갱신한다.**
구체적으로 아래 변경이 발생하면 4번 표를 업데이트할 것:

- [ ] 새 페이지에 프로필 마운트 추가/제거 → 4번 표 행 추가/삭제
- [ ] `OperatorProfile` 의 props 추가/변경 → 3번 props 표 갱신
- [ ] `site.json` operator 스키마 확장 (필드 추가/제거) → 2번 JSON 갱신
- [ ] 새 변형 컴포넌트 추가 (예: `OperatorBadge`) → 3번 표 행 추가
- [ ] 도용 방지 카피 수정 (CC BY → 다른 라이선스) → 라이선스 표기 위치 6번 갱신

## 6. 라이선스 표기 위치 (CC BY 4.0)

라이선스 문구가 노출되는 곳:

1. `Footer.jsx` — "교안·코드·디자인은 출처 표기 시 자유 사용 (CC BY 4.0)"
2. `OperatorProfile.jsx` — `showAntiPlagiarismNotice` 박스 안 (CC BY 4.0)
3. `pages/About.jsx` — 페이지 상단 안내 문장 (자연어, 라이선스 코드 없음)

라이선스를 바꿀 때는 위 3곳을 모두 일관되게 수정.

## 7. 사진/이미지

- 운영자 사진: `front/public/images/operator-photo.png`
- 정사각 권장 (컴포넌트에서 `object-cover` 처리). `OperatorProfile`은 `w-40 h-40 rounded-2xl`,
  `OperatorIntroCard`는 `rounded-full`, `InstructorMicroCard`는 `w-7 h-7 rounded-full`
- 파일 교체 시 같은 이름 유지하면 코드 수정 불필요

## 8. 향후 보강 (메모)

- `OperatorIntroCard` 를 /me 사이드바·가이드 사이드바에 마운트 검토
- favicon / OG 이미지에도 운영자 이니셜·로고 박기 (도용 방지 강화)
- 메타 태그 `<meta name="author">`, `<meta name="copyright">` 자동 주입 (검색 엔진 출처 입증용)
- 코드 샘플(교안 내) 주석에 `// © 바이브 세션 / 2026` 시그니처 추가

## 9. 관련 문서

- `agents/frontend/component-placement.md` — 새 컴포넌트 위치 결정 시
- `agents/ui/lecture-guide-component.md` — 강의 교안 페이지 수정 시 (강사 표기 일관성)
