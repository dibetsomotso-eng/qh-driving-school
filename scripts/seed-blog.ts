/**
 * One-time seed script: pushes hardcoded blog posts from data.ts into Firestore.
 *
 * Prerequisites:
 *   1. Install ts-node:  npm install --save-dev ts-node
 *   2. Set your .env.local with Firebase credentials (already done).
 *   3. Sign in as the admin user first using the Firebase Console, OR temporarily
 *      allow unauthenticated writes to /blogPosts in firestore.rules, run this
 *      script, then re-lock the rules.
 *
 * Run with:
 *   npx ts-node --project tsconfig.json scripts/seed-blog.ts
 *
 * This script is idempotent: it checks for existing posts by slug before writing.
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

const blogPosts = [
  {
    title: '5 Tips for Mastering Parallel Parking',
    slug: '5-tips-for-mastering-parallel-parking',
    publishedAt: '2024-07-15T10:00:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1648573688136-de51ced7aa0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imageHint: 'parallel parking',
    excerpt:
      "Parallel parking can be intimidating, but it doesn't have to be. With our step-by-step guide, you'll be slotting into tight spaces like a pro in no time...",
    content: `Parallel parking is a driving skill that many find daunting, but with the right technique, it becomes second nature. Here are five tips to help you master it.

### 1. Pick the Right Spot
Choose a parking space that is at least one and a half times the length of your car. This gives you enough room to maneuver without stress.

### 2. The Initial Position is Key
Pull up alongside the car you'll be parking behind, aligning your rear bumpers. You should be about 2-3 feet away from the other car.

### 3. Start Reversing Straight
Turn your steering wheel all the way to the left (or right, depending on the side of the road). Reverse slowly until your car is at a 45-degree angle to the curb.

### 4. Straighten and Continue
Now, straighten your steering wheel and continue to reverse straight back. Keep going until your front bumper has cleared the rear bumper of the car in front of you.

### 5. Final Turn into the Spot
Turn your steering wheel all the way in the opposite direction (towards the curb). This will swing the front of your car into the space. Keep reversing slowly until you are parallel with the curb.

Practice makes perfect! Find an empty parking lot and use cones to practice these steps.`,
  },
  {
    title: 'Understanding South African Road Signs',
    slug: 'understanding-south-african-road-signs',
    publishedAt: '2024-07-01T10:00:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1572670014853-1d3a3f22b40f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imageHint: 'road signs',
    excerpt:
      'Regulatory, warning, or guidance? We break down the different categories of road signs in South Africa to help you prepare for your learner\'s test and drive safer.',
    content: `Road signs are the silent language of the road. Understanding them is crucial for passing your learner's test and for safe driving. In South Africa, signs are divided into several categories.

### Regulatory Signs
These are usually circular with a red border and tell you what you must or must not do. The most common is the Stop sign and the Yield sign. Others include speed limits and no-entry signs.

### Warning Signs
These are typically triangular with a red border and warn you of potential hazards ahead, such as sharp curves, slippery roads, or animal crossings.

### Information and Guidance Signs
These are rectangular and provide information. Blue signs often indicate directions or facilities, while green signs are used for guidance on freeways.

Mastering these signs is a key part of your learner's license preparation.`,
  },
  {
    title: "What to Expect on Your Driver's Test Day",
    slug: 'what-to-expect-on-your-drivers-test-day',
    publishedAt: '2024-06-20T10:00:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1629015346993-2c1aa5d94cb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imageHint: 'driving view',
    excerpt:
      "The big day is approaching! Here's a checklist of what to bring, what the examiner will be looking for, and how to keep your nerves in check.",
    content: `The practical driving test is the final step to freedom. Knowing what to expect can significantly calm your nerves.

### Before the Test
- **Pre-Trip Inspection:** You will be asked to perform an exterior and interior pre-trip inspection of the vehicle.
- **Documentation:** Ensure you have your ID book/card, learner's license, and booking confirmation.

### The Yard Test
This is the first part of the test. You will be required to perform:
- Parallel parking
- Alley docking (reversing into a bay)
- Three-point turn

### The Road Test
After successfully completing the yard test, you will go out onto public roads with the examiner. They will assess your ability to:
- Obey traffic signs and signals.
- Perform observation checks (mirrors, blind spots).
- Maintain a safe following distance.

Remember to stay calm, listen carefully to the examiner's instructions, and drive safely. Good luck!`,
  },
];

async function seedBlogPosts() {
  const blogCollection = collection(db, 'blogPosts');
  let seeded = 0;
  let skipped = 0;

  for (const post of blogPosts) {
    const existing = await getDocs(
      query(blogCollection, where('slug', '==', post.slug))
    );

    if (!existing.empty) {
      console.log(`  SKIP  ${post.slug} (already exists)`);
      skipped++;
      continue;
    }

    await addDoc(blogCollection, post);
    console.log(`  ADDED ${post.slug}`);
    seeded++;
  }

  console.log(`\nDone. ${seeded} added, ${skipped} skipped.`);
}

seedBlogPosts().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
