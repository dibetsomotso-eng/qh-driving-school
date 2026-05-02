
'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';

function AdminHeader() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      // After sign-out, middleware will handle redirecting to the login page.
      router.push('/admin/login');
    }
  };

  return (
    <header className="bg-card border-b p-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold">Admin</h1>
        <nav className="flex gap-4 text-sm">
          <Link
            href="/admin"
            className={pathname === '/admin' ? 'font-semibold underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'}
          >
            Blog Posts
          </Link>
          <Link
            href="/admin/bookings"
            className={pathname.startsWith('/admin/bookings') ? 'font-semibold underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'}
          >
            Bookings
          </Link>
        </nav>
      </div>
      <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
    </header>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!user) {
      setIsAdmin(null);
      return;
    }
    user.getIdTokenResult().then(result => {
      setIsAdmin(result.claims['admin'] === true);
    });
  }, [user]);

  // Show a loader while Firebase resolves auth state or while fetching the token claim.
  if (isUserLoading || (user && isAdmin === null && !isLoginPage)) {
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

  const showHeader = isAdmin && !isLoginPage;

  return (
    <div className="min-h-screen bg-background">
      {showHeader && <AdminHeader />}
      <main className={showHeader ? "p-4 md:p-8" : ""}>{children}</main>
    </div>
  );
}
