// lib/config.ts
// Single source: re-exports everything from constants/config.ts
// No keys hardcoded here — they live in constants/config.ts + .env

export {
  ANTHROPIC_API_KEY, GOOGLE_MAPS_KEY, PAYMONGO_KEY, SUPABASE_ANON_KEY, SUPABASE_URL
} from '../constants/config';

