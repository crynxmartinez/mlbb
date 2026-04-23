import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mlbbApi } from '@/lib/mlbb-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role_id, zone_id, hero_id, hero_name, jwt_token } = body

    if (!role_id || !zone_id || !hero_id || !hero_name || !jwt_token) {
      return NextResponse.json(
        { code: -1, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get default tournament
    const tournament = await prisma.tournament.findFirst({
      where: { status: 'active' },
    })

    if (!tournament) {
      return NextResponse.json(
        { code: -1, message: 'No active tournament found' },
        { status: 404 }
      )
    }

    // Check if hero is enabled
    const enabledHero = await prisma.enabledHero.findFirst({
      where: {
        tournamentId: tournament.id,
        heroId: hero_id,
        enabled: true,
      },
    })

    if (!enabledHero) {
      return NextResponse.json(
        { code: -1, message: 'This hero is not available for registration' },
        { status: 400 }
      )
    }

    // Check if player already registered
    const existingPlayer = await prisma.player.findUnique({
      where: {
        tournamentId_roleId_zoneId: {
          tournamentId: tournament.id,
          roleId: BigInt(role_id),
          zoneId: zone_id,
        },
      },
    })

    if (existingPlayer) {
      return NextResponse.json(
        { code: -1, message: 'You are already registered for this tournament' },
        { status: 400 }
      )
    }

    // Get player info from MLBB API
    const playerInfo = await mlbbApi.getUserInfo(jwt_token)
    if (playerInfo.code !== 0 || !playerInfo.data) {
      return NextResponse.json(
        { code: -1, message: 'Failed to fetch player info' },
        { status: 400 }
      )
    }

    // Get player stats
    const playerStats = await mlbbApi.getUserStats(jwt_token)
    
    // Get current season
    const seasonData = await mlbbApi.getUserSeason(jwt_token)
    const currentSeason = seasonData.data?.sids?.[0] || 0

    // Get current total matches
    const totalMatches = playerStats.data?.tc || 0

    // Create player registration
    const player = await prisma.player.create({
      data: {
        tournamentId: tournament.id,
        roleId: BigInt(role_id),
        zoneId: zone_id,
        playerName: playerInfo.data.name || 'Unknown',
        heroId: hero_id,
        heroName: hero_name,
        jwtToken: jwt_token,
        jwtExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
        baselineTotalMatches: totalMatches,
        seasonIdAtRegistration: currentSeason,
        currentTotalMatches: totalMatches,
      },
    })

    return NextResponse.json({
      code: 0,
      message: 'Registration successful',
      data: {
        player_id: player.id,
        player_name: player.playerName,
        hero_name: player.heroName,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { code: -1, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
