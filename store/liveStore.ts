import type { LiveStat } from '@/types';
import { create } from 'zustand';

interface LiveState {
  stats: LiveStat;
  currentTime: Date;
  _interval: ReturnType<typeof setInterval> | null;
  startLive: () => void;
  stopLive: () => void;
}

function randomStats(): LiveStat {
  return {
    membersInGym: 18 + Math.floor(Math.random() * 14),   // 18-31
    courtsOccupied: 1 + Math.floor(Math.random() * 5),    // 1-5
    activeSessions: 2 + Math.floor(Math.random() * 4),    // 2-5
    courtQueue: Math.floor(Math.random() * 4),            // 0-3
    lastUpdated: new Date().toISOString(),
  };
}

export const useLiveStore = create<LiveState>((set, get) => ({
  stats: randomStats(),
  currentTime: new Date(),
  _interval: null,

  startLive: () => {
    if (get()._interval) return; // already running
    const interval = setInterval(() => {
      set({ stats: randomStats(), currentTime: new Date() });
    }, 5000);
    set({ _interval: interval, currentTime: new Date() });
  },

  stopLive: () => {
    const interval = get()._interval;
    if (interval) clearInterval(interval);
    set({ _interval: null });
  },
}));