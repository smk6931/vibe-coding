---
Title: 강의 교안 가이드 컴포넌트 (Chapter 폼팩터)
Description: GitHubGuide·MiniHompyGuide 류 — 단계별 카드 + 스크린샷 + 프롬프트 참고박스 + 라이브 데모 통합 폼팩터
When-To-Read: 새 챕터/주차 강의 가이드 컴포넌트 만들 때, EventDetail에 교안 섹션 추가할 때, 단계별 튜토리얼 UI 짤 때
Keywords: GitHubGuide, MiniHompyGuide, Chapter, 교안, 강의 가이드, 단계별 카드, isAdmin, 교안모드, PromptRef, lecture, tutorial
Priority: high
---

# 강의 교안 가이드 컴포넌트 (Chapter 폼팩터)

## 왜 이 패턴

`OnedayClassCurriculum` 안에 챕터별로 단계별 가이드를 박는 표준 폼팩터. 같은 모양으로 통일하면:
- 학생 입장: 챕터마다 동일한 패턴이라 학습 부담 ↓
- 운영자 입장: 새 챕터 추가가 데이터 입력만으로 가능
- 교안/학생 토글(`isAdmin`) 한 곳에서 일괄 처리

## 현재 적용된 컴포넌트

```
front/src/components/
├── GitHubGuide.jsx                  ← Chapter 1 — GitHub 리포 생성
├── GitHubGuide.module.css           ← 공통 CSS Module (재사용 가능)
└── MiniHompyGuide.jsx               ← Chapter 2 — 미니홈피 바이브 코딩
                                       (GitHubGuide.module.css 재사용)
```

`OnedayClassCurriculum.jsx`에서 순차 렌더:
```jsx
<GitHubGuide isAdmin={isGuide} />
<MiniHompyGuide isAdmin={isGuide} />
{/* 다음 chapter는 같은 폼팩터로 추가 */}
```

## 데이터 구조 (SECTIONS 배열)

```js
const SECTIONS = [
  {
    id: 'init',                          // 고유 ID (key 용)
    label: '1단계 — 빈 프로젝트',        // 섹션 라벨 (배지)
    labelColor: '#6366f1',               // 라벨 배경색
    badge: '0:20~0:35',                  // 우측 보조 텍스트 (시간/배지)
    desc: '섹션 한 줄 설명',
    steps: [
      {
        num: '1',                        // 단계 번호 (왼쪽 동그라미)
        color: '#6366f1',                // 단계 색
        title: '단계 제목',
        desc: '핵심 한 줄',
        detail: '상세 설명 (캡처 우측 패널 내용 등)',
        img: '/images/guide/week1/...png',  // 스크린샷 경로 (admin 모드만 노출)
        prompt: '이 단계 프롬프트 (참고박스로 표시)',  // 선택
        tip: '운영 노트',                // 선택
        warning: '주의사항',             // 선택
      },
    ],
  },
];
```

## isAdmin 분기 (교안 모드 / 학생 모드)

| 요소 | 교안 모드 | 학생 모드 |
|------|----------|----------|
| 헤더 부제 | "교안 모드 — 상세 + 운영 노트" | 친근한 한 줄 설명 |
| 우상단 배지 | `교안 모드` 빨강 pill | 없음 |
| 단계 스크린샷 | 노출 | 숨김 |
| `tip` / `warning` | 노출 | 노출 (학생도 도움) |
| `prompt` 박스 | 노출 | 노출 (수강생이 따라침) |

`OnedayClassCurriculum.jsx`에서 `mode === 'guide'`로 토글, prop으로 내려줌.

## CSS는 GitHubGuide.module.css 재사용

새 가이드 컴포넌트 만들 때:
```jsx
import s from './GitHubGuide.module.css';
```

