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
  console.log(`Uploading image: ${imagePath}`);
  const imageData = fs.readFileSync(imagePath);
  const asset = await client.assets.upload('image', imageData, {
    filename: path.basename(imagePath),
  });
  return asset._id;
}

async function createService() {
  try {
    const imagePath = 'C:\\Users\\Spitfire_Inbound\\.gemini\\antigravity\\brain\\76840f3c-2e3e-4a2a-8ef0-5dad24149d60\\code_b_driving_lesson_1777727307600.png';
    const imageAssetId = await uploadImage(imagePath);

    const doc = {
      _type: 'service',
      title: 'Code B Manual Driving Lessons',
      slug: { _type: 'slug', current: 'code-b-manual-lessons' },
      category: 'driving',
      shortDescription: 'Professional K53 manual driving lessons for Code B light motor vehicles.',
      description: 'Our Code B manual driving lessons cover everything from basic car control to advanced K53 techniques. We ensure you are fully prepared for your driver\'s license test with patient, certified instructors.',
      fee: 250,
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAssetId,
        },
      },
    };

    const result = await client.create(doc);
    console.log(`Service created with ID: ${result._id}`);
  } catch (err) {
    console.error('Failed to create service:', err);
  }
}

createService();
