import { COLORS } from '@/constants/theme';
import { useCartStore } from '@/store/cartStore';
import { useCoachChatStore } from '@/store/coachChatStore';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tab}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function GymLayout() {
  const cartCount = useCartStore((s) => s.cartCount());
  const unread    = useCoachChatStore((s) => s.totalUnread());

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarShowLabel: false }}>
      <Tabs.Screen name="index"    options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home"     focused={focused} /> }} />
      <Tabs.Screen name="session" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📅" label="Sessions" focused={focused} /> }} />
      <Tabs.Screen name="coaches"  options={{
        tabBarIcon: ({ focused }) => (
          <View>
            <TabIcon emoji="👥" label="Coaches" focused={focused} />
            {unread > 0 && <View style={styles.dot}><Text style={styles.dotText}>{unread}</Text></View>}
          </View>
        ),
      }} />
      <Tabs.Screen name="equipment"  options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏋️" label="Equipment" focused={focused} /> }} />
      <Tabs.Screen name="marketplace" options={{
        tabBarIcon: ({ focused }) => (
          <View>
            <TabIcon emoji="🛍️" label="Shop" focused={focused} />
            {cartCount > 0 && <View style={styles.dot}><Text style={styles.dotText}>{cartCount}</Text></View>}
          </View>
        ),
      }} />
      <Tabs.Screen name="ai-coach" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🤖" label="AI Coach" focused={focused} /> }} />

      {/* Hidden stack screens — reachable via router.push, not shown as tabs */}
      <Tabs.Screen name="membership"              options={{ href: null }} />
      <Tabs.Screen name="coach-chat"              options={{ href: null }} />
      <Tabs.Screen name="coach-inbox"             options={{ href: null }} />
      <Tabs.Screen name="success"                 options={{ href: null }} />
      <Tabs.Screen name="live-dashboard"          options={{ href: null }} />
      <Tabs.Screen name="coach-apply"             options={{ href: null }} />
      <Tabs.Screen name="coach-applications-admin" options={{ href: null }} />
      <Tabs.Screen name="home-dashboard"          options={{ href: null }} />
      <Tabs.Screen name="coach-profile"           options={{ href: null }} />
      <Tabs.Screen name="coache-profile"          options={{ href: null }} />
      <Tabs.Screen name="workout-tracker"         options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar:         { backgroundColor: COLORS.card, borderTopWidth: 0.5, borderTopColor: COLORS.border, height: 78, paddingBottom: 10, paddingTop: 8 },
  tab:            { alignItems: 'center', paddingHorizontal: 4 },
  tabEmoji:       { fontSize: 22 },
  tabLabel:       { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  tabLabelActive: { color: COLORS.primary, fontWeight: '600' },
  dot:            { position: 'absolute', top: -4, right: -10, backgroundColor: COLORS.error, borderRadius: 99, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  dotText:        { color: '#fff', fontSize: 9, fontWeight: '800' },
});
