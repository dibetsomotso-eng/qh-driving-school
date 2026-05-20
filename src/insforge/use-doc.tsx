'use client';

import { useState, useEffect, useCallback } from 'react';
import { WithId } from './use-collection';

export interface UseDocResult<T> {
  data: WithId<T> | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Hook to fetch a single record from an InsForge table via an API route.
 *
 * @param apiPath - The full API route with id, e.g. '/api/blog-posts/abc123'
 *                  Pass null/undefined to skip fetching.
 */
export function useDoc<T = unknown>(
  apiPath: string | null | undefined
): UseDocResult<T> {
  const [data, setData] = useState<WithId<T> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!apiPath) {
      setData(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(apiPath, { credentials: 'include' })
      .then(async (res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Fetch ${apiPath} failed: ${res.status}`);
        return res.json() as Promise<WithId<T>>;
      })
      .then((record) => {
        if (!cancelled) {
          setData(record);
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
  }, [apiPath, tick]);

  return { data, isLoading, error, refresh };
}
