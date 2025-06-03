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
  // 檢查 email 是否已註冊
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  })
  if (existingEmail) throw new Error('Email already registered')

  // 檢查 username 是否已存在
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  })
  if (existingUsername) throw new Error('Username already taken')

  // bcrypt hash 密碼
  const hashedPassword = await bcrypt.hash(password, 10)

  // 建立使用者
  await prisma.user.create({
    data: {
      email,
      username,
      passwordHash: hashedPassword,
    },
  })

  // 產生 OTP，暫存於 otpMap（for /verify-otp 使用）
  generateOtpFor(username)
}
