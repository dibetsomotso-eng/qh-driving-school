import { NextRequest, NextResponse } from 'next/server';
import { getAll, insertRow, insforgeVerifyToken } from '@/lib/insforge';
import type { BlogPost } from '@/lib/data';

type BlogPostRow = BlogPost & { id: string; [key: string]: unknown };

/** GET /api/blog-posts — public, returns all posts newest-first */
export async function GET() {
  try {
    const rows = await getAll<BlogPostRow>('blog_posts', 'published_at.desc');
    return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET /api/blog-posts]', err);
    return NextResponse.json({ error: 'Failed to fetch posts.' }, { status: 500 });
  }
}

/** POST /api/blog-posts — admin only */
export async function POST(req: NextRequest) {
  const token = req.cookies.get('insforge-token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    await insforgeVerifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const row = await insertRow<BlogPostRow>('blog_posts', {
      ...body,
      published_at: new Date().toISOString(),
    });
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error('[POST /api/blog-posts]', err);
    return NextResponse.json({ error: 'Failed to create post.' }, { status: 500 });
  }
}
