// app/api/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyOtpFor } from '@/lib/api/otp'

export async function POST(req: NextRequest) {
  const { username, otp } = await req.json()

  const valid = await verifyOtpFor(username, otp)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
  }

  return NextResponse.json({ token: `mock-jwt-token-for-${username}` })
}

