import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

// --- Fix: Define types locally ---
interface Coach {
  id: string;
  name: string;
  initials: string;
  color: string;
  available: boolean;
  specialties: string[];
  rating: number;
  reviews: number;
  experience: string;
  bio: string;
  sessionRate?: number;
}

interface CoachCardProps {
  coach: Coach;
  onBook?: () => void;
  onMessage?: () => void;
  onPress?: () => void;
  compact?: boolean;
  style?: ViewStyle;
}

// --- Fix: Define theme locally ---
const COLORS = {
  primary: '#185FA5', primaryDark: '#134c85', primaryLight: '#2a7bbd',
  secondary: '#1D9E75', amber: '#EF9F27', success: '#10B981', error: '#EF4444',
  errorLight: '#FEE2E2', background: '#0F0F1A', card: '#1A1A2E',
  text: '#FFFFFF', textSecondary: '#9CA3AF', textMuted: '#6B7280',
  border: 'rgba(255,255,255,0.08)',
};

const RADIUS = { sm: 6, md: 8, lg: 12, full: 9999 };
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };

// --- Fix: Create local Avatar component ---
interface AvatarProps {
  initials?: string;
  color?: string;
  size?: number;
  showOnline?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ initials = '?', color = COLORS.primary, size = 48, showOnline }) => {
  return (
    <View style={{ position: 'relative' }}>
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: color + '20', borderWidth: 1.5, borderColor: color + '40',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ color, fontSize: size * 0.35, fontWeight: '700' }}>
          {initials.slice(0, 2).toUpperCase()}
        </Text>
      </View>
      {showOnline && (
        <View style={{
          position: 'absolute', bottom: 0, right: 0,
          width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125,
          backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.card,
        }} />
      )}
    </View>
  );
};

// --- Fix: Create local Badge component ---
interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
  size?: 'xs' | 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ label, color = COLORS.primary, bgColor, size = 'sm' }) => {
  const sizeStyles = {
    xs: { px: 4, py: 1, fontSize: 9 },
    sm: { px: 6, py: 2, fontSize: 10 },
    md: { px: 8, py: 3, fontSize: 12 },
  };
  const s = sizeStyles[size];
  
  return (
    <View style={{
      backgroundColor: bgColor || color + '18',
      paddingHorizontal: s.px, paddingVertical: s.py, borderRadius: RADIUS.full,
    }}>
      <Text style={{ color, fontSize: s.fontSize, fontWeight: '600' }}>{label}</Text>
    </View>
  );
};

// --- Stars component ---
function Stars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: 12, color: i <= Math.round(rating) ? COLORS.amber : COLORS.border }}>★</Text>
      ))}
      <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginLeft: 2 }}>
        {rating} ({Math.floor(Math.random() * 50) + 20})
      </Text>
    </View>
  );
}

// --- CoachCard component ---
const CoachCard: React.FC<CoachCardProps> = ({
  coach,
  onBook,
  onMessage,
  onPress,
  compact = false,
  style,
}) => {
  if (compact) {
    return (
      <TouchableOpacity style={[styles.compact, style]} onPress={onPress} activeOpacity={0.85}>
        <Avatar initials={coach.initials} color={coach.color} size={48} showOnline={coach.available} />
        <View style={styles.compactInfo}>
          <Text style={styles.compactName}>{coach.name}</Text>
          <Text style={styles.compactSpec}>{coach.specialties.slice(0, 2).join(' · ')}</Text>
          <Stars rating={coach.rating} />
        </View>
        <View style={[styles.availDot, { backgroundColor: coach.available ? COLORS.success : COLORS.textMuted }]} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardTop}>
        <Avatar initials={coach.initials} color={coach.color} size={56} showOnline={coach.available} />
        <View style={styles.topInfo}>
          <Text style={styles.name}>{coach.name}</Text>
          <Stars rating={coach.rating} />
          <Text style={styles.meta}>{coach.reviews} reviews · {coach.experience} exp.</Text>
        </View>
        <View style={[styles.availPill, { backgroundColor: coach.available ? COLORS.primaryLight : '#F3F4F6' }]}>
          <Text style={[styles.availText, { color: coach.available ? COLORS.primaryDark : COLORS.textMuted }]}>
            {coach.available ? '● Today' : '○ Busy'}
          </Text>
        </View>
      </View>

      <View style={styles.specialties}>
        {coach.specialties.map((s) => (
          <Badge key={s} label={s} color={coach.color} bgColor={coach.color + '18'} size="sm" />
        ))}
        <Badge label={coach.experience} color={COLORS.textSecondary} size="sm" />
      </View>

      <Text style={styles.bio} numberOfLines={3}>{coach.bio}</Text>

      <View style={styles.rateRow}>
        <Text style={styles.rateLabel}>Session rate</Text>
        <Text style={styles.rateValue}>₱{coach.sessionRate?.toLocaleString() ?? '500'}/hr</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: coach.color, flex: 1 }]}
          onPress={onBook}
          disabled={!coach.available}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>📅 Book Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnOutline, { borderColor: coach.color }]}
          onPress={onMessage}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionBtnText, { color: coach.color }]}>💬</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 0.5, borderColor: COLORS.border, marginBottom: SPACING.md, gap: SPACING.md },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
  topInfo: { flex: 1, gap: 3 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: 12, color: COLORS.textSecondary },
  availPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full },
  availText: { fontSize: 11, fontWeight: '600' },
  specialties: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  bio: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md },
  rateLabel: { fontSize: 13, color: COLORS.textSecondary },
  rateValue: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  actions: { flexDirection: 'row', gap: SPACING.sm },
  actionBtn: { borderRadius: RADIUS.md, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, alignItems: 'center', justifyContent: 'center' },
  actionBtnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, width: 44 },
  actionBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  compact: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 0.5, borderColor: COLORS.border },
  compactInfo: { flex: 1, gap: 2 },
  compactName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  compactSpec: { fontSize: 12, color: COLORS.textSecondary },
  availDot: { width: 10, height: 10, borderRadius: 5 },
});

export default CoachCard;