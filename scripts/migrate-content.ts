import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../src/firebase/config';
import { QH_KNOWLEDGE_BASE } from '../src/ai/knowledge';
import { serviceCategories } from '../src/lib/data';

/**
 * MIGRATION SCRIPT
 * Run this once to seed Firestore with your hardcoded data.
 */

async function clearCollection(name: string) {
  const querySnapshot = await getDocs(collection(db, name));
  const deletePromises = querySnapshot.docs.map(d => deleteDoc(doc(db, name, d.id)));
  await Promise.all(deletePromises);
  console.log(`Cleared collection: ${name}`);
}

export async function migrateToCMS() {
  console.log('Starting CMS migration...');

  try {
    // 1. Migrate Services
    await clearCollection('services');
    const servicePromises = serviceCategories.flatMap(cat => 
      cat.services.map(s => addDoc(collection(db, 'services'), {
        name: s.name,
        category: cat.id === 'driving-lessons' ? 'driving' : 'vehicle',
        description: s.description,
        fee: s.price ? parseFloat(s.price.replace(/[^0-9.]/g, '')) : null,
        requirements: [],
        lastUpdated: new Date().toISOString()
      }))
    );
    await Promise.all(servicePromises);
    console.log('Migrated Services.');

    // 2. Migrate Regulatory Info
    await clearCollection('regulatory_info');
    const regPromises = [
      addDoc(collection(db, 'regulatory_info'), {
        category: 'policies',
        title: 'Booking Policy',
        content: QH_KNOWLEDGE_BASE.policies.booking,
        lastUpdated: new Date().toISOString()
      }),
      addDoc(collection(db, 'regulatory_info'), {
        category: 'policies',
        title: 'Guaranteed Pass',
        content: QH_KNOWLEDGE_BASE.policies.guaranteedPass,
        lastUpdated: new Date().toISOString()
      }),
      addDoc(collection(db, 'location'), {
        area: QH_KNOWLEDGE_BASE.location.area,
        address: QH_KNOWLEDGE_BASE.location.address,
        operatingHours: QH_KNOWLEDGE_BASE.location.operatingHours,
        lastUpdated: new Date().toISOString()
      })
    ];
    await Promise.all(regPromises);
    console.log('Migrated Regulatory Info.');

    console.log('Migration complete! Check your Firestore console.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}
