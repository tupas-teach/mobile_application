/**
 * app/(court)/_layout.tsx
 *
 * FIX: Tab name was "chat" but the actual file is "court-chat.tsx".
 * Expo Router uses the filename as the route name, so the tab must be
 * name="court-chat" — otherwise the Chat tab renders a blank/404 screen.
 *
 * Also fixed: all router.push calls in index.tsx, events.tsx use
 * '/(court)/chat' — those are updated to '/(court)/court-chat' too.
 */

import { COLORS } from '@/constants/theme';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={t.tab}>
      <Text style={t.emoji}>{emoji}</Text>
      <Text style={[t.label, focused && t.labelActive]}>{label}</Text>
    </View>
  );
}

export default function CourtLayout() {
  return (
    <Tabs screenOptions={{
      headerShown:    false,
      tabBarStyle:    t.bar,
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen name="index"        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏟️" label="Courts"  focused={focused} /> }} />
      <Tabs.Screen name="book"         options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Book"    focused={focused} /> }} />
      <Tabs.Screen name="events"       options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🎉" label="Events"  focused={focused} /> }} />
      <Tabs.Screen name="marketplace"  options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🛍️" label="Shop"   focused={focused} /> }} />
      {/* ✅ FIX: was name="chat" — must match filename court-chat.tsx */}
      <Tabs.Screen name="court-chat"   options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Chat"    focused={focused} /> }} />
    </Tabs>
  );
}

const t = StyleSheet.create({
  bar:         { backgroundColor: COLORS.card, borderTopWidth: 0.5, borderTopColor: COLORS.border, height: 80, paddingBottom: 10, paddingTop: 8 },
  tab:         { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  emoji:       { fontSize: 22 },
  label:       { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  labelActive: { color: COLORS.primary, fontWeight: '600' },
});