import { Link } from 'react-router-dom'
import { players, upcomingMatches, teamStats } from '../data/players'

const statusConfig = {
  good:    { label: '좋음', color: 'bg-green-500',  dot: 'bg-green-400',  text: 'text-green-400' },
  caution: { label: '주의', color: 'bg-yellow-500', dot: 'bg-yellow-400', text: 'text-yellow-400' },
  danger:  { label: '위험', color: 'bg-red-500',    dot: 'bg-red-400',    text: 'text-red-400' },
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  )
}

function PlayerCard({ player }) {
  const s = statusConfig[player.status]
  return (
    <Link
      to={`/player/${player.id}`}
      className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-green-500 transition"
    >
      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold text-white">
        {player.number}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-white">{player.name}</p>
        <p className="text-gray-400 text-sm">{player.position}</p>
      </div>
      <div className="text-right">
        <div className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${s.text} bg-gray-800`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </div>
        <p className="text-white font-bold mt-1">{player.condition}<span className="text-gray-400 text-xs">점</span></p>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const { season, wins, losses, winRate, rank, totalTeams } = teamStats

  return (
    <div className="space-y-8">

      {/* 시즌 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-white">{season}</h1>
        <p className="text-gray-400 text-sm mt-1">마지막 업데이트: 2025년 4월 14일</p>
      </div>

      {/* 팀 성적 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="승" value={wins} sub="이번 시즌" />
        <StatCard label="패" value={losses} sub="이번 시즌" />
        <StatCard label="승률" value={`${winRate}%`} sub="리그 평균 60%" />
        <StatCard label="순위" value={`${rank}위`} sub={`/ ${totalTeams}팀`} />
      </div>

      {/* 선수 컨디션 */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">선수 컨디션</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {players.map(p => <PlayerCard key={p.id} player={p} />)}
        </div>
      </section>

      {/* 다음 경기 일정 */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">다음 경기 일정</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
          {upcomingMatches.map((m, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-white font-medium">vs {m.opponent}</p>
                <p className="text-gray-400 text-sm">{m.date} · {m.location}</p>
              </div>
              <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full">{m.type}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
