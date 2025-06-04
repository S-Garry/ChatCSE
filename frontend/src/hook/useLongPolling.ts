// hooks/useLongPolling.ts
import { useEffect, useRef, useState, useCallback } from 'react';

interface LongPollingOptions {
  url: string;
  interval?: number;
  maxRetries?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  dependencies?: any[]; // 依賴項變化時重新開始輪詢
}

export async function useLongPolling<T>({
  url,
  interval = 5000,
  maxRetries = 3,
  onSuccess,
  onError,
  enabled = true,
  dependencies = []
}: LongPollingOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (!enabled || !isActiveRef.current) return;

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
        await onSuccess(result);
      }

      // 設置下一次輪詢（只有在仍然 active 時）
      if (isActiveRef.current) {
        timeoutRef.current = setTimeout(fetchData, interval);
      }

    } catch (err: any) {
      if (err.name === 'AbortError') {
        return; // 忽略被取消的請求
      }

      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);

      if (onError) {
        onError(error);
      }

      // 重試邏輯（只有在仍然 active 時）
      if (isActiveRef.current && retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const retryDelay = interval * Math.pow(2, retryCountRef.current - 1);
        timeoutRef.current = setTimeout(fetchData, retryDelay);
      }
    } finally {
      setLoading(false);
    }
  }, [url, interval, maxRetries, onSuccess, onError, enabled, ...dependencies]);

  const startPolling = useCallback(() => {
    isActiveRef.current = true;
    retryCountRef.current = 0;
    fetchData();
  }, [fetchData]);

  const stopPolling = useCallback(() => {
    isActiveRef.current = false;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const restart = useCallback(() => {
    stopPolling();
    if (enabled) {
      setTimeout(startPolling, 100); // 短暫延遲後重新開始
    }
  }, [enabled, startPolling, stopPolling]);

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling, ...dependencies]);

  // 頁面可見性變化時的處理
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else if (enabled) {
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, startPolling, stopPolling]);

  return {
    data,
    loading,
    error,
    startPolling,
    stopPolling,
    restart,
    refetch: fetchData
  };
}