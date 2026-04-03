import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL_TEMP || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const BUSINESS_NAME = process.env.BUSINESS_NAME || 'QH Driving School';

export async function POST(req: Request) {
  try {
    const {
      fullName,
      email,
      phone,
      serviceCategory,
      licenseType,
      preferredDate,
      preferredTime,
    } = await req.json();

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

    // 1. Customer confirmation
    await resend.emails.send({
      from: 'QH Driving School <noreply@qhdrivingschool.co.za>',
      to: email,
      subject: `Booking Received – ${BUSINESS_NAME}`,
      html: `
        <p>Hi ${fullName},</p>
        <p>Thank you for booking with <strong>${BUSINESS_NAME}</strong>. We have received your request and will confirm shortly.</p>
        <table>
          <tr><td><strong>Service</strong></td><td>${licenseType}</td></tr>
          <tr><td><strong>Date</strong></td><td>${formattedDate}</td></tr>
          <tr><td><strong>Time</strong></td><td>${timeLabels[preferredTime]}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${phone}</td></tr>
        </table>
        <p>If you have any questions, reply to this email or call us directly.</p>
        <p>Kind regards,<br/>${BUSINESS_NAME}</p>
      `,
    });

    // 2. Admin notification
    await resend.emails.send({
      from: 'QH Driving School <noreply@qhdrivingschool.co.za>',
      to: ADMIN_EMAIL!,
      subject: `New Booking – ${fullName} (${licenseType})`,
      html: `
        <p>A new booking has been submitted.</p>
        <table>
          <tr><td><strong>Name</strong></td><td>${fullName}</td></tr>
          <tr><td><strong>Email</strong></td><td>${email}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${phone}</td></tr>
          <tr><td><strong>Category</strong></td><td>${serviceCategory}</td></tr>
          <tr><td><strong>Service</strong></td><td>${licenseType}</td></tr>
          <tr><td><strong>Date</strong></td><td>${formattedDate}</td></tr>
          <tr><td><strong>Time</strong></td><td>${timeLabels[preferredTime]}</td></tr>
        </table>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
