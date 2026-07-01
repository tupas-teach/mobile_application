// store/workoutStore.ts
import { create } from 'zustand';

// ── Types ────────────────────────────────────────────────────────────────────

export interface SetLog {
  id:        string;
  weight:    string;   // kg, empty = bodyweight
  reps:      string;
  done:      boolean;
}

export interface ExerciseLog {
  id:        string;
  name:      string;
  muscleGroup: string;
  sets:      SetLog[];
  notes:     string;
}

export interface WorkoutSession {
  id:          string;
  name:        string;          // e.g. "Push Day", "HIIT Circuit"
  startedAt:   string;          // ISO
  finishedAt?: string;
  exercises:   ExerciseLog[];
}

interface WorkoutStore {
  // Active workout
  activeWorkout:    WorkoutSession | null;
  startWorkout:     (name: string) => void;
  finishWorkout:    () => void;
  discardWorkout:   () => void;

  // Exercises
  addExercise:      (exercise: Omit<ExerciseLog, 'id' | 'sets' | 'notes'>) => void;
  removeExercise:   (exerciseId: string) => void;
  updateNotes:      (exerciseId: string, notes: string) => void;

  // Sets
  addSet:           (exerciseId: string) => void;
  removeSet:        (exerciseId: string, setId: string) => void;
  updateSet:        (exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => void;
  toggleSetDone:    (exerciseId: string, setId: string) => void;

  // History
  history:          WorkoutSession[];
  clearHistory:     () => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);

const defaultSet = (): SetLog => ({
  id:     uid(),
  weight: '',
  reps:   '',
  done:   false,
});

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  activeWorkout: null,
  history:       [],

  // ── Workout lifecycle ────────────────────────────────────────────────────

  startWorkout: (name) =>
    set({
      activeWorkout: {
        id:        uid(),
        name,
        startedAt: new Date().toISOString(),
        exercises: [],
      },
    }),

  finishWorkout: () => {
    const w = get().activeWorkout;
    if (!w) return;
    const finished = { ...w, finishedAt: new Date().toISOString() };
    set((s) => ({ activeWorkout: null, history: [finished, ...s.history] }));
  },

  discardWorkout: () => set({ activeWorkout: null }),

  // ── Exercises ────────────────────────────────────────────────────────────

  addExercise: (exercise) =>
    set((s) => {
      if (!s.activeWorkout) return s;
      const newEx: ExerciseLog = {
        ...exercise,
        id:   uid(),
        sets: [defaultSet()],
        notes: '',
      };
      return {
        activeWorkout: {
          ...s.activeWorkout,
          exercises: [...s.activeWorkout.exercises, newEx],
        },
      };
    }),

  removeExercise: (exerciseId) =>
    set((s) => {
      if (!s.activeWorkout) return s;
      return {
        activeWorkout: {
          ...s.activeWorkout,
          exercises: s.activeWorkout.exercises.filter((e) => e.id !== exerciseId),
        },
      };
    }),

  updateNotes: (exerciseId, notes) =>
    set((s) => {
      if (!s.activeWorkout) return s;
      return {
        activeWorkout: {
          ...s.activeWorkout,
          exercises: s.activeWorkout.exercises.map((e) =>
            e.id === exerciseId ? { ...e, notes } : e
          ),
        },
      };
    }),

  // ── Sets ─────────────────────────────────────────────────────────────────

  addSet: (exerciseId) =>
    set((s) => {
      if (!s.activeWorkout) return s;
      return {
        activeWorkout: {
          ...s.activeWorkout,
          exercises: s.activeWorkout.exercises.map((e) =>
            e.id === exerciseId ? { ...e, sets: [...e.sets, defaultSet()] } : e
          ),
        },
      };
    }),

  removeSet: (exerciseId, setId) =>
    set((s) => {
      if (!s.activeWorkout) return s;
      return {
        activeWorkout: {
          ...s.activeWorkout,
          exercises: s.activeWorkout.exercises.map((e) =>
            e.id === exerciseId
              ? { ...e, sets: e.sets.filter((st) => st.id !== setId) }
              : e
          ),
        },
      };
    }),

  updateSet: (exerciseId, setId, field, value) =>
    set((s) => {
      if (!s.activeWorkout) return s;
      return {
        activeWorkout: {
          ...s.activeWorkout,
          exercises: s.activeWorkout.exercises.map((e) =>
            e.id === exerciseId
              ? {
                  ...e,
                  sets: e.sets.map((st) =>
                    st.id === setId ? { ...st, [field]: value } : st
                  ),
                }
              : e
          ),
        },
      };
    }),

  toggleSetDone: (exerciseId, setId) =>
    set((s) => {
      if (!s.activeWorkout) return s;
      return {
        activeWorkout: {
          ...s.activeWorkout,
          exercises: s.activeWorkout.exercises.map((e) =>
            e.id === exerciseId
              ? {
                  ...e,
                  sets: e.sets.map((st) =>
                    st.id === setId ? { ...st, done: !st.done } : st
                  ),
                }
              : e
          ),
        },
      };
    }),

  clearHistory: () => set({ history: [] }),
}));
