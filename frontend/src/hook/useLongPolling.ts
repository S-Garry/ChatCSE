// hooks/useLongPolling.ts
import { useEffect, useRef, useState, useCallback } from 'react';

interface LongPollingOptions {
  url: string;
  interval?: number;
  maxRetries?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export function useLongPolling<T>({
  url,
  interval = 5000,
  maxRetries = 3,
  onSuccess,
  onError,
  enabled = true
}: LongPollingOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // 取消前一個請求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      retryCountRef.current = 0; // 重置重試計數

      if (onSuccess) {
        onSuccess(result);
      }

      // 設置下一次輪詢
      timeoutRef.current = setTimeout(fetchData, interval);

    } catch (err: any) {
      if (err.name === 'AbortError') {
        return; // 忽略被取消的請求
      }

      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);

      if (onError) {
        onError(error);
      }

      // 重試邏輯
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        timeoutRef.current = setTimeout(fetchData, interval * Math.pow(2, retryCountRef.current - 1));
      }
    } finally {
      setLoading(false);
    }
  }, [url, interval, maxRetries, onSuccess, onError, enabled]);

  const startPolling = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const stopPolling = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  return {
    data,
    loading,
    error,
    startPolling,
    stopPolling,
    refetch: fetchData
  };
}