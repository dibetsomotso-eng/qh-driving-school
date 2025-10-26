'use server';

import sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';

dotenv.config();

export interface EmailRequest {
    to: string | string[];
    from: string;
    subject: string;
    text?: string;
    html: string;
    replyTo?: string;
}

export async function sendEmail(sendgridKey: string, request: EmailRequest) {
    if (!sendgridKey) {
        const errorMessage = 'SendGrid API key is not provided to the sendEmail function.';
        console.error(`❌ ${errorMessage}`);
        throw new Error(errorMessage);
    }
    sgMail.setApiKey(sendgridKey);

    try {
        await sgMail.send(request);
        console.log(`✅ Email sent successfully to ${Array.isArray(request.to) ? request.to.join(', ') : request.to}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending email:', JSON.stringify(error, null, 2));
        const errorMessage = error instanceof Error ? error.message : 'Unknown SendGrid error';
        throw new Error(`Failed to send email: ${errorMessage}`);
    }
}
