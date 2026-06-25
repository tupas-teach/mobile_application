import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

// --- Fix: Define theme locally ---
const COLORS = {
  primary: '#185FA5',
  primaryDark: '#134c85',
  primaryLight: '#2a7bbd',
  secondary: '#1D9E75',
  amber: '#EF9F27',
  success: '#10B981',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  background: '#0F0F1A',
  card: '#1A1A2E',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  border: 'rgba(255,255,255,0.08)',
};

const RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// --- Fix: Define TimeSlot type locally ---
interface TimeSlot {
  id: string;
  label: string;
  time?: string;
  available: boolean;
  price?: number;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selected: string | string[];
  onSelect: (id: string) => void;
  multi?: boolean;
  title?: string;
  style?: ViewStyle;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isSelected(id: string, selected: string | string[]): boolean {
  return Array.isArray(selected) ? selected.includes(id) : selected === id;
}

// ─── Component ────────────────────────────────────────────────────────────────

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selected,
  onSelect,
  multi = false,
  title,
  style,
}) => {
  const selectedCount = Array.isArray(selected) ? selected.length : selected ? 1 : 0;

  return (
    <View style={[styles.container, style]}>
      {(title || multi) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {multi && selectedCount > 0 && (
            <Text style={styles.selectionHint}>
              {selectedCount} slot{selectedCount > 1 ? 's' : ''} selected
            </Text>
          )}
        </View>
      )}

      <View style={styles.grid}>
        {slots.map((slot) => {
          const active = isSelected(slot.id, selected);
          const disabled = !slot.available;

          return (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.slot,
                active && styles.slotActive,
                disabled && styles.slotDisabled,
              ]}
              onPress={() => onSelect(slot.id)}
              disabled={disabled}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.slotLabel,
                  active && styles.slotLabelActive,
                  disabled && styles.slotLabelDisabled,
                ]}
              >
                {slot.label}
              </Text>

              {slot.price !== undefined && (
                <Text
                  style={[
                    styles.slotPrice,
                    active && styles.slotPriceActive,
                    disabled && styles.slotLabelDisabled,
                  ]}
                >
                  ₱{slot.price.toLocaleString()}
                </Text>
              )}

              {disabled && (
                <View style={styles.takenBadge}>
                  <Text style={styles.takenText}>Taken</Text>
                </View>
              )}

              {active && (
                <View style={styles.checkDot}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.legend}>
        {[
          { color: COLORS.primary,       bg: COLORS.primaryLight, label: 'Selected' },
          { color: COLORS.text,          bg: COLORS.card,         label: 'Available' },
          { color: COLORS.textMuted,     bg: '#F3F4F6',           label: 'Taken' },
        ].map(({ color, bg, label }) => (
          <View key={label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: bg, borderColor: color }]} />
            <Text style={styles.legendLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── Horizontal scroll variant ────────────────────────────────────────────────

interface TimeSlotScrollPickerProps {
  slots: TimeSlot[];
  selected: string;
  onSelect: (id: string) => void;
  style?: ViewStyle;
}

export const TimeSlotScrollPicker: React.FC<TimeSlotScrollPickerProps> = ({
  slots,
  selected,
  onSelect,
  style,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={style}
    contentContainerStyle={scrollStyles.content}
  >
    {slots.map((slot) => {
      const active = selected === slot.id;
      const disabled = !slot.available;
      return (
        <TouchableOpacity
          key={slot.id}
          style={[
            scrollStyles.chip,
            active && scrollStyles.chipActive,
            disabled && scrollStyles.chipDisabled,
          ]}
          onPress={() => onSelect(slot.id)}
          disabled={disabled}
          activeOpacity={0.75}
        >
          <Text
            style={[
              scrollStyles.chipLabel,
              active && scrollStyles.chipLabelActive,
              disabled && scrollStyles.chipLabelDisabled,
            ]}
          >
            {slot.label}
          </Text>
          {slot.price !== undefined && (
            <Text style={[
              scrollStyles.chipPrice, 
              active && scrollStyles.chipLabelActive, 
              disabled && scrollStyles.chipLabelDisabled
            ]}>
              ₱{slot.price}
            </Text>
          )}
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { gap: SPACING.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  selectionHint: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  slot: {
    width: '30.5%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    gap: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  slotActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary, borderWidth: 2 },
  slotDisabled: { backgroundColor: '#F3F4F6', borderColor: COLORS.border, opacity: 0.6 },
  slotLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  slotLabelActive: { color: COLORS.primaryDark },
  slotLabelDisabled: { color: COLORS.textMuted },
  slotPrice: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },
  slotPriceActive: { color: COLORS.primary, fontWeight: '700' },
  takenBadge: {
    position: 'absolute', top: 3, right: 3,
    backgroundColor: COLORS.border, borderRadius: RADIUS.sm,
    paddingHorizontal: 4, paddingVertical: 1,
  },
  takenText: { fontSize: 8, color: COLORS.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  checkDot: {
    position: 'absolute', top: 4, right: 4,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  checkIcon: { color: '#fff', fontSize: 9, fontWeight: '700' },
  legend: { flexDirection: 'row', gap: SPACING.lg, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 12, height: 12, borderRadius: 3, borderWidth: 1.5 },
  legendLabel: { fontSize: 11, color: COLORS.textSecondary },
});

const scrollStyles = StyleSheet.create({
  content: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, alignItems: 'center' },
  chip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, backgroundColor: COLORS.card,
    borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center', minWidth: 72,
  },
  chipActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  chipDisabled: { opacity: 0.5, backgroundColor: '#F3F4F6' },
  chipLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  chipLabelActive: { color: COLORS.primaryDark },
  chipLabelDisabled: { color: COLORS.textMuted },
  chipPrice: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '500', marginTop: 1 },
});

export default TimeSlotPicker;