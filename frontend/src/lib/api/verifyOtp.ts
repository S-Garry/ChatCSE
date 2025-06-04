import { verifyOtpFor } from './otp';

export async function verifyOtp({
  username,
  otp,
}: {
  username: string;
  otp: string;
}): Promise<{ token?: string }> {
  console.log('[debug] verifyOtpFor 是：', verifyOtpFor)
  const valid = verifyOtpFor(username, otp);
  if (!valid) throw new Error('Invalid or expired OTP');

  return { token: 'mock-jwt-token-for-' + username };
}
