import { Card, EmptyState } from '@/components/UI';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useCartStore } from '@/store/cartStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CATEGORIES = ['All', 'Bookings', 'Marketplace', 'Membership', 'Events'] as const;

const MOCK_TXS = [
  { id:'tx1', description:'Basketball Court Booking', date:'2025-06-14', amount:600,  method:'gcash',       category:'Bookings',     status:'success', emoji:'🏀' },
  { id:'tx2', description:'Whey Protein 2kg',         date:'2025-06-12', amount:1899, method:'maya',        category:'Marketplace',  status:'success', emoji:'🛒' },
  { id:'tx3', description:'Premium Membership',       date:'2025-06-01', amount:1299, method:'credit_card', category:'Membership',   status:'success', emoji:'👑' },
  { id:'tx4', description:'Badminton Court – 1hr',    date:'2025-05-30', amount:200,  method:'gcash',       category:'Bookings',     status:'success', emoji:'🏸' },
  { id:'tx5', description:'Birthday Bash Package',    date:'2025-05-25', amount:5000, method:'credit_card', category:'Events',       status:'success', emoji:'🎂' },
  { id:'tx6', description:'Gym Gloves',               date:'2025-05-20', amount:349,  method:'cash',        category:'Marketplace',  status:'success', emoji:'🥊' },
];

const METHOD_LABEL: Record<string, string> = { gcash:'GCash', maya:'Maya', credit_card:'Credit Card', cash:'Cash' };

export default function TransactionsScreen() {
  const [cat, setCat] = useState<typeof CATEGORIES[number]>('All');
  const { transactions } = useCartStore();

  const filtered = MOCK_TXS.filter((t) => cat === 'All' || t.category === cat);
  const totalSpent = filtered.reduce((s, t) => s + t.amount, 0);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.title}>Transaction History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catRow} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.sm }}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} style={[s.catChip, cat === c && s.catChipActive]} onPress={() => setCat(c)}>
            <Text style={[s.catLabel, cat === c && s.catLabelActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={s.content}>
        <View style={s.summaryCard}>
          <Text style={s.summaryLabel}>Total spent ({cat})</Text>
          <Text style={s.summaryAmount}>₱{totalSpent.toLocaleString()}</Text>
          <Text style={s.summaryCount}>{filtered.length} transactions</Text>
        </View>

        {filtered.length === 0 ? (
          <EmptyState emoji="💳" title="No transactions" subtitle="Transactions will appear here after payment" />
        ) : (
          filtered.map((tx) => (
            <Card key={tx.id} style={s.txCard}>
              <View style={s.txLeft}>
                <Text style={{ fontSize: 28 }}>{tx.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.txDesc}>{tx.description}</Text>
                  <Text style={s.txMeta}>{tx.date} · {METHOD_LABEL[tx.method]}</Text>
                </View>
              </View>
              <View style={s.txRight}>
                <Text style={s.txAmount}>₱{tx.amount.toLocaleString()}</Text>
                <View style={[s.txStatus, { backgroundColor: COLORS.primaryLight }]}>
                  <Text style={[s.txStatusText, { color: COLORS.primaryDark }]}>✓ Paid</Text>
                </View>
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
  container:    { flex: 1, backgroundColor: COLORS.background },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:      { width: 40 },
  backText:     { fontSize: 22, color: COLORS.primary },
  title:        { fontSize: 18, fontWeight: '700', color: COLORS.text },
  catRow:       { maxHeight: 56, paddingVertical: SPACING.sm, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  catChip:      { paddingHorizontal: SPACING.lg, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  catChipActive:{ backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catLabel:     { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  catLabelActive:{ color: '#fff' },
  content:      { padding: SPACING.lg },
  summaryCard:  { backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.xl },
  summaryLabel: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  summaryAmount:{ fontSize: 36, fontWeight: '900', color: '#fff' },
  summaryCount: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  txCard:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  txLeft:       { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  txDesc:       { fontSize: 14, fontWeight: '600', color: COLORS.text },
  txMeta:       { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  txRight:      { alignItems: 'flex-end', gap: 4 },
  txAmount:     { fontSize: 16, fontWeight: '800', color: COLORS.text },
  txStatus:     { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full },
  txStatusText: { fontSize: 10, fontWeight: '700' },
});
