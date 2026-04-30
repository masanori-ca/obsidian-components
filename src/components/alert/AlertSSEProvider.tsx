import { createContext, useContext, type ReactNode } from 'react';
import { useAlertSSE, type AlertSSEStatus } from '@/components/hooks/useAlertSSE';
import type { AlertEvaluateResponse } from '@/lib/pck-client';

interface AlertEvent {
  id: string;
  timestamp: string;
  data: AlertEvaluateResponse;
}

interface AlertSSEContextValue {
  status: AlertSSEStatus;
  latestAlert: AlertEvent | null;
  alerts: AlertEvent[];
  connect: () => void;
  disconnect: () => void;
}

const AlertSSEContext = createContext<AlertSSEContextValue | null>(null);

interface AlertSSEProviderProps {
  autoConnect?: boolean;
  children: ReactNode;
}

/**
 * Context provider that wraps useAlertSSE and makes alert data
 * available to all child components via useAlertContext().
 */
export function AlertSSEProvider({ autoConnect = true, children }: AlertSSEProviderProps) {
  const sse = useAlertSSE(autoConnect);

  return (
    <AlertSSEContext.Provider value={sse}>
      {children}
    </AlertSSEContext.Provider>
  );
}

export function useAlertContext(): AlertSSEContextValue {
  const ctx = useContext(AlertSSEContext);
  if (!ctx) {
    throw new Error('useAlertContext must be used within <AlertSSEProvider>');
  }
  return ctx;
}
