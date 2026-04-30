import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { PCKClient } from '@/lib/pck-client';

interface PCKTenantContextValue {
  client: PCKClient;
  tenant: string;
  baseUrl: string;
}

const PCKTenantContext = createContext<PCKTenantContextValue | null>(null);

interface PCKTenantProviderProps {
  baseUrl?: string;
  tenant?: string;
  children: ReactNode;
}

export function PCKTenantProvider({
  baseUrl = import.meta.env.VITE_PCK_BASE_URL ?? 'http://localhost:8080',
  tenant = import.meta.env.VITE_PCK_TENANT ?? 'kurita',
  children,
}: PCKTenantProviderProps) {
  const value = useMemo<PCKTenantContextValue>(
    () => ({
      client: new PCKClient(baseUrl, tenant),
      tenant,
      baseUrl,
    }),
    [baseUrl, tenant],
  );

  return (
    <PCKTenantContext.Provider value={value}>
      {children}
    </PCKTenantContext.Provider>
  );
}

export function usePCKTenant(): PCKTenantContextValue {
  const ctx = useContext(PCKTenantContext);
  if (!ctx) {
    throw new Error('usePCKTenant must be used within <PCKTenantProvider>');
  }
  return ctx;
}
