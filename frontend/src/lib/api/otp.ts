// src/lib/api/otp.ts
import { prisma } from '@/lib/prisma'

export async function generateOtpFor(username: string): Promise<string> {
  const otp = '12345' 
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 有效 5 分鐘

  await prisma.user.update({
    where: { username },
    data: {
      otpCode: otp,
      otpExpiresAt: expiresAt,
    },
  })

  console.log(`[寫入 OTP] ${username} -> ${otp}（有效至 ${expiresAt.toISOString()}）`)
  return otp
}


export async function verifyOtpFor(username: string, otp: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { username } })

  if (!user || user.otpCode !== otp) {
    console.log('[OTP 錯誤]', { username, otp, userOtp: user?.otpCode })
    return false
  }

  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    console.log('[OTP 過期]', { username, otp, expiresAt: user?.otpExpiresAt })
    return false
  }

  // 驗證通過後清除 OTP
  await prisma.user.update({
    where: { username },
    data: {
      otpCode: null,
      otpExpiresAt: null,
    },
  })

  console.log('[OTP 驗證成功]', { username })
  return true
}

/*
export function hasSentOtp(username: string): boolean {
  return otpMap[username] !== undefined;
}
*/
