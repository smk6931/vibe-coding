import CommunityLayout from './CommunityLayout';
import showcaseData from '../../../public/data/showcase.json';
import membersData from '../../../public/data/members.json';
import Avatar from '../../components/Avatar';

export default function CommunityShowcase() {
  const memberMap = new Map(membersData.map(m => [m.id, m]));

  return (
    <CommunityLayout>
      <p className="text-sm text-slate-500 mb-3">
        총 <strong className="text-slate-800">{showcaseData.length}</strong>개의 포트폴리오 · 회원이 만들어 자랑한 사이드프로젝트들
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        {showcaseData.map(p => {
          const m = memberMap.get(p.memberId);
          return (
            <article key={p.id} className="card overflow-hidden flex flex-col group">
              <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
                <img src={p.thumbnail} alt={p.title} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar nickname={m?.nickname ?? '?'} size="sm" />
                  <span className="text-sm font-medium text-slate-700">{m?.nickname ?? '회원'}</span>
                  <span className="text-xs text-slate-400">· {p.createdAt}</span>
                </div>
                <h3 className="font-semibold leading-snug text-[13px] sm:text-[14px]">{p.title}</h3>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2 hidden sm:block">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags.map(t => (
                    <span key={t} className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">#{t}</span>
                  ))}
                </div>
                <div className="mt-auto pt-3 flex items-center justify-between text-sm text-slate-500 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-xs">
                    <span>좋아요 {p.likes}</span>
                    <span>댓글 {p.comments}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noreferrer" className="text-brand-700 font-medium text-xs">데모 ↗</a>}
                    {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noreferrer" className="text-slate-500 text-xs">코드 ↗</a>}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </CommunityLayout>
  );
}
