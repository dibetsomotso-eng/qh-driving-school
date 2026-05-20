import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  SERVICE_CATEGORIES,
  LICENSE_TYPES,
  TIME_SLOTS,
  LOOSE_PHONE_REGEX,
  ISO_DATE_REGEX,
} from '@/lib/validation';

const BodySchema = z.object({
  fullName:        z.string().trim().min(2).max(100),
  email:           z.string().email().max(254).trim(),
  phone:           z.string().regex(LOOSE_PHONE_REGEX),
  serviceCategory: z.enum(SERVICE_CATEGORIES),
  licenseType:     z.enum(LICENSE_TYPES),
  preferredDate:   z.string().regex(ISO_DATE_REGEX),
  preferredTime:   z.enum(TIME_SLOTS),
});

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured.');
    return NextResponse.json({ error: 'Email service not configured.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid booking data.', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const {
    fullName,
    email,
    phone,
    serviceCategory,
    licenseType,
    preferredDate,
    preferredTime,
  } = parsed.data;

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL_TEMP || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const BUSINESS_NAME = escapeHtml(process.env.BUSINESS_NAME || 'QH Driving School');

  if (!ADMIN_EMAIL) {
    console.error('ADMIN_EMAIL_TEMP / NEXT_PUBLIC_ADMIN_EMAIL is not configured.');
    return NextResponse.json({ error: 'Email service misconfigured.' }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const formattedDate = new Date(preferredDate).toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeLabels: Record<string, string> = {
    morning: 'Morning (8am – 12pm)',
    afternoon: 'Afternoon (12pm – 4pm)',
    'late-afternoon': 'Late Afternoon (4pm – 6pm)',
  };

  const safeName = escapeHtml(fullName);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeCategory = escapeHtml(serviceCategory);
  const safeLicense = escapeHtml(licenseType);
  const safeDate = escapeHtml(formattedDate);
  const safeTime = escapeHtml(timeLabels[preferredTime] ?? preferredTime);

  try {
    await Promise.all([
      // 1. Customer confirmation
      resend.emails.send({
        from: `${BUSINESS_NAME} <noreply@qhdrivingschool.co.za>`,
        to: email,
        subject: `Booking Received – ${BUSINESS_NAME}`,
        html: `
          <p>Hi ${safeName},</p>
          <p>Thank you for booking with <strong>${BUSINESS_NAME}</strong>. We have received your request and will confirm shortly.</p>
          <table>
            <tr><td><strong>Service</strong></td><td>${safeLicense}</td></tr>
            <tr><td><strong>Date</strong></td><td>${safeDate}</td></tr>
            <tr><td><strong>Time</strong></td><td>${safeTime}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${safePhone}</td></tr>
          </table>
          <p>If you have any questions, reply to this email or call us directly.</p>
          <p>Kind regards,<br/>${BUSINESS_NAME}</p>
        `,
      }),

      // 2. Admin notification
      resend.emails.send({
        from: `${BUSINESS_NAME} <noreply@qhdrivingschool.co.za>`,
        to: ADMIN_EMAIL,
        subject: `New Booking – ${safeName} (${safeLicense})`,
        html: `
          <p>A new booking has been submitted.</p>
          <table>
            <tr><td><strong>Name</strong></td><td>${safeName}</td></tr>
            <tr><td><strong>Email</strong></td><td>${safeEmail}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${safePhone}</td></tr>
            <tr><td><strong>Category</strong></td><td>${safeCategory}</td></tr>
            <tr><td><strong>Service</strong></td><td>${safeLicense}</td></tr>
            <tr><td><strong>Date</strong></td><td>${safeDate}</td></tr>
            <tr><td><strong>Time</strong></td><td>${safeTime}</td></tr>
          </table>
        `,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[send-booking-email]', error);
    return NextResponse.json({ error: 'Failed to send emails.' }, { status: 500 });
  }
}
