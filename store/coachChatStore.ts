import type { ChatMessage } from '@/types';
import { create } from 'zustand';

interface CoachThread {
  coachId: string;
  coachName: string;
  coachInitials: string;
  coachColor: string;
  messages: ChatMessage[];
}

interface CoachChatState {
  threads: Record<string, CoachThread>;
  openThread: (coachId: string, coachName: string, coachInitials: string, coachColor: string) => void;
  sendMessage: (coachId: string, text: string) => void;
  markRead: (coachId: string) => void;
  totalUnread: () => number;
}

function welcomeMessage(coachName: string): ChatMessage {
  return {
    id: '0',
    senderId: 'coach',
    senderName: coachName,
    senderType: 'admin',
    content: `Hi! 👋 I'm ${coachName}. Feel free to ask me about training plans, schedules, or anything else!`,
    timestamp: new Date(),
    read: false,
  };
}

export const useCoachChatStore = create<CoachChatState>((set, get) => ({
  threads: {},

  openThread: (coachId, coachName, coachInitials, coachColor) => {
    set((state) => {
      if (state.threads[coachId]) return state;
      return {
        threads: {
          ...state.threads,
          [coachId]: {
            coachId,
            coachName,
            coachInitials,
            coachColor,
            messages: [welcomeMessage(coachName)],
          },
        },
      };
    });
  },

  sendMessage: (coachId, text) => {
    const thread = get().threads[coachId];
    if (!thread) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      senderType: 'user',
      content: text,
      timestamp: new Date(),
      read: true,
    };

    set((state) => ({
      threads: {
        ...state.threads,
        [coachId]: { ...thread, messages: [...thread.messages, userMsg] },
      },
    }));

    // Simulate a coach reply
    setTimeout(() => {
      const current = get().threads[coachId];
      if (!current) return;
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'coach',
        senderName: current.coachName,
        senderType: 'admin',
        content: 'Got it! I\'ll get back to you shortly. 💪',
        timestamp: new Date(),
        read: false,
      };
      set((state) => ({
        threads: {
          ...state.threads,
          [coachId]: { ...current, messages: [...current.messages, reply] },
        },
      }));
    }, 1500);
  },

  markRead: (coachId) => {
    const thread = get().threads[coachId];
    if (!thread) return;
    set((state) => ({
      threads: {
        ...state.threads,
        [coachId]: {
          ...thread,
          messages: thread.messages.map((m) => ({ ...m, read: true })),
        },
      },
    }));
  },

  totalUnread: () => {
    const threads = Object.values(get().threads);
    return threads.reduce(
      (sum, t) => sum + t.messages.filter((m) => !m.read && m.senderType !== 'user').length,
      0
    );
  },
}));
