const PALETTE = [
  ['bg-brand-100', 'text-brand-700'],
  ['bg-warm-100',  'text-warm-600'],
  ['bg-emerald-100','text-emerald-700'],
  ['bg-rose-100',   'text-rose-700'],
  ['bg-sky-100',    'text-sky-700'],
  ['bg-amber-100',  'text-amber-700'],
  ['bg-indigo-100', 'text-indigo-700'],
  ['bg-teal-100',   'text-teal-700'],
];

function pick(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export default function Avatar({ nickname, size = 'md', className = '' }) {
  const initial = (nickname?.[0] ?? '·').toUpperCase();
  const [bg, fg] = pick(nickname || '?');
  const sizeCls =
    size === 'sm' ? 'w-7 h-7 text-[12px]' :
    size === 'lg' ? 'w-12 h-12 text-base' :
    'w-9 h-9 text-sm';
  return (
    <div className={`rounded-full grid place-items-center font-semibold ${bg} ${fg} ${sizeCls} ${className}`}>
      {initial}
    </div>
  );
}
