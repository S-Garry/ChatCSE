export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('access_token');

  if (!token) {
    throw new Error('No authentication token found. Please login again.');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 如果是 401 未授权，清除 token 并提示重新登录
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      throw new Error('Authentication expired. Please login again.');
    }

    // 如果响应不成功，尝试解析错误消息
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // 如果无法解析 JSON，使用默认错误消息
      }
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network request failed');
  }
}

/*
使用示例:

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