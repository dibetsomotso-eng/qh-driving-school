'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
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

  const isAdmin = user?.email === 'admin@example.com';
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // If auth is still loading, don't do anything yet.
    if (isUserLoading) {
      return;
    }

    // If the user is an admin and is on the login page, redirect them to the dashboard.
    if (isAdmin && isLoginPage) {
      router.replace('/admin');
    }

    // If the user is not an admin and is not on the login page, redirect them to login.
    if (!isAdmin && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [user, isUserLoading, isAdmin, isLoginPage, router]);


  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If a non-admin is trying to access a protected page, they will be redirected by the useEffect.
  // We can show a loader while the redirect happens.
  if (!isAdmin && !isLoginPage) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
  }
  
  // If an admin is on the login page, they will be redirected. Show a loader.
  if (isAdmin && isLoginPage) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
  }

  // If the user is an admin and on a protected page, show the admin layout.
  if (isAdmin && !isLoginPage) {
      return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    );
  }

  // If the user is not an admin and is on the login page, show the login page content.
  if (!isAdmin && isLoginPage) {
    return <>{children}</>;
  }

  // Fallback loader for any other edge cases during transitions.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
