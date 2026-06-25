// constants/config.ts
// ─────────────────────────────────────────────────────────────────────────────
// SOURCE OF TRUTH for all keys and app config.
// All other config files (lib/config.ts) re-export from here.
// ─────────────────────────────────────────────────────────────────────────────

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
    basic:   { price: 599,  label: 'Basic',     color: '#185FA5' },
    premium: { price: 1299, label: 'Premium',   color: '#1D9E75' },
    vip:     { price: 2499, label: 'VIP Elite', color: '#EF9F27' },
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

// ── Supabase ──────────────────────────────────────────────────────────────────
export const SUPABASE_URL      = process.env.EXPO_PUBLIC_SUPABASE_URL      ?? 'https://vzvbiedcfupvuamkhubk.supabase.co';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6dmJpZWRjZnVwdnVhbWtodWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxOTE4MTgsImV4cCI6MjA5Nzc2NzgxOH0.4VFCeWtDBeywiQzXPb4N2UMedDImhRRzYziX-S07XwI';

// ── Third-party keys ──────────────────────────────────────────────────────────
export const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_KEY ?? '';
export const PAYMONGO_KEY      = process.env.EXPO_PUBLIC_PAYMONGO_KEY  ?? '';
export const GOOGLE_MAPS_KEY   = process.env.EXPO_PUBLIC_MAPS_KEY      ?? '';

// ── Laravel backend ───────────────────────────────────────────────────────────
// Set EXPO_PUBLIC_API_URL in your .env to your Laravel server address.
// Local emulator  → http://10.0.2.2:8000/api    (Android emulator)
// Physical device → http://192.168.x.x:8000/api (replace with your LAN IP)
// Production      → https://api.flexzone.ph/api
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8000/api';

// ── Dev sanity checks ─────────────────────────────────────────────────────────
if (__DEV__) {
  if (!process.env.EXPO_PUBLIC_SUPABASE_URL)      console.warn('[FlexZone] ⚠️  EXPO_PUBLIC_SUPABASE_URL is not set in .env');
  if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) console.warn('[FlexZone] ⚠️  EXPO_PUBLIC_SUPABASE_ANON_KEY is not set in .env');
  if (!process.env.EXPO_PUBLIC_ANTHROPIC_KEY)     console.warn('[FlexZone] ⚠️  EXPO_PUBLIC_ANTHROPIC_KEY is not set in .env');
  if (!process.env.EXPO_PUBLIC_PAYMONGO_KEY)      console.warn('[FlexZone] ⚠️  EXPO_PUBLIC_PAYMONGO_KEY is not set in .env');
  if (!process.env.EXPO_PUBLIC_MAPS_KEY)          console.warn('[FlexZone] ⚠️  EXPO_PUBLIC_MAPS_KEY is not set in .env');
  if (!process.env.EXPO_PUBLIC_API_URL)           console.warn('[FlexZone] ⚠️  EXPO_PUBLIC_API_URL is not set — defaulting to Android emulator address');
}
