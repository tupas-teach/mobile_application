import { generateMembershipCertificate } from '@/lib/pdf';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const COLORS = {
  primary: '#1D9E75', primaryDark: '#0F6E56', primaryLight: '#E1F5EE',
  secondary: '#534AB7', amber: '#EF9F27',
  text: '#111827', textSecondary: '#6B7280', textMuted: '#9CA3AF',
  border: '#E5E7EB', card: '#FFFFFF', background: '#F8F9FA',
  error: '#E24B4A', errorLight: '#FCEBEB',
};
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };
const RADIUS  = { md: 10, lg: 14, xl: 20, full: 999 };

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  basic:   { label: 'Basic',    color: '#185FA5', bg: '#E6F1FB', emoji: '🏃' },
  premium: { label: 'Premium',  color: COLORS.primary, bg: COLORS.primaryLight, emoji: '⭐' },
  vip:     { label: 'VIP Elite',color: COLORS.amber,   bg: '#FAEEDA',           emoji: '👑' },
};

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { transactions } = useCartStore();
  const [notifs, setNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const tier = TIER_CONFIG[user?.membership ?? 'basic'];

  const handleLogout = () =>
    Alert.alert('Log out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      // --- Fix: Use type assertion for router ---
      { text: 'Log out', style: 'destructive', onPress: () => { logout(); router.replace('/(auth)/login' as any); } },
    ]);

  const handleCertificate = async () => {
    if (!user) return;
    try {
      await generateMembershipCertificate({
        name: user.name,
        membership: tier.label,
        expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-PH', { dateStyle: 'long' }),
      });
    } catch {
      Alert.alert('Error', 'Could not generate certificate. Please try again.');
    }
  };

  // --- Fix: Create navigation helper functions with type assertions ---
  const navigateTo = (path: string, params?: Record<string, string>) => {
    if (params) {
      router.push({ pathname: path, params } as any);
    } else {
      router.push(path as any);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigateTo('/(shared)/notification')} style={styles.notifBtn}>
          <Text style={{ fontSize: 22 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar & name */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: tier.bg }]}>
          <Text style={styles.avatarInitials}>{user?.name?.charAt(0) ?? 'U'}</Text>
        </View>
        <Text style={styles.userName}>{user?.name ?? 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
        <View style={[styles.tierPill, { backgroundColor: tier.bg }]}>
          <Text style={styles.tierEmoji}>{tier.emoji}</Text>
          <Text style={[styles.tierLabel, { color: tier.color }]}>{tier.label} Member</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Transactions', value: transactions.length.toString(), emoji: '💳' },
          { label: 'Points',       value: (user?.points ?? 0).toLocaleString(), emoji: '⭐' },
          { label: 'Member since', value: user?.joinedAt?.split('-')[0] ?? '2024', emoji: '📅' },
        ].map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statEmoji}>{s.emoji}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Membership */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Membership</Text>
        <TouchableOpacity style={[styles.menuRow, { backgroundColor: tier.bg }]} onPress={() => navigateTo('/(gym)/membership')}>
          <Text style={styles.menuEmoji}>{tier.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.menuLabel, { color: tier.color }]}>{tier.label} Plan</Text>
            <Text style={styles.menuSub}>Tap to view plans or upgrade</Text>
          </View>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuRow} onPress={handleCertificate}>
          <Text style={styles.menuEmoji}>📄</Text>
          <Text style={styles.menuLabel}>Download Membership Certificate</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Recent transactions */}
      {transactions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.slice(0, 3).map((tx) => (
            <TouchableOpacity
              key={tx.id}
              style={styles.txRow}
              // --- Fix: Use navigateTo with params ---
              onPress={() => navigateTo('/(shared)/receipt/[id]', { id: tx.reference, type: tx.description, amount: tx.amount.toString() })}
            >
              <View style={styles.txIcon}><Text style={{ fontSize: 18 }}>💳</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txDesc} numberOfLines={1}>{tx.description}</Text>
                <Text style={styles.txDate}>{new Date(tx.createdAt).toLocaleDateString('en-PH')}</Text>
              </View>
              <Text style={styles.txAmount}>₱{tx.amount.toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          {[
            { label: 'Push Notifications', icon: '🔔', value: notifs, onToggle: setNotifs },
            { label: 'Dark Mode',          icon: '🌙', value: darkMode, onToggle: setDarkMode },
          ].map((s) => (
            <View key={s.label} style={styles.toggleRow}>
              <Text style={styles.toggleIcon}>{s.icon}</Text>
              <Text style={styles.toggleLabel}>{s.label}</Text>
              <Switch
                value={s.value}
                onValueChange={s.onToggle}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>
      </View>

      {/* Menu rows */}
      <View style={styles.section}>
        {[
          { emoji: '🏀', label: 'Switch to Court Booking', onPress: () => router.replace('/(court)' as any) },
          { emoji: '❓', label: 'Help & Support',          onPress: () => Alert.alert('Support', 'Email: hello@flexzone.ph\nPhone: +63 32 888 1234') },
          { emoji: '⭐', label: 'Rate FlexZone App',       onPress: () => Alert.alert('Rating', 'Thank you for your feedback!') },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuRow} onPress={item.onPress}>
            <Text style={styles.menuEmoji}>{item.emoji}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>FlexZone v1.0.0 · Made with 💚 in Cebu</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: COLORS.background },
  content:       { padding: SPACING.lg },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 54, paddingBottom: SPACING.lg },
  headerTitle:   { fontSize: 26, fontWeight: '700', color: COLORS.text },
  notifBtn:      { padding: 8 },
  avatarSection: { alignItems: 'center', marginBottom: SPACING.xl },
  avatar:        { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  avatarInitials:{ fontSize: 32, fontWeight: '800', color: COLORS.primaryDark },
  userName:      { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  userEmail:     { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.md },
  tierPill:      { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.full },
  tierEmoji:     { fontSize: 16 },
  tierLabel:     { fontSize: 14, fontWeight: '700' },
  statsRow:      { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  statCard:      { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', gap: 3, borderWidth: 0.5, borderColor: COLORS.border },
  statEmoji:     { fontSize: 20 },
  statValue:     { fontSize: 18, fontWeight: '700', color: COLORS.text },
  statLabel:     { fontSize: 10, color: COLORS.textSecondary, textAlign: 'center' },
  section:       { marginBottom: SPACING.xl },
  sectionTitle:  { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.md },
  menuRow:       { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 0.5, borderColor: COLORS.border },
  menuEmoji:     { fontSize: 22 },
  menuLabel:     { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.text },
  menuSub:       { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  menuArrow:     { fontSize: 16, color: COLORS.textMuted },
  txRow:         { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 0.5, borderColor: COLORS.border },
  txIcon:        { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  txDesc:        { fontSize: 14, fontWeight: '500', color: COLORS.text },
  txDate:        { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  txAmount:      { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  settingsCard:  { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 0.5, borderColor: COLORS.border, overflow: 'hidden' },
  toggleRow:     { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  toggleIcon:    { fontSize: 20 },
  toggleLabel:   { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.text },
  logoutBtn:     { backgroundColor: COLORS.errorLight, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.error + '30' },
  logoutText:    { fontSize: 16, fontWeight: '700', color: COLORS.error },
  version:       { textAlign: 'center', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md },
});