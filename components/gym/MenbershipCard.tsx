// === MembershipCard.tsx ===
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

// --- Fix: Define type locally ---
type MembershipTier = 'basic' | 'premium' | 'vip';

interface MembershipCardProps {
  tier: MembershipTier;
  userName: string;
  memberId?: string;
  expiry?: string;
  points?: number;
  onUpgrade?: () => void;
  onDownload?: () => void;
  style?: ViewStyle;
}

// --- Fix: Define theme locally ---
const RADIUS = { sm: 6, md: 8, lg: 12, xl: 16, full: 9999 };
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

const TIER_CONFIG: Record<MembershipTier, {
  label: string;
  emoji: string;
  gradient: [string, string];
  bg: string;
  accent: string;
  price: string;
}> = {
  basic: { label: 'Basic', emoji: '🏃', gradient: ['#185FA5', '#2E86C1'], bg: '#1a4a7a', accent: '#5BA4D4', price: '₱599' },
  premium: { label: 'Premium', emoji: '⭐', gradient: ['#0F6E56', '#1D9E75'], bg: '#0d5c46', accent: '#4DC9A0', price: '₱1,299' },
  vip: { label: 'VIP Elite', emoji: '👑', gradient: ['#B45309', '#EF9F27'], bg: '#8a3e05', accent: '#FBC56A', price: '₱2,499' },
};

const MembershipCard: React.FC<MembershipCardProps> = ({
  tier,
  userName,
  memberId = 'FZ-001234',
  expiry,
  points = 0,
  onUpgrade,
  onDownload,
  style,
}) => {
  const cfg = TIER_CONFIG[tier];

  return (
    <View style={[styles.card, { backgroundColor: cfg.bg }, style]}>
      <View style={[styles.circle1, { backgroundColor: cfg.accent + '20' }]} />
      <View style={[styles.circle2, { backgroundColor: cfg.accent + '10' }]} />
      <View style={styles.topRow}>
        <View>
          <Text style={styles.gymName}>FLEX<Text style={{ color: cfg.accent }}>ZONE</Text></Text>
          <Text style={styles.gymSub}>SmartGym Membership</Text>
        </View>
        <View style={styles.tierBadge}>
          <Text style={styles.tierEmoji}>{cfg.emoji}</Text>
          <Text style={[styles.tierLabel, { color: cfg.accent }]}>{cfg.label}</Text>
        </View>
      </View>
      <Text style={styles.memberName}>{userName.toUpperCase()}</Text>
      <Text style={styles.memberId}>{memberId}</Text>
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.metaLabel}>VALID UNTIL</Text>
          <Text style={styles.metaValue}>{expiry ?? '—'}</Text>
        </View>
        <View>
          <Text style={styles.metaLabel}>POINTS</Text>
          <Text style={styles.metaValue}>{points.toLocaleString()} pts</Text>
        </View>
        <View>
          <Text style={styles.metaLabel}>PLAN</Text>
          <Text style={styles.metaValue}>{cfg.price}/mo</Text>
        </View>
      </View>
      <View style={styles.qrRow}>
        <View style={styles.qrBox}>
          <Text style={styles.qrText}>▦ QR Check-In</Text>
        </View>
        <View style={styles.cardActions}>
          {onDownload && (
            <TouchableOpacity style={[styles.cardBtn, { borderColor: cfg.accent }]} onPress={onDownload}>
              <Text style={[styles.cardBtnText, { color: cfg.accent }]}>📄 Certificate</Text>
            </TouchableOpacity>
          )}
          {tier !== 'vip' && onUpgrade && (
            <TouchableOpacity style={[styles.cardBtn, { backgroundColor: cfg.accent, borderColor: cfg.accent }]} onPress={onUpgrade}>
              <Text style={[styles.cardBtnText, { color: cfg.bg }]}>⬆ Upgrade</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: RADIUS.xl, padding: SPACING.xl, overflow: 'hidden', position: 'relative', minHeight: 200 },
  circle1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, top: -60, right: -60 },
  circle2: { position: 'absolute', width: 150, height: 150, borderRadius: 75, bottom: -40, left: -30 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xl },
  gymName: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  gymSub: { fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 },
  tierBadge: { alignItems: 'flex-end' },
  tierEmoji: { fontSize: 22 },
  tierLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginTop: 2 },
  memberName: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: 2, marginBottom: 2 },
  memberId: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', letterSpacing: 2, marginBottom: SPACING.lg },
  bottomRow: { flexDirection: 'row', gap: SPACING.xl, marginBottom: SPACING.lg },
  metaLabel: { fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 3 },
  metaValue: { fontSize: 13, fontWeight: '700', color: '#fff' },
  qrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  qrBox: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: RADIUS.sm, padding: 8 },
  qrText: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' },
  cardActions: { gap: SPACING.sm, alignItems: 'flex-end' },
  cardBtn: { borderWidth: 1, borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 5 },
  cardBtnText: { fontSize: 11, fontWeight: '700' },
});

export default MembershipCard;