// src/lib/api/otp.ts
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export async function generateOtpFor(username: string): Promise<string> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 有效 5 分鐘

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) throw new Error('User not found')

  await prisma.user.update({
    where: { username },
    data: {
      otpCode: otp,
      otpExpiresAt: expiresAt,
    },
  })

  await sendOtpEmail(user.email, otp)
  console.log(`[寄送 OTP] ${username} -> ${otp}（有效至 ${expiresAt.toISOString()}）`)
  return otp
}

export async function verifyOtpFor(username: string, otp: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user || user.otpCode !== otp) return false
  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) return false

  await prisma.user.update({
    where: { username },
    data: {
      otpCode: null,
      otpExpiresAt: null,
    },
  })

  return true
}

async function sendOtpEmail(to: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.OTP_EMAIL_FROM,
      pass: process.env.OTP_EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.OTP_EMAIL_FROM,
    to,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
  })
}