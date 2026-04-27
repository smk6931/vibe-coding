---
Title: 가이드 페이지 구조
Description: /guide/* 라우트의 레이아웃, 사이드바, 콘텐츠 컴포넌트 구조와 반응형 동작
When-To-Read: 가이드 페이지 수정, 사이드바/레이아웃 변경, 새 가이드 섹션 추가할 때
Keywords: GuideLayout, GuideSidebar, GuideClient, guide, sidebar, sticky, responsive, accordion
Priority: medium
---

# 가이드 페이지 구조

## 라우트 → 파일 매핑

```
URL: /guide/oneday/install
  → routes/guide.jsx (라우트 정의)
  → pages/guide/GuideLayout.jsx (공통 레이아웃 wrapper)
    → pages/guide/GuideSidebar.jsx (사이드 네비)
    → pages/guide/oneday/Install.jsx (페이지)
      → components/GuideClient.jsx (실제 컨텐츠 + 인터랙션)
        → pages/guide/oneday/MiniHompy.jsx (결과물 데모)
```

## GuideLayout — 반응형 그리드

```jsx
// pages/guide/GuideLayout.jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
  <div className="md:grid md:gap-8 lg:gap-12"
       style={{ gridTemplateColumns: '200px 1fr' }}>
    <aside>
      <div className="md:sticky md:top-24">
        <GuideSidebar />
      </div>
    </aside>
    <main className="mt-4 md:mt-0 min-w-0">
      {children}
    </main>
  </div>
</div>
```

- `md:` (768px) 기준으로 사이드바 on/off — `lg:`(1024px)로 하면 태블릿에서 사이드바가 상단 드롭다운으로 보여 불편함
- 사이드바 `200px` 고정, 콘텐츠 `1fr`
- `md:sticky md:top-24`: 데스크탑에서 사이드바 고정, 스크롤해도 따라옴
- `min-w-0` on main: grid 셀에서 콘텐츠가 200px 바깥으로 넘치는 것 방지

## GuideSidebar — 모바일/데스크탑 분기

```
모바일 (< 768px): md:hidden 드롭다운
  - 현재 페이지명 + 화살표 → 클릭하면 전체 메뉴 오버레이
데스크탑 (≥ 768px): hidden md:block 고정 사이드바
  - border-r border-slate-100로 구분선
  - NavContent 공통 사용
```

getCurrentLabel(pathname) → 현재 경로의 사이드바 라벨 반환 (드롭다운 버튼에 표시)

## GuideClient — 설치 가이드 콘텐츠

`components/GuideClient.jsx`

### AI 도구 탭 분기
- "Claude Code" / "Codex (OpenAI)" 탭 상단에 있음
- `tool` state: `'claude' | 'codex'`
- 공통 스텝(1-3) + 도구별 스텝(4: 설치) + 공통 스텝(5: 시작)

### 스텝 데이터 구조
```js
STEPS_COMMON      // 1-3단계: GitHub, VSCode, Node.js (두 도구 공통)
STEPS_CLAUDE_EXT  // 4단계 Claude Code 설치
STEPS_CODEX_EXT   // 4단계 Codex 설치
STEPS_CLAUDE      // 5단계 바이브 코딩 시작 (Claude)
STEPS_CODEX       // 5단계 바이브 코딩 시작 (Codex)
```

### 스크린샷 → visual 키로 분기 렌더링
```js
step.visual === 'vscode-ext-real'        → <VSCodeExtReal />  (클릭 순서 ①-⑥ 설명)
step.visual === 'node-version-screenshot'→ <NodeVersionScreenshot />
step.visual === 'vibe-start-screenshot'  → <VibeStartScreenshot />  (프롬프트 + MiniHompy)
```

### 실제 이미지 파일 위치
```
front/public/images/guide/
├── vscode-claude-ext.png   (Extension 설치 화면)
├── vscode-node-version.png (터미널에서 node --version)
├── vscode-vibe-start.png   (AI 채팅창 + 프롬프트)
└── vscode-ai-coding.png    (AI 응답 + 코드 생성)
```
원본 파일은 `front/` 루트의 숫자 이름 png들. 가이드용 이름으로 복사해서 사용.

## 새 가이드 섹션 추가 시 체크리스트

1. `routes/guide.jsx`에 새 라우트 추가
2. `pages/guide/[섹션]/` 폴더에 페이지 컴포넌트 생성
3. `GuideSidebar.jsx`의 navItems 배열에 항목 추가
4. 섹션 전용 컴포넌트는 `pages/guide/[섹션]/`에 co-locate
