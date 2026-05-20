import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAll, insertRow } from '@/lib/insforge';
import { insforgeVerifyToken } from '@/lib/insforge';
import {
  SERVICE_CATEGORIES,
  LICENSE_TYPES,
  TIME_SLOTS,
  LOOSE_PHONE_REGEX,
  ISO_DATE_REGEX,
} from '@/lib/validation';

/** Snake-case shape that matches the actual database columns. */
type BookingRow = {
  id: string;
  created_at: string;
  service_category: string;
  full_name: string;
  phone: string;
  email: string;
  license_type: string;
  preferred_date: string;
  preferred_time: string;
  booking_date: string;
  status: string;
  [key: string]: unknown; // satisfies InsForgeRecord constraint
};

const BookingSchema = z.object({
  serviceCategory: z.enum(SERVICE_CATEGORIES),
  fullName:        z.string().trim().min(2).max(100),
  phone:           z.string().regex(LOOSE_PHONE_REGEX),
  email:           z.string().email().max(254).trim(),
  licenseType:     z.enum(LICENSE_TYPES),
  preferredDate:   z.string().regex(ISO_DATE_REGEX).refine(
    (d) => new Date(d) >= new Date(new Date().toDateString()),
    { message: 'Preferred date must be today or in the future.' },
  ),
  preferredTime:   z.enum(TIME_SLOTS),
});

/** GET /api/bookings — admin only, returns all bookings ordered newest-first */
export async function GET(req: NextRequest) {
  const token = req.cookies.get('insforge-token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    await insforgeVerifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const rows = await getAll<BookingRow>('bookings', 'booking_date.desc');
    return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET /api/bookings]', err);
    return NextResponse.json({ error: 'Failed to fetch bookings.' }, { status: 500 });
  }
}

/** POST /api/bookings — public, creates a new booking */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid booking data.', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const row = await insertRow<BookingRow>('bookings', {
      service_category: data.serviceCategory,
      full_name:        data.fullName,
      phone:            data.phone,
      email:            data.email,
      license_type:     data.licenseType,
      preferred_date:   data.preferredDate,
      preferred_time:   data.preferredTime,
      booking_date:     new Date().toISOString(),
      status:           'pending',
    });

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error('[POST /api/bookings]', err);
    return NextResponse.json({ error: 'Failed to create booking.' }, { status: 500 });
  }
}
