import type { NextConfig } from 'next';

// ---------------------------------------------------------------------------
// OWASP Security Headers
// Applied to every response via Next.js headers() config.
// ---------------------------------------------------------------------------
// Content-Security-Policy (CSP) — restricts which sources browsers may load.
// 'unsafe-inline' on style-src is required by Tailwind's runtime class injection.
// 'unsafe-eval' on script-src is required by Next.js dev-mode HMR; tighten in
// a future pass by adding nonces via middleware if the threat model warrants it.
const CSP = [
  "default-src 'self'",
  // Next.js scripts + Google Fonts
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  // Tailwind + inline styles from Sanity Studio
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Google Fonts, Unsplash, Picsum, Firebase Storage (all used by the app)
  "img-src 'self' data: blob: https://placehold.co https://images.unsplash.com https://picsum.photos https://firebasestorage.googleapis.com https://lh3.googleusercontent.com https://maps.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // API calls: own origin + InsForge + Google Places + Resend + Sanity CDN
  "connect-src 'self' https://*.insforge.app https://places.googleapis.com https://api.resend.com https://*.sanity.io https://*.apicdn.sanity.io wss://*.sanity.io",
  // Sanity Studio uses iframes internally
  "frame-src 'self' https://*.sanity.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Upgrade plain HTTP requests to HTTPS in production
  "upgrade-insecure-requests",
]
  .join('; ')
  .trim();

const securityHeaders = [
  // Prevent the page from being embedded in iframes on other origins (clickjacking).
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Stop browsers from MIME-sniffing the response away from the declared Content-Type.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Limit referrer information sent to third-party sites.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features not used by the app (reduces attack surface).
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Force HTTPS for 1 year in production (Strict-Transport-Security).
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // Content-Security-Policy.
  { key: 'Content-Security-Policy', value: CSP },
];

const nextConfig: NextConfig = {
  transpilePackages: ['sanity', 'next-sanity'],

  async headers() {
    return [
      {
        // Apply security headers to all routes.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
