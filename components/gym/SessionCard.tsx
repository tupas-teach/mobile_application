// === SessionCard.tsx ===
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

// --- Fix: Define types locally ---
interface GymSession {
  id: string;
  name: string;
  type: 'HIIT' | 'Yoga' | 'Boxing' | 'Strength' | 'Cardio';
  intensity: 'Low' | 'Medium' | 'High';
  color: string;
  time: string;
  duration: number;
  coach: string;
  slots: number;
  bookedSlots: number;
}

interface SessionCardProps {
  session: GymSession;
  booked?: boolean;
  onBook?: () => void;
  onCancel?: () => void;
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

function IntensityDots({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const filled = { Low: 1, Medium: 2, High: 3 }[level];
  const color = { Low: COLORS.success, Medium: COLORS.amber, High: COLORS.error }[level];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={[dots.dot, { backgroundColor: i <= filled ? color : COLORS.border }]} />
      ))}
      <Text style={[dots.label, { color }]}>{level}</Text>
    </View>
  );
}

const dots = StyleSheet.create({
  dot: { width: 7, height: 7, borderRadius: 4 },
  label: { fontSize: 10, fontWeight: '600', marginLeft: 2 },
});

const TYPE_EMOJI: Record<string, string> = {
  HIIT: '🔥', Yoga: '🧘', Boxing: '🥊', Strength: '💪', Cardio: '🏃',
};

const SessionCard: React.FC<SessionCardProps> = ({ session, booked = false, onBook, onCancel, compact = false, style }) => {
  const slotsLeft = session.slots - session.bookedSlots;
  const full = slotsLeft === 0;
  const fillRatio = session.bookedSlots / session.slots;

  if (compact) {
    return (
      <TouchableOpacity style={[styles.compact, style]} activeOpacity={0.85} onPress={onBook}>
        <View style={[styles.compactDot, { backgroundColor: session.color }]} />
        <View style={styles.compactInfo}>
          <Text style={styles.compactName}>{session.name}</Text>
          <Text style={styles.compactMeta}>{session.time} · {session.coach}</Text>
        </View>
        {booked ? (
          <View style={styles.bookedPill}><Text style={styles.bookedPillText}>✓ Booked</Text></View>
        ) : (
          <Text style={styles.compactSlots}>{full ? 'Full' : `${slotsLeft} left`}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, style]}>
      <View style={[styles.accentBar, { backgroundColor: session.color }]} />
      <View style={styles.header}>
        <View style={[styles.typeTag, { backgroundColor: session.color + '20' }]}>
          <Text style={styles.typeEmoji}>{TYPE_EMOJI[session.type]}</Text>
          <Text style={[styles.typeLabel, { color: session.color }]}>{session.type}</Text>
        </View>
        <IntensityDots level={session.intensity} />
      </View>
      <Text style={styles.name}>{session.name}</Text>
      <Text style={styles.coach}>👤 {session.coach}</Text>
      <View style={styles.metaRow}>
        {[
          { icon: '🕐', text: session.time },
          { icon: '⏱️', text: `${session.duration} min` },
          { icon: '👥', text: full ? 'Full' : `${slotsLeft} slots left`, danger: full },
        ].map((m) => (
          <View key={m.icon} style={styles.metaItem}>
            <Text style={styles.metaIcon}>{m.icon}</Text>
            <Text style={[styles.metaText, m.danger && { color: COLORS.error }]}>{m.text}</Text>
          </View>
        ))}
      </View>
      <View style={styles.slotBarTrack}>
        <View style={[styles.slotBar, {
          width: `${fillRatio * 100}%`,
          backgroundColor: full ? COLORS.error : slotsLeft <= 2 ? COLORS.amber : COLORS.primary,
        }]} />
      </View>
      {booked ? (
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>✓ Booked — tap to cancel</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.bookBtn, full && styles.bookBtnDisabled, { backgroundColor: full ? COLORS.border : session.color }]}
          onPress={onBook}
          disabled={full}
          activeOpacity={0.8}
        >
          <Text style={styles.bookBtnText}>{full ? 'Class is Full' : 'Book Now'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 0.5, borderColor: COLORS.border, marginBottom: SPACING.md },
  accentBar: { height: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, paddingBottom: SPACING.sm },
  typeTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  typeEmoji: { fontSize: 13 },
  typeLabel: { fontSize: 12, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '800', color: COLORS.text, paddingHorizontal: SPACING.lg, marginBottom: 2 },
  coach: { fontSize: 13, color: COLORS.textSecondary, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  metaRow: { flexDirection: 'row', gap: SPACING.lg, paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaIcon: { fontSize: 13 },
  metaText: { fontSize: 13, color: COLORS.textSecondary },
  slotBarTrack: { height: 4, backgroundColor: COLORS.border, marginHorizontal: SPACING.lg, marginBottom: SPACING.md, borderRadius: 2, overflow: 'hidden' },
  slotBar: { height: 4, borderRadius: 2 },
  bookBtn: { margin: SPACING.lg, marginTop: 0, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center' },
  bookBtnDisabled: { backgroundColor: COLORS.border },
  bookBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  cancelBtn: { margin: SPACING.lg, marginTop: 0, backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center' },
  cancelBtnText: { color: COLORS.primaryDark, fontSize: 13, fontWeight: '700' },
  compact: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 0.5, borderColor: COLORS.border },
  compactDot: { width: 10, height: 10, borderRadius: 5 },
  compactInfo: { flex: 1 },
  compactName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  compactMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  compactSlots: { fontSize: 12, color: COLORS.textSecondary },
  bookedPill: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3 },
  bookedPillText: { fontSize: 11, color: COLORS.primaryDark, fontWeight: '700' },
});

export default SessionCard;