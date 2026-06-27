/**
 * app/_layout.tsx  — ROOT LAYOUT
 *
 * FIX: Defers navigation until session is fully restored.
 * Without this, the app redirects to /(gym) before auth screens
 * even have a chance to mount, making login/register invisible.
 */

import { useAuthStore } from '@/store/authStore';
import { Slot, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, restoreSession } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await restoreSession();   // wait for token check
      setReady(true);
      await SplashScreen.hideAsync();
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (isAuthenticated) {
      router.replace('/(gym)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [ready, isAuthenticated]);

  // Don't render anything until session is restored
  if (!ready) return null;

  return <Slot />;
}