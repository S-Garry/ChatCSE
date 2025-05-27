// src/app/page.tsx
'use client'

import { useState } from 'react'
import styles from '@/app/auth/auth.module.css'
import Link from 'next/link'
import { showSuccess, showError, clearToast } from '@/components/ToastMessage'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isProcessing, setProcessing] = useState(false)
  const [isOtpPhase, setOtpPhase] = useState(false)
  const router = useRouter()

  const handleRegister = () => {
    console.log('Register with username: ', username, ', password: ', password)
    // 這裡之後會送到 backend

    if (isProcessing) {
      showError('Still in process')
      return
    }

    if (!username || !password || !email) {
      showError('Email, username and password are required')
      return
    }

    // TODO: get the username from backend
    if (username == "admin") {
      showError('Username exists')
      return;
    }
    else {
      setOtpPhase(true)
    }
  }

  const handleOTP = () => {
    if (isProcessing) {
      showError('Still in process')
      return
    }

    if (!otp) {
      showError('OTP are required')
      return
    }

    if (otp == "12345") {
      setProcessing(true)
      showSuccess('Register Success')
      setTimeout(() => router.push('login'), 1500)
      setTimeout(() => clearToast(), 1450)
      setTimeout(() => setProcessing(false), 1400)
    }
    else {
      showError('Invalid OTP')
      return;
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
