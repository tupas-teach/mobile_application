import { Stack } from 'expo-router';
import React from 'react';

export default function SharedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8F9FA' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="my-bookings" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="support" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="receipt/[id]" />
      <Stack.Screen name="refund" />
    </Stack>
  );
}