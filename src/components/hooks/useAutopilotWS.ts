import { useEffect, useRef, useState, useCallback } from 'react';
import { usePCKTenant } from '@/components/providers/PCKTenantProvider';
import type { AutopilotCycleResult, WhatIfResponse } from '@/lib/pck-client';

export type WSStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

type WSMessage =
  | { type: 'result'; [key: string]: unknown }
  | { type: 'what-if-result'; [key: string]: unknown }
  | { type: 'alert'; [key: string]: unknown }
  | { type: 'pong' }
  | { type: 'subscribed'; channel: string }
  | { type: 'error'; message: string };

interface UseAutopilotWSReturn {
  status: WSStatus;
  lastCycleResult: AutopilotCycleResult | null;
  lastWhatIfResult: WhatIfResponse | null;
  connect: () => void;
  disconnect: () => void;
  sendQuery: (query: string, context?: Record<string, unknown>) => void;
  sendWhatIf: (siteId: string, overrides: Record<string, number>, baseState: Record<string, number>) => void;
  subscribeAlerts: () => void;
}

/**
 * WebSocket hook for ProTwin2 bidirectional real-time communication.
 * Connects to ws://{baseUrl}/api/protwin2/ws?tenant={tenant}
 */
export function useAutopilotWS(autoConnect = false): UseAutopilotWSReturn {
  const { baseUrl, tenant } = usePCKTenant();
  const [status, setStatus] = useState<WSStatus>('disconnected');
  const [lastCycleResult, setLastCycleResult] = useState<AutopilotCycleResult | null>(null);
  const [lastWhatIfResult, setLastWhatIfResult] = useState<WhatIfResponse | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<number>(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const pingTimerRef = useRef<ReturnType<typeof setInterval>>();

  const disconnect = useCallback(() => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    if (pingTimerRef.current) clearInterval(pingTimerRef.current);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
    retryRef.current = 0;
  }, []);

  const sendRaw = useCallback((data: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const connect = useCallback(() => {
    disconnect();
    setStatus('connecting');

    const wsUrl = baseUrl.replace(/^http/, 'ws') + `/api/protwin2/ws?tenant=${tenant}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.addEventListener('open', () => {
      setStatus('connected');
      retryRef.current = 0;

      // Keep-alive ping every 30s
      pingTimerRef.current = setInterval(() => {
        sendRaw({ type: 'ping' });
      }, 30000);
    });

    ws.addEventListener('message', (e) => {
      try {
        const msg = JSON.parse(e.data) as WSMessage;
        switch (msg.type) {
          case 'result':
            setLastCycleResult(msg as unknown as AutopilotCycleResult);
            break;
          case 'what-if-result':
            setLastWhatIfResult(msg as unknown as WhatIfResponse);
            break;
          case 'pong':
          case 'subscribed':
            break;
          case 'error':
            console.warn('PCK WS error:', msg.message);
            break;
        }
      } catch {
        // ignore malformed
      }
    });

    ws.addEventListener('close', () => {
      if (pingTimerRef.current) clearInterval(pingTimerRef.current);
      wsRef.current = null;
      setStatus('disconnected');

      const delay = Math.min(1000 * Math.pow(2, retryRef.current), 30000);
      retryRef.current += 1;
      retryTimerRef.current = setTimeout(connect, delay);
    });

    ws.addEventListener('error', () => {
      setStatus('error');
    });
  }, [baseUrl, tenant, disconnect, sendRaw]);

  const sendQuery = useCallback(
    (query: string, context: Record<string, unknown> = {}) => {
      sendRaw({ type: 'query', query, context });
    },
    [sendRaw],
  );

  const sendWhatIf = useCallback(
    (siteId: string, overrides: Record<string, number>, baseState: Record<string, number>) => {
      sendRaw({ type: 'what-if', site_id: siteId, overrides, context: { base_state: baseState } });
    },
    [sendRaw],
  );

  const subscribeAlerts = useCallback(() => {
    sendRaw({ type: 'subscribe', channel: 'alerts' });
  }, [sendRaw]);

  useEffect(() => {
    if (autoConnect) connect();
    return () => disconnect();
  }, [autoConnect, connect, disconnect]);

  return {
    status,
    lastCycleResult,
    lastWhatIfResult,
    connect,
    disconnect,
    sendQuery,
    sendWhatIf,
    subscribeAlerts,
  };
}
