// app/api/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyOtpFor } from '@/lib/api/otp'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { username, otp } = await req.json()

  const valid = await verifyOtpFor(username, otp)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    token: `mock-jwt-token-for-${username}`,
    uid: user.id.toString(), // BigInt 轉 string 回傳
  })
}


