import CommunityLayout from './CommunityLayout';
import membersData from '../../../public/data/members.json';
import Avatar from '../../components/Avatar';

export default function CommunityMembers() {
  return (
    <CommunityLayout>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        {membersData.map(m => (
          <div key={m.id} className="card p-4 flex items-start gap-3">
            <Avatar nickname={m.nickname} size="md" />
            <div className="min-w-0">
              <p className="font-semibold text-[13px] sm:text-[14px] text-slate-900">{m.nickname}</p>
              <p className="text-[11px] sm:text-[12px] text-slate-500 line-clamp-2 mt-0.5">{m.bio}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {(m.stack ?? []).slice(0, 3).map(s => (
                  <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">#{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CommunityLayout>
  );
}
