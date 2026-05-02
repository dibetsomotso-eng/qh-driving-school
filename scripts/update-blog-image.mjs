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

async function updateBlogImage() {
  try {
    const imagePath = 'C:\\Users\\Spitfire_Inbound\\.gemini\\antigravity\\brain\\76840f3c-2e3e-4a2a-8ef0-5dad24149d60\\branded_blog_hero_services_v2_1777729135999.png';
    const imageData = fs.readFileSync(imagePath);
    console.log('Uploading image...');
    const asset = await client.assets.upload('image', imageData, {
      filename: path.basename(imagePath),
    });

    console.log('Finding blog post...');
    const posts = await client.fetch('*[_type == "blogPost" && slug.current == "exploring-qh-driving-school-services"]');
    
    if (posts.length > 0) {
      console.log('Patching blog post...');
      await client.patch(posts[0]._id)
        .set({
          mainImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          }
        })
        .commit();
      console.log('Blog image updated successfully!');
    } else {
      console.error('Blog post not found!');
    }
  } catch (err) {
    console.error('Update failed:', err);
  }
}

updateBlogImage();
