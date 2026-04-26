import GuideLayout from '../GuideLayout';

const MAKE_ITEMS = [
  {
    id: 'intro-page',
    title: '개인 소개 웹페이지',
    desc: '내 이름·소개·연락처가 담긴 심플한 1페이지 사이트. HTML + CSS 기초로 만들고 GitHub Pages로 무료 배포.',
    badge: '기초',
    badgeCls: 'bg-emerald-50 text-emerald-700',
    soon: false,
  },
  {
    id: 'todo',
    title: 'Todo 앱',
    desc: '항목 추가·완료·삭제가 되는 간단한 Todo 리스트. JavaScript 이벤트와 DOM 조작을 실습.',
    badge: '기초',
    badgeCls: 'bg-emerald-50 text-emerald-700',
    soon: false,
  },
  {
    id: 'ai-chat',
    title: 'AI 채팅 인터페이스 (예정)',
    desc: '커리큘럼 확정 후 공개됩니다.',
    badge: '준비 중',
    badgeCls: 'bg-slate-100 text-slate-500',
    soon: true,
  },
];

const PREREQ_ITEMS = [
  {
    id: 'browser',
    title: '인터넷 브라우저 기본 사용',
    desc: 'Chrome 또는 Edge에서 URL 입력, 탭 전환, 개발자 도구(F12) 열기 정도면 충분합니다.',
  },
  {
    id: 'typing',
    title: '키보드 타이핑 가능 수준',
    desc: '영문 알파벳을 느리더라도 입력할 수 있으면 됩니다. 속도는 관계없습니다.',
  },
  {
    id: 'no-code',
    title: '코딩 경험 불필요',
    desc: '처음이어도 괜찮습니다. 수업 중 AI 도구와 함께 단계별로 진행합니다.',
  },
];

export default function Preview() {
  return (
    <GuideLayout>
      <div>
        <div className="mb-6">
          <span className="inline-block px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            원데이 클래스 미리보기
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">강의 맛보기</h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            수업에서 무엇을 만들고, 어떤 사전 지식이 필요한지 미리 확인해보세요.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-base font-bold text-slate-800 mb-3">수업에서 만들 것</h2>
          <div className="space-y-3">
            {MAKE_ITEMS.map(item => (
              <div key={item.id} className={`card p-4 ${item.soon ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${item.badgeCls}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-slate-900">{item.title}</p>
                    <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  {item.soon && <span className="shrink-0 text-[11px] text-slate-400 mt-0.5">준비 중</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold text-slate-800 mb-3">추천 사전 지식</h2>
          <div className="space-y-3">
            {PREREQ_ITEMS.map((item, idx) => (
              <div key={item.id} className="flex gap-3 card p-4">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{item.title}</p>
                  <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">커리큘럼 상세 준비 중</p>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            정식 커리큘럼은 1기 수업 확정 후 공개됩니다.
            지금은 <strong className="text-slate-700">설치 가이드</strong>를 먼저 완료해두세요.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
