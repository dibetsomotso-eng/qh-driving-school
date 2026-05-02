import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: 'zxoaykhf',
  dataset: 'production',
  apiVersion: '2024-05-02',
  token: 'sk6N3BvhRV65jfHDL9CLABfeEyk2uo5IGSgB5k2EBv4314DCQpXkiI6be4J6hWtNzrBqD0IBZVJnZjXUCxXMESij0V4mRF8pcoJWQrW17dEgrXeWQh5x1LLiuCMuDL6X3r5q5Pq6stNGoBZXW9fWbJIvXXwtNkxAxM0evRLAZVI82FLCeUpK',
  useCdn: false,
});

async function uploadImage(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  const asset = await client.assets.upload('image', imageData, {
    filename: path.basename(imagePath),
  });
  return asset._id;
}

async function createBlog() {
  try {
    const imagePath = 'C:\\Users\\Spitfire_Inbound\\.gemini\\antigravity\\brain\\76840f3c-2e3e-4a2a-8ef0-5dad24149d60\\blog_hero_services_1777727897310.png';
    const imageAssetId = await uploadImage(imagePath);

    const doc = {
      _type: 'blogPost',
      title: 'Your Path to the Road: Exploring QH Driving School Services',
      slug: { _type: 'slug', current: 'exploring-qh-driving-school-services' },
      excerpt: 'From motorcycle licenses to heavy-duty vehicle training and registration help, see how QH Driving School supports your journey.',
      content: `Getting behind the wheel is more than just a skill—it's a gateway to independence. At QH Driving School, we pride ourselves on offering a comprehensive suite of services designed to take you from a complete beginner to a confident, licensed driver.

1. Driving Lessons (Code A, B, C1, EC)
Whether you are master of the two-wheeled motorcycle (Code A) or looking to command a heavy-duty truck (Code EC), our patient instructors are trained to help you succeed. Our most popular service, Code B Manual Driving Lessons, focuses on the K53 standard, ensuring you pass your test the first time.

2. Vehicle Registration and Licensing
We know that the paperwork can be the most stressful part of owning a car. That's why we offer end-to-end support for car registrations, disk renewals, and licensing. We handle the queues so you don't have to.

3. Learner's License Preparation
Before you drive, you must master the rules of the road. We provide expert guidance and resources to help you ace your learner's license test with confidence.

Conclusion
No matter where you are in your driving journey, QH Driving School is here to provide professional, reliable, and affordable support. Visit our services page to book your first lesson today!`,
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAssetId,
        },
      },
      publishedAt: new Date().toISOString(),
    };

    const result = await client.create(doc);
    console.log(`Blog post created with ID: ${result._id}`);
  } catch (err) {
    console.error('Failed to create blog:', err);
  }
}

createBlog();
