import { useState } from 'react';
import s from './GitHubGuide.module.css';
import MiniHompy from '../pages/guide/oneday/MiniHompy';

const SECTIONS = [
  {
    id: 'init',
    label: '1단계 — 빈 프로젝트',
    labelColor: '#6366f1',
    badge: '0:20~0:35',
    desc: 'AI에게 프로젝트 만들어달라고 시키면 명령어부터 첫 화면 띄우는 것까지 자동. 첫 화면부터 톤을 잡아둬야 다음 단계가 자연스러움.',
    steps: [
      {
        num: '1',
        color: '#6366f1',
        title: 'Vite + React 빈 프로젝트 생성 + 첫 화면 톤 잡기',
        desc: 'AI에 첫 프롬프트 → npm 명령어 → npm run dev로 첫 화면 확인.',
        detail: 'Vite 기본 스플래시는 즉시 지우고 다크 보라 무드로 첫 화면을 채움. 학생이 보자마자 "오, 이미 분위기 다르네?" 느낌 드는 게 핵심.',
        img: '/images/guide/week1/chapter2-1-vite-init.png',
        prompt: `Vite + React로 minihome 프로젝트 만들어줘. 명령어 순서대로 알려주고 npm run dev까지.

기본 Vite 스플래시는 지우고 첫 화면을 이렇게 채워줘:
- 배경: 칠흑같은 딥 보라 그라데이션 (#0d001a → #220045 → #0d001a, 135deg)
- 좌상단·우하단에 거대 radial gradient 글로우 오브 (보라 rgba(168,85,247,0.45), 핑크 rgba(236,72,153,0.38))
- index.html에 구글폰트 link 추가: Cute Font, Nanum Gothic Coding, Noto Sans KR
- 가운데에 "🌟 미니홈피 만드는 중 🌟" 큼지막하게
  · Cute Font, font-size 3rem
  · 텍스트 색은 핑크→보라 그라데이션 (#f5d0fe → #e879f9 → #a855f7 → #ec4899)
  · background-position 움직이는 shimmer 애니메이션 (3.5초 무한)
- 그 아래 작게 "곧 멋진 미니홈피가 될 자리예요 ✨"
- CSS만으로 별 8개 깜빡이는 애니메이션

첫 화면부터 Y2K 다크 글래스 무드 풍기게. 절대 흰 배경에 React 로고 같은 거 두지 말고.`,
      },
    ],
  },
  {
    id: 'router',
    label: '2단계 — 라우팅 + 사이드바',
    labelColor: '#8b5cf6',
    badge: '0:35~0:55',
    desc: 'React Router로 두 페이지 구조 + 왼쪽 사이드바. 이때 디자인 시스템(글래스모피즘 + 핑크 보더)을 같이 잡아둬서 P3에서 컨텐츠만 채우면 되게.',
    steps: [
      {
        num: '2',
        color: '#8b5cf6',
        title: '두 페이지(/ + /about) + 사이드바 + 디자인 시스템',
        desc: 'URL이 바뀌면 다른 화면 — 이 개념을 사이드바 클릭으로 체험.',
        detail: '"왜 라우팅이랑 디자인을 같이?" — 한 번에 잡아두면 다음 단계가 가벼워짐. 사이드바 자체가 글래스 카드라 디자인 시스템의 첫 사례가 됨.',
        img: '/images/guide/week1/chapter2-2-router-sidebar.png',
        prompt: `이제 React Router로 두 페이지 분리해줘:
- 홈 (/) — 미니홈피 메인 (placeholder 카드만 "준비 중 ✨")
- 소개 (/about) — 자기소개 페이지 (placeholder)

설치 명령어 포함.

【사이드바 (왼쪽 고정, 폭 220px, 높이 100vh)】
- 반투명 글래스: background rgba(255,255,255,0.07) + backdrop-filter: blur(22px)
- 핑크 보더: 1.5px solid rgba(232,121,249,0.45)
- 위쪽 로고: "🌸 minihome" — Cute Font 1.8rem, 핑크→보라 그라데이션 텍스트
- 메뉴: 🏠 홈 / 👤 소개
  · 현재 페이지: 보라 글로우 box-shadow + 핑크 보더 강조
  · hover: translateX(4px) + 핑크 글로우

【본문 영역】
- 같은 다크 보라 그라데이션 배경 + 좌우 글로우 오브 살림
- placeholder 카드도 글래스로 (반투명 + blur + 핑크 보더 + 보라 box-shadow 글로우)

지금 봐도 이미 "와 이쁘다" 소리 나오게. npm run dev로 확인까지.`,
        tip: '라우팅 = "URL이 바뀌면 컴포넌트가 교체된다" 한 줄로 설명. 개념 설명에 5분 이상 쓰지 말 것.',
      },
    ],
  },
  {
    id: 'content',
    label: '3단계 — 미니홈피 본체 + 자기소개',
    labelColor: '#ec4899',
    badge: '0:55~1:25',
    desc: '사진 한 장을 채팅창에 드래그 → AI가 자기소개 글 + 홈 미니홈피 본체(헤더·프로필·방문자수·좋아하는것·다이어리·별파티클) 한 번에 생성. 멀티모달 임팩트의 정점.',
    steps: [
      {
        num: '3',
        color: '#ec4899',
        title: '사진 드래그 → 자기소개 + 미니홈피 본체 완성',
        desc: '사진을 채팅창에 드래그 + 프롬프트 한 번 → About + 홈 둘 다 채워짐.',
        detail: '캡처 추가 예정. 사진 드래그 → AI 응답 → 결과물 시연 순서로 3장 정도.',
        img: null,
        prompt: `[자기 사진 1장을 채팅창에 드래그한 다음]

이제 본격 컨텐츠 채워줘.

【About 페이지】
드래그한 사진 보고 자기소개 만들어 — 이름, 한 줄 소개, 관심사 3개, 자기소개 문단.
다크 보라 톤 글래스 카드 안에. 사진은 동그랗게(180x180), 핑크 보더 + 회전하는 그라데이션 링.

【홈 (/) — 미니홈피 본체】

1) 별 파티클 배경 (canvas)
- 별 120개. 보라~핑크 hsl, 깜빡이는 twinkle 애니메이션. 각 별마다 shadowBlur 10.

2) 헤더
"🌟 미니홈피 🌟" — Cute Font 2.1rem, 핑크-보라 그라데이션 + shimmer. 양쪽 별 이모지는 4초마다 360도 회전 + 1.25배 확대.

3) 프로필 섹션
- 동그란 사진(120x120) + 회전하는 핑크-보라 그라데이션 보더 링 (3초 무한)
- 옆에: 이름(Cute Font) / 한마디 "🎵 오늘도 바이브코딩 중 🎵" (보라 pill 배지) / 방문자수
- 방문자수: localStorage 저장. 6자리 디지털 시계 스타일 (각 자리수 짙은 보라 박스, Nanum Gothic Coding, 핑크 네온)

4) "💕 좋아하는 것" 4개 카드 그리드
이모지 + 라벨(Cute Font) + 한 줄 설명. hover 시 5px 떠오르고 1.04배 + 보라 글로우.

5) "📔 오늘의 다이어리"
한 줄 메모 입력 + 핑크-보라 그라데이션 등록 버튼. 입력하면 위에 쌓이고 localStorage 저장. 슬라이드인 애니메이션.

6) 푸터: "made with 💜 · since 2026" 가운데, 흐릿한 보라.

CSS Modules, 키프레임 mh 접두사. 모바일(520px↓)에서 좋아하는것 2열, 프로필 세로.
다 만들고 npm run dev로 확인까지.`,
        tip: '멀티모달 체험 핵심 구간. 사진 드래그 → Claude 응답 나오는 순간 반응이 제일 좋음.',
      },
    ],
  },
  {
    id: 'asset',
    label: '4단계 — 사진 자산 추가',
    labelColor: '#f59e0b',
    badge: '1:25~1:35',
    desc: '본인 사진 파일을 프로젝트에 추가하고 컴포넌트에 노출. 파일 경로·import·src 속성 — 비전공자가 가장 헷갈리는 "파일이 어디 있어야 하나"를 자연스럽게 학습.',
    steps: [
      {
        num: '4',
        color: '#f59e0b',
        title: '쿠로미 사진(또는 본인 사진) 프로젝트에 추가',
        desc: '사진 파일을 프로젝트 어디에 두고 어떻게 컴포넌트에서 불러오는지.',
        detail: 'AI한테 "이 사진을 프로젝트 어디에 두고 어떻게 표시?" 물어보면 src/assets/에 두고 import하는 방법을 알려줍니다.',
        img: '/images/guide/week1/chapter2-4-kuromi.png',
        prompt: `http://localhost:5174 여기서 Today's visitors 밑에 kuromi.png 쿠로미 사진을 넣어줘.
이 쿠로미 사진을 프로젝트 어디에 저장하고, 어떻게 이 사진을 Today's Visitor 영역에 나타내는지 알려줘.`,
        tip: 'src/assets/에 두는 것 + import 구문이 핵심. 한 번 이해하면 사진·아이콘·로고 다 동일 패턴.',
      },
    ],
  },
  {
    id: 'responsive',
    label: '5단계 — 반응형',
    labelColor: '#10b981',
    badge: '1:35~1:45',
    desc: '이쁘게 만들었는데 모바일에서 깨진다 → 미디어 쿼리 한 번에 정리. 카페에서 카톡 공유했을 때 휴대폰에서 안 깨지는 게 핵심.',
    steps: [
      {
        num: '5',
        color: '#10b981',
        title: '모바일·웹 둘 다 이쁜 반응형',
        desc: '사진이 너무 길거나 카드가 깨지는 케이스 → AI한테 반응형 부탁.',
        detail: '"모바일에서 깨져요" 한 줄로도 AI가 미디어 쿼리 짜줌. 직접 손으로 픽셀 맞추는 건 비효율.',
        img: '/images/guide/week1/chapter2-5-responsive.png',
        prompt: `자, 이거 보면 사진이 너무 세로로 길다. 이거 모바일이랑 웹에서도 이쁘게 보이는 반응형 버전으로 만들어줘.`,
        tip: 'F12 → 모바일 디바이스 토글로 직접 확인하는 습관까지. AI 결과물도 검증이 필요.',
      },
    ],
  },
];

