# Firebase → InsForge Migration

## What Changed

| Area | Before | After |
|---|---|---|
| Database | Firestore (`bookings`, `blogPosts`) | InsForge PostgreSQL (`bookings`, `blog_posts`) |
| Auth | Firebase Auth + custom `admin` claim | InsForge Auth (JWT in httpOnly cookie) |
| Storage | Firebase Storage | InsForge S3 Storage (wire up when needed) |
| Context | `FirebaseClientProvider` | `InsForgeClientProvider` |
| Data hooks | `useCollection`, `useDoc` (Firestore real-time) | `useCollection`, `useDoc` (fetch-based, with `refresh()`) |
| Route protection | Client-side redirect in layout | `middleware.ts` (server-side, before render) |

## New Files

```
src/lib/insforge.ts                  — Server-side API client (used in API routes only)
src/insforge/provider.tsx            — Auth context (user, signOut, refresh)
src/insforge/client-provider.tsx     — Wraps provider for layout.tsx
src/insforge/use-collection.tsx      — Fetch-based collection hook
src/insforge/use-doc.tsx             — Fetch-based single-doc hook
src/insforge/index.ts                — Barrel exports

src/app/api/auth/login/route.ts      — POST  Login, sets httpOnly cookie
src/app/api/auth/logout/route.ts     — POST  Clears cookie
src/app/api/auth/me/route.ts         — GET   Verify token, return user

src/app/api/bookings/route.ts        — GET (admin) + POST (public)
src/app/api/bookings/[id]/route.ts   — PATCH + DELETE (admin)

src/app/api/blog-posts/route.ts      — GET (public) + POST (admin)
src/app/api/blog-posts/[id]/route.ts — GET (public) + PUT + DELETE (admin)

middleware.ts                        — Protects /admin/* at the edge
.env.local.example                   — Required env vars
```

## Setup Steps

### 1. Create InsForge project
Go to https://insforge.dev → New Project → copy your Project ID, Anon Key, Service Role Key.

### 2. Create your .env.local
```bash
cp .env.local.example .env.local
# Fill in your InsForge keys
```

### 3. Create the database tables
Run this SQL in your InsForge SQL editor:

```sql
-- Bookings (from public booking form)
CREATE TABLE bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Blog posts (managed in admin)
CREATE TABLE blog_posts (
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

### 4. Create admin user
In your InsForge dashboard → Auth → Users → Create User.
Use the same email/password you used with Firebase Admin.

### 5. Install dependencies & remove Firebase
```bash
npm uninstall firebase firebase-admin
npm install
```

### 6. Run the app
```bash
npm run dev
```

Visit `/admin/login` — log in with your InsForge credentials.

---

## Notes

- The old `src/firebase/` directory is untouched. Once you've verified everything works,
  you can safely delete it along with `src/components/FirebaseErrorListener.tsx`.
- The `useCollection` hook exposes a `refresh()` function — call it after any mutation
  to re-fetch the latest data (replaces Firestore's `onSnapshot` real-time updates).
- Field naming: InsForge PostgreSQL uses `snake_case` columns (e.g. `booking_date`, `full_name`).
  The API routes map these to camelCase before returning to the frontend, matching your
  existing TypeScript types in `src/lib/data.ts`.
