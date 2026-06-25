// lib/config.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single re-export hub — import from here OR from constants/config directly.
// No keys hardcoded here; everything lives in constants/config.ts + .env
//
// ✅ FIX: Added API_URL to the re-export list.
//         It was missing before, so any file importing API_URL from lib/config
//         would get a TypeScript "has no exported member 'API_URL'" error.
// ─────────────────────────────────────────────────────────────────────────────

export {
  ANTHROPIC_API_KEY, API_URL, GOOGLE_MAPS_KEY,
  PAYMONGO_KEY,
  SUPABASE_ANON_KEY,
  SUPABASE_URL
} from '../constants/config';

