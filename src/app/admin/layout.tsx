'use client';

import { useUser, useInsForge } from '@/insforge/provider';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function AdminHeader() {
  const { signOut } = useInsForge();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  return (
    <header className="bg-card border-b p-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold">Admin</h1>
        <nav className="flex gap-4 text-sm">
          <Link
            href="/admin"
            className={
              pathname === '/admin'
                ? 'font-semibold underline underline-offset-4'
                : 'text-muted-foreground hover:text-foreground'
            }
          >
            Blog Posts
          </Link>
          <Link
            href="/admin/bookings"
            className={
              pathname.startsWith('/admin/bookings')
                ? 'font-semibold underline underline-offset-4'
                : 'text-muted-foreground hover:text-foreground'
            }
          >
            Bookings
          </Link>
        </nav>
      </div>
      <Button onClick={handleSignOut} variant="outline">
        Sign Out
      </Button>
    </header>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isUserLoading && !user && !isLoginPage) {
      router.replace('/admin/login');
    }
    if (!isUserLoading && user && isLoginPage) {
      router.replace('/admin');
    }
  }, [user, isUserLoading, isLoginPage, router]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Show spinner while redirect is in flight
  if (!user && !isLoginPage) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const showHeader = !!user && !isLoginPage;

  return (
    <div className="min-h-screen bg-background">
      {showHeader && <AdminHeader />}
      <main className={showHeader ? 'p-4 md:p-8' : ''}>{children}</main>
    </div>
  );
}
