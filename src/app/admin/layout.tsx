'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AdminHeader() {
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/admin/login');
    }
  };

  return (
    <header className="bg-card border-b p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
    </header>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Wait until the authentication status is resolved
    if (isUserLoading) {
      return;
    }

    const isAdmin = user?.email === 'admin@example.com';
    const isLoginPage = pathname === '/admin/login';

    // If user is an admin...
    if (isAdmin) {
      // ...and they are on the login page, redirect them to the dashboard.
      if (isLoginPage) {
        router.replace('/admin');
        // We don't set isVerifying to false here because a redirect is in progress.
        // The next render will handle the new route.
        return;
      }
    }
    // If user is NOT an admin...
    else {
      // ...and they are on any page other than login, redirect them to login.
      if (!isLoginPage) {
        router.replace('/admin/login');
        // A redirect is in progress.
        return;
      }
    }

    // If we've reached this point, no redirect is needed, so we can stop verifying.
    setIsVerifying(false);

  }, [user, isUserLoading, pathname, router]);

  // While checking auth status or waiting for an initial redirect to occur, show a loader.
  if (isVerifying) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isAdmin = user?.email === 'admin@example.com';
  const isLoginPage = pathname === '/admin/login';

  // Render the protected admin dashboard layout
  if (isAdmin && !isLoginPage) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    );
  }

  // Render the login page for non-admins, or for admins who are being redirected.
  return <>{children}</>;
}
