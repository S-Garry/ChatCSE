// lib/api/auth.ts

// 模擬 delay（用來假裝正在請求 API）
const simulateNetworkDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 模擬已註冊的 email/username
const existingUsers = ['admin', 'testuser'];
const existingEmails = ['admin@example.com', 'test@example.com'];

// 模擬儲存的 OTP（實際上應該由後端發送）
const otpMap: Record<string, string> = {};


export async function register({ email, username, password }: {
  email: string;
  username: string;
  password: string;
}): Promise<void> {
  // ========== mock ==========
  await simulateNetworkDelay(800)

  if (existingEmails.includes(email)) {
    throw new Error('Email already registered')
  }

  if (existingUsers.includes(username)) {
    throw new Error('Uesrname already taken')
  }

  otpMap[username] = '12345'

  // ========== mock ==========

  // const res = await fetch('/api/register', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, username, password }),
  // });

  // if (!res.ok) {
  //   const { message } = await res.json();
  //   throw new Error(message || 'Registration failed');
  // }
}

export async function verifyOtp({ username, otp }: {
  username: string;
  otp: string;
}): Promise<void> {
  // ========== mock ==========
  await simulateNetworkDelay(600)

  const correctOTP = otpMap[username]

  if (!correctOTP) {
    throw new Error('No OTP sent for this user')
  }

  if (otp !== correctOTP) {
    throw new Error('Invalid OTP')
  }

  delete otpMap[username]
  // ========== mock ==========


  // const res = await fetch('/api/verify-otp', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ username, otp }),
  // });

  // if (!res.ok) {
  //   const { message } = await res.json();
  //   throw new Error(message || 'OTP verification failed');
  // }
}
