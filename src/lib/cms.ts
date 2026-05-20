export type ContentCollection = 'services' | 'regulatory_info' | 'faq' | 'settings';

export interface CMSService {
  id: string;
  name: string;
  category: 'driving' | 'vehicle';
  description: string;
  fee?: number;
  requirements?: string[];
  lastUpdated: string;
}

export interface CMSRegulatoryInfo {
  id: string;
  category: string;
  title: string;
  content: string;
  lastUpdated: string;
}

export async function getAllContent<T>(_collectionName: ContentCollection): Promise<T[]> {
  return [];
}

export async function getContentById<T>(_collectionName: ContentCollection, _id: string): Promise<T | null> {
  return null;
}

export async function getAIKnowledgeBase() {
  return {
    services: [] as CMSService[],
    regulatory: [] as CMSRegulatoryInfo[],
    timestamp: new Date().toISOString(),
  };
}
