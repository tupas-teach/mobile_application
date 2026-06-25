import { Button } from '@/components/UI';
import { COLORS, RADIUS, SHADOW, SPACING } from '@/constants/theme';
import { useBookingStore } from '@/store/bookingStore';
import { useCartStore } from '@/store/cartStore';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const REFUND_REASONS = [
  'Change of plans',
  'Emergency / health issue',
  'Booked wrong date or time',
  'Booked wrong court',
  'Duplicate booking',
  'Other reason',
];

const REFUND_POLICY = [
  { days: '7+ days before',  pct: 100, color: COLORS.success,  label: 'Full refund'    },
  { days: '3–6 days before', pct: 50,  color: COLORS.amber,    label: '50% refund'     },
  { days: 'Within 48 hours', pct: 0,   color: COLORS.error,    label: 'No refund'      },
];

export default function RefundScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { myBookings, cancelBooking } = useBookingStore();
  const { transactions }              = useCartStore();

  const booking = myBookings.find((b) => b.id === bookingId);
  const tx      = transactions.find((t) => t.bookingId === bookingId || t.id === bookingId);

  const [reason,  setReason]  = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Calculate eligibility
  const bookingDate  = booking ? new Date(booking.date) : new Date();
  const daysUntil    = Math.ceil((bookingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const refundPct    = daysUntil >= 7 ? 100 : daysUntil >= 3 ? 50 : 0;
  const refundAmount = booking ? Math.round((booking.totalAmount * refundPct) / 100) : 0;
  const isEligible   = refundPct > 0;

  const handleSubmit = async () => {
    if (!reason) { Alert.alert('Required', 'Please select a reason.'); return; }
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 1500));
    if (booking) cancelBooking(booking.id);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.replace('/(shared)/my-bookings' as never)} style={s.backBtn}>
            <Text style={s.backText}>←</Text>
          </TouchableOpacity>
          <Text style={s.title}>Refund Request</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={s.successWrap}>
          <View style={s.successCircle}><Text style={{ fontSize: 48 }}>✅</Text></View>
          <Text style={s.successTitle}>Request Submitted!</Text>
          <Text style={s.successSub}>
            Your refund request has been received.{'\n'}
            {refundPct > 0 ? `₱${refundAmount.toLocaleString()} will be credited within 3–5 business days.` : 'Our team will review your case.'}
          </Text>
          <View style={s.refNumCard}>
            <Text style={s.refNumLabel}>Reference</Text>
            <Text style={s.refNum}>REF-{Date.now().toString(36).toUpperCase()}</Text>
          </View>
          <Button title="Back to My Bookings" onPress={() => router.replace('/(shared)/my-bookings' as never)} style={{ width: '100%', marginTop: SPACING.xl }} />
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Request Refund</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Booking summary */}
        {booking && (
          <View style={s.bookingSummary}>
            <Text style={s.bookingEmoji}>🏀</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.bookingName}>{booking.courtName}</Text>
              <Text style={s.bookingMeta}>{booking.date} · {booking.timeSlots.join(', ')}</Text>
              <Text style={s.bookingAmount}>₱{booking.totalAmount.toLocaleString()}</Text>
            </View>
          </View>
        )}

        {/* Refund policy */}
        <Text style={s.sectionTitle}>Refund Policy</Text>
        <View style={s.policyCard}>
          {REFUND_POLICY.map((p, i) => (
            <View key={i} style={[s.policyRow, i < REFUND_POLICY.length - 1 && s.policyDivider]}>
              <Text style={s.policyDays}>{p.days}</Text>
              <View style={[s.policyBadge, { backgroundColor: p.color + '20' }]}>
                <Text style={[s.policyLabel, { color: p.color }]}>{p.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Eligibility result */}
        <View style={[s.eligibilityCard, { backgroundColor: isEligible ? COLORS.primaryLight : COLORS.errorLight, borderColor: isEligible ? COLORS.primary : COLORS.error }]}>
          <Text style={s.eligibilityEmoji}>{isEligible ? '✅' : '❌'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[s.eligibilityTitle, { color: isEligible ? COLORS.primaryDark : COLORS.error }]}>
              {isEligible ? `Eligible for ${refundPct}% refund` : 'Not eligible for refund'}
            </Text>
            <Text style={[s.eligibilitySub, { color: isEligible ? COLORS.primary : COLORS.error }]}>
              {isEligible
                ? `You will receive ₱${refundAmount.toLocaleString()} back`
                : `Booking is within 48 hours. Contact support for exceptions.`}
            </Text>
          </View>
        </View>

        {/* Reason selector */}
        <Text style={s.sectionTitle}>Reason for refund *</Text>
        <View style={s.reasonsGrid}>
          {REFUND_REASONS.map((r) => (
            <TouchableOpacity key={r} style={[s.reasonChip, reason === r && s.reasonChipActive]}
              onPress={() => setReason(r)}>
              <Text style={[s.reasonText, reason === r && s.reasonTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Additional details */}
        <Text style={s.sectionTitle}>Additional details (optional)</Text>
        <TextInput
          style={s.textarea}
          placeholder="Provide any additional context for your request..."
          placeholderTextColor={COLORS.textMuted}
          value={details}
          onChangeText={setDetails}
          multiline
          numberOfLines={4}
        />

        {/* Warning */}
        {!isEligible && (
          <View style={s.warningCard}>
            <Text style={s.warningText}>
              ⚠️ Your booking is within the no-refund window. You can still submit a request and our team will review it within 24 hours. Contact us at +63 32 888 1234 for urgent cases.
            </Text>
          </View>
        )}

        <Button
          title={loading ? 'Submitting...' : 'Submit Refund Request'}
          onPress={handleSubmit}
          loading={loading}
          style={{ marginTop: SPACING.lg }}
        />

        <TouchableOpacity style={s.cancelLink} onPress={() => router.back()}>
          <Text style={s.cancelLinkText}>Cancel — keep my booking</Text>
        </TouchableOpacity>

        <View style={{ height: SPACING.xxl * 2 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:         { flex: 1, backgroundColor: COLORS.background },
  header:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:           { width: 40 },
  backText:          { fontSize: 22, color: COLORS.primary },
  title:             { fontSize: 18, fontWeight: '700', color: COLORS.text },
  content:           { padding: SPACING.lg },
  bookingSummary:    { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 0.5, borderColor: COLORS.border, ...SHADOW.sm },
  bookingEmoji:      { fontSize: 32 },
  bookingName:       { fontSize: 15, fontWeight: '700', color: COLORS.text },
  bookingMeta:       { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  bookingAmount:     { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginTop: 4 },
  sectionTitle:      { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm, marginTop: SPACING.lg },
  policyCard:        { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 0.5, borderColor: COLORS.border },
  policyRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  policyDivider:     { borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  policyDays:        { fontSize: 13, color: COLORS.text },
  policyBadge:       { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  policyLabel:       { fontSize: 12, fontWeight: '700' },
  eligibilityCard:   { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, borderRadius: RADIUS.lg, padding: SPACING.md, marginTop: SPACING.md, borderWidth: 1 },
  eligibilityEmoji:  { fontSize: 28 },
  eligibilityTitle:  { fontSize: 15, fontWeight: '700' },
  eligibilitySub:    { fontSize: 13, marginTop: 2 },
  reasonsGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  reasonChip:        { paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border },
  reasonChipActive:  { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  reasonText:        { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary },
  reasonTextActive:  { color: '#fff', fontWeight: '700' },
  textarea:          { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.border, padding: SPACING.md, fontSize: 14, color: COLORS.text, height: 100, textAlignVertical: 'top' },
  warningCard:       { backgroundColor: '#FEF3C7', borderRadius: RADIUS.lg, padding: SPACING.md, marginTop: SPACING.md },
  warningText:       { fontSize: 13, color: '#92400E', lineHeight: 20 },
  cancelLink:        { alignItems: 'center', marginTop: SPACING.md },
  cancelLinkText:    { color: COLORS.textSecondary, fontSize: 14 },
  successWrap:       { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  successCircle:     { marginBottom: SPACING.lg },
  successTitle:      { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm },
  successSub:        { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xl },
  refNumCard:        { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', width: '100%' },
  refNumLabel:       { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  refNum:            { fontSize: 18, fontWeight: '800', color: COLORS.primaryDark, marginTop: 4 },
});