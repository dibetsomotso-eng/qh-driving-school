import type { LucideProps } from 'lucide-react';
import Link from 'next/link';

export const Icons = {
  Logo: () => (
    <Link href="/" className="flex items-center" aria-label="QH Driving School Home">
      <span className="text-3xl font-bold font-headline text-primary">QH</span>
      <span className="ml-2 text-2xl font-cursive text-foreground">Driving School</span>
    </Link>
  ),
  Whatsapp: (props: LucideProps) => (
    <svg 
      {...props}
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.78.46 3.45 1.28 4.92L2 22l5.25-1.38c1.45.77 3.09 1.19 4.79 1.19h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.9-9.91-9.9zM17 15.23c-.14-.73-2.1-1.04-2.33-1.09s-.48-.08-.68.08c-.2.15-.78.73-.95.88-.18.15-.35.18-.65.08-.3-.1-1.25-.63-2.38-1.48-.88-.65-1.48-1.45-1.63-1.7-.15-.25-.03-.38.1-.5.1-.13.23-.33.35-.48.13-.15.18-.25.28-.43.1-.18.05-.33-.03-.48-.08-.15-.7-.85-.95-1.13s-.5-.23-.68-.23h-.4c-.18 0-.38.05-.5.1s-.5.23-.75.5c-.25.28-.5.58-.5.95s.25 1.13.28 1.23c.03.1.5 1.2.5 1.2s.53 1.2 2.7 2.4c2.18 1.2 2.5.95 2.88.9.38-.05 1.23-.5 1.4-1s.18-.9.13-1z" />
    </svg>
  ),
};
