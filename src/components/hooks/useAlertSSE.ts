import { useEffect, useRef, useState, useCallback } from 'react';
import { usePCKTenant } from '@/components/providers/PCKTenantProvider';
import type { AlertEvaluateResponse } from '@/lib/pck-client';

export type AlertSSEStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface AlertEvent {
  id: string;
  timestamp: string;
  data: AlertEvaluateResponse;
}

interface UseAlertSSEReturn {
  status: AlertSSEStatus;
  latestAlert: AlertEvent | null;
  alerts: AlertEvent[];
  connect: () => void;
  disconnect: () => void;
}

/**
 * SSE hook for PCK Alert stream (GET /api/alert/stream).
 * Auto-reconnects on error with exponential backoff.
 */
export function useAlertSSE(autoConnect = false): UseAlertSSEReturn {
  const { baseUrl } = usePCKTenant();
  const [status, setStatus] = useState<AlertSSEStatus>('disconnected');
  const [latestAlert, setLatestAlert] = useState<AlertEvent | null>(null);
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef<number>(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const disconnect = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = undefined;
    }
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    setStatus('disconnected');
    retryRef.current = 0;
  }, []);

  const connect = useCallback(() => {
    disconnect();
    setStatus('connecting');

    const es = new EventSource(`${baseUrl}/api/alert/stream`);
    esRef.current = es;

    es.addEventListener('open', () => {
      setStatus('connected');
      retryRef.current = 0;
    });

    es.addEventListener('alert', (e) => {
      const parsed = JSON.parse(e.data) as AlertEvaluateResponse;
      const event: AlertEvent = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        data: parsed,
      };
      setLatestAlert(event);
      setAlerts((prev) => [event, ...prev].slice(0, 100));
    });

    es.addEventListener('heartbeat', () => {
      // keep-alive, no action needed
    });

    es.addEventListener('error', () => {
      es.close();
      esRef.current = null;
      setStatus('error');

      // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
      const delay = Math.min(1000 * Math.pow(2, retryRef.current), 30000);
      retryRef.current += 1;
      retryTimerRef.current = setTimeout(() => {
        connect();
      }, delay);
    });
  }, [baseUrl, disconnect]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => disconnect();
  }, [autoConnect, connect, disconnect]);

  return { status, latestAlert, alerts, connect, disconnect };
}
