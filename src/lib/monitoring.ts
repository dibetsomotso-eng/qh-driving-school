export type ServiceType = 'genkit-ai' | 'resend-email' | 'insforge-auth' | 'insforge-write';

interface UsageLog {
  service: ServiceType;
  action: string;
  tokens?: number;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Logs service usage to Firestore for cost and usage tracking.
 */
export async function logUsage(
  service: ServiceType,
  action: string,
  tokens?: number,
  metadata?: Record<string, unknown>
) {
  try {
    console.log(`[Monitoring] ${service}:${action} - ${tokens || 0} tokens`, metadata);
  } catch (error) {
    console.error('[Monitoring] Failed to log usage:', error);
  }
}
