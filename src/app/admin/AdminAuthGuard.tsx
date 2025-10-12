'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isRouting, setIsRouting] = useState(false);

  useEffect(() => {
    // Wait until Firebase has checked the auth state
    if (isUserLoading) {
      return;
    }

    const isAdmin = user?.email === 'admin@example.com';
    const isLoginPage = pathname === '/admin/login';

    // If user is not an admin and is not on the login page, redirect them.
    if (!isAdmin && !isLoginPage) {
      setIsRouting(true);
      router.replace('/admin/login');
      return;
    }

    // If user is an admin and is on the login page, redirect them to the dashboard.
    if (isAdmin && isLoginPage) {
      setIsRouting(true);
      router.replace('/admin');
      return;
    }
    
    // If we've reached here, no redirect is needed, so ensure routing state is false.
    setIsRouting(false);

  }, [user, isUserLoading, pathname, router]);

  // Show a loader while Firebase is checking auth or while a redirect is in progress.
  if (isUserLoading || isRouting) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If no redirect is needed, render the children pages.
  return <>{children}</>;
}
