// src/app/page.tsx
'use client'

import { useState } from 'react'
import styles from '@/app/auth/auth.module.css'
import Link from 'next/link'
import { showSuccess, showError, clearToast } from '@/components/ToastMessage'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isProcessing, setProcessing] = useState(false)
  const router = useRouter()

  const handleLogin = () => {
    console.log('Logging in with username: ', username,', password: ', password)
    // 這裡之後會送到 backend

    if (isProcessing) {
      showError('Still in process')
      return
    }

    if (!username || !password) {
      showError('Username and password are required')
      return
    }

    if (username == "admin" && password == "admin") {
      setProcessing(true)
      showSuccess('Login Success')
      setTimeout(() => router.replace('/chat'), 1500)
      setTimeout(() => clearToast(), 1450)
      setTimeout(() => setProcessing(false), 1400)
    }
    else {
      showError('Invalid credentials')
      return;
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
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
      </div>
    </div>
  )
}
