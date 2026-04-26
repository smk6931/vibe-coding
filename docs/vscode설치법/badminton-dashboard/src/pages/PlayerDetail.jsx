import { useParams, Link } from 'react-router-dom'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { players } from '../data/players'

const statusConfig = {
  good:    { label: '좋음', color: 'text-green-400', bar: 'bg-green-400' },
  caution: { label: '주의', color: 'text-yellow-400', bar: 'bg-yellow-400' },
  danger:  { label: '위험', color: 'text-red-400', bar: 'bg-red-400' },
}

export default function PlayerDetail() {
  const { id } = useParams()
  const player = players.find(p => p.id === Number(id))

  if (!player) return (
    <div className="text-gray-400 py-20 text-center">
      선수를 찾을 수 없습니다. <Link to="/" className="text-green-400 underline">돌아가기</Link>
    </div>
  )

  const s = statusConfig[player.status]

  const radarData = [
    { skill: '스매시',    value: player.stats.smashRate },
    { skill: '서브',      value: player.stats.serveAccuracy },
    { skill: '네트',      value: player.stats.netPlay },
    { skill: '수비',      value: player.stats.defense },
    { skill: '체력',      value: player.stats.stamina },
    { skill: '멘탈',      value: player.stats.mental },
  ]

  return (
    <div className="space-y-8">

      {/* 뒤로가기 */}
      <Link to="/" className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
        ← 대시보드로
      </Link>

      {/* 프로필 헤더 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold text-white">
          {player.number}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{player.name}</h1>
          <p className="text-gray-400">{player.position} · {player.age}세</p>
          <p className={`mt-2 font-semibold ${s.color}`}>컨디션 {s.label} — {player.condition}점</p>
        </div>
      </div>

      {/* 컨디션 히스토리 */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">주간 컨디션 추이</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={player.conditionHistory}>
              <XAxis dataKey="week" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis domain={[0, 100]} stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#d1d5db' }}
                itemStyle={{ color: '#4ade80' }}
              />
              <Line type="monotone" dataKey="score" stroke="#4ade80" strokeWidth={2} dot={{ fill: '#4ade80' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 스탯 레이더 */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">능력치 분석</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-center">
          <RadarChart width={320} height={280} data={radarData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Radar name={player.name} dataKey="value" stroke="#4ade80" fill="#4ade80" fillOpacity={0.25} />
          </RadarChart>
        </div>
      </section>

      {/* 최근 경기 */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">최근 경기 결과</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
          {player.recentMatches.map((m, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-white font-medium">vs {m.opponent}</p>
                <p className="text-gray-400 text-sm">{m.date} · {m.score}</p>
              </div>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                m.result === '승' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
              }`}>
                {m.result}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
