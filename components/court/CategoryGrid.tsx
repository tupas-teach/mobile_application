import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

// --- Fix: Define types locally ---
export interface EventPackage {
  id: string;
  name: string;
  eventType: string;
  emoji: string;
  price: number;
  duration: string;
  maxGuests: number;
  includes: string[];
  color: string;
}

export type PaymentMethod = 'gcash' | 'paymaya' | 'card';

// --- Fix: Define theme locally (or import if you have it elsewhere) ---
const COLORS = {
  primary: '#185FA5',
  primaryDark: '#134c85',
  primaryLight: '#2a7bbd',
  secondary: '#1D9E75',
  amber: '#EF9F27',
  success: '#10B981',
  error: '#EF4444',
  errorLight: '#FEE2E2', // Added missing color
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
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

// ─── CategoryGrid ─────────────────────────────────────────────────────────────

interface CategoryItem {
  emoji: string;
  label: string;
  price: string;
  color: string;
  bg: string;
  available?: boolean;
}

interface CategoryGridProps {
  items: CategoryItem[];
  onSelect: (label: string) => void;
  style?: ViewStyle;
  columns?: 2 | 3;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  items,
  onSelect,
  style,
  columns = 3,
}) => (
  <View style={[grid.container, style]}>
    {items.map((item: CategoryItem) => ( // Added type annotation
      <TouchableOpacity
        key={item.label}
        style={[
          grid.cell,
          { backgroundColor: item.bg, width: columns === 3 ? '31%' : '48%' },
          item.available === false && grid.cellUnavail,
        ]}
        onPress={() => onSelect(item.label)}
        activeOpacity={0.8}
        disabled={item.available === false}
      >
        <Text style={grid.emoji}>{item.emoji}</Text>
        <Text style={[grid.label, { color: item.color }]}>{item.label}</Text>
        <Text style={grid.price}>{item.price}</Text>
        {item.available === false && (
          <View style={grid.unavailBadge}>
            <Text style={grid.unavailText}>Full</Text>
          </View>
        )}
      </TouchableOpacity>
    ))}
  </View>
);

const grid = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  cell: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  cellUnavail: {
    opacity: 0.5,
  },
  emoji: { fontSize: 32 },
  label: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  price: { fontSize: 11, color: COLORS.textSecondary },
  unavailBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  unavailText: { fontSize: 9, color: COLORS.error, fontWeight: '700' },
});

// ─── EventPackageCard ─────────────────────────────────────────────────────────

interface EventPackageCardProps {
  pkg: EventPackage;
  onBook?: () => void;
  onDetails?: () => void;
  compact?: boolean;
  style?: ViewStyle;
}

