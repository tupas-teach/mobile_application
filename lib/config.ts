/**
 * lib/config.ts
 */

// ── Laravel Backend ───────────────────────────────────────────────────────────
export const API_BASE: string =
process.env.EXPO_PUBLIC_API_BASE ?? 'http://192.168.1.6/flexzone-api/public/api'

export const API_URL = API_BASE;

// ── Anthropic AI Coach ────────────────────────────────────────────────────────
export const ANTHROPIC_API_KEY: string | undefined =
  process.env.EXPO_PUBLIC_ANTHROPIC_KEY;

// ── PayMongo ──────────────────────────────────────────────────────────────────
export const PAYMONGO_PUBLIC_KEY: string | undefined =
  process.env.EXPO_PUBLIC_PAYMONGO_KEY;