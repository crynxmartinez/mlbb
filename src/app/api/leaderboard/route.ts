import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const minGames = parseInt(searchParams.get('minGames') || '0')
    const heroFilter = searchParams.get('hero') || 'all'

    // Get active tournament
    const tournament = await prisma.tournament.findFirst({
      where: { status: 'active' },
    })

    if (!tournament) {
      return NextResponse.json({
        code: 0,
        data: { players: [], tournament: null },
      })
    }

    // Build where clause
    const where: any = {
      tournamentId: tournament.id,
      gamesSinceRegistration: { gte: minGames },
    }

    if (heroFilter !== 'all') {
      where.heroName = heroFilter
    }

    // Fetch players
    const players = await prisma.player.findMany({
      where,
      orderBy: [
        { totalPoints: 'desc' },
        { winRate: 'desc' },
        { avgKda: 'desc' },
      ],
      select: {
        id: true,
        playerName: true,
        heroName: true,
        gamesSinceRegistration: true,
        totalWins: true,
        totalLosses: true,
        winRate: true,
        avgKda: true,
        totalPoints: true,
        rankPosition: true,
      },
    })

    // Update rank positions
    for (let i = 0; i < players.length; i++) {
      if (players[i].rankPosition !== i + 1) {
        await prisma.player.update({
          where: { id: players[i].id },
          data: { rankPosition: i + 1 },
        })
        players[i].rankPosition = i + 1
      }
    }

    return NextResponse.json({
      code: 0,
      data: {
        players,
        tournament: {
          id: tournament.id,
          name: tournament.name,
          status: tournament.status,
          minGamesRequired: tournament.minGamesRequired,
        },
      },
    })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json(
      { code: -1, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
