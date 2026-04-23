'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [roleId, setRoleId] = useState('')
  const [zoneId, setZoneId] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [selectedHero, setSelectedHero] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [playerName, setPlayerName] = useState('')

  const heroes = [
    { id: 101, name: 'Miya', role: 'Marksman' },
    { id: 102, name: 'Layla', role: 'Marksman' },
    { id: 103, name: 'Balmond', role: 'Fighter' },
    { id: 104, name: 'Fanny', role: 'Assassin' },
    { id: 105, name: 'Gusion', role: 'Assassin' },
    { id: 106, name: 'Ling', role: 'Assassin' },
    { id: 107, name: 'Lancelot', role: 'Assassin' },
    { id: 108, name: 'Granger', role: 'Marksman' },
  ]

  const handleSendCode = async () => {
    if (!roleId || !zoneId) {
      setError('Please enter both Game ID and Server ID')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/mlbb/send-vc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role_id: parseInt(roleId),
          zone_id: parseInt(zoneId),
        }),
      })

      const data = await response.json()

      if (data.code === 0) {
        setStep(2)
      } else {
        setError(data.message || 'Failed to send verification code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!verificationCode) {
      setError('Please enter verification code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/mlbb/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role_id: parseInt(roleId),
          zone_id: parseInt(zoneId),
          vc: parseInt(verificationCode),
        }),
      })

      const data = await response.json()

      if (data.code === 0 && data.data?.jwt) {
        localStorage.setItem('mlbb_jwt', data.data.jwt)
        setStep(3)
      } else {
        setError(data.message || 'Invalid verification code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!selectedHero) {
      setError('Please select a hero')
      return
    }

    setLoading(true)
    setError('')

    try {
      const jwt = localStorage.getItem('mlbb_jwt')
      const selectedHeroData = heroes.find(h => h.id === selectedHero)

      const response = await fetch('/api/player/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role_id: parseInt(roleId),
          zone_id: parseInt(zoneId),
          hero_id: selectedHero,
          hero_name: selectedHeroData?.name,
          jwt_token: jwt,
        }),
      })

      const data = await response.json()

      if (data.code === 0) {
        setPlayerName(data.data?.player_name || 'Player')
        setStep(4)
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎮 Register for Tournament
          </h1>
          <p className="text-blue-200">
            Join the competition and climb the leaderboard!
          </p>
        </div>

        {/* Rules Alert */}
        <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-yellow-300 mb-2">⚠️ IMPORTANT RULES:</h3>
          <ul className="text-yellow-100 text-sm space-y-1">
            <li>• Only PVP matches count (Ranked or Classic)</li>
            <li>• Bot/AI matches will result in disqualification</li>
            <li>• You can only register ONE hero</li>
            <li>• Once registered, hero cannot be changed</li>
          </ul>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 text-gray-400'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-12 h-1 ${
                    step > s ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Step 1: Enter Account */}
        {step === 1 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Step 1: Enter Your MLBB Account
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 mb-2">Game ID (Role ID)</label>
                <input
                  type="number"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                  placeholder="Enter your Game ID"
                />
              </div>
              <div>
                <label className="block text-blue-200 mb-2">Server ID (Zone ID)</label>
                <input
                  type="number"
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                  placeholder="Enter your Server ID"
                />
              </div>
              <button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Verify */}
        {step === 2 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Step 2: Verify Your Account
            </h2>
            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mb-4">
              <p className="text-blue-200 text-sm">
                📧 Check your in-game mail for the verification code
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 mb-2">Verification Code</label>
                <input
                  type="number"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Choose Hero */}
        {step === 3 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Step 3: Choose Your Hero
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {heroes.map((hero) => (
                <button
                  key={hero.id}
                  onClick={() => setSelectedHero(hero.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedHero === hero.id
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="text-4xl mb-2">🦸</div>
                  <div className="text-white font-semibold">{hero.name}</div>
                  <div className="text-blue-300 text-sm">{hero.role}</div>
                  {selectedHero === hero.id && (
                    <div className="text-blue-400 mt-2">✓</div>
                  )}
                </button>
              ))}
            </div>
            {selectedHero && (
              <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-4">
                <p className="text-yellow-300 text-sm font-semibold">
                  ⚠️ WARNING: You cannot change hero after registration!
                </p>
              </div>
            )}
            <button
              onClick={handleRegister}
              disabled={loading || !selectedHero}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Registering...' : 'Register for Tournament'}
            </button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Registration Complete!
            </h2>
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-6 mb-6">
              <p className="text-white text-lg mb-2">Welcome, {playerName}!</p>
              <p className="text-green-300">
                Hero: {heroes.find(h => h.id === selectedHero)?.name}
              </p>
              <p className="text-green-300">Starting Games: 0</p>
            </div>
            <p className="text-blue-200 mb-6">
              Your matches will be tracked automatically every 30 minutes. Good luck!
            </p>
            <Link
              href="/leaderboard"
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              View Leaderboard
            </Link>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-blue-300 hover:text-blue-200">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  )
}
