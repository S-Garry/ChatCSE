// app/api/channels/[id]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const channelId = BigInt(params.id)

    const messages = await prisma.message.findMany({
      where: { channelId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        senderId: true,
        encryptedContent: true,
        encryptedAesKey: true,
        iv: true,
        authTag: true,
        createdAt: true,
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const channelId = BigInt(params.id)
    const {
      username,
      encryptedMessage,
      encryptedAESKey,
      iv,
      authTag,
    } = await req.json()

    if (!username || !encryptedMessage || !iv || !authTag || !encryptedAESKey) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const saved = await prisma.message.create({
      data: {
        channelId,
        senderId: user.id,
        encryptedContent: encryptedMessage,
        encryptedAesKey: encryptedAESKey,
        iv,
        authTag,
      },
    })

    return NextResponse.json({ id: saved.id, createdAt: saved.createdAt })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}
