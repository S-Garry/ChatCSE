// app/api/channels/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

// GET /api/channels - 取得所有聊天室（顯示 inviteCode 存在的）
export async function GET(req: NextRequest) {
  try {
    const channels = await prisma.channel.findMany({
      where: {
        inviteCode: {
          not: null,
        },
      },
      include: {
        _count: {
          select: { memberships: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(channels)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 })
  }
}

// POST /api/channels - 建立新聊天室
export async function POST(req: NextRequest) {
  try {
    const { name, createdBy } = await req.json()

    if (!name || !createdBy) {
      return NextResponse.json({ error: 'Missing name or createdBy' }, { status: 400 })
    }

    const inviteCode = nanoid(8)

    const channel = await prisma.channel.create({
      data: {
        name,
        isPrivate: true,
        createdBy,
        inviteCode,
        memberships: {
          create: {
            userId: createdBy,
          },
        },
      },
    })

    return NextResponse.json(channel)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create channel' }, { status: 500 })
  }
}
