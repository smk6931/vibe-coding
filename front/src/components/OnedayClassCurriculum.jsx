import { Link } from 'react-router-dom';

/* 2시간 바이브코딩 원데이 클래스 커리큘럼 — evt-001 전용 */

const TIMELINE = [
  {
    time: '0:00 – 0:20',
    label: '환경 세팅',
    color: 'bg-brand-600',
    title: 'VSCode + Claude Extension 설치',
    desc: '노트북만 들고 오세요. 같이 설치합니다.',
    items: [
      'VSCode 공식 홈페이지에서 .exe 다운로드 → 설치 (PATH 추가 옵션 체크)',
      'Node.js LTS 버전 설치 (nodejs.org)',
      'VSCode Extensions → "Claude for VS Code" 검색 → Install',
      'Claude 계정 로그인 (없으면 현장 회원가입)',
    ],
    tip: '설치가 미리 되어 있으면 더 좋지만, 현장에서도 충분히 완료할 수 있어요.',
  },
  {
    time: '0:20 – 0:40',
    label: '첫 프롬프트',
    color: 'bg-indigo-500',
    title: '바이브코딩이란? + 첫 프롬프트 작성',
    desc: '코드를 외우지 않아도 됩니다. Claude한테 말로 설명하면 됩니다.',
    items: [
      '바이브코딩 개념 소개 — "AI한테 지시해서 만드는 코딩"',
      '첫 프롬프트 복사해서 Claude에 붙여넣기',
      'React 프로젝트 생성 명령어 → 터미널에 Ctrl+V → Enter',
      '브라우저에 localhost:3000 열어서 첫 화면 확인',
    ],
    tip: '터미널 명령어를 외울 필요 없습니다. Claude가 "이걸 터미널에 붙여넣어" 하고 알려줘요.',
    prompt: `나는 코딩을 전혀 모르는 완전 초보자야.\n지금 VSCode를 열었고 오른쪽에 Claude 채팅이 있어.\n\nReact로 [만들고 싶은 것] 웹사이트를 처음부터 만들어줘.\n단계마다 터미널에 붙여넣을 명령어랑 다음에 뭘 해야 하는지 알려줘.\n모르는 용어는 쉽게 설명해줘.`,
  },
  {
    time: '0:40 – 1:30',
    label: '라이브 제작',
    color: 'bg-warm-500',
    title: '내 첫 웹페이지 1장 만들기 (Claude와 함께 라이브)',
    desc: '운영자 화면을 보면서 따라 만드세요. 막히면 바로 옆에서 봐드립니다.',
    items: [
      '포트폴리오 / 소개 페이지 중 원하는 것 선택',
      'Claude에 "이런 디자인으로 만들어줘" 요청 → 코드 받기',
      '파일 열고 전체 선택(Ctrl+A) → 붙여넣기(Ctrl+V) → 저장(Ctrl+S)',
      '브라우저 새로고침 → 확인 → 마음에 안 들면 "이 부분 바꿔줘" 요청',
      '반복하면서 내 페이지 완성',
    ],
    tip: '한 번에 하나씩만 바꾸세요. 한꺼번에 많이 요청하면 오류 추적이 어려워요.',
  },
  {
    time: '1:30 – 1:50',
    label: '배포',
    color: 'bg-emerald-600',
    title: 'GitHub 업로드 + Vercel 배포 (내 URL 생성)',
    desc: '끝나면 실제 인터넷 주소가 생깁니다. 지인에게 바로 공유 가능해요.',
    items: [
      'GitHub 계정 만들기 (없으면 현장)',
      'Claude에 "GitHub에 올리고 Vercel로 배포하는 법 알려줘" 요청',
      'Vercel 계정 연동 → 프로젝트 선택 → Deploy 클릭',
      '내 도메인 URL 확인 (예: my-project.vercel.app)',
    ],
    tip: '카카오톡에 링크 공유 → 폰으로 확인 → 완성!',
  },
  {
    time: '1:50 – 2:00',
    label: '마무리',
    color: 'bg-slate-600',
    title: '결과물 발표 + 다음 단계 안내',
    desc: '짧게 한 마디씩. 잘 안 됐어도 괜찮아요.',
    items: [
      '한 명씩 화면 보여주며 한 마디 (강요 아님)',
      '다음 모임 일정 안내',
      '카카오 오픈채팅방 초대 → 이후 질문·피드백 채널',
      '오늘 쓴 프롬프트 모음 공유 (Notion 링크)',
    ],
    tip: '"구경하러 왔어요"도 충분합니다. 다음 번엔 더 만들 수 있어요.',
  },
];

const PROMPTS = [
  {
    label: '다음 단계를 모를 때',
    code: '방금 [한 것] 했어. 다음에 뭘 해야 해?\n터미널 명령어가 있으면 복사할 수 있게 알려줘.',
  },
  {
    label: '오류가 났을 때',
    code: '아래 오류가 났어. 왜 이런 건지 쉽게 설명해주고\n수정 방법이랑 수정된 전체 코드 보여줘.\n\n[오류 메시지 붙여넣기]',
  },
  {
    label: '기능 추가하고 싶을 때',
    code: '지금 웹사이트에 [추가하고 싶은 기능]을 추가하고 싶어.\n설치할 게 있으면 터미널 명령어도 같이 알려주고\n수정할 파일이랑 전체 코드 보여줘.',
  },
  {
    label: '완전히 막혔을 때',
    code: '나는 코딩 초보야. 지금 [상황]인데 어떻게 해야 할지 모르겠어.\n뭘 해야 하는지 순서대로 알려줘. 터미널 명령어 있으면 복사할 수 있게.\n모르는 용어는 쉽게 설명해줘.',
  },
];

