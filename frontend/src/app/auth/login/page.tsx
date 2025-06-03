// src/app/page.tsx
'use client'

import { useState } from 'react'
import styles from '@/app/auth/auth.module.css'
import Link from 'next/link'
import { showSuccess, showError, clearToast } from '@/components/ToastMessage'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/api/login'
import { verifyOtp } from '@/lib/api/verifyOtp'

export default function Home() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isProcessing, setProcessing] = useState(false)
  const [isOtpPhase, setOtpPhase] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (isProcessing) {
      showError('Still in process')
      return
    }

    if (!username || !password) {
      showError('Username and password are required')
      return
    }

    setProcessing(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'Login failed')
      }

      setOtpPhase(true)
    }
    catch (err: any) {
      showError(err.message)
    }
    finally {
      setProcessing(false)
    }
  }

  const handleOTP = async () => {
    if (isProcessing) {
      showError('Still in process')
      return
    }
    
    if (!otp) {
      showError('OTP are required')
      return
    }
    console.log('[ handleOTP] username:', username)
    console.log('[ handleOTP] otp:', otp)


    setProcessing(true)
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, otp }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'OTP verification failed')
      }

      const data = await res.json()

      if (data.token) {
        localStorage.setItem('access_token', data.token)
      }

      showSuccess('Login Success')
      router.replace('/chat')
      clearToast()
      // setTimeout(() => router.replace('/chat'), 1500)
      // setTimeout(() => clearToast(), 1450)
    }
    catch (err: any) {
      showError(err.message)
      setOtpPhase(false)
      setOtp('')
      setPassword('')
    }
    finally {
      setProcessing(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        {!isOtpPhase ? (
          <>
            <div className="mb-4">
              <label className={styles.label}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={styles.input}
                placeholder="Enter username"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter password"
              />
            </div>
            <button
              onClick={handleLogin}
              className={styles.button}
            >
              Login
            </button>
            <p className={styles.textLink}>
              Don't have an account? <Link href="/auth/register">Register here</Link>
            </p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className={styles.label}>OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className={styles.input}
                placeholder="Enter the OTP"
              />
            </div>
            <button
              onClick={handleOTP}
              className={styles.button}
            >
              Send
            </button>
          </>
        )}
      </div>
    </div>
  )
}
