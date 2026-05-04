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
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-start">
        <img
          src={operator.photo}
          alt={`운영자 ${operator.name}`}
          className="w-40 h-40 rounded-2xl object-cover shrink-0 ring-4 ring-white shadow-md bg-slate-100"
        />
        <div className="text-center sm:text-left min-w-0">
          <h2 className="text-[18px] sm:text-2xl font-bold text-slate-900">
            {operator.name}
            {operator.experience && (
              <span className="text-slate-400 font-normal"> · {operator.experience}</span>
            )}
          </h2>
          <blockquote className="mt-3 text-[14px] sm:text-base italic text-slate-700 leading-relaxed sm:border-l-2 sm:border-brand-300 sm:pl-4">
            "{operator.intro}"
          </blockquote>
        </div>
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
                    인스타그램
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
                    카카오 오픈채팅
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
