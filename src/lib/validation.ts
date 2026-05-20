import { z } from 'zod';

// ── Canonical enum values ────────────────────────────────────────────────────
// Keep these in sync with the booking form UI and database columns.

export const SERVICE_CATEGORIES = [
  'driving', 'vehicle', 'licensing', 'documentation',
] as const;

export const LICENSE_TYPES = [
  'learners', 'code-b', 'code-eb', 'code-a', 'code-c1', 'prdp',
  'renewal', 'car-registration', 'number-plates', 'disk-renewal',
  'police-clearance', 'export-clearance', 'vin-update', 'roadworthy',
  'duplicates', 'microdots', 'vintage-registration',
] as const;

export const TIME_SLOTS = ['morning', 'afternoon', 'late-afternoon'] as const;

export const CONTACT_INQUIRY_TYPES = [
  'code-a-b-eb', 'code-c1-ec', 'learners', 'renewals', 'other',
] as const;

// ── Regex ────────────────────────────────────────────────────────────────────

/** Strict SA phone: 0XXXXXXXXX or +27XXXXXXXXX, mobile range 6–8. */
export const SA_PHONE_REGEX = /^(\+27|0)[6-8][0-9]{8}$/;

/** Loose phone: allows international formats, spaces, dashes, parens. */
export const LOOSE_PHONE_REGEX = /^[+\d\s\-() ]{7,30}$/;

/** ISO calendar date: YYYY-MM-DD */
export const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// ── Shared API-layer schemas ─────────────────────────────────────────────────
// Used by /api/send-email to validate each notificationType's data payload.

export const BookingDataSchema = z.object({
  bookingId:       z.string().max(64).optional(),
  fullName:        z.string().trim().min(2).max(100),
  phone:           z.string().regex(LOOSE_PHONE_REGEX),
  email:           z.string().email().max(254).trim(),
  licenseType:     z.enum(LICENSE_TYPES),
  preferredDate:   z.string().regex(ISO_DATE_REGEX),
  preferredTime:   z.enum(TIME_SLOTS),
  bookingDate:     z.string().max(64).optional(),
  serviceCategory: z.enum(SERVICE_CATEGORIES).optional(),
});

export const ContactDataSchema = z.object({
  fullName:        z.string().trim().min(2).max(100),
  email:           z.string().email().max(254).trim(),
  phone:           z.string().regex(LOOSE_PHONE_REGEX).optional().or(z.literal('')),
  licenseType:     z.enum(CONTACT_INQUIRY_TYPES).optional(),
  message:         z.string().trim().min(10).max(2000),
  submissionDate:  z.string().max(64).optional(),
});

export const NewsletterDataSchema = z.object({
  email:            z.string().email().max(254).trim(),
  subscriptionDate: z.string().max(64).optional(),
});
