import { COLORS, RADIUS, SHADOW, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: '✏️', label: 'Edit Profile',         path: '/(shared)/edit-profile',          color: COLORS.primary   },
      { icon: '📅', label: 'My Bookings',           path: '/(shared)/my-bookings',           color: '#185FA5'        },
      { icon: '💳', label: 'Transaction History',   path: '/(shared)/transactions',          color: '#534AB7'        },
      { icon: '👑', label: 'Membership',            path: '/(gym)/membership',               color: COLORS.amber     },
    ],
  },
  {
    title: 'Communication',
    items: [
      { icon: '💬', label: 'Coach Inbox',           path: '/(gym)/coach-inbox',              color: COLORS.primary   },
      { icon: '🔔', label: 'Notifications',         path: '/(shared)/notifications',         color: '#D85A30'        },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: '⚙️', label: 'Settings',              path: '/(shared)/settings',              color: COLORS.textSecondary },
      { icon: '🆘', label: 'Help & Support',        path: '/(shared)/support',               color: '#185FA5'        },
    ],
  },
];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const TIER_COLORS: Record<string, string> = { basic: '#185FA5', premium: COLORS.primary, vip: COLORS.amber };
  const TIER_LABELS: Record<string, string> = { basic: 'Basic', premium: 'Premium', vip: 'VIP Elite' };
  const tier      = user?.membership ?? 'basic';
  const tierColor = TIER_COLORS[tier];
  const tierLabel = TIER_LABELS[tier];

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => { logout(); router.replace('/(auth)/login' as never); } },
    ]);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.screenTitle}>Profile</Text>
        <TouchableOpacity onPress={() => router.push('/(shared)/notifications' as never)}>
          <Text style={{ fontSize: 22 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Overview card */}
      <View style={s.overviewCard}>
        <View style={s.avatarCircle}>
          <Text style={s.avatarText}>{user?.name?.charAt(0) ?? 'U'}</Text>
        </View>
        <Text style={s.name}>{user?.name ?? 'Member'}</Text>
        <Text style={s.email}>{user?.email ?? ''}</Text>
        <View style={[s.tierBadge, { backgroundColor: tierColor + '20' }]}>
          <Text style={[s.tierText, { color: tierColor }]}>👑 {tierLabel} Member</Text>
        </View>
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statValue}>{user?.points?.toLocaleString() ?? '0'}</Text>
            <Text style={s.statLabel}>Points</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statValue}>28</Text>
            <Text style={s.statLabel}>Sessions</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statValue}>3</Text>
            <Text style={s.statLabel}>Bookings</Text>
          </View>
        </View>
      </View>

      {/* Menu sections */}
      {MENU_SECTIONS.map((section) => (
        <View key={section.title} style={s.section}>
          <Text style={s.sectionTitle}>{section.title}</Text>
          <View style={s.menuCard}>
            {section.items.map((item, idx) => (
              <TouchableOpacity key={item.label} style={[s.menuRow, idx < section.items.length - 1 && s.menuRowBorder]}
                onPress={() => router.push(item.path as never)} activeOpacity={0.7}>
                <View style={[s.menuIcon, { backgroundColor: item.color + '18' }]}>
                  <Text style={{ fontSize: 17 }}>{item.icon}</Text>
                </View>
                <Text style={s.menuLabel}>{item.label}</Text>
                <Text style={s.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Log out */}
      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={s.logoutText}>🚪  Log Out</Text>
      </TouchableOpacity>

      <Text style={s.version}>FlexZone v1.0.0</Text>
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: COLORS.background },
  content:         { padding: SPACING.lg },
  header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 54, marginBottom: SPACING.xl },
  screenTitle:     { fontSize: 26, fontWeight: '800', color: COLORS.text },
  overviewCard:    { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.xl, ...SHADOW.sm, borderWidth: 0.5, borderColor: COLORS.border },
  avatarCircle:    { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md, borderWidth: 3, borderColor: COLORS.primary },
  avatarText:      { fontSize: 32, fontWeight: '800', color: COLORS.primaryDark },
  name:            { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  email:           { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  tierBadge:       { paddingHorizontal: SPACING.md, paddingVertical: 5, borderRadius: RADIUS.full, marginBottom: SPACING.lg },
  tierText:        { fontSize: 13, fontWeight: '700' },
  statsRow:        { flexDirection: 'row', alignItems: 'center', width: '100%' },
  statItem:        { flex: 1, alignItems: 'center' },
  statValue:       { fontSize: 20, fontWeight: '800', color: COLORS.text },
  statLabel:       { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  statDivider:     { width: 1, height: 30, backgroundColor: COLORS.border },
  section:         { marginBottom: SPACING.lg },
  sectionTitle:    { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: SPACING.sm, paddingLeft: 4 },
  menuCard:        { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 0.5, borderColor: COLORS.border, ...SHADOW.sm },
  menuRow:         { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  menuRowBorder:   { borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  menuIcon:        { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel:       { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.text },
  menuArrow:       { fontSize: 20, color: COLORS.textMuted },
  logoutBtn:       { backgroundColor: COLORS.errorLight, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', marginBottom: SPACING.md, borderWidth: 0.5, borderColor: COLORS.error + '30' },
  logoutText:      { fontSize: 15, fontWeight: '700', color: COLORS.error },
  version:         { textAlign: 'center', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.sm },
});
