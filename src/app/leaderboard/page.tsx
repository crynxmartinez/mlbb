'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Player {
  id: string
  playerName: string
  heroName: string
  gamesSinceRegistration: number
  totalWins: number
  totalLosses: number
  winRate: number
  avgKda: number
  totalPoints: number
  rankPosition: number | null
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHero, setSelectedHero] = useState('all')
  const [minGames, setMinGames] = useState(20)
  const [tournamentInfo, setTournamentInfo] = useState<any>(null)

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [minGames, selectedHero])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`/api/leaderboard?minGames=${minGames}&hero=${selectedHero}`)
      const data = await response.json()
      
      if (data.code === 0) {
        setPlayers(data.data.players || [])
        setTournamentInfo(data.data.tournament)
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = players.filter(player =>
    player.playerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            🏆 Tournament Leaderboard
          </h1>
          {tournamentInfo && (
            <div className="text-blue-200">
              <p className="text-xl">{tournamentInfo.name}</p>
              <p className="text-sm">
                Status: <span className="text-green-400">🟢 {tournamentInfo.status}</span> | 
                Total Players: {players.length}
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-blue-200 mb-2 text-sm">Search Player</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-blue-200 mb-2 text-sm">Filter by Hero</label>
              <select
                value={selectedHero}
                onChange={(e) => setSelectedHero(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              >
                <option value="all">All Heroes</option>
                <option value="Miya">Miya</option>
                <option value="Layla">Layla</option>
                <option value="Fanny">Fanny</option>
                <option value="Gusion">Gusion</option>
                <option value="Ling">Ling</option>
              </select>
            </div>
            <div>
              <label className="block text-blue-200 mb-2 text-sm">Minimum Games</label>
              <select
                value={minGames}
                onChange={(e) => setMinGames(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              >
                <option value="0">All Players</option>
                <option value="10">10+ Games</option>
                <option value="20">20+ Games (Qualified)</option>
                <option value="30">30+ Games</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        {loading ? (
          <div className="text-center text-white py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p>Loading leaderboard...</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center text-white py-12">
            <div className="text-4xl mb-4">📭</div>
            <p>No players found</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr className="text-blue-200 text-sm">
                    <th className="px-6 py-4 text-left">Rank</th>
                    <th className="px-6 py-4 text-left">Player</th>
                    <th className="px-6 py-4 text-left">Hero</th>
                    <th className="px-6 py-4 text-center">Games</th>
                    <th className="px-6 py-4 text-center">W/L</th>
                    <th className="px-6 py-4 text-center">Win Rate</th>
                    <th className="px-6 py-4 text-center">Avg KDA</th>
                    <th className="px-6 py-4 text-center">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player, index) => (
                    <tr
                      key={player.id}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-bold text-lg">
                        {getRankMedal(index + 1)}
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">
                        {player.playerName}
                      </td>
                      <td className="px-6 py-4 text-blue-300">
                        {player.heroName}
                      </td>
                      <td className="px-6 py-4 text-center text-white">
                        {player.gamesSinceRegistration}
                      </td>
                      <td className="px-6 py-4 text-center text-white">
                        <span className="text-green-400">{player.totalWins}</span>/
                        <span className="text-red-400">{player.totalLosses}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-white">
                        {player.winRate.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 text-center text-white">
                        {player.avgKda.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-yellow-400 font-bold text-lg">
                          {player.totalPoints.toFixed(0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {filteredPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getRankMedal(index + 1)}</span>
                      <div>
                        <div className="text-white font-semibold">{player.playerName}</div>
                        <div className="text-blue-300 text-sm">{player.heroName}</div>
                      </div>
                    </div>
                    <div className="text-yellow-400 font-bold text-xl">
                      {player.totalPoints.toFixed(0)}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="text-blue-200">Games</div>
                      <div className="text-white font-semibold">{player.gamesSinceRegistration}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-200">Win Rate</div>
                      <div className="text-white font-semibold">{player.winRate.toFixed(1)}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-200">Avg KDA</div>
                      <div className="text-white font-semibold">{player.avgKda.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Footer */}
        {!loading && players.length > 0 && (
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-white font-bold mb-3">📊 Tournament Stats</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-blue-200">
                • Total Qualified Players: {players.filter(p => p.gamesSinceRegistration >= 20).length}
              </div>
              <div className="text-blue-200">
                • Highest Points: {Math.max(...players.map(p => p.totalPoints)).toFixed(0)}
              </div>
              <div className="text-blue-200">
                • Average Games: {(players.reduce((sum, p) => sum + p.gamesSinceRegistration, 0) / players.length).toFixed(1)}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 text-center space-x-4">
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Register Now
          </Link>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
