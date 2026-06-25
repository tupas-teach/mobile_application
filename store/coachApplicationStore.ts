import * as svc from '@/services/coachApplication';
import { useGymStore } from '@/store/gymStore';
import type { ApplicationStatus, Coach, CoachApplication } from '@/types';
import { create } from 'zustand';

// Re-export so screens can do `import { type ApplicationStatus } from '@/store/coachApplicationStore'`
export type { ApplicationStatus };

interface CoachAppState {
  applications: CoachApplication[];
  myApplication: CoachApplication | null;
  loading: boolean;
  submitApplication: (
    payload: Partial<CoachApplication> & { applicantName: string; applicantEmail: string; expectedRate: number }
  ) => Promise<void>;
  withdrawApplication: () => Promise<void>;
  fetchApplications: () => Promise<void>;
  adminUpdateStatus: (id: string, status: ApplicationStatus, note?: string) => Promise<void>;
}

export const useCoachApplicationStore = create<CoachAppState>((set, get) => ({
  applications: [],
  myApplication: null,
  loading: false,

  submitApplication: async (payload) => {
    set({ loading: true });
    try {
      const app = await svc.submitApplication(payload);
      set((state) => ({ applications: [app, ...state.applications], myApplication: app }));
    } finally {
      set({ loading: false });
    }
  },

  withdrawApplication: async () => {
    const app = get().myApplication;
    if (!app) return;
    set({ loading: true });
    try {
      await svc.withdrawApplication(app.id);
      set((state) => ({
        myApplication: null,
        applications: state.applications.filter((a) => a.id !== app.id),
      }));
    } finally {
      set({ loading: false });
    }
  },

  fetchApplications: async () => {
    set({ loading: true });
    try {
      const apps = await svc.fetchApplications();
      set({ applications: apps });
    } finally {
      set({ loading: false });
    }
  },

  adminUpdateStatus: async (id, status, note) => {
    set({ loading: true });
    try {
      const updated = await svc.adminUpdateStatus(id, status, note);
      set((state) => ({
        applications: state.applications.map((a) => (a.id === id ? updated : a)),
        myApplication: state.myApplication?.id === id ? updated : state.myApplication,
      }));

      // On approval, add the applicant to the gym's coach roster
      if (status === 'approved') {
        const gym = useGymStore.getState();
        const exists = gym.coaches.find((c) => c.name === updated.applicantName);
        if (!exists) {
          const initials = updated.applicantName
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

          const newCoach: Coach = {
            id: `c-${Date.now()}`,
            name: updated.applicantName,
            initials,
            specialties: updated.specialties ?? [],
            rating: 5.0,
            reviews: 0,
            experience: updated.experience || 'N/A',
            bio: updated.bio || updated.portfolioNote || '',
            available: true,
            color: '#1D9E75',
            sessionRate: updated.expectedRate,
          };
          useGymStore.setState({ coaches: [newCoach, ...gym.coaches] });
        }
      }
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCoachApplicationStore;
