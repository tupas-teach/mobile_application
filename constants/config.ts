export const CONFIG = {
  appName:   'FlexZone',
  tagline:   'SmartGym & Court Booking',
  gymName:   'FlexZone SmartGym',
  courtName: 'FlexZone Sports Complex',
  address:   'MacArthur Highway, Consolacion, Cebu',
  phone:     '+63 32 888 1234',
  email:     'hello@flexzone.ph',
  lat:       10.3739,
  lng:       123.9594,

  membership: {
    basic:   { price: 599,  label: 'Basic',    color: '#185FA5' },
    premium: { price: 1299, label: 'Premium',  color: '#1D9E75' },
    vip:     { price: 2499, label: 'VIP Elite',color: '#EF9F27' },
  },

  court: {
    basketball:  300,
    volleyball:  250,
    badminton:   200,
    pickleball:  200,
    tabletennis: 150,
  },

  event: {
    birthday:  5000,
    reunion:   8000,
    corporate: 12000,
    wedding:   15000,
  },
};

// ── Keys from .env ───────────────────────────────────────────────────────────
export const SUPABASE_URL      = process.env.EXPO_PUBLIC_SUPABASE_URL      ?? 'https://vzvbiedcfupvuamkhubk.supabase.co';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6dmJpZWRjZnVwdnVhbWtodWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxOTE4MTgsImV4cCI6MjA5Nzc2NzgxOH0.4VFCeWtDBeywiQzXPb4N2UMedDImhRRzYziX-S07XwI';
export const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_KEY     ?? '';
export const PAYMONGO_KEY      = process.env.EXPO_PUBLIC_PAYMONGO_KEY      ?? '';
export const GOOGLE_MAPS_KEY   = process.env.EXPO_PUBLIC_MAPS_KEY          ?? '';

// ── Dev sanity check ─────────────────────────────────────────────────────────
if (__DEV__) {
  if (!SUPABASE_URL)      console.warn('[FlexZone] ⚠️  EXPO_PUBLIC_SUPABASE_URL is not set in .env');
  if (!SUPABASE_ANON_KEY) console.warn('[FlexZone] ⚠️  EXPO_PUBLIC_SUPABASE_ANON_KEY is not set in .env');
  if (!ANTHROPIC_API_KEY) console.warn('[FlexZone] ⚠️  EXPO_PUBLIC_ANTHROPIC_KEY is not set in .env');
  if (!PAYMONGO_KEY)      console.warn('[FlexZone] ⚠️  EXPO_PUBLIC_PAYMONGO_KEY is not set in .env');
  if (!GOOGLE_MAPS_KEY)   console.warn('[FlexZone] ⚠️  EXPO_PUBLIC_MAPS_KEY is not set in .env');
}