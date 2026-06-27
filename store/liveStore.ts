/**
 * store/liveStore.ts
 *
 * FIX: Both index.tsx and home-dashboard.tsx import useLiveStore from
 * '@/store/liveStore' but this file didn't exist — causing a module-not-found
 * crash at startup.
 *
 * Provides simulated live gym stats that update every 10 seconds.
 * Replace with real API polling when backend is ready.
 */

import { create } from 'zustand';

interface LiveStats {
  membersInGym:    number;
  courtsOccupied:  number;
  sessionsLive:    number;
  courtQueue:      number;
}

interface LiveState {
  stats:     LiveStats;
  startLive: () => void;
  stopLive:  () => void;
}

// Generates slightly randomized "live" stats each tick
function generateStats(): LiveStats {
  return {
    membersInGym:   Math.floor(Math.random() * 30) + 20,   // 20–50
    courtsOccupied: Math.floor(Math.random() * 4)  + 1,    // 1–4
    sessionsLive:   Math.floor(Math.random() * 3)  + 1,    // 1–3
    courtQueue:     Math.floor(Math.random() * 5),          // 0–4
  };
}

let _interval: ReturnType<typeof setInterval> | null = null;

export const useLiveStore = create<LiveState>((set) => ({
  stats: generateStats(),

  startLive: () => {
    if (_interval) return; // already running
    _interval = setInterval(() => {
      set({ stats: generateStats() });
    }, 10_000); // update every 10 s
  },

  stopLive: () => {
    if (_interval) {
      clearInterval(_interval);
      _interval = null;
    }
  },
}));