import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';

export type ContentCollection = 'services' | 'regulatory_info' | 'faq' | 'settings';

/**
 * Interface for a Service item in the CMS.
 */
export interface CMSService {
  id: string;
  name: string;
  category: 'driving' | 'vehicle';
  description: string;
  fee?: number;
  requirements?: string[];
  lastUpdated: string;
}

/**
 * Interface for Regulatory Info in the CMS.
 */
export interface CMSRegulatoryInfo {
  id: string;
  category: string;
  title: string;
  content: string;
  lastUpdated: string;
}

/**
 * Fetches all documents from a specific content collection.
 */
export async function getAllContent<T>(collectionName: ContentCollection): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    console.error(`[CMS] Error fetching ${collectionName}:`, error);
    return [];
  }
}

/**
 * Fetches a single document by ID from a content collection.
 */
export async function getContentById<T>(collectionName: ContentCollection, id: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as T;
    }
    return null;
  } catch (error) {
    console.error(`[CMS] Error fetching document ${id} from ${collectionName}:`, error);
    return null;
  }
}

/**
 * Fetches the latest knowledge for the AI assistant.
 * This aggregates regulatory info and services.
 */
export async function getAIKnowledgeBase() {
  const [services, regulatory] = await Promise.all([
    getAllContent<CMSService>('services'),
    getAllContent<CMSRegulatoryInfo>('regulatory_info')
  ]);

  return {
    services,
    regulatory,
    timestamp: new Date().toISOString()
  };
}
