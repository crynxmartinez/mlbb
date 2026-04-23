'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('admin_session')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      
      if (data.code === 0) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    router.push('/admin/login')
  }

  const handleForceUpdate = async () => {
    if (!confirm('Force update all players? This may take a while.')) return
    
    try {
      const response = await fetch('/api/admin/force-update', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.code === 0) {
        alert('Update started successfully!')
        fetchDashboardStats()
      } else {
        alert('Update failed: ' + data.message)
      }
    } catch (error) {
      alert('Network error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            🎮 MLBB Tournament Admin
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">👤 Admin</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Total Players</div>
            <div className="text-3xl font-bold text-white">
              {stats?.totalPlayers || 0}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Qualified Players</div>
            <div className="text-3xl font-bold text-green-400">
              {stats?.qualifiedPlayers || 0}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Total Matches</div>
            <div className="text-3xl font-bold text-blue-400">
              {stats?.totalMatches || 0}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Active Players</div>
            <div className="text-3xl font-bold text-purple-400">
              {stats?.activePlayers || 0}
            </div>
          </div>
        </div>

        {/* Tournament Status */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">🏆 Tournament Status</h2>
          {stats?.tournament && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white font-semibold">{stats.tournament.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400 font-semibold">
                  🟢 {stats.tournament.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Min Games:</span>
                <span className="text-white">{stats.tournament.minGamesRequired}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Games:</span>
                <span className="text-white">{stats.tournament.maxGamesCounted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Auto-Update:</span>
                <span className="text-green-400">
                  {stats.tournament.autoUpdateEnabled ? '🟢 ON' : '🔴 OFF'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Update Frequency:</span>
                <span className="text-white">{stats.tournament.updateFrequency} minutes</span>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleForceUpdate}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              🔄 Force Update Now
            </button>
            <Link
              href="/admin/dashboard/settings"
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">📈 Quick Stats</h2>
          <div className="space-y-2 text-gray-300">
            <div>• Most Popular Hero: {stats?.mostPopularHero || 'N/A'}</div>
            <div>• Highest Points: {stats?.highestPoints || 0}</div>
            <div>• Highest Win Rate: {stats?.highestWinRate || 0}%</div>
            <div>• Average Games per Player: {stats?.avgGamesPerPlayer || 0}</div>
          </div>
        </div>

        {/* Alerts */}
        {stats?.alerts && stats.alerts.length > 0 && (
          <div className="bg-yellow-900/20 border-2 border-yellow-600 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">⚠️ Alerts & Notifications</h2>
            <div className="space-y-2">
              {stats.alerts.map((alert: any, index: number) => (
                <div key={index} className="text-yellow-300 text-sm">
                  {alert.type === 'warning' && '⚠️ '}
                  {alert.type === 'error' && '🚨 '}
                  {alert.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/leaderboard"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 border border-gray-700 transition-colors"
          >
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-lg font-bold text-white mb-2">View Leaderboard</h3>
            <p className="text-gray-400 text-sm">See current rankings</p>
          </Link>
          
          <Link
            href="/admin/dashboard/players"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 border border-gray-700 transition-colors"
          >
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-lg font-bold text-white mb-2">Manage Players</h3>
            <p className="text-gray-400 text-sm">View and manage registered players</p>
          </Link>
          
          <Link
            href="/admin/dashboard/heroes"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 border border-gray-700 transition-colors"
          >
            <div className="text-4xl mb-3">🦸</div>
            <h3 className="text-lg font-bold text-white mb-2">Manage Heroes</h3>
            <p className="text-gray-400 text-sm">Enable/disable heroes</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
