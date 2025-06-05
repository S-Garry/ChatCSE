// app/api/channels/[id]/members/route.ts
export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const channelId = BigInt(context.params.id)

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
    
    const sanitizedUsers = members.map((m) => ({
      ...m.user,
      id: m.user.id.toString(),
    }))

    return NextResponse.json(sanitizedUsers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}