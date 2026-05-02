/**
 * One-time script: grants the `admin: true` custom claim to a Firebase user.
 *
 * After this runs, the user's ID token will contain `claims.admin === true`,
 * which is checked by:
 *   - Firestore rules  (request.auth.token.admin == true)
 *   - admin/layout.tsx (user.getIdTokenResult())
 *
 * Prerequisites:
 *   1. Download a service account key from Firebase Console:
 *        Project Settings → Service accounts → Generate new private key
 *      Save the JSON file somewhere safe (do NOT commit it to git).
 *   2. Find the admin UID in Firebase Console → Authentication → Users → UID column.
 *
 * Run in PowerShell:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"
 *   $env:ADMIN_UID = "VDOTYv8TkGQ9p9IDqJEnvm7pnwN2"
 *   $env:FIREBASE_PROJECT_ID = "studio-3859332776-8df84"
 *   npx ts-node --project tsconfig.json scripts/set-admin-claim.ts
 *
 * The target user must sign out and sign back in for the new claim to appear in their token.
 */

import admin from 'firebase-admin';

const uid = process.env.ADMIN_UID;
const projectId = process.env.FIREBASE_PROJECT_ID;

if (!uid) {
  console.error('Error: ADMIN_UID environment variable is required.');
  process.exit(1);
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Error: GOOGLE_APPLICATION_CREDENTIALS must point to your service account JSON file.');
  console.error('Download it from Firebase Console → Project Settings → Service accounts → Generate new private key');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId,
});

async function run() {
  await admin.auth().setCustomUserClaims(uid!, { admin: true });
  const user = await admin.auth().getUser(uid!);
  console.log(`✓ admin: true claim set on ${user.email ?? uid}`);
  console.log('  → Sign out and sign back in to the admin panel for the claim to take effect.');
}

run().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
