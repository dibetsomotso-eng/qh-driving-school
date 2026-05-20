import { NextRequest, NextResponse } from 'next/server';
import { updateRow, deleteRow, insforgeVerifyToken } from '@/lib/insforge';

type Params = { params: Promise<{ id: string }> };

function requireAuth(req: NextRequest) {
  return req.cookies.get('insforge-token')?.value ?? null;
}

/** PATCH /api/bookings/[id] — update status */
export async function PATCH(req: NextRequest, { params }: Params) {
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
    const updated = await updateRow('bookings', id, body);
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[PATCH /api/bookings]', err);
    return NextResponse.json({ error: 'Failed to update booking.' }, { status: 500 });
  }
}

/** DELETE /api/bookings/[id] */
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
    await deleteRow('bookings', id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('[DELETE /api/bookings]', err);
    return NextResponse.json({ error: 'Failed to delete booking.' }, { status: 500 });
  }
}
