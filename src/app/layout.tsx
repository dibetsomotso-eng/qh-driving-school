import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { SiteChromeHeader, SiteChromeFooter } from '@/components/layout/site-chrome';
import { ThemeProvider } from '@/components/theme-provider';
import { InsForgeClientProvider } from '@/insforge/client-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'QH Driving School | We Teach You to Drive Step by Step',
  description: 'Affordable lessons, professional instructors, guaranteed success. Driving lessons in Roodepoort.',
  keywords: ['driving lessons Roodepoort', 'Code 8 lessons', 'learn to drive South Africa', 'QH Driving School'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <InsForgeClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SiteChromeHeader />
            <main>{children}</main>
            <SiteChromeFooter />
            <Toaster />
          </ThemeProvider>
        </InsForgeClientProvider>
      </body>
    </html>
  );
}
