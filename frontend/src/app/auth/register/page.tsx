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

  const handleRegister = () => {
    console.log('Register with username: ', username,', password: ', password)
    // 這裡之後會送到 backend

    if (isProcessing) {
      showError('Still in process')
      return
    }

    if (!username || !password) {
      showError('Username and password are required')
      return
    }

    // TODO: get the username from backend
    if (username == "admin") {
      showError('Username exists')
      return;
    }
    else {
      setProcessing(true)
      showSuccess('Register Success')
      setTimeout(() => router.push('login'), 1500)
      setTimeout(() => clearToast(), 1450)
      setTimeout(() => setProcessing(false), 1400)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register</h2>
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
      </div>
    </div>
  )
}
