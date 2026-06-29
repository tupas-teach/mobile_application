import { Badge, EmptyState, IntensityBar } from '@/components/UI';
import { COLORS, RADIUS, SHADOW, SPACING } from '@/constants/theme';
import { useGymStore } from '@/store/gymStore';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ── Muscle-group filters ──────────────────────────────────────────────────────
const FILTERS = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio'] as const;
type FilterType = typeof FILTERS[number];

// ── Per-muscle-group metadata ─────────────────────────────────────────────────
const TYPE_META: Record<string, { emoji: string; calories: string; focus: string }> = {
  Chest:     { emoji: '🏋️', calories: '250–400 kcal', focus: 'Pecs, front delts & triceps'  },
  Back:      { emoji: '🧗', calories: '280–420 kcal', focus: 'Lats, traps & rear delts'      },
  Shoulders: { emoji: '🔝', calories: '200–350 kcal', focus: 'Delts, rotator cuff & traps'   },
  Arms:      { emoji: '💪', calories: '150–280 kcal', focus: 'Biceps, triceps & forearms'    },
  Legs:      { emoji: '🦵', calories: '350–600 kcal', focus: 'Quads, hamstrings & glutes'    },
  Core:      { emoji: '🌀', calories: '180–300 kcal', focus: 'Abs, obliques & lower back'    },
  Cardio:    { emoji: '🏃', calories: '400–700 kcal', focus: 'Heart health & fat burn'       },
};

