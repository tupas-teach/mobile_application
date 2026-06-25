/**
 * ✅ FIX 02 — app/_layout.tsx
 *
 * PROBLEM:
 *   The old _layout.tsx used a `ready` state + `setTimeout(..., 0)`
 *   to delay navigation. This was unreliable on Expo Router v6 (SDK 54)
 *   and caused the guard to miss the redirect after login.
 *
 * OLD CODE (BROKEN ❌):
 *   const [ready, setReady] = useState(false);
 *
 *   useEffect(() => {
 *     const timer = setTimeout(() => setReady(true), 0);  // ← fragile
 *     return () => clearTimeout(timer);
 *   }, []);
 *
 *   useEffect(() => {
 *     if (!ready) return;  // ← missed the window
 *     ...
 *   }, [ready, isAuthenticated, segments]);
 *
 * FIX:
 *   Remove the `ready` state entirely. Expo Router v6 with SDK 54
 *   handles navigator mount timing correctly — no setTimeout needed.
 *   One clean useEffect watches isAuthenticated + segments.
 *
 * HOW TO APPLY:
 *   Replace the ENTIRE content of:
 *   📄 c:/Users/Dell/FlexZone/app/_layout.tsx
 *   with the code below ↓
 */

// ============================================================
// PASTE THIS INTO: app/_layout.tsx
// ============================================================

import { useAuthStore } from '@/store/authStore';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';

export default function RootLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Not logged in and not on an auth screen → go to login
      router.replace('/(auth)/login' as never);
    } else if (isAuthenticated && inAuthGroup) {
      // Logged in but still on auth screen → go to main app
      router.replace('/(gym)' as never);
    }
    // In all other cases: stay on current screen (do nothing)
  }, [isAuthenticated, segments]);
  //   ↑ This re-runs automatically whenever login/logout happens

  return (
    <>
      <StatusBar style="light" />
      <Slot />
    </>
  );
}