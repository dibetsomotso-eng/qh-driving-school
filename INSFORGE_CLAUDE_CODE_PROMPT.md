# Claude Code Prompt — Activate InsForge Migration for QH Driving School

---

## Context

This is a Next.js 15 (App Router, TypeScript) project for QH Driving School. The codebase has already been prepared for a Firebase → InsForge migration. All new files have been written and all Firebase-dependent pages have been rewritten. Your job is to activate, verify, and finalise the migration.

The full migration plan is in `INSFORGE_MIGRATION.md`.

---

## Your Tasks

### 1. Remove Firebase dependencies

Uninstall Firebase from the project:

```bash
npm uninstall firebase firebase-admin
```

Then verify no remaining Firebase imports exist in the source:

```bash
grep -r "from 'firebase" src/ --include="*.ts" --include="*.tsx"
grep -r "from \"firebase" src/ --include="*.ts" --include="*.tsx"
```

If any are found outside of `src/firebase/` (which is the legacy folder and can be ignored), fix them by replacing with the InsForge equivalents in `src/insforge/`.

---

### 2. Set up environment variables

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and fill in the following (you will need the values from the InsForge project dashboard at https://insforge.dev):

```
INSFORGE_API_URL=https://api.insforge.dev/v1/YOUR_PROJECT_ID
NEXT_PUBLIC_INSFORGE_ANON_KEY=your-anon-key
INSFORGE_SERVICE_ROLE_KEY=your-service-role-key
```

Do not remove the existing keys for Resend, Sanity, or Genkit.

---

### 3. Verify the new files exist

Confirm these files are present (they should already exist — do not recreate them):

- `src/lib/insforge.ts`
- `src/insforge/provider.tsx`
- `src/insforge/client-provider.tsx`
- `src/insforge/use-collection.tsx`
- `src/insforge/use-doc.tsx`
- `src/insforge/index.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/me/route.ts`
- `src/app/api/bookings/route.ts`
- `src/app/api/bookings/[id]/route.ts`
- `src/app/api/blog-posts/route.ts`
- `src/app/api/blog-posts/[id]/route.ts`
- `middleware.ts`

If any are missing, recreate them using the specifications in `INSFORGE_MIGRATION.md`.

---

### 4. Check TypeScript types in `src/lib/data.ts`

Open `src/lib/data.ts` and confirm the following types exist. If they don't, add them:

```typescript
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id?: string;
  serviceCategory: 'driving' | 'vehicle';
  fullName: string;
  phone: string;
  email: string;
  licenseType: string;
  preferredDate: string;
  preferredTime: string;
  bookingDate: string;
  status?: BookingStatus;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageHint: string;
  publishedAt: string;
}
```

---

### 5. Fix the `src/insforge/index.ts` barrel if needed

Open `src/insforge/index.ts` and ensure the exports are clean with no circular references or duplicate default exports. It should look like this:

```typescript
export { InsForgeProvider, useInsForge, useUser } from './provider';
export { InsForgeClientProvider } from './client-provider';
export { useCollection } from './use-collection';
export { useDoc } from './use-doc';
export type { InsForgeUser, InsForgeContextState } from './provider';
export type { WithId, UseCollectionResult } from './use-collection';
export type { UseDocResult } from './use-doc';
```

---

### 6. Run a TypeScript check

```bash
npx tsc --noEmit
```

Fix any type errors. Common ones to watch for:
- `InsForgeClientProvider` not found — check the import path in `src/app/layout.tsx`
- `useUser` or `useInsForge` not found — check imports in admin layout come from `@/insforge/provider`
- Missing `id` on record types — the `WithId<T>` utility in `use-collection.tsx` should handle this

---

### 7. Run the dev server and smoke-test

```bash
npm run dev
```

Test the following manually (or describe what to test):

| Route | Expected behaviour |
|---|---|
| `/` | Home page loads, no Firebase errors in console |
| `/booking` | Booking form submits successfully (check network tab — should POST to `/api/bookings`) |
| `/admin/login` | Login page renders |
| `/admin/login` (submit) | Logs in, redirects to `/admin`, cookie `insforge-token` is set |
| `/admin` | Blog posts table loads |
| `/admin/bookings` | Bookings table loads |
| `/admin/edit` | New post form renders |
| `/admin` (sign out) | Clears cookie, redirects to `/admin/login` |
| Direct `/admin` (no cookie) | Middleware redirects to `/admin/login` |

---

### 8. Clean up legacy Firebase files (optional, do last)

Once everything is verified working, delete the legacy Firebase folder and error listener:

```bash
rm -rf src/firebase/
rm src/components/FirebaseErrorListener.tsx
```

Then run `npx tsc --noEmit` again to confirm no broken imports remain.

---

## Important Notes

- **Never import from `src/firebase/`** in any new or updated code — that directory is legacy and will be deleted.
- **`src/lib/insforge.ts` is server-only** — it must never be imported by client components. Only API routes (`src/app/api/`) and Server Components should import it.
- **The `useCollection` hook has a `refresh()` method** — always call `refresh()` after a successful mutation (delete, update) to re-fetch data from InsForge. This replaces Firestore's `onSnapshot` real-time listener.
- **Field naming**: InsForge PostgreSQL uses `snake_case` (e.g. `booking_date`). The API routes in this project handle the mapping. If you add new fields, be consistent.
- **The old `src/firebase/` folder does not affect the build** until you import from it — ignore TypeScript errors inside that folder.

---

## SQL to run in InsForge dashboard (if not done yet)

```sql
CREATE TABLE IF NOT EXISTS bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_category TEXT NOT NULL,
  full_name        TEXT NOT NULL,
  phone            TEXT NOT NULL,
  email            TEXT NOT NULL,
  license_type     TEXT NOT NULL,
  preferred_date   TEXT NOT NULL,
  preferred_time   TEXT NOT NULL,
  booking_date     TIMESTAMPTZ DEFAULT NOW(),
  status           TEXT DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  image_url    TEXT,
  image_hint   TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

When you are done, confirm:
1. `npx tsc --noEmit` passes with zero errors
2. `npm run dev` starts without crashing
3. The booking form and admin dashboard both function correctly against InsForge
