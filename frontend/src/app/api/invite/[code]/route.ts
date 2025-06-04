// app/api/invite/[code]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/invite/[code] - 加入聊天室
export async function POST(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params
    const { userId } = await req.json()

    if (!code || !userId) {
      return NextResponse.json({ error: 'Missing invite code or userId' }, { status: 400 })
    }

    const channel = await prisma.channel.findUnique({
      where: { inviteCode: code },
    })

    if (!channel) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 })
    }

    await prisma.channelMembership.upsert({
      where: {
        userId_channelId: {
          userId,
          channelId: channel.id,
        },
      },
      update: {},
      create: {
        userId,
        channelId: channel.id,
      },
    })

    return NextResponse.json({ channelId: channel.id, joined: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join channel' }, { status: 500 })
  }
}
