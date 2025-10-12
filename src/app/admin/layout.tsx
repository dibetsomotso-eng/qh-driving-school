'use client';

import { useUser } from '@/firebase';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { AdminAuthGuard } from './AdminAuthGuard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';

function AdminHeader() {
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      // After signing out, the AdminAuthGuard will automatically redirect to the login page.
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
  const pathname = usePathname();

  const isAdmin = user?.email === 'admin@example.com';
  const showHeader = !isUserLoading && isAdmin && pathname !== '/admin/login';
  
  return (
    <AdminAuthGuard>
        <div className="min-h-screen bg-background">
          {showHeader && <AdminHeader />}
          <main className={showHeader ? "p-4 md:p-8" : ""}>{children}</main>
        </div>
    </AdminAuthGuard>
  );
}
