import { NextRequest, NextResponse } from 'next/server';
import { insforgeVerifyToken } from '@/lib/insforge';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('insforge-token')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = await insforgeVerifyToken(token);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
