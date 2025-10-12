
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

  // The middleware now handles redirection, so this component's logic is much simpler.
  // We just need to decide whether to render the UI, primarily the header.

  // While checking user auth, show a full-screen loader.
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // An admin is a user with the specific admin email.
  const isAdmin = user?.email === 'admin@example.com';
  
  // Don't show the header on the login page or if the user is not an admin.
  // The middleware prevents non-admins from seeing protected pages.
  const showHeader = isAdmin && pathname !== '/admin/login';
  
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <AdminHeader />}
      <main className={showHeader ? "p-4 md:p-8" : ""}>{children}</main>
    </div>
  );
}
