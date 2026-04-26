import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import PlayerDetail from './pages/PlayerDetail'
import MatchAnalysis from './pages/MatchAnalysis'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/player/:id" element={<PlayerDetail />} />
          <Route path="/match" element={<MatchAnalysis />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
