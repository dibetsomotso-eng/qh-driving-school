'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything while auth state is loading
    if (isUserLoading) {
      return;
    }

    const isAdmin = user?.email === 'admin@example.com';
    const isLoginPage = pathname === '/admin/login';

    // If user is not admin and not on the login page, redirect to login
    if (!isAdmin && !isLoginPage) {
      router.replace('/admin/login');
    }
    
    // If user is admin and on the login page, redirect to dashboard
    if (isAdmin && isLoginPage) {
      router.replace('/admin');
    }

  }, [user, isUserLoading, pathname, router]);

  // While auth is loading, show a full-screen spinner. This is the highest priority.
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isAdmin = user?.email === 'admin@example.com';
  const isLoginPage = pathname === '/admin/login';

  // If the user is an admin and not on the login page, show the dashboard.
  if (isAdmin && !isLoginPage) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    );
  }

  // If the user is not an admin and is trying to access the login page, show the login page.
  if (!isAdmin && isLoginPage) {
    return <>{children}</>;
  }
  
  // As a fallback for any other cases (like a non-admin on an admin page during the brief redirect period), show a loader.
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