export default function SessionScreen() {
  const { sessions, bookedSessions, bookSession, cancelBooking } = useGymStore();
  const router = useRouter();
  const [query,  setQuery]  = useState('');
  const [filter, setFilter] = useState<FilterType>('All');

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const matchFilter = filter === 'All' || s.type === filter;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q)  ||
        s.coach.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [sessions, filter, query]);

  const handleBook = (id: string, name: string) => {
    const isBooked = bookedSessions.includes(id);
    if (isBooked) {
      Alert.alert('Cancel Booking', `Cancel your booking for ${name}?`, [
        { text: 'Keep',           style: 'cancel'      },
        { text: 'Cancel Booking', style: 'destructive', onPress: () => cancelBooking(id) },
      ]);
    } else {
      bookSession(id);
      Alert.alert('Booked! 💪', `You're registered for ${name}. See you at the gym!`);
    }
  };

  // Summary counts
  const bookedCount = sessions.filter((s) => bookedSessions.includes(s.id)).length;

  return (
    <View style={s.container}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Workout Classes 💪</Text>
          <Text style={s.sub}>{sessions.length} sessions today · {bookedCount} booked</Text>
        </View>
        {bookedCount > 0 && (
          <View style={s.myBadge}>
            <Text style={s.myBadgeText}>My Plan: {bookedCount}</Text>
          </View>
        )}
      </View>

      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <View style={s.searchWrap}>
        <View style={s.searchBar}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Search muscle group, coach or session..."
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={s.clearBtn}>
              <Text style={s.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Filter chips ───────────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.filtersRow}
        contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.sm }}
      >
        {FILTERS.map((f) => {
          const meta = TYPE_META[f];
          return (
            <TouchableOpacity
              key={f}
              style={[s.chip, filter === f && s.chipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.chipText, filter === f && s.chipTextActive]}>
                {meta ? `${meta.emoji} ${f}` : f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Session list ───────────────────────────────────────────────────── */}
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <EmptyState
            emoji="🏋️"
            title="No sessions found"
            subtitle="Try a different muscle group or search"
          />
        ) : (
          filtered.map((session) => {
            const isBooked  = bookedSessions.includes(session.id);
            const isFull    = session.bookedSlots >= session.slots;
            const slotsLeft = session.slots - session.bookedSlots;
            const pct       = (session.bookedSlots / session.slots) * 100;
            const meta      = TYPE_META[session.type] ?? { emoji: '🏅', calories: '300+ kcal', focus: 'General fitness' };

            return (
              <View key={session.id} style={[s.card, isBooked && s.cardBooked]}>
                {/* Color accent bar */}
                <View style={[s.accentBar, { backgroundColor: session.color }]} />

                <View style={s.cardContent}>

                  {/* ── Top row: type badge + time + booked badge ─────────── */}
                  <View style={s.cardTop}>
                    <View style={[s.typeBadge, { backgroundColor: session.color + '22' }]}>
                      <Text style={s.typeEmoji}>{meta.emoji}</Text>
                      <Text style={[s.typeBadgeText, { color: session.color }]}>{session.type}</Text>
                    </View>
                    <Text style={s.time}>🕐 {session.time}</Text>
                    {isBooked && (
                      <Badge label="Booked ✓" color={COLORS.primaryDark} bgColor={COLORS.primaryLight} size="sm" />
                    )}
                  </View>

                  {/* ── Session name ─────────────────────────────────────── */}
                  <Text style={s.name}>{session.name}</Text>

                  {/* ── Coach + duration ─────────────────────────────────── */}
                  <Text style={s.coach}>👤 {session.coach} · ⏱ {session.duration} min</Text>

                  {/* ── Fitness stats row ────────────────────────────────── */}
                  <View style={s.statsRow}>
                    <View style={s.statChip}>
                      <Text style={s.statIcon}>🔥</Text>
                      <Text style={s.statText}>{meta.calories}</Text>
                    </View>
                    <View style={s.statChip}>
                      <Text style={s.statIcon}>🎯</Text>
                      <Text style={s.statText}>{meta.focus}</Text>
                    </View>
                  </View>

                  {/* ── Intensity bar ────────────────────────────────────── */}
                  <View style={s.intensityRow}>
                    <Text style={s.intensityLabel}>Intensity</Text>
                    <IntensityBar level={session.intensity} />
                  </View>

                  {/* ── Slots progress bar ───────────────────────────────── */}
                  <View style={s.slotsRow}>
                    <View style={s.barTrack}>
                      <View
                        style={[
                          s.barFill,
                          {
                            width: `${pct}%` as any,
                            backgroundColor: isFull ? COLORS.error : session.color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[s.slotsText, { color: isFull ? COLORS.error : COLORS.textSecondary }]}>
                      {isFull ? '🚫 Full' : `${slotsLeft}/${session.slots} slots`}
                    </Text>
                  </View>

                  {/* ── Book button ──────────────────────────────────────── */}
                  <TouchableOpacity
                    style={[
                      s.bookBtn,
                      isBooked           && s.bookBtnBooked,
                      isFull && !isBooked && s.bookBtnFull,
                    ]}
                    onPress={() => handleBook(session.id, session.name)}
                    disabled={isFull && !isBooked}
                    activeOpacity={0.85}
                  >
                    <Text style={[s.bookBtnText, isBooked && s.bookBtnTextBooked]}>
                      {isBooked
                        ? `${meta.emoji}  You're in · Tap to cancel`
                        : isFull
                        ? '🚫 Class Full'
                        : `${meta.emoji}  Join Class`}
                    </Text>
                  </TouchableOpacity>

                  {/* ── Track Workout button (booked sessions only) ───────── */}
                  {isBooked && (
                    <TouchableOpacity
                      style={s.trackBtn}
                      onPress={() =>
                        router.push({
                          pathname: '/workout-tracker' as any,
                          params:   { sessionName: session.name },
                               })
                      }
                      activeOpacity={0.85}
                    >
                      <Text style={s.trackBtnText}>📊  Track Workout</Text>
                    </TouchableOpacity>
                  )}

                </View>
              </View>
            );
          })
        )}
        <View style={{ height: SPACING.xxl * 2 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container:         { flex: 1, backgroundColor: COLORS.background },

  // Header
  header:            { paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title:             { fontSize: 24, fontWeight: '800', color: COLORS.text },
  sub:               { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  myBadge:           { backgroundColor: COLORS.primaryLight, paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.full, alignSelf: 'flex-start', marginTop: 4 },
  myBadgeText:       { fontSize: 12, fontWeight: '700', color: COLORS.primaryDark },

  // Search
  searchWrap:        { backgroundColor: COLORS.card, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm, paddingTop: SPACING.sm },
  searchBar:         { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border, height: 44 },
  searchIcon:        { fontSize: 16, marginRight: SPACING.sm },
  searchInput:       { flex: 1, fontSize: 15, color: COLORS.text, height: '100%' },
  clearBtn:          { padding: 6 },
  clearText:         { fontSize: 14, color: COLORS.textMuted },

  // Filters
  filtersRow:        { maxHeight: 52, paddingVertical: SPACING.sm, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  chip:              { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border },
  chipActive:        { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText:          { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  chipTextActive:    { color: '#fff' },

  // Cards
  content:           { padding: SPACING.lg },
  card:              { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, marginBottom: SPACING.md, overflow: 'hidden', borderWidth: 0.5, borderColor: COLORS.border, ...SHADOW.sm },
  cardBooked:        { borderColor: COLORS.primary, borderWidth: 1.5 },
  accentBar:         { width: 5 },
  cardContent:       { flex: 1, padding: SPACING.md },

  // Card top row
  cardTop:           { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm, flexWrap: 'wrap' },
  typeBadge:         { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full },
  typeEmoji:         { fontSize: 13 },
  typeBadgeText:     { fontSize: 11, fontWeight: '700' },
  time:              { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500', flex: 1 },

  // Session info
  name:              { fontSize: 17, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  coach:             { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.sm },

  // Fitness stats
  statsRow:          { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm, flexWrap: 'wrap' },
  statChip:          { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.background, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: COLORS.border },
  statIcon:          { fontSize: 11 },
  statText:          { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },

  // Intensity
  intensityRow:      { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  intensityLabel:    { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', minWidth: 56 },

  // Slots bar
  slotsRow:          { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  barTrack:          { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  barFill:           { height: '100%', borderRadius: 3 },
  slotsText:         { fontSize: 11, fontWeight: '600', minWidth: 70, textAlign: 'right' },

  // Book button
  bookBtn:           { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 11, alignItems: 'center' },
  bookBtnBooked:     { backgroundColor: COLORS.primaryLight },
  bookBtnFull:       { backgroundColor: COLORS.border },
  bookBtnText:       { color: '#fff', fontWeight: '700', fontSize: 14 },
  bookBtnTextBooked: { color: COLORS.primaryDark },

  // Track workout button
  trackBtn:          { marginTop: 8, borderRadius: RADIUS.md, paddingVertical: 9, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.primary },
  trackBtnText:      { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
});
