/**
 * One-time script: grants the `admin: true` custom claim to a Firebase user.
 *
 * After this runs, the user's ID token will contain `claims.admin === true`,
 * which is checked by:
 *   - Firestore rules  (request.auth.token.admin == true)
 *   - admin/layout.tsx (user.getIdTokenResult())
 *
 * Prerequisites:
 *   1. Install dependencies:  npm install  (firebase-admin is already a devDependency)
 *   2. Authenticate with Firebase:
 *        Option A (recommended): npx firebase login --reauth
 *        Option B: set GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
 *   3. Find the UID in Firebase Console → Authentication → Users → copy the UID column.
 *
 * Run with:
 *   ADMIN_UID=<uid> npx ts-node --project tsconfig.json scripts/set-admin-claim.ts
 *
 * The target user must sign out and sign back in for the new claim to appear in their token.
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const uid = process.env.ADMIN_UID;
if (!uid) {
  console.error('Error: ADMIN_UID environment variable is required.');
  console.error('Usage: ADMIN_UID=<uid> npx ts-node --project tsconfig.json scripts/set-admin-claim.ts');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

async function run() {
  await admin.auth().setCustomUserClaims(uid!, { admin: true });
  const user = await admin.auth().getUser(uid!);
  console.log(`✓ admin: true claim set on ${user.email ?? uid}`);
  console.log('  → The user must sign out and sign back in for the claim to take effect.');
}

run().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
