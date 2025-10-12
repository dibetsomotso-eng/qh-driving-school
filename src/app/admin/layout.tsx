'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode } from 'react';
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

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const isAdmin = user?.email === 'admin@example.com';
  const isLoginPage = pathname === '/admin/login';

  // Case 1: User is an authenticated admin.
  if (isAdmin) {
    // If admin is on the login page, redirect them to the dashboard.
    if (isLoginPage) {
      router.replace('/admin');
      return ( // Render a loader while redirecting.
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }
    // If admin is on any other admin page, show the admin layout.
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    );
  }

  // Case 2: User is not an admin (or is logged out).
  if (!isAdmin) {
    // If the user is on a protected admin page, redirect to login.
    if (!isLoginPage) {
      router.replace('/admin/login');
       return ( // Render a loader while redirecting.
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }
    // If the user is on the login page, just show the login page content.
    return <>{children}</>;
  }

  // This should not be reached, but provides a fallback loader.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
