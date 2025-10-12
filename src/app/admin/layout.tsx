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
    await auth.signOut();
    router.push('/admin/login');
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
    if (!isUserLoading) {
      const isAdmin = user?.email === 'admin@example.com';
      if (!user || !isAdmin) {
        if (pathname !== '/admin/login') {
            router.replace('/admin/login');
        }
      } else if (pathname === '/admin/login') {
        router.replace('/admin');
      }
    }
  }, [user, isUserLoading]); // router and pathname removed from dependencies

  if (isUserLoading && pathname !== '/admin/login') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Only show header and main layout if user is an admin and not on the login page
  const isAdmin = user?.email === 'admin@example.com';
  if (!user || !isAdmin) {
    // This will show the loading spinner briefly while redirecting non-admins
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
