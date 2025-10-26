import { z } from 'genkit';

// Define schemas for different notification types
export const BookingDataSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  email: z.string(),
  licenseType: z.string(),
  preferredDate: z.string(),
  preferredTime: z.string(),
  bookingDate: z.string(),
  bookingId: z.string(),
});

export const ContactDataSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  email: z.string(),
  licenseType: z.string(),
  message: z.string(),
  submissionDate: z.string(),
});

export const SubscriberDataSchema = z.object({
  email: z.string(),
  subscriptionDate: z.string(),
});

// Input schema for the main flow
export const SendNotificationInputSchema = z.object({
  notificationType: z.enum(['booking', 'contact', 'newsletter']),
  data: z.union([BookingDataSchema, ContactDataSchema, SubscriberDataSchema]),
});
export type SendNotificationInput = z.infer<typeof SendNotificationInputSchema>;

// Output schema for the main flow
export const SendNotificationOutputSchema = z.object({
  success: z.boolean(),
});
export type SendNotificationOutput = z.infer<typeof SendNotificationOutputSchema>;
