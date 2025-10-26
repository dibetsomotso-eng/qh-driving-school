'use server';

import sgMail from '@sendgrid/mail';

export interface EmailRequest {
    to: string | string[];
    from: string;
    subject: string;
    text?: string;
    html: string;
    replyTo?: string;
}

export async function sendEmail(request: EmailRequest) {
    const sendgridKey = process.env.SENDGRID_API_KEY;
    if (!sendgridKey) {
        console.warn('⚠️ SendGrid API key not configured. Skipping email.');
        throw new Error('SendGrid API key is not configured.');
    }
    sgMail.setApiKey(sendgridKey);

    try {
        await sgMail.send(request);
        console.log(`✅ Email sent successfully to ${Array.isArray(request.to) ? request.to.join(', ') : request.to}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending email:', JSON.stringify(error, null, 2));
        throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
