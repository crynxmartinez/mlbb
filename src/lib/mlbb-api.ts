const API_BASE = process.env.MLBB_API_BASE_URL || 'https://mlbb.rone.dev/api'

export interface MLBBApiResponse<T = any> {
  code: number
  data?: T
  message?: string
  msg?: string
}

export class MLBBApi {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE
  }

  async sendVerificationCode(roleId: number, zoneId: number): Promise<MLBBApiResponse> {
    const response = await fetch(`${this.baseUrl}/user/auth/send-vc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_id: roleId, zone_id: zoneId }),
    })
    return response.json()
  }

  async login(roleId: number, zoneId: number, vc: number): Promise<MLBBApiResponse<{ jwt: string }>> {
    const response = await fetch(`${this.baseUrl}/user/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_id: roleId, zone_id: zoneId, vc }),
    })
    return response.json()
  }

  async getUserInfo(jwt: string): Promise<MLBBApiResponse> {
    const response = await fetch(`${this.baseUrl}/user/info`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${jwt}` },
    })
    return response.json()
  }

  async getUserStats(jwt: string): Promise<MLBBApiResponse> {
    const response = await fetch(`${this.baseUrl}/user/stats`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${jwt}` },
    })
    return response.json()
  }

  async getUserSeason(jwt: string): Promise<MLBBApiResponse<{ sids: number[] }>> {
    const response = await fetch(`${this.baseUrl}/user/season`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${jwt}` },
    })
    return response.json()
  }

  async getUserMatches(jwt: string, sid: number, limit: number = 50): Promise<MLBBApiResponse> {
    const response = await fetch(`${this.baseUrl}/user/matches?sid=${sid}&limit=${limit}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${jwt}` },
    })
    return response.json()
  }

  async getHeroes(size: number = 200): Promise<MLBBApiResponse> {
    const response = await fetch(`${this.baseUrl}/heroes?size=${size}`, {
      method: 'GET',
    })
    return response.json()
  }
}

export const mlbbApi = new MLBBApi()
