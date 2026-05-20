'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InsForgeUser {
  id: string;
  email: string;
  role: string;
}

export interface InsForgeContextState {
  user: InsForgeUser | null;
  isUserLoading: boolean;
  userError: Error | null;
  /** Sign out: clears the cookie and resets state. */
  signOut: () => Promise<void>;
  /** Manually re-fetch the current user (e.g. after login). */
  refresh: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const InsForgeContext = createContext<InsForgeContextState | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function InsForgeProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<InsForgeUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    setIsUserLoading(true);
    setUserError(null);
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUserError(err instanceof Error ? err : new Error('Auth check failed'));
      setUser(null);
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  // Check auth state on mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const signOut = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  }, []);

  return (
    <InsForgeContext.Provider
      value={{
        user,
        isUserLoading,
        userError,
        signOut,
        refresh: fetchCurrentUser,
      }}
    >
      {children}
    </InsForgeContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useInsForge(): InsForgeContextState {
  const ctx = useContext(InsForgeContext);
  if (!ctx) throw new Error('useInsForge must be used within InsForgeProvider');
  return ctx;
}

export function useUser() {
  const { user, isUserLoading, userError } = useInsForge();
  return { user, isUserLoading, userError };
}
