import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            🎮 MLBB Tournament Tracker
          </h1>
          <p className="text-xl text-blue-200 mb-8">
            Auto-tracking tournament system for Mobile Legends: Bang Bang
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Register Now
            </Link>
            <Link
              href="/leaderboard"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-900 rounded-lg font-semibold text-lg transition-colors"
            >
              View Leaderboard
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">Hero-Based Tournaments</h3>
            <p className="text-blue-200">
              Register for your main hero and compete against other players
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Auto-Tracking</h3>
            <p className="text-blue-200">
              Your matches are automatically tracked every 30 minutes
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">Points System</h3>
            <p className="text-blue-200">
              Earn points based on wins, KDA, and MVP performances
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">How It Works</h2>
          <div className="space-y-4 text-blue-100">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <strong className="text-white">Register</strong> - Choose your main hero and verify your MLBB account
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <strong className="text-white">Play</strong> - Play ranked matches with your registered hero
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <strong className="text-white">Track</strong> - Your stats update automatically every 30 minutes
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <strong className="text-white">Rank</strong> - Climb the leaderboard and become the top player!
              </div>
            </div>
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center mt-16">
          <Link
            href="/admin/login"
            className="text-blue-300 hover:text-blue-200 text-sm"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </main>
  )
}
