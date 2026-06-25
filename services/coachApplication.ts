// Mock service for coach applications — replace with real API calls later
import type { CoachApplication } from '@/types';

// Seed with sample data so the admin screen has something to show on first load
let DB: CoachApplication[] = [
  {
    id: 'app_seed001',
    applicantName: 'Marco Villanueva',
    applicantEmail: 'marco.v@email.com',
    applicantPhone: '+63 917 234 5678',
    bio: 'Former collegiate basketball player, 6 years coaching youth and adult HIIT programs.',
    portfolioNote: 'Certified NASM-CPT, ran bootcamps for 3 gyms in Cebu.',
    expectedRate: 550,
    experience: '6 years',
    specialties: ['HIIT', 'Strength', 'Full Body'],
    certifications: ['NASM-CPT', 'First Aid / CPR'],
    availability: ['Mon', 'Wed', 'Fri', 'Sat'],
    status: 'pending',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'app_seed002',
    applicantName: 'Joanna Reyes',
    applicantEmail: 'joanna.reyes@email.com',
    applicantPhone: '+63 928 111 2233',
    bio: 'RYT-500 certified yoga instructor with focus on Vinyasa and recovery flows.',
    portfolioNote: 'Taught at two wellness studios, 200+ hour teacher training.',
    expectedRate: 480,
    experience: '4 years',
    specialties: ['Yoga', 'Cardio'],
    certifications: ['RYT-500'],
    availability: ['Tue', 'Thu', 'Sun'],
    status: 'reviewing',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitApplication(
  payload: Partial<CoachApplication> & { applicantName: string; applicantEmail: string; expectedRate: number }
): Promise<CoachApplication> {
  await sleep(600);
  const id = `app_${Math.random().toString(36).slice(2, 9)}`;
  const app: CoachApplication = {
    id,
    applicantName:  payload.applicantName,
    applicantEmail: payload.applicantEmail,
    applicantPhone: payload.applicantPhone ?? '',
    bio:            payload.bio ?? '',
    portfolioNote:  payload.portfolioNote ?? '',
    expectedRate:   payload.expectedRate,
    experience:     payload.experience ?? '',
    specialties:    payload.specialties ?? [],
    certifications: payload.certifications ?? [],
    availability:   payload.availability ?? [],
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
  DB.unshift(app);
  return app;
}

export async function fetchApplications(): Promise<CoachApplication[]> {
  await sleep(200);
  return DB.slice();
}

export async function withdrawApplication(id: string): Promise<boolean> {
  await sleep(200);
  DB = DB.filter((a) => a.id !== id);
  return true;
}

export async function adminUpdateStatus(
  id: string,
  status: CoachApplication['status'],
  note?: string
): Promise<CoachApplication> {
  await sleep(300);
  const idx = DB.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error('Application not found');
  DB[idx] = {
    ...DB[idx],
    status,
    reviewNote: note ?? DB[idx].reviewNote,
    reviewedAt: new Date().toISOString(),
  };
  return DB[idx];
}
