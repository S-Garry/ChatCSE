// app/api/channels/[id]/members/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const channelId = BigInt(params.id)

    const members = await prisma.channelMembership.findMany({
      where: { channelId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            publicKey: true,
          },
        },
      },
    })

    return NextResponse.json(members.map(m => m.user))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}