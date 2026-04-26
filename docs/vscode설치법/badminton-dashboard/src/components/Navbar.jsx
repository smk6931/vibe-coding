import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/',       label: '대시보드' },
  { to: '/match',  label: '경기 분석' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-8">
      <span className="text-green-400 font-bold text-lg tracking-wide">🏸 BadmintonPro</span>
      <div className="flex gap-4">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`text-sm px-3 py-1.5 rounded transition ${
              pathname === l.to
                ? 'bg-green-500 text-gray-950 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
