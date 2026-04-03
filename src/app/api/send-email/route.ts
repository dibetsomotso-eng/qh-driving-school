import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_NOTIFICATION_TYPES = ['booking', 'contact', 'newsletter'] as const;
type NotificationType = typeof ALLOWED_NOTIFICATION_TYPES[number];

/** Escape HTML entities to prevent XSS in email templates. */
function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error('Resend API key is missing from environment variables.');
    return NextResponse.json(
      { success: false, message: 'Email service is not configured.' },
      { status: 500 }
    );
  }

  const adminEmailsEnv = process.env.ADMIN_EMAILS;
  if (!adminEmailsEnv) {
    console.error('ADMIN_EMAILS environment variable is not set.');
    return NextResponse.json(
      { success: false, message: 'Email service is misconfigured.' },
      { status: 500 }
    );
  }

  let body: { notificationType?: unknown; data?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const { notificationType, data } = body;

  if (
    typeof notificationType !== 'string' ||
    !(ALLOWED_NOTIFICATION_TYPES as readonly string[]).includes(notificationType)
  ) {
    return NextResponse.json(
      { success: false, message: 'Invalid notification type.' },
      { status: 400 }
    );
  }

  if (!data || typeof data !== 'object') {
    return NextResponse.json(
      { success: false, message: 'Missing data payload.' },
      { status: 400 }
    );
  }

  const type = notificationType as NotificationType;
  const adminEmails = adminEmailsEnv.split(',').map((e) => e.trim());
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const businessName = process.env.BUSINESS_NAME || 'QH Driving School';

  try {
    const promises: Promise<unknown>[] = [];

    if (type === 'booking') {
      const { adminPayload, customerPayload } = getBookingEmailPayloads(
        data as Record<string, unknown>,
        adminEmails,
        fromEmail,
        businessName
      );
      promises.push(
        resend.emails.send(adminPayload),
        resend.emails.send(customerPayload)
      );
    } else if (type === 'contact') {
      const adminPayload = getContactEmailPayload(
        data as Record<string, unknown>,
        adminEmails,
        fromEmail,
        businessName
      );
      promises.push(resend.emails.send(adminPayload));
    } else if (type === 'newsletter') {
      const { adminPayload, customerPayload } = getNewsletterEmailPayloads(
        data as Record<string, unknown>,
        adminEmails,
        fromEmail,
        businessName
      );
      promises.push(
        resend.emails.send(adminPayload),
        resend.emails.send(customerPayload)
      );
    }

    const results = await Promise.allSettled(promises);
    const failures = results.filter((r) => r.status === 'rejected');

    if (failures.length > 0) {
      console.error('One or more emails failed to send:', failures);
      return NextResponse.json(
        { success: false, message: 'One or more email notifications failed to send.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in /api/send-email:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatLicenseType = (type: unknown): string => {
  const map: Record<string, string> = {
    learners: "Learner's License Preparation",
    'code-b': 'Code B (Car) Driving Lesson',
    'code-eb': 'Code EB (Towing) Driving Lesson',
    'code-a': 'Code A (Motorcycle) Driving Lesson',
    'code-c1': 'Code C1 (Medium Truck) Driving Lesson',
    renewal: 'License Renewal Assistance',
    'car-registration': 'Car Registration & Licensing',
    'number-plates': 'Number Plates',
    'disk-renewal': 'Disk Renewal',
    'police-clearance': 'Police Clearance',
    'export-clearance': 'Export Police Clearance',
    'vin-update': 'VIN Update',
    roadworthy: 'Roadworthy Certificate',
    duplicates: 'Duplicates',
    microdots: 'Microdots',
    'vintage-registration': 'Vintage Car Registration',
  };
  return map[String(type)] || escapeHtml(type);
};

const formatTimeSlot = (time: unknown): string => {
  const map: Record<string, string> = {
    morning: 'Morning (8am – 12pm)',
    afternoon: 'Afternoon (12pm – 4pm)',
    'late-afternoon': 'Late Afternoon (4pm – 6pm)',
  };
  return map[String(time)] || escapeHtml(time);
};

// ---------------------------------------------------------------------------
// Email payloads
// ---------------------------------------------------------------------------

function getBookingEmailPayloads(
  booking: Record<string, unknown>,
  adminEmails: string[],
  fromEmail: string,
  businessName: string
) {
  const bookingId = escapeHtml(booking.bookingId ?? 'NEW');
  const fullName = escapeHtml(booking.fullName);
  const phone = escapeHtml(booking.phone);
  const email = escapeHtml(booking.email);
  const licenseType = formatLicenseType(booking.licenseType);
  const preferredDate = escapeHtml(booking.preferredDate);
  const preferredTime = formatTimeSlot(booking.preferredTime);
  const bookingDate = booking.bookingDate
    ? new Date(String(booking.bookingDate)).toLocaleString('en-ZA', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    : '';
  const safeBusinessName = escapeHtml(businessName);

  const adminPayload = {
    from: `${safeBusinessName} <${fromEmail}>`,
    to: adminEmails,
    subject: `New Booking Request - ${fullName}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
        <tr><td style="background-color:#2563eb;padding:30px;text-align:center;"><h1 style="color:#ffffff;margin:0;font-size:24px;">New Booking Request</h1></td></tr>
        <tr><td style="padding:30px;">
          <p style="margin:0 0 20px 0;font-size:16px;color:#111827;">You have received a new booking request. Please contact the customer within 24 hours.</p>
          <table width="100%" cellpadding="12" cellspacing="0" style="background-color:#f3f4f6;border-radius:6px;">
            <tr><td style="font-weight:bold;color:#374151;width:40%;padding:12px;">Booking ID:</td><td style="color:#111827;padding:12px;">${bookingId.substring(0, 8)}</td></tr>
            <tr style="background-color:#e5e7eb;"><td style="font-weight:bold;color:#374151;padding:12px;">Customer Name:</td><td style="color:#111827;padding:12px;"><strong>${fullName}</strong></td></tr>
            <tr><td style="font-weight:bold;color:#374151;padding:12px;">Phone:</td><td style="color:#111827;padding:12px;">${phone}</td></tr>
            <tr style="background-color:#e5e7eb;"><td style="font-weight:bold;color:#374151;padding:12px;">Email:</td><td style="color:#111827;padding:12px;">${email}</td></tr>
            <tr><td style="font-weight:bold;color:#374151;padding:12px;">Service:</td><td style="color:#111827;padding:12px;">${licenseType}</td></tr>
            <tr style="background-color:#e5e7eb;"><td style="font-weight:bold;color:#374151;padding:12px;">Preferred Date:</td><td style="color:#111827;padding:12px;"><strong>${preferredDate}</strong></td></tr>
            <tr><td style="font-weight:bold;color:#374151;padding:12px;">Preferred Time:</td><td style="color:#111827;padding:12px;">${preferredTime}</td></tr>
            <tr style="background-color:#e5e7eb;"><td style="font-weight:bold;color:#374151;padding:12px;">Submitted:</td><td style="color:#111827;padding:12px;">${bookingDate}</td></tr>
          </table>
          <div style="margin-top:30px;padding:20px;background-color:#fef3c7;border-left:4px solid #f59e0b;border-radius:4px;">
            <p style="margin:0;color:#92400e;font-size:15px;line-height:1.6;"><strong>Action Required:</strong><br>Contact ${fullName} at ${phone} within 24 hours to confirm their appointment.</p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;"><p style="margin:0;color:#6b7280;font-size:12px;">This is an automated notification from ${safeBusinessName}</p></td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };

  const customerPayload = {
    from: `${safeBusinessName} <${fromEmail}>`,
    to: [String(booking.email)],
    subject: `Booking Request Received - ${safeBusinessName}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
        <tr><td style="background-color:#10b981;padding:30px;text-align:center;"><h1 style="color:#ffffff;margin:0;font-size:24px;">Booking Request Received!</h1></td></tr>
        <tr><td style="padding:30px;">
          <p style="margin:0 0 20px 0;font-size:16px;color:#111827;">Hi <strong>${fullName}</strong>,</p>
          <p style="margin:0 0 20px 0;font-size:16px;color:#111827;">Thank you for choosing ${safeBusinessName}! We have received your booking request and will be in touch within 24 hours.</p>
          <h2 style="color:#2563eb;font-size:18px;margin:30px 0 15px 0;">Your Booking Details</h2>
          <table width="100%" cellpadding="12" cellspacing="0" style="background-color:#f3f4f6;border-radius:6px;">
            <tr><td style="font-weight:bold;color:#374151;width:40%;padding:12px;">Service:</td><td style="color:#111827;padding:12px;">${licenseType}</td></tr>
            <tr style="background-color:#e5e7eb;"><td style="font-weight:bold;color:#374151;padding:12px;">Preferred Date:</td><td style="color:#111827;padding:12px;"><strong>${preferredDate}</strong></td></tr>
            <tr><td style="font-weight:bold;color:#374151;padding:12px;">Preferred Time:</td><td style="color:#111827;padding:12px;">${preferredTime}</td></tr>
            <tr style="background-color:#e5e7eb;"><td style="font-weight:bold;color:#374151;padding:12px;">Reference:</td><td style="color:#6b7280;font-size:12px;padding:12px;">${bookingId.substring(0, 8).toUpperCase()}</td></tr>
          </table>
          <p style="margin:30px 0 0 0;font-size:16px;color:#111827;">Best regards,<br><strong>${safeBusinessName} Team</strong></p>
        </td></tr>
        <tr><td style="background-color:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;"><p style="margin:0;color:#6b7280;font-size:12px;">${safeBusinessName} | Roodepoort, Gauteng</p></td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };

  return { adminPayload, customerPayload };
}

function getContactEmailPayload(
  contact: Record<string, unknown>,
  adminEmails: string[],
  fromEmail: string,
  businessName: string
) {
  const fullName = escapeHtml(contact.fullName);
  const email = escapeHtml(contact.email);
  const phone = contact.phone ? escapeHtml(contact.phone) : 'Not provided';
  const message = escapeHtml(contact.message);
  const submissionDate = contact.submissionDate
    ? new Date(String(contact.submissionDate)).toLocaleString('en-ZA')
    : '';
  const safeBusinessName = escapeHtml(businessName);

  return {
    from: `${safeBusinessName} <${fromEmail}>`,
    to: adminEmails,
    replyTo: String(contact.email),
    subject: `New Contact Form - ${fullName}`,
    html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <h2 style="color:#2563eb;">New Contact Form Submission</h2>
    <div style="background-color:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0;">
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Submitted:</strong> ${submissionDate}</p>
    </div>
    <div style="background-color:#ffffff;padding:20px;border-left:4px solid #2563eb;margin:20px 0;">
      <h3 style="margin-top:0;">Message:</h3>
      <p style="white-space:pre-wrap;line-height:1.6;">${message}</p>
    </div>
    <p style="color:#6b7280;font-size:14px;text-align:center;margin-top:40px;">This is an automated notification from ${safeBusinessName}</p>
  </div>
</body>
</html>`,
  };
}

function getNewsletterEmailPayloads(
  subscriber: Record<string, unknown>,
  adminEmails: string[],
  fromEmail: string,
  businessName: string
) {
  const email = escapeHtml(subscriber.email);
  const subscriptionDate = subscriber.subscriptionDate
    ? new Date(String(subscriber.subscriptionDate)).toLocaleString('en-ZA')
    : '';
  const safeBusinessName = escapeHtml(businessName);

  const customerPayload = {
    from: `${safeBusinessName} <${fromEmail}>`,
    to: [String(subscriber.email)],
    subject: `Welcome to ${safeBusinessName}!`,
    html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <h2 style="color:#10b981;">Thanks for Subscribing!</h2>
    <p>Welcome to the ${safeBusinessName} community!</p>
    <p>We're committed to helping you become a confident, safe driver — and keeping your vehicle documentation up to date.</p>
    <p style="margin-top:30px;">Stay safe on the roads!<br><strong>${safeBusinessName} Team</strong></p>
  </div>
</body>
</html>`,
  };

  const adminPayload = {
    from: `${safeBusinessName} <${fromEmail}>`,
    to: adminEmails,
    subject: 'New Newsletter Subscriber',
    html: `<p>New subscriber: <strong>${email}</strong></p><p>Subscribed: ${subscriptionDate}</p>`,
  };

  return { adminPayload, customerPayload };
}