export const EventPackageCard: React.FC<EventPackageCardProps> = ({
  pkg,
  onBook,
  onDetails,
  compact = false,
  style,
}) => {
  if (compact) {
    return (
      <TouchableOpacity style={[evtCard.compact, style]} onPress={onDetails} activeOpacity={0.85}>
        <Text style={evtCard.compactEmoji}>{pkg.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={evtCard.compactName}>{pkg.name}</Text>
          <Text style={evtCard.compactMeta}>{pkg.duration} · {pkg.maxGuests} guests</Text>
        </View>
        <Text style={[evtCard.compactPrice, { color: pkg.color }]}>₱{pkg.price.toLocaleString()}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[evtCard.card, { borderLeftColor: pkg.color, borderLeftWidth: 4 }, style]}>
      <View style={evtCard.cardHeader}>
        <Text style={evtCard.cardEmoji}>{pkg.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={evtCard.cardName}>{pkg.name}</Text>
          <Text style={evtCard.cardType}>{pkg.eventType}</Text>
        </View>
        <View style={evtCard.priceCol}>
          <Text style={[evtCard.price, { color: pkg.color }]}>₱{pkg.price.toLocaleString()}</Text>
          <Text style={evtCard.priceSub}>{pkg.duration}</Text>
        </View>
      </View>
      <View style={evtCard.metaRow}>
        <Text style={evtCard.metaItem}>👥 {pkg.maxGuests} guests max</Text>
        <Text style={evtCard.metaItem}>⏱️ {pkg.duration}</Text>
      </View>
      <View style={evtCard.includes}>
        {pkg.includes.slice(0, 4).map((item: string) => (
          <Text key={item} style={[evtCard.includeItem, { color: pkg.color }]}>✓ {item}</Text>
        ))}
        {pkg.includes.length > 4 && (
          <Text style={evtCard.moreIncludes}>+{pkg.includes.length - 4} more</Text>
        )}
      </View>
      <TouchableOpacity
        style={[evtCard.bookBtn, { backgroundColor: pkg.color }]}
        onPress={onBook}
        activeOpacity={0.8}
      >
        <Text style={evtCard.bookBtnText}>Book {pkg.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const evtCard = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  cardEmoji: { fontSize: 32 },
  cardName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  cardType: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  priceCol: { alignItems: 'flex-end' },
  price: { fontSize: 18, fontWeight: '800' },
  priceSub: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  metaRow: { flexDirection: 'row', gap: SPACING.lg },
  metaItem: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  includes: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  includeItem: { fontSize: 12, fontWeight: '500' },
  moreIncludes: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  bookBtn: {
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  // Compact
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: '#1A1A2E',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: SPACING.sm,
  },
  compactEmoji: { fontSize: 24 },
  compactName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  compactMeta: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  compactPrice: { fontSize: 15, fontWeight: '800' },
});

// ─── BookingCalendar ──────────────────────────────────────────────────────────

interface BookingCalendarProps {
  selectedDate: string;          // ISO format: 'YYYY-MM-DD'
  onSelectDate: (date: string) => void;
  bookedDates?: string[];        // dates that are fully booked
  style?: ViewStyle;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  onSelectDate,
  bookedDates = [],
  style,
}) => {
  const today = new Date();
  const days: { date: string; label: string; day: string; past: boolean }[] = [];

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    days.push({
      date: iso,
      day: d.toLocaleDateString('en-PH', { weekday: 'short' }),
      label: d.toLocaleDateString('en-PH', { day: 'numeric' }),
      past: i < 0,
    });
  }

  return (
    <View style={[cal.container, style]}>
      <Text style={cal.month}>
        {today.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={cal.strip}>
          {days.map((d) => {
            const isSelected = selectedDate === d.date;
            const isBooked = bookedDates.includes(d.date);
            const isToday = d.date === today.toISOString().split('T')[0];
            return (
              <TouchableOpacity
                key={d.date}
                style={[
                  cal.day,
                  isSelected && cal.daySelected,
                  isBooked && cal.dayBooked,
                  isToday && !isSelected && cal.dayToday,
                ]}
                onPress={() => !isBooked && onSelectDate(d.date)}
                disabled={isBooked || d.past}
                activeOpacity={0.8}
              >
                <Text style={[cal.dayName, isSelected && cal.dayNameSelected]}>{d.day}</Text>
                <Text style={[cal.dayNum, isSelected && cal.dayNumSelected]}>{d.label}</Text>
                {isBooked && <View style={cal.bookedDot} />}
                {isToday && <View style={[cal.todayLine, { backgroundColor: isSelected ? '#fff' : COLORS.primary }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const cal = StyleSheet.create({
  container: { gap: SPACING.sm },
  month: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 2 },
  strip: { flexDirection: 'row', gap: SPACING.sm, paddingVertical: 4 },
  day: {
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    minWidth: 52,
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 3,
    position: 'relative',
  },
  daySelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dayBooked:   { opacity: 0.35 },
  dayToday:    { borderColor: COLORS.primary },
  dayName: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  dayNameSelected: { color: 'rgba(255,255,255,0.8)' },
  dayNum: { fontSize: 16, fontWeight: '700', color: '#fff' },
  dayNumSelected: { color: '#fff' },
  bookedDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.error,
  },
  todayLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
  },
});