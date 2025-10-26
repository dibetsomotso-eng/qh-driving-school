import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY is not set in .env file. Emails will not be sent.');
}

export async function POST(request: Request) {
  if (!process.env.SENDGRID_API_KEY) {
    return NextResponse.json({ success: false, message: 'Email service is not configured.' }, { status: 500 });
  }

  try {
    const { notificationType, data } = await request.json();

    const adminEmails = (process.env.ADMIN_EMAILS || 'dibetsomotso@gmail.com').split(',');
    const fromEmail = process.env.FROM_EMAIL || 'dibetsomotso@gmail.com';
    const businessName = process.env.BUSINESS_NAME || 'QH Driving School';

    let adminEmailPromise: Promise<any> | null = null;
    let customerEmailPromise: Promise<any> | null = null;

    if (notificationType === 'booking' && 'fullName' in data) {
      const { adminEmail, customerEmail } = getBookingEmailTemplates(data, adminEmails, fromEmail, businessName);
      adminEmailPromise = sgMail.send(adminEmail);
      customerEmailPromise = sgMail.send(customerEmail);
    } else if (notificationType === 'contact' && 'fullName' in data) {
      const adminEmail = getContactEmailTemplate(data, adminEmails, fromEmail);
      adminEmailPromise = sgMail.send(adminEmail);
    } else if (notificationType === 'newsletter' && 'email' in data) {
      const { adminEmail, customerEmail } = getNewsletterEmailTemplates(data, adminEmails, fromEmail, businessName);
      adminEmailPromise = sgMail.send(adminEmail);
      customerEmailPromise = sgMail.send(customerEmail);
    }

    const promises = [adminEmailPromise, customerEmailPromise].filter(p => p !== null) as Promise<any>[];
    const results = await Promise.allSettled(promises);

    const allSucceeded = results.every(r => r.status === 'fulfilled');

    if (!allSucceeded) {
        console.error('One or more emails failed to send.', results);
        // We still return success to the user as their form submission was received.
        // The failure is a backend notification issue.
        return NextResponse.json({ success: true, message: 'Form submitted, but there was an issue with email notifications.' });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in /api/send-email:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}


// EMAIL TEMPLATE GENERATORS

const formatLicenseType = (type: string): string => {
    const types: { [key: string]: string } = {
      'learners': "Learner's License Prep",
      'code-b': 'Code B (Car) Lesson',
      'code-eb': 'Code EB (Towing) Lesson',
      'code-a': 'Code A (Motorcycle) Lesson',
      'code-c1': 'Code C1 (Medium Truck) Lesson',
      'renewal': 'License Renewal Assistance',
    };
    return types[type] || type;
  };
  
  const formatTimeSlot = (time: string): string => {
    const times: { [key: string]: string } = {
      'morning': 'Morning (8am - 12pm)',
      'afternoon': 'Afternoon (12pm - 4pm)',
      'late-afternoon': 'Late Afternoon (4pm - 6pm)',
    };
    return times[time] || time;
  };


function getBookingEmailTemplates(booking: any, adminEmails: string[], fromEmail: string, businessName: string) {
    const bookingId = booking.bookingId;
    const adminEmail = {
        to: adminEmails,
        from: fromEmail,
        subject: `🚗 New Booking Request - ${booking.fullName}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr><td style="background-color: #2563eb; padding: 30px; text-align: center;"><h1 style="color: #ffffff; margin: 0; font-size: 24px;">🚗 New Booking Request</h1></td></tr>
                  <tr>
                    <td style="padding: 30px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; color: #111827;">You have received a new booking request. Please contact the customer within 24 hours.</p>
                      <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #f3f4f6; border-radius: 6px;">
                        <tr><td style="font-weight: bold; color: #374151; width: 40%; padding: 12px;">Booking ID:</td><td style="color: #111827; padding: 12px;">${bookingId.substring(0, 8)}</td></tr>
                        <tr style="background-color: #e5e7eb;"><td style="font-weight: bold; color: #374151; padding: 12px;">Customer Name:</td><td style="color: #111827; padding: 12px;"><strong>${booking.fullName}</strong></td></tr>
                        <tr><td style="font-weight: bold; color: #374151; padding: 12px;">Phone:</td><td style="color: #111827; padding: 12px;"><a href="tel:${booking.phone}" style="color: #2563eb; text-decoration: none; font-weight: bold;">${booking.phone}</a></td></tr>
                        <tr style="background-color: #e5e7eb;"><td style="font-weight: bold; color: #374151; padding: 12px;">Email:</td><td style="color: #111827; padding: 12px;"><a href="mailto:${booking.email}" style="color: #2563eb; text-decoration: none;">${booking.email}</a></td></tr>
                        <tr><td style="font-weight: bold; color: #374151; padding: 12px;">Service:</td><td style="color: #111827; padding: 12px;">${formatLicenseType(booking.licenseType)}</td></tr>
                        <tr style="background-color: #e5e7eb;"><td style="font-weight: bold; color: #374151; padding: 12px;">Preferred Date:</td><td style="color: #111827; padding: 12px;"><strong>${booking.preferredDate}</strong></td></tr>
                        <tr><td style="font-weight: bold; color: #374151; padding: 12px;">Preferred Time:</td><td style="color: #111827; padding: 12px;">${formatTimeSlot(booking.preferredTime)}</td></tr>
                        <tr style="background-color: #e5e7eb;"><td style="font-weight: bold; color: #374151; padding: 12px;">Submitted:</td><td style="color: #111827; padding: 12px;">${new Date(booking.bookingDate).toLocaleString('en-ZA', { dateStyle: 'full', timeStyle: 'short' })}</td></tr>
                      </table>
                      <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;"><p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.6;"><strong>⏰ Action Required:</strong><br>Contact ${booking.fullName} at <a href="tel:${booking.phone}" style="color: #92400e; text-decoration: underline;">${booking.phone}</a> within 24 hours to confirm their lesson.</p></div>
                      <div style="margin-top: 20px; text-align: center;"><a href="tel:${booking.phone}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">📞 Call Customer</a><a href="mailto:${booking.email}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">✉️ Email Customer</a></div>
                    </td>
                  </tr>
                  <tr><td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;"><p style="margin: 0; color: #6b7280; font-size: 12px;">This is an automated notification from ${businessName}</p></td></tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>`
    };

    const customerEmail = {
        to: booking.email,
        from: fromEmail,
        subject: `✅ Booking Request Received - ${businessName}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr><td style="background-color: #10b981; padding: 30px; text-align: center;"><h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Booking Request Received!</h1></td></tr>
                  <tr>
                    <td style="padding: 30px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; color: #111827;">Hi <strong>${booking.fullName}</strong>,</p>
                      <p style="margin: 0 0 20px 0; font-size: 16px; color: #111827;">Thank you for choosing ${businessName}! We've received your booking request and are excited to help you on your driving journey.</p>
                      <h2 style="color: #2563eb; font-size: 18px; margin: 30px 0 15px 0;">📋 Your Booking Details</h2>
                      <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #f3f4f6; border-radius: 6px;">
                        <tr><td style="font-weight: bold; color: #374151; width: 40%; padding: 12px;">Service:</td><td style="color: #111827; padding: 12px;">${formatLicenseType(booking.licenseType)}</td></tr>
                        <tr style="background-color: #e5e7eb;"><td style="font-weight: bold; color: #374151; padding: 12px;">Preferred Date:</td><td style="color: #111827; padding: 12px;"><strong>${booking.preferredDate}</strong></td></tr>
                        <tr><td style="font-weight: bold; color: #374151; padding: 12px;">Preferred Time:</td><td style="color: #111827; padding: 12px;">${formatTimeSlot(booking.preferredTime)}</td></tr>
                        <tr style="background-color: #e5e7eb;"><td style="font-weight: bold; color: #374151; padding: 12px;">Reference Number:</td><td style="color: #6b7280; font-size: 12px; padding: 12px;">${bookingId.substring(0, 8).toUpperCase()}</td></tr>
                      </table>
                      <h2 style="color: #2563eb; font-size: 18px; margin: 30px 0 15px 0;">🚦 What Happens Next?</h2>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr><td style="padding: 12px 0;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td style="width: 30px; vertical-align: top;"><span style="color: #10b981; font-size: 20px;">1️⃣</span></td><td><p style="margin: 0; color: #374151; line-height: 1.6;">We'll review your request and check availability</p></td></tr></table></td></tr>
                        <tr><td style="padding: 12px 0;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td style="width: 30px; vertical-align: top;"><span style="color: #10b981; font-size: 20px;">2️⃣</span></td><td><p style="margin: 0; color: #374151; line-height: 1.6;">We'll contact you at <strong>${booking.phone}</strong> within 24 hours</p></td></tr></table></td></tr>
                        <tr><td style="padding: 12px 0;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td style="width: 30px; vertical-align: top;"><span style="color: #10b981; font-size: 20px;">3️⃣</span></td><td><p style="margin: 0; color: #374151; line-height: 1.6;">We'll confirm your lesson time and provide payment details</p></td></tr></table></td></tr>
                      </table>
                      <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-left: 4px solid #2563eb; border-radius: 4px;"><p style="margin: 0 0 10px 0; color: #1e40af; font-weight: bold;">💡 Pro Tip</p><p style="margin: 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">While you wait, review the K53 manual and practice your road signs. This will help you get the most out of your lessons!</p></div>
                      <p style="margin: 30px 0 0 0; font-size: 16px; color: #111827;">Have questions? Feel free to reply to this email or give us a call.</p>
                      <p style="margin: 20px 0 0 0; font-size: 16px; color: #111827;">Best regards,<br><strong>${businessName} Team</strong></p>
                    </td>
                  </tr>
                  <tr><td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;"><p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">${businessName} | Vereeniging, Gauteng</p><p style="margin: 0; color: #6b7280; font-size: 12px;">Booking Reference: ${bookingId.substring(0, 8).toUpperCase()}</p></td></tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>`
    };
    return { adminEmail, customerEmail };
}


function getContactEmailTemplate(contact: any, adminEmails: string[], fromEmail: string) {
    const adminEmail = {
        to: adminEmails,
        from: fromEmail,
        replyTo: contact.email,
        subject: `📧 New Contact Form - ${contact.fullName}`,
        html: `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">📧 New Contact Form Submission</h2>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${contact.fullName}</p>
              <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
              <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
              <p><strong>Submitted:</strong> ${new Date(contact.submissionDate).toLocaleString('en-ZA')}</p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
              <h3 style="margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${contact.message}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              💡 Reply directly to this email to respond to ${contact.fullName}
            </p>
          </div>
        </body>
        </html>
      `
    };
    return adminEmail;
}

function getNewsletterEmailTemplates(subscriber: any, adminEmails: string[], fromEmail: string, businessName: string) {
    const customerEmail = {
        to: subscriber.email,
        from: fromEmail,
        subject: `🎉 Welcome to ${businessName}!`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #10b981;">🎉 Thanks for Subscribing!</h2>
              <p>Welcome to the ${businessName} community!</p>
              <p>You'll now receive:</p>
              <ul style="line-height: 1.8;">
                <li>🚗 Driving tips and safety advice</li>
                <li>💰 Special offers and discounts</li>
                <li>📰 Latest news and updates</li>
              </ul>
              <p>We're committed to helping you become a confident, safe driver.</p>
              <p style="margin-top: 30px;">
                Stay safe on the roads!<br>
                <strong>${businessName} Team</strong>
              </p>
            </div>
          </body>
          </html>
        `
      };

    const adminEmail = {
        to: adminEmails,
        from: fromEmail,
        subject: '📬 New Newsletter Subscriber',
        html: `<p>New subscriber: <strong>${subscriber.email}</strong></p><p>Subscribed: ${new Date(subscriber.subscriptionDate).toLocaleString('en-ZA')}</p>`
      };
      
    return { adminEmail, customerEmail };
}
