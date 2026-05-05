import { useOperator } from '../lib/useOperator';

/**
 * OperatorProfile — 운영자 풀 프로필 모듈.
 * site.json operator 단일 소스.
 *
 * Props:
 *   - variant: 'section' | 'card' (기본 'section')
 */
export default function OperatorProfile({
  variant = 'section',
  operator: operatorProp,
}) {
  const operatorFromHook = useOperator();
  const operator = operatorProp ?? operatorFromHook;
  const inner = (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="text-center sm:text-left min-w-0">
        <p className="text-[12px] font-semibold text-brand-600 mb-2">
          바이브코딩 모임 운영자
        </p>
        <h2 className="text-[22px] sm:text-3xl font-bold text-slate-900">
          {operator.name}
          {operator.experience && (
            <span className="block sm:inline text-slate-400 font-normal sm:ml-2 text-[17px] sm:text-2xl">
              {operator.experience}
            </span>
          )}
        </h2>
        <blockquote className="mt-4 text-[14px] sm:text-base italic text-slate-700 leading-relaxed sm:border-l-2 sm:border-brand-300 sm:pl-4">
          "{operator.intro}"
        </blockquote>
      </div>

      {operator.story?.length > 0 && (
        <div className="mt-8 space-y-3 text-[14px] sm:text-[15px] text-slate-700 leading-relaxed">
          {operator.story.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      <div className="mt-8 grid sm:grid-cols-2 gap-6">
        {operator.credentials?.length > 0 && (
          <div>
            <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">
              이력
            </p>
            <ul className="space-y-1 text-[13px] text-slate-700">
              {operator.credentials.map((c, i) => (
                <li key={i}>· {c}</li>
              ))}
            </ul>
          </div>
        )}
        {operator.contacts && (
          <div>
            <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">
              연락
            </p>
            <ul className="space-y-1 text-[13px] text-slate-700">
              {operator.contacts.instagram && (
                <li>
                  <a
                    href={operator.contacts.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand-600"
                  >
                    인스타그램 · 활동/후기 확인
                  </a>
                </li>
              )}
              {operator.contacts.kakao && (
                <li>
                  <a
                    href={operator.contacts.kakao}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand-600"
                  >
                    문의하기 · 카카오 오픈채팅
                  </a>
                </li>
              )}
              {operator.contacts.email && (
                <li>
                  <a
                    href={`mailto:${operator.contacts.email}`}
                    className="hover:text-brand-600"
                  >
                    {operator.contacts.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

    </div>
  );

  if (variant === 'card') {
    return (
      <section className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        {inner}
      </section>
    );
  }

  return (
    <section id="operator" className="py-10 sm:py-16 bg-slate-50 border-y border-slate-200">
      {inner}
    </section>
  );
}
