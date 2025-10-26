'use server';
/**
 * @fileoverview An email sending service using SendGrid.
 */

import sgMail from '@sendgrid/mail';

interface EmailParams {
  to: string | string[];
  from: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends an email using SendGrid.
 * @param {EmailParams} mailOptions - The options for the email.
 * @returns {Promise<any>} - A promise that resolves with the SendGrid response.
 */
export async function sendEmail(mailOptions: EmailParams) {
  const sendgridKey = process.env.SENDGRID_API_KEY;

  if (!sendgridKey) {
    console.warn('⚠️ SendGrid API key not configured. Email will not be sent.');
    // To avoid breaking the flow, we can return a resolved promise.
    return Promise.resolve({
      message: 'Email not sent due to missing API key.',
    });
  }

  sgMail.setApiKey(sendgridKey);

  try {
    const [response] = await sgMail.send(mailOptions);
    console.log(`✅ Email sent to ${mailOptions.to}. Status: ${response.statusCode}`);
    return response;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // In case of an API error, we should throw it so Promise.allSettled can catch it.
    throw error;
  }
}
