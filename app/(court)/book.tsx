import { Button, Card } from '@/components/UI';
import { COLORS, RADIUS, SHADOW, SPACING } from '@/constants/theme';
import { COURTS, TIME_SLOTS, useBookingStore } from '@/store/bookingStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i);
  return { label: d.toLocaleDateString('en-PH', { weekday: 'short' }), date: d.toLocaleDateString('en-PH', { day: 'numeric' }), full: d.toISOString().split('T')[0] };
});

export default function BookCourtScreen() {
  const { selectedCourt, setSelectedCourt, selectedDate, setSelectedDate, selectedSlots, toggleSlot } = useBookingStore();
  const [guestCount, setGuestCount] = useState('');
  const [notes, setNotes]           = useState('');
  const court  = selectedCourt ?? COURTS[0];
  const hours  = selectedSlots.length;
  const total  = court.pricePerHour * Math.max(1, hours);

  const handleBook = () => {
    if (selectedSlots.length === 0) { Alert.alert('Select time', 'Please select at least one time slot.'); return; }
    router.push({ pathname: '/(shared)/payment' as never, params: { type: 'court', courtId: court.id, courtName: court.name, total: total.toString(), slots: selectedSlots.join(','), date: selectedDate } });
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.title}>Book a Court</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Court selector */}
        <Text style={s.sectionLabel}>Select Court</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.lg }}>
          {COURTS.filter((c) => c.id !== 'c6').map((c) => (
            <TouchableOpacity key={c.id}
              style={[s.courtChip, court.id === c.id && s.courtChipActive]}
              onPress={() => setSelectedCourt(c)}>
              <Text style={s.courtChipEmoji}>{c.image}</Text>
              <Text style={[s.courtChipLabel, court.id === c.id && s.courtChipLabelActive]}>{c.name.split(' ').slice(0, 2).join(' ')}</Text>
              <Text style={[s.courtChipPrice, court.id === c.id && { color: COLORS.primaryDark }]}>₱{c.pricePerHour}/hr</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selected court info */}
        <Card style={s.courtInfo}>
          <View style={s.courtInfoRow}>
            <Text style={{ fontSize: 36 }}>{court.image}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.courtInfoName}>{court.name}</Text>
              <Text style={s.courtInfoMeta}>Capacity: {court.capacity} pax · ₱{court.pricePerHour}/hr</Text>
            </View>
            <View style={[s.availPill, { backgroundColor: court.available ? COLORS.primaryLight : COLORS.errorLight }]}>
              <Text style={[s.availText, { color: court.available ? COLORS.primaryDark : COLORS.error }]}>
                {court.available ? 'Available' : 'Busy'}
              </Text>
            </View>
          </View>
          <View style={s.amenitiesRow}>
            {court.amenities.map((a) => <Text key={a} style={s.amenityTag}>{a}</Text>)}
          </View>
        </Card>

        {/* Date picker */}
        <Text style={s.sectionLabel}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.lg }}>
          {DATES.map((d) => (
            <TouchableOpacity key={d.full}
              style={[s.dateChip, selectedDate === d.full && s.dateChipActive]}
              onPress={() => setSelectedDate(d.full)}>
              <Text style={[s.dateDow, selectedDate === d.full && s.dateActiveText]}>{d.label}</Text>
              <Text style={[s.dateNum, selectedDate === d.full && s.dateActiveText]}>{d.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time slots */}
        <Text style={s.sectionLabel}>Select Time Slots</Text>
        <Text style={s.slotHint}>Tap multiple slots to extend duration</Text>
        <View style={s.slotsGrid}>
          {TIME_SLOTS.map((slot) => {
            const selected = selectedSlots.includes(slot.id);
            return (
              <TouchableOpacity key={slot.id}
                style={[s.slot, selected && s.slotSelected, !slot.available && s.slotUnavail]}
                onPress={() => slot.available && toggleSlot(slot.id)}
                disabled={!slot.available}>
                <Text style={[s.slotTime, selected && s.slotTimeSelected, !slot.available && s.slotTimeUnavail]}>{slot.time}</Text>
                {!slot.available && <Text style={s.slotTakenLabel}>Taken</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Guest count */}
        <Text style={s.sectionLabel}>Number of players/guests</Text>
        <TextInput style={s.input} placeholder={`Max ${court.capacity}`} placeholderTextColor={COLORS.textMuted}
          value={guestCount} onChangeText={setGuestCount} keyboardType="number-pad" />

        {/* Notes */}
        <Text style={s.sectionLabel}>Special requests (optional)</Text>
        <TextInput style={[s.input, s.textarea]} placeholder="e.g. Need extra chairs, specific setup..."
          placeholderTextColor={COLORS.textMuted} value={notes} onChangeText={setNotes} multiline numberOfLines={3} />

        {/* Summary */}
        {selectedSlots.length > 0 && (
          <Card style={s.summaryCard}>
            <Text style={s.summaryTitle}>Booking Summary</Text>
            {[
              ['Court', court.name],
              ['Date', selectedDate],
              ['Duration', `${hours} hour(s)`],
              ['Rate', `₱${court.pricePerHour}/hr`],
            ].map(([k, v]) => (
              <View key={k} style={s.summaryRow}>
                <Text style={s.summaryKey}>{k}</Text>
                <Text style={s.summaryVal}>{v}</Text>
              </View>
            ))}
            <View style={[s.summaryRow, s.summaryTotalRow]}>
              <Text style={s.totalLabel}>Total</Text>
              <Text style={s.totalValue}>₱{total.toLocaleString()}</Text>
            </View>
          </Card>
        )}

        <Button title={selectedSlots.length > 0 ? `Proceed to Payment · ₱${total.toLocaleString()}` : 'Select a time slot to book'}
          onPress={handleBook} disabled={selectedSlots.length === 0} style={{ marginTop: SPACING.sm }} />

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:          { flex: 1, backgroundColor: COLORS.background },
  header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:            { width: 40, alignItems: 'center' },
  backText:           { fontSize: 22, color: COLORS.primary },
  title:              { fontSize: 18, fontWeight: '700', color: COLORS.text },
  content:            { padding: SPACING.lg },
  sectionLabel:       { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm },
  courtChip:          { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginRight: SPACING.sm, alignItems: 'center', minWidth: 110, borderWidth: 1.5, borderColor: COLORS.border, ...SHADOW.sm },
  courtChipActive:    { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  courtChipEmoji:     { fontSize: 24, marginBottom: 4 },
  courtChipLabel:     { fontSize: 12, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  courtChipLabelActive:{ color: COLORS.primaryDark },
  courtChipPrice:     { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  courtInfo:          { marginBottom: SPACING.lg },
  courtInfoRow:       { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm },
  courtInfoName:      { fontSize: 15, fontWeight: '700', color: COLORS.text },
  courtInfoMeta:      { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  availPill:          { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full },
  availText:          { fontSize: 11, fontWeight: '700' },
  amenitiesRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  amenityTag:         { fontSize: 11, color: COLORS.textSecondary, backgroundColor: COLORS.background, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  dateChip:           { alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginRight: SPACING.sm, borderRadius: RADIUS.md, backgroundColor: COLORS.card, minWidth: 60, borderWidth: 1.5, borderColor: COLORS.border },
  dateChipActive:     { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dateDow:            { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },
  dateNum:            { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  dateActiveText:     { color: '#fff' },
  slotHint:           { fontSize: 12, color: COLORS.textSecondary, marginBottom: SPACING.md, marginTop: -SPACING.xs },
  slotsGrid:          { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  slot:               { paddingHorizontal: SPACING.md, paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center' },
  slotSelected:       { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  slotUnavail:        { backgroundColor: COLORS.background, borderColor: COLORS.border, opacity: 0.45 },
  slotTime:           { fontSize: 13, fontWeight: '600', color: COLORS.text },
  slotTimeSelected:   { color: '#fff' },
  slotTimeUnavail:    { color: COLORS.textMuted, textDecorationLine: 'line-through' },
  slotTakenLabel:     { fontSize: 9, color: COLORS.error, fontWeight: '600', marginTop: 2 },
  input:              { backgroundColor: COLORS.card, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, padding: SPACING.md, fontSize: 15, color: COLORS.text, marginBottom: SPACING.lg },
  textarea:           { height: 80, textAlignVertical: 'top' },
  summaryCard:        { marginBottom: SPACING.lg },
  summaryTitle:       { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  summaryRow:         { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  summaryKey:         { fontSize: 13, color: COLORS.textSecondary },
  summaryVal:         { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  summaryTotalRow:    { borderBottomWidth: 0, marginTop: 4, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm },
  totalLabel:         { fontSize: 16, fontWeight: '700', color: COLORS.text },
  totalValue:         { fontSize: 20, fontWeight: '800', color: COLORS.primary },
});