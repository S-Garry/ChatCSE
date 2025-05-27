// src/app/page.tsx
'use client'

import { useState } from 'react'
import styles from '@/app/auth/auth.module.css'
import Link from 'next/link'
import { showSuccess, showError, clearToast } from '@/components/ToastMessage'
import { useRouter } from 'next/navigation'
import { register, verifyOtp } from '@/lib/api/auth'

export default function Home() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isProcessing, setProcessing] = useState(false)
  const [isOtpPhase, setOtpPhase] = useState(false)
  const router = useRouter()

  const handleRegister = async () => {
    if (isProcessing) {
      showError('Still in process')
      return
    }

    if (!username || !password || !email) {
      showError('Email, username and password are required')
      return
    }

    setProcessing(true)
    try {
      await register({ email, username, password})
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

    setProcessing(true)
    try {
      // DISCUSS: username or email?
      await verifyOtp({username, otp})
      showSuccess('Register Success')
      setTimeout(() => router.push('login'), 1500)
      setTimeout(() => clearToast(), 1450)
    }
    catch (err: any) {
      showError(err.message)
      setOtpPhase(false)
      setOtp('')
      setPassword('')
    }
    finally {
      setTimeout(() => setProcessing(false), 1400)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register</h2>
        {!isOtpPhase ? (
          <>
            <div className="mb-4">
              <label className={styles.label}>
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Enter email"
              />
            </div>
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
              onClick={handleRegister}
              className={styles.button}
            >
              Register
            </button>
            <p className={styles.textLink}>
              Already have an account? <Link href="/auth/login">Login here</Link>
            </p>
          </>
        ) : (<>
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
