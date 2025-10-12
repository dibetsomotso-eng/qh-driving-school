'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';

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
    // Wait until the authentication status is resolved.
    if (isUserLoading) {
      return;
    }

    const isAdmin = user?.email === 'admin@example.com';
    const isLoginPage = pathname === '/admin/login';

    // If the user is an admin and on the login page, redirect them to the dashboard.
    if (isAdmin && isLoginPage) {
      router.replace('/admin');
      return;
    }
    
    // If the user is not an admin and not on the login page, redirect them to login.
    if (!isAdmin && !isLoginPage) {
      router.replace('/admin/login');
      return;
    }

  }, [user, isUserLoading, pathname, router]);

  // While checking auth status, show a full-screen loader.
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const isAdmin = user?.email === 'admin@example.com';
  const isLoginPage = pathname === '/admin/login';

  // If the user is an admin, show the full admin layout.
  // Or, if they are on the login page (regardless of admin status), show the content.
  if (isAdmin || isLoginPage) {
    // The login page renders its own layout, so don't wrap it in AdminHeader/main.
    if (isLoginPage) {
      return <>{children}</>;
    }
    
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    );
  }
  
  // If the user is not an admin and not on the login page, show a loader while redirecting.
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
