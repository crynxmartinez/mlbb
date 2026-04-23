export interface PointsConfig {
  baseWinPoints: number
  baseLossPoints: number
  kdaBonusMax: number
  mvpBonus: number
}

export interface MatchData {
  kills: number
  deaths: number
  assists: number
  mvp: boolean
  win: boolean
}

export function calculateKDA(kills: number, deaths: number, assists: number): number {
  if (deaths === 0) return kills + assists
  return (kills + assists) / deaths
}

export function calculatePoints(match: MatchData, config: PointsConfig): number {
  const kda = calculateKDA(match.kills, match.deaths, match.assists)
  
  if (match.win) {
    // Win points
    let points = config.baseWinPoints
    
    // KDA bonus (0 to kdaBonusMax)
    const kdaBonus = Math.min(kda * 2, config.kdaBonusMax)
    points += kdaBonus
    
    // MVP bonus
    if (match.mvp) {
      points += config.mvpBonus
    }
    
    return points
  } else {
    // Loss points
    let points = config.baseLossPoints
    
    // KDA reduction (less loss if good KDA)
    const kdaReduction = Math.min(kda * 1, 5)
    points += kdaReduction
    
    return points
  }
}

export function calculatePlayerStats(matches: MatchData[]) {
  if (matches.length === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      avgKda: 0,
      avgScore: 0,
      mvpCount: 0,
    }
  }

  const wins = matches.filter(m => m.win).length
  const losses = matches.length - wins
  const mvpCount = matches.filter(m => m.mvp).length
  
  const totalKda = matches.reduce((sum, m) => {
    return sum + calculateKDA(m.kills, m.deaths, m.assists)
  }, 0)
  
  return {
    totalGames: matches.length,
    wins,
    losses,
    winRate: (wins / matches.length) * 100,
    avgKda: totalKda / matches.length,
    avgScore: 0, // Will be calculated from match.score
    mvpCount,
  }
}
