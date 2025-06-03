import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { generateOtpFor } from './otp'

export async function login({ username, password }: { username: string, password: string }) {
  const user = await prisma.user.findUnique({ where: { username } })

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error('Invalid credentials')
  }

  generateOtpFor(username) 

  return { message: 'OTP sent' }
}
