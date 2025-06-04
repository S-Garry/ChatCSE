// src/lib/api/register.ts
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { generateOtpFor } from './otp'

export async function register({
  email,
  username,
  password,
}: {
  email: string
  username: string
  password: string
}): Promise<void> {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username },
      ],
    },
  })

  if (existing) {
    throw new Error('Email or username already registered')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
    },
  })

  await generateOtpFor(username)
}
