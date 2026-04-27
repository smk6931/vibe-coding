# test 프로젝트 — 4주차 주차별 Git 리포 관리 계획

## 목적
- 수강생이 "이번 주 완성본은 이렇게 생겼어요"를 코드로 직접 볼 수 있게 한다
- 운영자도 주차 진행 시 혼동 없이 단계별 기준 코드 참조 가능
- 리포 URL을 슬라이드/노션에 걸어두면 수강생이 막힐 때 직접 복사 가능

---

## 리포 구조 (별도 리포 4개)

| 주차 | 리포 이름 | 핵심 내용 |
|------|----------|----------|
| 1주차 | `vibe-week1` | React + Vite 세팅, React Router, 2페이지(홈+소개), 사이드바, Vercel 배포 |
| 2주차 | `vibe-week2` | 방문자카운터, 좋아하는 것 카드, localStorage 다이어리 |
| 3주차 | `vibe-week3` | 별 파티클 Canvas, CSS 테마 꾸미기, 이미지 업로드 |
| 4주차 | `vibe-week4` | 최종 완성본, 커스터마이징 가이드, 배포 최적화 |

---

## 1주차 기준 코드 목표 (`vibe-week1`)

```
vibe-week1/
├── src/
│   ├── main.jsx
│   ├── App.jsx          # BrowserRouter + Routes
│   ├── pages/
│   │   ├── Home.jsx     # 홈 페이지 (간단한 환영 메시지)
│   │   └── About.jsx    # 소개 페이지 (이름·관심사·자기소개)
│   ├── components/
│   │   └── Sidebar.jsx  # 홈/소개 이동 버튼
│   └── index.css
├── package.json
└── vite.config.js
```

### 핵심 제약 (수강생 따라하기 쉽게)
- 외부 CSS 라이브러리 없음 (index.css만 사용)
- 상태관리 없음 (useState 최소화)
- 파일 개수 최소화 — 한 번에 보여줘도 부담 없는 수준
- About.jsx에 더미 이름·소개 넣어두되 주석으로 "여기 본인 내용으로 바꾸세요" 표시

---

## Git 커밋 전략 (각 리포 공통)

```
main 브랜치만 사용 (브랜치 없이 심플하게)

커밋 흐름 예시 (vibe-week1):
  feat: React + Vite 프로젝트 초기 세팅
  feat: React Router 설치 + 2페이지 라우트 연결
  feat: 사이드바 컴포넌트 추가
  feat: About 페이지 자기소개 내용 추가
  chore: Vercel 배포 설정
```

수강생은 이 커밋 히스토리를 보면서 "어떤 순서로 만들었나" 흐름을 따라갈 수 있음.

---

## 작업 순서 (미착수)

- [ ] `test/` 폴더를 `vibe-week1` 기준 코드로 정리
  - `test/src/App.jsx` — React Router + Sidebar + 2페이지 구조 완성
  - `test/src/pages/Home.jsx` + `About.jsx` 생성
  - `test/src/components/Sidebar.jsx` 생성
- [ ] `test/` 완성 후 GitHub에 `vibe-week1` 리포 생성 + push
- [ ] 이후 `vibe-week2`는 week1 기준에서 기능 추가한 별도 리포로 생성
- [ ] 각 리포 README에 "이번 주에 배운 것", "주요 파일 설명" 작성

---

## 비고

- `test/` 폴더가 vibe-week1 리포의 로컬 작업 공간 역할
- 완성 후 GitHub 리포 URL을 `CLAUDE.md` 또는 강의 노션에 등록
- node_modules는 .gitignore — 수강생이 clone 후 `npm install` 하도록
