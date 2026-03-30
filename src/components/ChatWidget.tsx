'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type ChatMessage } from '@/ai/genkit';

const GREETING: ChatMessage = {
  role: 'model',
  content: 'Hi! I\'m the QH Driving School assistant. How can I help you today? I can answer questions about our driving lessons, vehicle services, pricing, and how to book.',
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'model', content: data.message || 'Sorry, something went wrong. Please try again.' },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: 'Sorry, I could not connect to the assistant. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[70vh]">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold text-sm">QH Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:opacity-70 transition-opacity"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2 flex-shrink-0">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="flex-1 text-sm"
              disabled={isLoading}
              autoFocus
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="h-9 w-9 flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
