/**
 * hooks/index.ts
 *
 * FIX: ai-coach.tsx imports `useAICoach` from '@/hooks' but the file
 * didn't exist — module-not-found crash.
 *
 * useAICoach wraps the Anthropic API call from lib/aiCoach.ts and manages
 * message history + loading state locally.
 */

import { sendMessageToAICoach, type Message } from '@/services/aiCoach';
import { useAuthStore } from '@/store/authStore';
import { useCallback, useState } from 'react';

// ── useAICoach ────────────────────────────────────────────────────────────────
export function useAICoach(context: 'gym' | 'court' = 'gym') {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id:        'welcome',
      role:      'assistant',
      // senderType used by the UI bubble renderer
      senderType: 'ai',
      content:   `Hi${user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 💪 I'm your FlexZone AI Coach. I can help you with personalized workout plans, nutrition advice, and class recommendations. What are your fitness goals today?`,
      timestamp: new Date(),
      read:      true,
    } as any,
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: Message = {
      id:        Date.now().toString(),
      role:      'user',
      content:   text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build the history for the API (role + content only)
      const history = [...messages, userMsg].map((m) => ({
        role:    m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const reply = await sendMessageToAICoach(
        history,
        user?.membership ?? 'basic',
      );

      const aiMsg: Message = {
        id:         (Date.now() + 1).toString(),
        role:       'assistant',
        content:    reply,
        timestamp:  new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errMsg: Message = {
        id:        (Date.now() + 2).toString(),
        role:      'assistant',
        content:   `Sorry, I encountered an error: ${err.message ?? 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }, [messages, user]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, loading, sendMessage, clearChat };
}