import { NextRequest, NextResponse } from 'next/server'
import { mlbbApi } from '@/lib/mlbb-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role_id, zone_id, vc } = body

    if (!role_id || !zone_id || !vc) {
      return NextResponse.json(
        { code: -1, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await mlbbApi.login(role_id, zone_id, vc)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { code: -1, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
