import { NextRequest, NextResponse } from 'next/server';
import { getById, updateRow, deleteRow, insforgeVerifyToken } from '@/lib/insforge';
import type { BlogPost } from '@/lib/data';

type BlogPostRow = BlogPost & { id: string; [key: string]: unknown };
type Params = { params: Promise<{ id: string }> };

function requireAuth(req: NextRequest) {
  return req.cookies.get('insforge-token')?.value ?? null;
}

/** GET /api/blog-posts/[id] — public */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const row = await getById<BlogPostRow>('blog_posts', id);
    if (!row) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    console.error('[GET /api/blog-posts/[id]]', err);
    return NextResponse.json({ error: 'Failed to fetch post.' }, { status: 500 });
  }
}

/** PUT /api/blog-posts/[id] — admin only, full update */
export async function PUT(req: NextRequest, { params }: Params) {
  const token = requireAuth(req);
  if (!token) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    await insforgeVerifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateRow<BlogPostRow>('blog_posts', id, body);
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[PUT /api/blog-posts/[id]]', err);
    return NextResponse.json({ error: 'Failed to update post.' }, { status: 500 });
  }
}

/** DELETE /api/blog-posts/[id] — admin only */
export async function DELETE(req: NextRequest, { params }: Params) {
  const token = requireAuth(req);
  if (!token) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    await insforgeVerifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteRow('blog_posts', id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('[DELETE /api/blog-posts/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete post.' }, { status: 500 });
  }
}
