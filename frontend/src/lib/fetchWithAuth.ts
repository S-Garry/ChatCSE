export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem('access_token')

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

/*
import { fetchWithAuth } from '../fetchWithAuth'

export async function sendMessage(content: string) {
  return fetchWithAuth('/api/chat/send', {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export async function getMessages() {
  return fetchWithAuth('/api/chat/history', {
    method: 'GET',
  })
}
*/