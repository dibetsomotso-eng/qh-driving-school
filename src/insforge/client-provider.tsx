'use client';

import { ReactNode } from 'react';
import { InsForgeProvider } from '@/insforge/provider';

export function InsForgeClientProvider({ children }: { children: ReactNode }) {
  return <InsForgeProvider>{children}</InsForgeProvider>;
}
