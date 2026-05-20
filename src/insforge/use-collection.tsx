'use client';

import { useState, useEffect, useCallback } from 'react';

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: Error | null;
  /** Manually re-fetch (call after mutations). */
  refresh: () => void;
}

/**
 * Hook to fetch all records from an InsForge table via an API route.
 *
 * @param apiPath - The Next.js API route to call, e.g. '/api/bookings'
 * @param enabled - Set to false to skip fetching (e.g. while deps are loading)
 */
export function useCollection<T = unknown>(
  apiPath: string | null | undefined,
  enabled = true
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!apiPath || !enabled) {
      setData(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(apiPath, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Fetch ${apiPath} failed: ${res.status}`);
        return res.json() as Promise<WithId<T>[]>;
      })
      .then((rows) => {
        if (!cancelled) {
          setData(rows);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [apiPath, enabled, tick]);

  return { data, isLoading, error, refresh };
}