const PREP = [
  { icon: '💻', t: '노트북 지참 필수', d: 'Windows / Mac 모두 OK. 충전기도 가져오세요.' },
  { icon: '🌐', t: '인터넷 연결 확인', d: '와이파이가 제공되지만 LTE 핫스팟 백업 추천.' },
  { icon: '👤', t: 'Anthropic 계정', d: 'claude.ai 가입 (무료 플랜 OK). 미리 해두면 시간 절약.' },
  { icon: '💾', t: 'GitHub 계정', d: 'github.com 가입 (무료). 현장에서도 OK.' },
];

export default function OnedayClassCurriculum({ kakaoUrl }) {
  return (
    <div className="mt-8 space-y-6">
      {/* 헤드라인 */}
      <div className="border-t border-slate-100 pt-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">2시간 커리큘럼</h2>
        <p className="mt-1 text-[13px] text-slate-500">
          코드 한 줄 몰라도 됩니다. Claude가 다 알려줘요. 운영자가 옆에서 봐드립니다.
        </p>
      </div>

      {/* 타임라인 */}
      <div className="relative">
        {/* 세로선 */}
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-200" aria-hidden />

        <ol className="space-y-4">
          {TIMELINE.map((step, i) => (
            <li key={i} className="flex gap-3 sm:gap-4">
              {/* 타임 도트 */}
              <div className="shrink-0 w-10 flex flex-col items-center gap-0.5 pt-1">
                <div className={`w-5 h-5 rounded-full ${step.color} flex items-center justify-center text-white text-[10px] font-bold z-10`}>
                  {i + 1}
                </div>
              </div>

              {/* 내용 */}
              <div className="flex-1 min-w-0 card p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                  <div>
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full text-white mb-1 ${step.color}`}>
                      {step.label}
                    </span>
                    <h3 className="font-bold text-[14px] sm:text-[15px] text-slate-900 leading-snug">{step.title}</h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">{step.time}</span>
                </div>
                <p className="text-[12px] sm:text-[13px] text-slate-600 mb-2">{step.desc}</p>
                <ul className="space-y-1">
                  {step.items.map((item, j) => (
                    <li key={j} className="flex gap-2 text-[12px] sm:text-[13px] text-slate-700">
                      <span className="text-slate-300 shrink-0 mt-0.5">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {step.tip && (
                  <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-[11px] sm:text-[12px] text-amber-800">
                    {step.tip}
                  </div>
                )}
                {step.prompt && (
                  <div className="mt-3">
                    <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider">첫 프롬프트 예시</div>
                    <pre className="bg-slate-900 text-emerald-400 rounded-lg p-3 text-[11px] sm:text-[12px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                      {step.prompt}
                    </pre>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* 준비물 */}
      <div>
        <h3 className="font-bold text-[14px] text-slate-800 mb-3">준비물</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {PREP.map((p, i) => (
            <div key={i} className="card p-3 flex gap-2.5 items-start">
              <span className="text-lg shrink-0">{p.icon}</span>
              <div>
                <div className="font-semibold text-[12px] sm:text-[13px] text-slate-800">{p.t}</div>
                <div className="text-[11px] text-slate-500 leading-snug mt-0.5">{p.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 프롬프트 모음 */}
      <div>
        <h3 className="font-bold text-[14px] text-slate-800 mb-3">현장에서 쓸 프롬프트 모음</h3>
        <div className="space-y-2.5">
          {PROMPTS.map((p, i) => (
            <details key={i} className="card">
              <summary className="p-3 sm:p-4 cursor-pointer font-medium text-[13px] text-slate-800 flex items-center justify-between">
                <span>{p.label}</span>
                <span className="text-slate-400 text-xs">펼치기</span>
              </summary>
              <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                <pre className="bg-slate-900 text-emerald-400 rounded-lg p-3 text-[11px] sm:text-[12px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {p.code}
                </pre>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-brand-600 text-white p-5 sm:p-6 text-center">
        <h3 className="font-bold text-[15px] sm:text-lg">자리가 얼마 안 남았어요</h3>
        <p className="text-brand-100 text-[12px] sm:text-[13px] mt-1">정원 6명 소규모. 운영자가 1:1로 봐드립니다.</p>
        <a href={kakaoUrl} target="_blank" rel="noreferrer"
          className="mt-4 inline-flex items-center px-5 py-2.5 rounded-xl bg-white text-brand-700 font-semibold text-[13px] sm:text-sm hover:bg-brand-50 transition-colors">
          카톡으로 신청하기 →
        </a>
      </div>

      {/* 수강생 결과물 보기 */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 text-center">
        <p className="text-[12px] sm:text-[13px] text-slate-500 mb-3">2시간 만에 이런 걸 만들 수 있어요</p>
        <Link to="/community"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-[13px] sm:text-sm hover:bg-slate-700 transition-colors">
          2시간 완성 배포 웹페이지 보러가기 →
        </Link>
      </div>
    </div>
  );
}
