import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={[styles.tab, focused && styles.tabActive]}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function CourtLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏟️" label="Courts" focused={focused} /> }} />
      <Tabs.Screen name="book" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Book" focused={focused} /> }} />
      <Tabs.Screen name="events" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🎉" label="Events" focused={focused} /> }} />
      <Tabs.Screen name="marketplace" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🛍️" label="Shop" focused={focused} /> }} />
      <Tabs.Screen name="court-chat" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Chat" focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: { backgroundColor: '#1A1A2E', borderTopWidth: 0, height: 80, paddingBottom: 10, paddingTop: 8 },
  tab: { alignItems: 'center', paddingHorizontal: 6 },
  tabActive: {},
  tabEmoji: { fontSize: 22 },
  tabLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  tabLabelActive: { color: COLORS.primary, fontWeight: '600' },
});