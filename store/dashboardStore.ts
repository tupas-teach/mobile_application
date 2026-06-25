import { create } from 'zustand';

interface DashboardState {
  stats: {
    membersInGym: number;
    courtsOccupied: number;
    activeSessions: number;
    courtQueue: number;
    lastUpdated: string;
  };
  currentTime: Date;
  isActive: boolean;
  timerRef: ReturnType<typeof setInterval> | null;
  startDashboard: () => void;
  stopDashboard: () => void;
  refreshStats: () => void;
}

function randomDelta(val: number, max: number, min = 0): number {
  const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
  return Math.min(max, Math.max(min, val + delta));
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  currentTime: new Date(),
  isActive: false,
  timerRef: null,
  stats: {
    membersInGym: 42,
    courtsOccupied: 2,
    activeSessions: 3,
    courtQueue: 1,
    lastUpdated: new Date().toISOString(),
  },

  refreshStats: () => {
    const s = get().stats;
    set({
      currentTime: new Date(),
      stats: {
        membersInGym:   randomDelta(s.membersInGym,   120, 5),
        courtsOccupied: randomDelta(s.courtsOccupied, 5,   0),
        activeSessions: randomDelta(s.activeSessions, 7,   0),
        courtQueue:     randomDelta(s.courtQueue,     8,   0),
        lastUpdated:    new Date().toISOString(),
      },
    });
  },

  startDashboard: () => {
    if (get().isActive) return;
    const ref = setInterval(() => get().refreshStats(), 3000);
    set({ isActive: true, timerRef: ref });
  },

  stopDashboard: () => {
    const ref = get().timerRef;
    if (ref) clearInterval(ref);
    set({ isActive: false, timerRef: null });
  },
}));