export default function MiniHompyGuide({ isAdmin = false }) {
  return (
    <div className={s.wrap}>
      <div className={s.header}>
        <div>
          <h2 className={s.title}>Chapter 2 — 미니홈피 바이브 코딩</h2>
          <p className={s.subtitle}>
            {isAdmin
              ? '교안 모드 — 단계별 프롬프트 · 스크린샷 · 운영 노트 + 라이브 결과물'
              : '실제 수업에서 AI에 프롬프트 5번 던져서 미니홈피 한 채를 짓는 흐름. 결과물은 맨 아래 라이브로.'}
          </p>
        </div>
        {isAdmin && <span className={s.adminBadge}>교안 모드</span>}
      </div>

      {SECTIONS.map(section => (
        <div key={section.id} className={s.section}>
          <div className={s.sectionHeader}>
            <span className={s.sectionLabel} style={{ background: section.labelColor }}>
              {section.label}
            </span>
            <span className={s.sectionBadge}>{section.badge}</span>
          </div>
          <p className={s.sectionDesc}>{section.desc}</p>

          <div className={s.stepList}>
            {section.steps.map(step => (
              <div key={step.num} className={s.stepCard}>
                <div className={s.stepLeft}>
                  <div className={s.stepNum} style={{ background: step.color }}>
                    {step.num}
                  </div>
                  <div className={s.stepLine} />
                </div>

                <div className={s.stepBody}>
                  <h3 className={s.stepTitle}>{step.title}</h3>
                  <p className={s.stepDesc}>{step.desc}</p>
                  <p className={s.stepDetail}>{step.detail}</p>

                  {step.prompt && <PromptBlock text={step.prompt} />}

                  {isAdmin && step.img && (
                    <div className={s.imgWrap}>
                      <img
                        src={step.img}
                        alt={step.title}
                        className={s.stepImg}
                        loading="lazy"
                      />
                    </div>
                  )}
                  {isAdmin && !step.img && (
                    <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-[12px] text-slate-400">
                      📷 캡처 추가 예정
                    </div>
                  )}

                  {step.tip && (
                    <div className={s.tipBox}>
                      <span className={s.tipIcon}>TIP</span>
                      {step.tip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 라이브 결과물 */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-[14px] font-bold text-slate-800">완성 결과물 — 직접 써보세요</h3>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">LIVE</span>
        </div>
        <p className="text-[12px] text-slate-500 mb-4 leading-relaxed">
          위 5개 프롬프트로 AI가 만든 결과물. 방문자수는 실제로 카운트되고, 다이어리는 직접 입력해보세요.
        </p>
        <MiniHompy />
      </div>
    </div>
  );
}

function PromptBlock({ text }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          이 단계 프롬프트
        </span>
        <button
          onClick={copy}
          className="text-[11px] px-2 py-0.5 rounded-md bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
        >
          {copied ? '복사됨 ✓' : '복사'}
        </button>
      </div>
      <pre className="bg-slate-900 text-emerald-400 rounded-lg p-3 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">
        {text}
      </pre>
    </div>
  );
}
