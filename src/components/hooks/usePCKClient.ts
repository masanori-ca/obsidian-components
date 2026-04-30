import { usePCKTenant } from '@/components/providers/PCKTenantProvider';
import type { PCKClient } from '@/lib/pck-client';

/**
 * Returns the PCKClient instance from the nearest PCKTenantProvider.
 */
export function usePCKClient(): PCKClient {
  const { client } = usePCKTenant();
  return client;
}
