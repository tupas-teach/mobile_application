import { Badge, Card, EmptyState } from '@/components/UI';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useBookingStore } from '@/store/bookingStore';
import { useGymStore } from '@/store/gymStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'] as const;

export default function MyBookingsScreen() {
  const [tab, setTab] = useState<typeof TABS[number]>('All');
  const { myBookings } = useBookingStore();
  const { bookedSessions, sessions } = useGymStore();

  const gymBookings = sessions
    .filter((s) => bookedSessions.includes(s.id))
    .map((s) => ({
      id: s.id, type: 'gym' as const, name: s.name,
      meta: `${s.time} · ${s.coach}`, status: 'confirmed' as const,
      amount: 0, color: s.color, canRefund: false,
    }));

  const courtBookings = myBookings.map((b) => ({
    id: b.id, type: 'court' as const, name: b.courtName,
    meta: `${b.date} · ${b.timeSlots.join(', ')}`, status: b.status,
    amount: b.totalAmount, color: COLORS.primary, canRefund: b.status === 'confirmed',
  }));

  const all = [...gymBookings, ...courtBookings];

  const filtered = tab === 'All'       ? all
    : tab === 'Upcoming'  ? all.filter((b) => b.status === 'confirmed' || b.status === 'pending')
    : tab === 'Completed' ? all.filter((b) => b.status === 'completed')
    : all.filter((b) => b.status === 'cancelled');

  const STATUS_COLOR: Record<string, string> = {
    confirmed: COLORS.primary, pending: COLORS.amber,
    completed: COLORS.success, cancelled: COLORS.error,
  };
  const STATUS_BG: Record<string, string> = {
    confirmed: COLORS.primaryLight, pending: '#FAEEDA',
    completed: COLORS.primaryLight, cancelled: COLORS.errorLight,
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>My Bookings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsRow}
        contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.sm }}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}
            style={[s.tabChip, tab === t && s.tabChipActive]}>
            <Text style={[s.tabLabel, tab === t && s.tabLabelActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={s.content}>
        {filtered.length === 0 ? (
          <EmptyState emoji="📅" title="No bookings yet"
            subtitle="Book a court or gym session to get started" />
        ) : (
          filtered.map((b) => (
            <Card key={b.id} style={s.bookingCard}>
              <View style={s.cardTop}>
                <View style={[s.typeBadge, {
                  backgroundColor: b.type === 'gym' ? COLORS.primaryLight : '#E6F1FB',
                }]}>
                  <Text style={[s.typeText, { color: b.type === 'gym' ? COLORS.primary : '#185FA5' }]}>
                    {b.type === 'gym' ? '🏋️ Gym' : '🏀 Court'}
                  </Text>
                </View>
                <Badge
                  label={b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  color={STATUS_COLOR[b.status] ?? COLORS.text}
                  bgColor={STATUS_BG[b.status] ?? COLORS.background}
                  size="sm"
                />
              </View>

              <Text style={s.bookingName}>{b.name}</Text>
              <Text style={s.bookingMeta}>{b.meta}</Text>
              {b.amount > 0 && (
                <Text style={s.bookingAmount}>₱{b.amount.toLocaleString()}</Text>
              )}

              {/* Action buttons */}
              <View style={s.actionRow}>
                {b.type === 'court' && b.status === 'confirmed' && (
                  <TouchableOpacity
                    onPress={() => router.push({
                      pathname: '/(shared)/receipt/[id]' as never,
                      params: { id: b.id },
                    })}
                    style={s.actionBtn}>
                    <Text style={s.actionBtnText}>📄 Receipt</Text>
                  </TouchableOpacity>
                )}
                {b.canRefund && (
                  <TouchableOpacity
                    onPress={() => router.push({
                      pathname: '/(shared)/refund' as never,
                      params: { bookingId: b.id },
                    })}
                    style={[s.actionBtn, s.refundBtn]}>
                    <Text style={s.refundBtnText}>↩ Request Refund</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          ))
        )}
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: COLORS.background },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:       { width: 40 },
  backText:      { fontSize: 22, color: COLORS.primary },
  title:         { fontSize: 18, fontWeight: '700', color: COLORS.text },
  tabsRow:       { maxHeight: 56, paddingVertical: SPACING.sm, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  tabChip:       { paddingHorizontal: SPACING.lg, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  tabChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabLabel:      { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  tabLabelActive:{ color: '#fff' },
  content:       { padding: SPACING.lg },
  bookingCard:   { marginBottom: SPACING.md },
  cardTop:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  typeBadge:     { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  typeText:      { fontSize: 11, fontWeight: '700' },
  bookingName:   { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  bookingMeta:   { fontSize: 13, color: COLORS.textSecondary },
  bookingAmount: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginTop: SPACING.sm },
  actionRow:     { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md, flexWrap: 'wrap' },
  actionBtn:     { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLight, borderWidth: 1, borderColor: COLORS.primary + '30' },
  actionBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.primaryDark },
  refundBtn:     { backgroundColor: COLORS.errorLight, borderColor: COLORS.error + '30' },
  refundBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.error },
});
