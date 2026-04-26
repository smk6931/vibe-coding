
import dynamic from '@/lib/dynamic';

const LeafletSingleMap = dynamic(
  () => import('./LeafletMap').then(m => m.LeafletSingleMap),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[4/3] rounded-xl border border-slate-200 bg-slate-50 grid place-items-center text-sm text-slate-400">
        지도 로딩 중...
      </div>
    ),
  }
);

export default function EventLocationMap(props) {
  return <LeafletSingleMap {...props} />;
}
