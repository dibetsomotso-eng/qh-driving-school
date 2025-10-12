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
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.78.46 3.45 1.28 4.92L2 22l5.25-1.38c1.45.77 3.09 1.19 4.79 1.19h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.9-9.91-9.9zM17 15.23c-.14-.73-2.1-1.04-2.33-1.09s-.48-.08-.68.08c-.2.15-.78.73-.95.88-.18.15-.35.18-.65.08-.3-.1-.9-.23-1.73-.83-.65-.48-1.28-1.2-1.43-1.53-.15-.33-.03-.5.08-.65.1-.13.23-.33.35-.48.13-.15.18-.25.28-.43.1-.18.05-.33-.03-.48-.08-.15-1.48-1.8-1.63-2.2-.15-.4-.3-.35-.4-.35h-.4c-.1 0-.25.03-.38.08-.13.05-1.88.2-1.88 2.1s.65 2.45.73 2.63c.08.18 1.48 2.63 3.6 3.6.5.25.88.4 1.18.53.5.2.85.15 1.18.1.38-.05.9-.25 1.03-.48.13-.23.13-.43.1-.48s-.05-.08-.13-.13z" />
    </svg>
  ),
};
