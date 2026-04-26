import GuideLayout from '../GuideLayout';

export default function ClaudeIndex() {
  return (
    <GuideLayout>
      <div>
        <div className="mb-6">
          <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold mb-2">
            준비 중
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Claude 활용</h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Cursor와 Claude를 활용한 실전 AI 코딩 강의입니다. 커리큘럼 확정 후 공개됩니다.
          </p>
        </div>
        <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center">
          <p className="text-slate-400 text-sm">강의 준비 중입니다.</p>
          <p className="text-slate-400 text-xs mt-1">원데이 클래스 설치 가이드를 먼저 완료해두세요.</p>
        </div>
      </div>
    </GuideLayout>
  );
}
