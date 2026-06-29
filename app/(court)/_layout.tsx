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
      headerShown: false,
      tabBarStyle: t.bar,
      tabBarShowLabel: false,
    }}>
      {/* ── Visible tabs ── */}
      <Tabs.Screen name="index"       options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏟️" label="Courts"  focused={focused} /> }} />
      <Tabs.Screen name="book"        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Book"    focused={focused} /> }} />
      <Tabs.Screen name="events"      options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🎉" label="Events"  focused={focused} /> }} />
      <Tabs.Screen name="marketplace" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🛍️" label="Shop"   focused={focused} /> }} />
      <Tabs.Screen name="court-chat"  options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Chat"    focused={focused} /> }} />

      {/* ── Hidden screens — reachable via router.push, NOT shown as tabs ── */}
      <Tabs.Screen name="my-bookings"  options={{ href: null }} />
      <Tabs.Screen name="refund"       options={{ href: null }} />
      <Tabs.Screen name="notification" options={{ href: null }} />
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
