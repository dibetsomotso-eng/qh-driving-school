
'use client';

import { useUser } from '@/firebase';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
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

  // Show a loader while Firebase is still determining the user's auth state.
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Determine if the header should be shown.
  // The middleware handles redirection, so we only need to decide whether to render the UI.
  const isAdmin = user?.email === 'admin@example.com';
  const showHeader = isAdmin && pathname !== '/admin/login';
  
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <AdminHeader />}
      <main className={showHeader ? "p-4 md:p-8" : ""}>{children}</main>
    </div>
  );
}
