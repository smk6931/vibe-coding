import { useState } from 'react';
import s from './GitHubGuide.module.css';
import MiniHompyLive from '../pages/guide/oneday/MiniHompyLive';

const SECTIONS = [
  {
    id: 'init',
    label: '1단계 — Vite + React 빈 프로젝트',
    labelColor: '#6366f1',
    badge: '0:20~0:35',
    desc: '프로젝트 폴더에서 명령어 3개(npm create vite → install → run dev)로 첫 화면을 띄웁니다. 학생들이 처음으로 "내 화면이 뜬다"는 환호를 경험하는 구간.',
    steps: [
      {
        num: '1',
        color: '#6366f1',
        title: '명령어 한 번 → 첫 화면 확인',
        desc: 'AI한테 프로젝트 만들어달라고 시키면 npm 명령어 3개를 알려줍니다.',
        detail: '캡처 우측 패널: 사전 준비(폴더 위치, 필수 프로그램), 설치 명령어 3개, 주의사항(Vite 버전, npm 권한). 화면 자체는 Vite 기본 "Get started" 스플래시 — 다음 단계에서 우리 톤으로 갈아엎습니다.',
        img: '/images/guide/week1/chapter2-1-vite-init.png',
        prompt: 'Vite + React로 빈 프로젝트 만들어. 명령어 알려주고 npm run dev로 첫 화면 띄우는 데까지.',
        tip: '명령어 받아쓰기보다 "왜 이 3개를 치는지"를 한 줄씩 설명. install = 부품 다운로드, dev = 미리보기 서버.',
      },
    ],
  },
  {
    id: 'router',
    label: '2단계 — React Router + 사이드바 + 디자인 시스템',
    labelColor: '#8b5cf6',
    badge: '0:35~0:55',
    desc: 'URL이 바뀌면 다른 화면이 보이는 구조. 동시에 다크 보라 글래스 톤을 잡아둬서, 다음 단계에서 컨텐츠만 채우면 되도록.',
    steps: [
      {
        num: '2',
        color: '#8b5cf6',
        title: '두 페이지(/ + /about) + Sidebar 컴포넌트',
        desc: 'Sidebar.jsx 신규 생성 + App.jsx에 Routes 추가 + index.css에 다크 보라 베이스.',
        detail: '캡처 우측 패널: 추가/수정 파일 목록(Sidebar.jsx, App.jsx, App.css, index.css), 라우트 정의(/, /about), 사이드바 컴포넌트 코드 일부. "URL이 바뀌면 컴포넌트가 교체된다" 한 줄로 라우팅 개념 정리.',
        img: '/images/guide/week1/chapter2-2-router-sidebar.png',
        prompt: '이제 React Router로 홈 about 소개 2 페이지 나누고 왼쪽 사이드바에 이동 버튼 만들어. 설치 명령어도 라우팅 포함.',
        tip: '라우팅 개념 설명에 5분 이상 쓰지 말 것. 사이드바 클릭 → URL 바뀜 → 화면 바뀜, 이걸 직접 보여주는 게 더 빠름.',
      },
    ],
  },
  {
    id: 'content',
    label: '3단계 — 사진 드래그 + 미니홈피 본체 + About',
    labelColor: '#ec4899',
    badge: '0:55~1:25',
    desc: '사진 한 장을 채팅창에 드래그 → AI가 About 자기소개 글 + 홈 미니홈피 본체(헤더·방문자수·좋아하는것·사진·다이어리)를 컴포넌트별로 한 번에 분리 생성. 멀티모달 임팩트의 정점.',
    steps: [
      {
        num: '3',
        color: '#ec4899',
        title: '사진 → AI 자기소개 + 컴포넌트 분리 생성',
        desc: 'VisitorCounter / KuromiPhoto / FavoritesCard / DiaryMemo가 각각 별도 파일로 생성됩니다.',
        detail: '캡처 우측 패널: About 페이지 자기소개 글 구조 + 컴포넌트 분리 안내. 학생들에게 "AI가 한 번에 4개 파일을 만들었다"는 걸 보여주는 구간 — Explorer 트리에서 새로 생긴 파일들 같이 확인.',
        img: '/images/guide/week1/chapter2-3-content.png',
        prompt: '[사진 Ctrl+C → Ctrl+V] 이 사진 보고 자기소개 글 만들어서 About에 넣고, 전체 톤은 보라+핑크 그라데이션 + 별 파티클로 Y2K 감성. 방문자카운터·좋아하는것 카드·다이어리 메모도 홈에.',
        tip: '사진 드래그 → Claude 응답 나오는 순간이 가장 반응 좋음. 결과물이 바로 화면에 뜰 때까지 1:1로 봐주기.',
      },
    ],
  },
  {
    id: 'asset',
    label: '4단계 — 사진 자산 추가 (KuromiPhoto)',
    labelColor: '#f59e0b',
    badge: '1:25~1:35',
    desc: '본인이 가져온 사진(또는 쿠로미 같은 캐릭터 사진)을 프로젝트에 추가하고 컴포넌트에 노출. "파일이 어디 있어야 하나"라는 비전공자 단골 질문을 자연스럽게 학습.',
    steps: [
      {
        num: '4',
        color: '#f59e0b',
        title: 'public/ 또는 src/assets/ + import + src 속성',
        desc: 'AI에게 "이 사진을 어디 두고 어떻게 표시?" 물어보면 위치 + import + src까지 한 번에.',
        detail: '캡처 우측 패널: KuromiPhoto.jsx 컴포넌트 코드 + 이미지 경로 안내(public 폴더에 두면 / 슬래시로 바로 참조). 한 번 이해하면 사진·아이콘·로고 모두 동일 패턴.',
        img: '/images/guide/week1/chapter2-4-kuromi.png',
        prompt: "http://localhost:5174 여기서 Today's visitors 밑에 kuromi.png 쿠로미 사진을 넣어주고, 이 쿠로미 사진을 프로젝트 어디에 저장하고 어떻게 이 사진을 저기 Today's Visitor에 나타내는지 알려줘.",
        tip: 'public/에 두는 것(빌드 시 그대로) vs src/assets/에 두고 import(번들에 포함)의 차이는 가볍게만. 결과는 같음.',
      },
    ],
  },
  {
    id: 'responsive',
    label: '5단계 — 반응형 (모바일·태블릿·데스크탑)',
    labelColor: '#10b981',
    badge: '1:35~1:45',
    desc: '이쁘게 만들었는데 모바일에서 깨진다 → 미디어쿼리 한 번에. 카페에서 카톡 공유했을 때 휴대폰에서 안 깨지는 게 핵심.',
    steps: [
      {
        num: '5',
        color: '#10b981',
        title: '미디어쿼리 breakpoint별 레이아웃 분기',
        desc: '"모바일에서 사진이 너무 길어요" 한 줄로 AI가 breakpoint별 정리.',
        detail: '캡처 우측 패널: 미디어쿼리 표 — 1200px+ / 768~ / 540~ / ~480px 별로 폰트 크기·그리드 컬럼 수·패딩이 어떻게 바뀌는지. F12 → 모바일 디바이스 토글로 직접 확인하는 습관까지.',
        img: '/images/guide/week1/chapter2-5-responsive.png',
        prompt: '자, 이거 보면 사진이 너무 세로로 길다. 이거 모바일이랑 웹에서도 이쁘게 보이는 반응형 버전으로 만들어줘.',
        tip: 'AI가 한 번에 잘 잡아주지만 직접 디바이스 토글로 확인 필수. 생성형 결과물도 검증이 필요한 패턴.',
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
              ? '교안 모드 — 단계별 스크린샷 + 운영 노트. 프롬프트는 캡처 파일명 그대로.'
              : 'AI에 프롬프트 5번 던져서 미니홈피 한 채를 짓는 흐름. 결과물은 맨 아래 라이브로 직접 써보세요.'}
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

                  {step.prompt && <PromptRef text={step.prompt} />}

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

      {/* 라이브 결과물 — vibe-coding-minihome 프로젝트 그대로 임베드 */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-[14px] font-bold text-slate-800">완성 결과물 — 직접 써보세요</h3>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">LIVE</span>
        </div>
        <p className="text-[12px] text-slate-500 mb-4 leading-relaxed">
          위 5단계로 AI가 만든 실제 결과물 (vibe-coding-minihome). 사이드바 클릭으로 홈/소개 전환,
          방문자수는 실제로 카운트되고 다이어리는 직접 입력해보세요 (브라우저에 저장됨).
        </p>
        <MiniHompyLive />
      </div>
    </div>
  );
}

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
        <button
          onClick={copy}
          className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-white font-semibold hover:bg-slate-900 transition-colors"
        >
          {copied ? '복사됨 ✓' : '복사'}
        </button>
      </div>
      <p className="text-[12px] text-slate-700 leading-relaxed font-mono whitespace-pre-wrap break-words">
        {text}
      </p>
    </div>
  );
}
