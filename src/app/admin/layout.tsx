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
    if (isUserLoading) {
      // Don't do anything while auth state is loading.
      return;
    }

    const isAdmin = user?.email === 'admin@example.com';

    // If the user is not an admin and is not on the login page, redirect to login.
    if (!isAdmin && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }

    // If the user is an admin and is on the login page, redirect to the dashboard.
    if (isAdmin && pathname === '/admin/login') {
      router.replace('/admin');
    }
  }, [user, isUserLoading, pathname, router]);

  // While loading auth state, show a spinner, unless we're already on the login page.
  // This prevents a layout shift on the login page itself.
  if (isUserLoading && pathname !== '/admin/login') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If we are on the login page, just render the content.
  // The useEffect will handle redirecting away if the user is already an admin.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const isAdmin = user?.email === 'admin@example.com';
  // If the user is not an admin, we show a spinner while the redirect in useEffect happens.
  if (!isAdmin) {
     return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If we've made it this far, the user is an admin and not on the login page.
  // Show the full admin layout.
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
