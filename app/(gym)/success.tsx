import { Button } from '@/components/UI';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SuccessScreen() {
  const params = useLocalSearchParams<{ type?: string; amount?: string; reference?: string }>();

  const titles: Record<string, string> = {
    membership: 'Membership Activated! 🎉',
    court: 'Court Booked! 🏀',
    event: 'Event Reserved! 🎉',
    marketplace: 'Order Placed! 🛍️',
  };
  const title = titles[params.type ?? ''] ?? 'Payment Successful! ✅';

  return (
    <View style={s.container}>
      <View style={s.iconCircle}><Text style={{ fontSize: 56 }}>✅</Text></View>
      <Text style={s.title}>{title}</Text>
      <Text style={s.sub}>Your transaction has been completed successfully.</Text>

      {(params.amount || params.reference) && (
        <View style={s.card}>
          {params.amount && (
            <View style={s.row}>
              <Text style={s.label}>Amount</Text>
              <Text style={s.value}>₱{Number(params.amount).toLocaleString()}</Text>
            </View>
          )}
          {params.reference && (
            <View style={s.row}>
              <Text style={s.label}>Reference</Text>
              <Text style={s.value}>{params.reference}</Text>
            </View>
          )}
        </View>
      )}

      <Button title="Back to Home" onPress={() => router.replace('/(gym)' as never)} style={{ width: '100%', marginTop: SPACING.xl }} />
      <TouchableOpacity onPress={() => router.replace('/(shared)/notifications' as never)} style={{ marginTop: SPACING.md }}>
        <Text style={s.link}>View Notifications</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  title:      { fontSize: 22, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.sm },
  sub:        { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.lg },
  card:       { width: '100%', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 0.5, borderColor: COLORS.border, gap: SPACING.sm },
  row:        { flexDirection: 'row', justifyContent: 'space-between' },
  label:      { fontSize: 13, color: COLORS.textSecondary },
  value:      { fontSize: 13, fontWeight: '700', color: COLORS.text },
  link:       { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
});
