// components/ToastMessage.tsx
'use client'

import { toast, Toast } from 'react-hot-toast'

const MAX_TOASTS = 3
let activeToasts: string[] = []

function trackToast(toastId: string) {
  activeToasts.push(toastId)

  if (activeToasts.length > MAX_TOASTS) {
    const oldest = activeToasts.shift()
    if (oldest) toast.dismiss(oldest)
  }
}

export function showSuccess(message: string) {
  const id = toast.success(message)
  trackToast(id)
}

export function showError(message: string) {
  const id = toast.error(message)
  trackToast(id)
}

export function clearToast() {
    activeToasts.forEach(element => {
        toast.dismiss(element)
    });
}
