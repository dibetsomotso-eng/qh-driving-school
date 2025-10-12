'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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

  // State to manage redirection, preventing premature navigation
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    // Don't do anything while auth state is loading
    if (isUserLoading) {
      return;
    }

    const isAdmin = user?.email === 'admin@example.com';
    const isLoginPage = pathname === '/admin/login';

    // Scenario 1: User is an admin
    if (isAdmin) {
      // If they are on the login page, redirect them to the dashboard.
      if (isLoginPage) {
        setRedirectPath('/admin');
        setShouldRedirect(true);
      }
    }
    // Scenario 2: User is NOT an admin
    else {
      // If they are on any page other than login, redirect them to login.
      if (!isLoginPage) {
        setRedirectPath('/admin/login');
        setShouldRedirect(true);
      }
    }
  }, [user, isUserLoading, pathname]);

  useEffect(() => {
    if (shouldRedirect && redirectPath) {
      router.replace(redirectPath);
    }
  }, [shouldRedirect, redirectPath, router]);


  // While auth is loading OR a redirect is pending, show a full-screen spinner.
  if (isUserLoading || shouldRedirect) {
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

  // If the user is not an admin and is on the login page, show the login page.
  if (!isAdmin && isLoginPage) {
    return <>{children}</>;
  }

  // Fallback loader for any brief transitional states.
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
