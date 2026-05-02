import { NextResponse } from 'next/server';
import { ChatRequestSchema, runChatFlow } from '@/ai/genkit';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    return NextResponse.json(
      { success: false, message: 'AI service is not configured.' },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body.' },
      { status: 400 }
    );
  }

  let parsed;
  try {
    parsed = ChatRequestSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid message format.' },
        { status: 400 }
      );
    }
    throw err;
  }

  // Enforce a reasonable history limit to avoid runaway token costs
  const messages = parsed.messages.slice(-20);

  try {
    const reply = await runChatFlow(messages);
    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error('Chat flow error:', error);
    return NextResponse.json(
      { success: false, message: 'The AI assistant is temporarily unavailable. Please try again shortly.' },
      { status: 500 }
    );
  }
}
