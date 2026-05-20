/**
 * InsForge server-side client using @insforge/sdk.
 * Used only in API routes and Server Components — never imported by client code.
 */
import { createClient } from '@insforge/sdk';

const url = process.env.NEXT_PUBLIC_INSFORGE_URL!;
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!;
const apiKey = process.env.INSFORGE_API_KEY!;

/** Admin client — full access, server-only. */
export const insforge = createClient({ baseUrl: url, anonKey, isServerMode: true });

export type InsForgeRecord = Record<string, unknown>;

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export interface InsForgeUser {
  id: string;
  email: string;
  role: string;
}

export interface LoginResult {
  token: string;
  user: InsForgeUser;
}

/** Sign in with email + password. Returns JWT + user info. */
export async function insforgeLogin(email: string, password: string): Promise<LoginResult> {
  const { data, error } = await insforge.auth.signInWithPassword({ email, password });
  if (error || !data) throw new Error(error?.message ?? 'Login failed');
  return {
    token: data.accessToken ?? '',
    user: {
      id: data.user.id,
      email: data.user.email ?? '',
      role: 'admin',
    },
  };
}

/** Verify a JWT and return the user it belongs to. */
export async function insforgeVerifyToken(token: string): Promise<InsForgeUser> {
  const client = createClient({ baseUrl: url, anonKey: token, isServerMode: true });
  const { data, error } = await client.auth.getCurrentUser();
  if (error || !data?.user) throw new Error('Invalid token');
  return {
    id: data.user.id,
    email: data.user.email ?? '',
    role: 'admin',
  };
}

// ─── Table helpers ────────────────────────────────────────────────────────────

/** Fetch all rows from a table, with optional ordering. */
export async function getAll<T extends InsForgeRecord>(
  table: string,
  orderBy?: string
): Promise<T[]> {
  let query = insforge.database.from(table).select('*');
  if (orderBy) {
    const [col, dir] = orderBy.split('.');
    query = query.order(col, { ascending: dir !== 'desc' });
  }
  const { data, error } = await query;
  if (error) throw new Error(`getAll ${table}: ${error.message}`);
  return (data ?? []) as T[];
}

/** Fetch a single row by id. */
export async function getById<T extends InsForgeRecord>(
  table: string,
  id: string
): Promise<T | null> {
  const { data, error } = await insforge.database
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as T | null;
}

/** Insert a new row. Returns the created record. */
export async function insertRow<T extends InsForgeRecord>(
  table: string,
  row: Omit<T, 'id' | 'created_at'>
): Promise<T> {
  const { data, error } = await insforge.database
    .from(table)
    .insert([row])
    .select()
    .single();
  if (error) throw new Error(`insertRow ${table}: ${error.message}`);
  return data as T;
}

/** Update an existing row by id. Returns the updated record. */
export async function updateRow<T extends InsForgeRecord>(
  table: string,
  id: string,
  patch: Partial<T>
): Promise<T> {
  const { data, error } = await insforge.database
    .from(table)
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`updateRow ${table}: ${error.message}`);
  return data as T;
}

/** Delete a row by id. */
export async function deleteRow(table: string, id: string): Promise<void> {
  const { error } = await insforge.database.from(table).delete().eq('id', id);
  if (error) throw new Error(`deleteRow ${table}: ${error.message}`);
}