제공 클래스: `.wrap`, `.header`, `.title`, `.subtitle`, `.adminBadge`,
`.section`, `.sectionHeader`, `.sectionLabel`, `.sectionBadge`, `.sectionDesc`,
`.stepList`, `.stepCard`, `.stepLeft`, `.stepNum`, `.stepLine`, `.stepBody`,
`.stepTitle`, `.stepDesc`, `.stepDetail`, `.imgWrap`, `.stepImg`,
`.tipBox`, `.tipIcon`, `.warnBox`, `.warnIcon`, `.previewNote`

추가 UI(프롬프트 박스, 라이브 데모 등)는 컴포넌트 내부에서 Tailwind로.

## PromptRef — 프롬프트 참고 박스

스크린샷 아래에 "이 단계 프롬프트 (참고)" 박스 + 복사 버튼:

```jsx
function PromptRef({ text }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          이 단계 프롬프트 (참고)
        </span>
        <button onClick={copy} className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-white font-semibold hover:bg-slate-900">
          {copied ? '복사됨 ✓' : '복사'}
        </button>
      </div>
      <p className="text-[12px] text-slate-700 leading-relaxed font-mono whitespace-pre-wrap break-words">
        {text}
      </p>
    </div>
  );
}
```

학생 모드에서도 노출. 수강생이 그대로 복사해서 AI 채팅창에 붙여넣을 용도.

## 마지막에 라이브 데모 임베드

각 챕터의 마지막에 "완성 결과물" 라이브 컴포넌트:

```jsx
<div className="mt-8 pt-6 border-t border-slate-100">
  <div className="flex items-center gap-2 mb-3">
    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
    <h3 className="text-[14px] font-bold text-slate-800">완성 결과물 — 직접 써보세요</h3>
    <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">LIVE</span>
  </div>
  <p className="text-[12px] text-slate-500 mb-4">결과물 설명</p>
  <MiniHompyLive />
</div>
```

라이브 컴포넌트 임베드 패턴은 [mini-hompy-demo.md](mini-hompy-demo.md) 참조.

## 캡처 파일 컨벤션

```
docs/class/<주제>/<주차>/chapter_N_<topic>/      ← 원본 (파일명에 프롬프트 그대로)
front/public/images/guide/<주차>/chapter<N>-<step>-<name>.png   ← 가이드 노출용 (단순 이름)
```

원본 → 가이드용 복사 시 한글 경로라 Bash glob이 잡지 못하는 경우 있음. Python 스크립트 사용:

```python
from pathlib import Path
import shutil
src = Path(r"docs/class/.../chapter_N_xxx")
dst = Path(r"front/public/images/guide/weekN")
mapping = {"1": "chapterN-1-xxx.png", "2": "chapterN-2-yyy.png"}
for f in src.glob("*.png"):
    prefix = f.name.split(".")[0]
    if prefix in mapping:
        shutil.copy2(f, dst / mapping[prefix])
```

## 새 챕터 추가 체크리스트

1. 캡처 정리: `docs/class/...` → `front/public/images/guide/<주차>/chapter<N>-*.png`
2. 새 컴포넌트 `front/src/components/<주제>Guide.jsx` 생성 (GitHubGuide 폼팩터 그대로)
3. `OnedayClassCurriculum.jsx`에 import + 렌더 라인 추가
4. (선택) 챕터 결과물이 라이브 컴포넌트로 가능하면 마지막에 임베드
5. README/agents 업데이트

## 톤 가이드

- 섹션 desc: 학생 입장에서 "이 단계가 왜 필요한지" 한 줄
- step.desc: 결과물 ("뭐가 만들어지나")
- step.detail: 캡처 안 보면 모르는 보충 정보 (우측 패널 내용 등)
- step.tip: 운영 노하우 ("개념 설명 5분 이상 쓰지 말 것" 같은)
- 프롬프트는 학생이 복사해서 그대로 붙여넣을 수 있어야 — 너무 추상적 키워드("Y2K 감성") 단독은 결과물 짜침 → 디테일 키워드(글래스모피즘, 네온 글로우, shimmer 등) 1~2개 박기
