
'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';

function AdminHeader() {
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      // After sign-out, middleware will handle redirecting to the login page.
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
  const pathname = usePathname();
  const router = useRouter();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isLoginPage = pathname === '/admin/login';

  // Show a loader while Firebase resolves the auth state.
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect unauthenticated users away from protected admin pages.
  if (!isLoginPage && !user) {
    router.replace('/admin/login');
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect authenticated admin away from the login page.
  if (isLoginPage && user) {
    router.replace('/admin');
    return null;
  }

  const isAdmin = adminEmail ? user?.email === adminEmail : !!user;
  const showHeader = isAdmin && !isLoginPage;
  
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <AdminHeader />}
      <main className={showHeader ? "p-4 md:p-8" : ""}>{children}</main>
    </div>
  );
}
