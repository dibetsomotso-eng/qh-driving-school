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
 * @param {string} sendgridKey - The SendGrid API key.
 * @returns {Promise<any>} - A promise that resolves with the SendGrid response.
 */
export async function sendEmail(mailOptions: EmailParams, sendgridKey: string) {
  if (!sendgridKey) {
    console.warn('⚠️ SendGrid API key was not provided to sendEmail function. Email will not be sent.');
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
