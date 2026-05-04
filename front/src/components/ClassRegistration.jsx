import curriculumsData from '../../public/data/curriculums.json';
import { formatDateTime, formatKRW, dDay } from '../lib/format';

/**
 * ClassRegistration — Curriculum + Class (Template + Instance) 패턴의 등록 모듈.
 *
 * 한 회차(=Class instance) 객체와, 거기 연결된 Curriculum 메타를 받아
 * "신청에 필요한 모든 정보"를 한 화면에 모은다.
 *
 * 표시 박스(같은 파일 내 서브컴포넌트):
 *   1) 일시 · 장소
 *   2) 결제 안내 (계좌이체)
 *   3) 환불 + 인원 미달 연기 정책
 *   4) 준비물 체크리스트 (curriculum.prerequisites)
 *   5) 신청 CTA (카톡 오픈채팅)
 *
 * Props:
 *   - event: events.json 의 자체 강의 1건 (curriculumId 필수)
 */
export default function ClassRegistration({ event }) {
  const curriculum = curriculumsData.find((c) => c.id === event.curriculumId);
  const sold = event.remaining === 0;
  const dday = dDay(event.startAt);

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2">
      <DateVenueBox event={event} dday={dday} />
      <PaymentBox event={event} />
      <PoliciesBox event={event} />
      <PrerequisitesBox curriculum={curriculum} />
      <ApplyCTA event={event} sold={sold} className="sm:col-span-2" />
    </section>
  );
}

/* ─────────────── 박스 1: 일시 · 장소 ─────────────── */
function DateVenueBox({ event, dday }) {
  const venue = event.venue;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold tracking-widest text-brand-600 uppercase">일시 · 장소</span>
        <span className="badge bg-brand-50 text-brand-700 text-[11px] font-semibold">{dday}</span>
      </div>
      <p className="mt-2 text-[15px] sm:text-base font-semibold text-slate-900 leading-snug">
        {formatDateTime(event.startAt)}
      </p>
      <p className="text-[12px] text-slate-500">
        ~ {formatDateTime(event.endAt).slice(11)}
      </p>
      <div className="mt-3 pt-3 border-t border-slate-100">
        <p className="text-[14px] font-semibold text-slate-800 leading-snug">
          {venue.name}
        </p>
        {venue.address && (
          <p className="mt-1 text-[12px] text-slate-500">{venue.address}</p>
        )}
        {venue.directions && (
          <p className="mt-2 text-[12px] text-slate-600 leading-relaxed">{venue.directions}</p>
        )}
        {venue.url && (
          <a
            href={venue.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-[12px] text-brand-600 hover:underline"
          >
            장소 정보 보기 →
          </a>
        )}
      </div>
    </div>
  );
}

/* ─────────────── 박스 2: 결제 안내 ─────────────── */
function PaymentBox({ event }) {
  const p = event.payment;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <p className="text-[11px] font-bold tracking-widest text-brand-600 uppercase">결제 안내</p>
      <p className="mt-2 text-[20px] sm:text-2xl font-bold text-brand-700">
        {formatKRW(event.price)}
      </p>
      <p className="text-[12px] text-slate-500">{p?.method ?? '계좌이체'}</p>

      {p && (
        <dl className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-[13px]">
          <Row label="은행">{p.bank}</Row>
          <Row label="계좌">{p.account}</Row>
          <Row label="예금주">{p.holder}</Row>
          <Row label="입금자명">
            <span className="text-slate-700">{p.memoFormat}</span>
          </Row>
        </dl>
      )}

      {p?.guide && (
        <p className="mt-3 text-[12px] text-slate-500 leading-relaxed bg-slate-50 rounded-lg p-2.5">
          {p.guide}
        </p>
      )}
    </div>
  );
}

/* ─────────────── 박스 3: 환불 + 연기 정책 ─────────────── */
function PoliciesBox({ event }) {
  const policies = event.policies;
  if (!policies) return null;
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5">
      <p className="text-[11px] font-bold tracking-widest text-amber-700 uppercase">환불 · 연기 정책</p>

      {policies.minHeadsNotice && (
        <p className="mt-2 text-[13px] text-slate-800 leading-relaxed font-medium">
          {policies.minHeadsNotice}
        </p>
      )}

      {policies.refund?.length > 0 && (
        <ul className="mt-3 pt-3 border-t border-amber-200 space-y-1 text-[12px] text-slate-700">
          {policies.refund.map((r, i) => (
            <li key={i}>· {r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────────── 박스 4: 준비물 ─────────────── */
function PrerequisitesBox({ curriculum }) {
  if (!curriculum?.prerequisites?.length) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <p className="text-[11px] font-bold tracking-widest text-brand-600 uppercase">준비물</p>
      <ul className="mt-2 space-y-1.5 text-[13px] text-slate-700">
        {curriculum.prerequisites.map((p, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-slate-300 shrink-0">□</span>
            <span className="leading-relaxed">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────── 박스 5: 신청 CTA ─────────────── */
function ApplyCTA({ event, sold, className = '' }) {
  if (sold) {
    return (
      <div className={`rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center ${className}`}>
        <p className="text-[14px] font-semibold text-rose-700">정원 마감</p>
        <p className="mt-1 text-[12px] text-rose-600">다음 회차 안내 받으려면 카톡 오픈채팅 입장</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl bg-brand-600 text-white p-5 sm:p-6 text-center ${className}`}>
      <p className="text-[12px] font-medium opacity-90">
        잔여 <strong className="text-white">{event.remaining}</strong> / {event.capacity}석
      </p>
      <a
        href={event.applyUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block bg-white text-brand-700 font-bold px-6 py-3 rounded-xl text-[15px] sm:text-base hover:bg-brand-50 transition"
      >
        카톡 오픈채팅으로 신청하기 →
      </a>
      <p className="mt-3 text-[11px] sm:text-[12px] opacity-80 leading-relaxed">
        오픈채팅 입장 → 운영자에게 신청 메시지 → 입금 안내 받으면 좌석 확정
      </p>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex gap-3">
      <dt className="w-14 shrink-0 text-slate-400 text-[12px]">{label}</dt>
      <dd className="text-slate-700 font-medium break-all">{children}</dd>
    </div>
  );
}
