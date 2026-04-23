import { NextRequest, NextResponse } from 'next/server'
import { mlbbApi } from '@/lib/mlbb-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role_id, zone_id } = body

    if (!role_id || !zone_id) {
      return NextResponse.json(
        { code: -1, message: 'Missing role_id or zone_id' },
        { status: 400 }
      )
    }

    const result = await mlbbApi.sendVerificationCode(role_id, zone_id)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Send VC error:', error)
    return NextResponse.json(
      { code: -1, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
