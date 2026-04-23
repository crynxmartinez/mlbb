import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get active tournament
    const tournament = await prisma.tournament.findFirst({
      where: { status: 'active' },
    })

    if (!tournament) {
      return NextResponse.json({
        code: 0,
        data: {
          totalPlayers: 0,
          qualifiedPlayers: 0,
          totalMatches: 0,
          activePlayers: 0,
          tournament: null,
          alerts: [],
        },
      })
    }

    // Get player stats
    const totalPlayers = await prisma.player.count({
      where: { tournamentId: tournament.id },
    })

    const qualifiedPlayers = await prisma.player.count({
      where: {
        tournamentId: tournament.id,
        gamesSinceRegistration: { gte: tournament.minGamesRequired },
      },
    })

    const activePlayers = await prisma.player.count({
      where: {
        tournamentId: tournament.id,
        status: 'active',
      },
    })

    // Get total matches
    const matchesAgg = await prisma.player.aggregate({
      where: { tournamentId: tournament.id },
      _sum: { gamesSinceRegistration: true },
    })
    const totalMatches = matchesAgg._sum.gamesSinceRegistration || 0

    // Get most popular hero
    const heroStats = await prisma.player.groupBy({
      by: ['heroName'],
      where: { tournamentId: tournament.id },
      _count: true,
      orderBy: { _count: { heroName: 'desc' } },
      take: 1,
    })
    const mostPopularHero = heroStats[0]
      ? `${heroStats[0].heroName} (${heroStats[0]._count} players)`
      : 'N/A'

    // Get highest points
    const topPlayer = await prisma.player.findFirst({
      where: { tournamentId: tournament.id },
      orderBy: { totalPoints: 'desc' },
      select: { totalPoints: true },
    })
    const highestPoints = topPlayer?.totalPoints || 0

    // Get highest win rate
    const topWinRate = await prisma.player.findFirst({
      where: {
        tournamentId: tournament.id,
        gamesSinceRegistration: { gte: 10 },
      },
      orderBy: { winRate: 'desc' },
      select: { winRate: true },
    })
    const highestWinRate = topWinRate?.winRate || 0

    // Calculate average games
    const avgGamesPerPlayer = totalPlayers > 0 ? (totalMatches / totalPlayers).toFixed(1) : 0

    // Get alerts
    const alerts = []
    
    // Check for expired JWT tokens
    const expiredTokens = await prisma.player.count({
      where: {
        tournamentId: tournament.id,
        jwtExpiresAt: { lt: new Date() },
      },
    })
    if (expiredTokens > 0) {
      alerts.push({
        type: 'warning',
        message: `${expiredTokens} players with expired JWT tokens`,
      })
    }

    // Check for suspicious activity (100% win rate with 20+ games)
    const suspicious = await prisma.player.findMany({
      where: {
        tournamentId: tournament.id,
        gamesSinceRegistration: { gte: 20 },
        winRate: { gte: 95 },
      },
      select: { playerName: true, winRate: true, gamesSinceRegistration: true },
    })
    suspicious.forEach((player) => {
      alerts.push({
        type: 'error',
        message: `${player.playerName}: ${player.winRate.toFixed(1)}% win rate (${player.gamesSinceRegistration} games) - REVIEW`,
      })
    })

    return NextResponse.json({
      code: 0,
      data: {
        totalPlayers,
        qualifiedPlayers,
        totalMatches,
        activePlayers,
        tournament: {
          id: tournament.id,
          name: tournament.name,
          status: tournament.status,
          minGamesRequired: tournament.minGamesRequired,
          maxGamesCounted: tournament.maxGamesCounted,
          autoUpdateEnabled: tournament.autoUpdateEnabled,
          updateFrequency: tournament.updateFrequency,
        },
        mostPopularHero,
        highestPoints,
        highestWinRate,
        avgGamesPerPlayer,
        alerts,
      },
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { code: -1, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
