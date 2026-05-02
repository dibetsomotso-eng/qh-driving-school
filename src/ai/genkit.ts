import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import { QH_KNOWLEDGE_BASE } from './knowledge';
import { logUsage } from '@/lib/monitoring';
import { getAIKnowledgeBase } from '@/lib/cms';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1),
});

export async function runChatFlow(messages: ChatMessage[]): Promise<string> {
  // Fetch the latest dynamic knowledge from the CMS (Firestore)
  // Fallback to the static knowledge if the CMS fetch fails or is empty
  let dynamicKnowledge;
  try {
    dynamicKnowledge = await getAIKnowledgeBase();
  } catch (err) {
    console.warn('[Genkit] Failed to fetch dynamic knowledge, using static fallback.', err);
    dynamicKnowledge = QH_KNOWLEDGE_BASE;
  }

  const SYSTEM_PROMPT = `You are a friendly and helpful assistant for QH Driving School, based in Roodepoort, Gauteng, South Africa.

USE THE FOLLOWING DYNAMIC KNOWLEDGE BASE TO ANSWER QUESTIONS ACCURATELY:
${JSON.stringify(dynamicKnowledge, null, 2)}

GUIDELINES:
- Be warm, concise, and professional.
- If you don't know a specific price, tell the customer to contact us directly for a quote.
- Always encourage customers to book or contact us.
- Do not make up information. If unsure, say "please contact us directly for the most accurate information."
- Keep responses brief (2–4 sentences unless more detail is needed).`;

  const allMessages = [
    ...messages.slice(0, -1).map((m) => ({
      role: m.role as 'user' | 'model',
      content: [{ text: m.content }],
    })),
  ];

  const lastMessage = messages[messages.length - 1];

  try {
    const { text, usage } = await ai.generate({
      system: SYSTEM_PROMPT,
      messages: allMessages,
      prompt: lastMessage.content,
    });

    // Log AI usage for cost monitoring
    if (usage) {
      await logUsage('genkit-ai', 'chat-generate', usage.totalTokens, {
        promptTokens: usage.promptTokens,
        completionTokens: usage.outputTokens,
      });
    }

    return text;
  } catch (error) {
    console.error('Genkit Error:', error);
    await logUsage('genkit-ai', 'chat-error', 0, { error: String(error) });
    throw error;
  }
}
