import { useParams, Link } from 'react-router-dom';
import eventsData from '../../public/data/events.json';
import siteData from '../../public/data/site.json';
import { formatDateTime, formatKRW, dDay, eventTypeLabel } from '../lib/format';
import OnedayClassCurriculum from '../components/OnedayClassCurriculum';

export default function EventDetail() {
  const { id } = useParams();
  const event = eventsData.find(e => e.id === id);

  if (!event) {
    return (
      <div className="container-page py-20 text-center text-slate-500">
        이벤트를 찾을 수 없습니다.
        <br />
        <Link to="/" className="text-brand-600 hover:underline mt-4 inline-block">← 전체 모임</Link>
      </div>
    );
  }

  const isInternal     = event.source === 'internal';
  const sold           = event.remaining === 0;
  const showCurriculum = isInternal && event.type === 'oneday_class';

  return (
    <div className="container-page py-5 sm:py-8">
      <div className="mb-3">
        <Link to="/" className="text-[13px] text-slate-400 hover:text-brand-700">← 전체 모임</Link>
      </div>

      <article>
        {event.thumbnail && (
          <div className="relative aspect-[16/8] rounded-2xl overflow-hidden mb-5 bg-slate-100">
            <img src={event.thumbnail} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
              <span className={`badge text-[11px] ${isInternal ? 'bg-brand-600 text-white' : 'bg-black/60 text-white'}`}>
                {isInternal ? '★ 자체 운영' : `외부 · ${event.externalSource}`}
              </span>
              <span className="badge bg-black/60 text-white text-[11px]">{dDay(event.startAt)}</span>
              <span className="badge bg-black/60 text-white text-[11px]">{eventTypeLabel(event.type)}</span>
            </div>
          </div>
        )}

        <div className="card p-4 sm:p-6">
          <h1 className="text-[18px] sm:text-2xl font-bold tracking-tight leading-snug">{event.title}</h1>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mt-4 text-[13px] sm:text-sm">
            <Field label="일시">{formatDateTime(event.startAt)} ~ {formatDateTime(event.endAt).slice(11)}</Field>
            <Field label="장소">{event.venue.name}</Field>
            <Field label="주소">{event.venue.address}</Field>
            <Field label="주최">{event.host.name}</Field>
            <Field label="난이도">{event.level}</Field>
            <Field label="가격" className="text-brand-700 font-semibold">{formatKRW(event.price)}</Field>
            <Field label="정원">
              {sold
                ? <span className="text-rose-600 font-medium">정원 마감</span>
                : <>잔여 <strong>{event.remaining}</strong> / {event.capacity}</>}
            </Field>
          </dl>

          <div className="mt-5 pt-5 border-t border-slate-100">
            <h2 className="text-[14px] font-bold text-slate-700 mb-2">소개</h2>
            <p className="whitespace-pre-line text-[13px] sm:text-sm text-slate-700 leading-relaxed">{event.description}</p>
          </div>

          {event.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {event.tags.map(t => (
                <span key={t} className="badge bg-slate-100 text-slate-600 text-[11px]">#{t}</span>
              ))}
            </div>
          )}

          {showCurriculum && (
            <OnedayClassCurriculum kakaoUrl={siteData.kakaoOpenChatUrl} />
          )}
        </div>
      </article>
    </div>
  );
}

function Field({ label, children, className }) {
  return (
    <div className="flex gap-3">
      <dt className="w-14 shrink-0 text-slate-400 text-[12px] sm:text-[13px]">{label}</dt>
      <dd className={`text-[13px] sm:text-sm ${className ?? 'text-slate-700'}`}>{children}</dd>
    </div>
  );
}
