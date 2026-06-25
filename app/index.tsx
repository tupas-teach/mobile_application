/**
 * ✅ FIX 01 — app/index.tsx
 *
 * PROBLEM:
 *   The old index.tsx had a <Redirect> that fired immediately on mount,
 *   competing with the guard in _layout.tsx.
 *
 * OLD CODE (BROKEN ❌):
 *   import { useAuthStore } from '@/store/authStore';
 *   import { Redirect } from 'expo-router';
 *   export default function Index() {
 *     const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
 *     return (
 *       <Redirect href={isAuthenticated ? ('/(gym)' as never) : ('/(auth)/login' as never)} />
 *     );
 *   }
 *
 * WHY IT BROKE:
 *   Expo Router v6 mounts all layouts before screens. So _layout.tsx
 *   AND index.tsx both tried to redirect at the same time — they
 *   cancelled each other out and left you stuck.
 *
 * FIX:
 *   Make index.tsx a blank stub. Let _layout.tsx handle ALL routing.
 *
 * HOW TO APPLY:
 *   Replace the ENTIRE content of:
 *   📄 c:/Users/Dell/FlexZone/app/index.tsx
 *   with the code below ↓
 */

// ============================================================
// PASTE THIS INTO: app/index.tsx
// ============================================================

import { View } from 'react-native';

/**
 * Root entry point — intentionally blank.
 * The AuthGuard in app/_layout.tsx handles all navigation.
 * Expo Router requires this file to exist as the root route.
 */
export default function Index() {
  return <View />;
}