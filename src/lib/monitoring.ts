import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export type ServiceType = 'genkit-ai' | 'resend-email' | 'firebase-auth' | 'firestore-write';

interface UsageLog {
  service: ServiceType;
  action: string;
  tokens?: number;
  metadata?: Record<string, any>;
  timestamp: any;
}

/**
 * Logs service usage to Firestore for cost and usage tracking.
 */
export async function logUsage(
  service: ServiceType,
  action: string,
  tokens?: number,
  metadata?: Record<string, any>
) {
  // In a real server-side context, you'd use firebase-admin.
  // For client-side or simple tracking, we can use the web SDK if available.
  // However, for sensitive cost tracking, this is ideally done in a server action or API route.
  
  try {
    const usageData: UsageLog = {
      service,
      action,
      tokens,
      metadata,
      timestamp: new Date().toISOString(), // Fallback if serverTimestamp not used
    };

    console.log(`[Monitoring] ${service}:${action} - ${tokens || 0} tokens`, metadata);
    
    // We'll implement the actual Firestore write in the API routes where these services are called.
  } catch (error) {
    console.error('[Monitoring] Failed to log usage:', error);
  }
}
