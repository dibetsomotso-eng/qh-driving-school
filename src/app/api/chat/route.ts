import { NextRequest, NextResponse } from 'next/server';
import { ChatRequestSchema, runChatFlow } from '@/ai/genkit';
import { ZodError } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

// OWASP: Aggressive rate limit on AI endpoint to prevent runaway API cost abuse.
// 10 requests per minute per IP — generous for a real user, punishing for scripts.
const CHAT_RATE_LIMIT = { windowMs: 60_000, max: 10 };

export async function POST(request: NextRequest) {
  // SECURITY: Rate-limit by IP before any expensive processing.
  const ip = getClientIp(request.headers);
  const rl = checkRateLimit(`chat:${ip}`, CHAT_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

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
