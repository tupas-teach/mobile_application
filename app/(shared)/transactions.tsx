import { Card, EmptyState } from '@/components/UI';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import type { PaymentTransaction } from '@/types';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CATEGORIES = ['All', 'Bookings', 'Marketplace', 'Membership', 'Events'] as const;
type Cat = typeof CATEGORIES[number];

const METHOD_LABEL: Record<string, string> = {
  gcash:       'GCash',
  maya:        'Maya',
  credit_card: 'Credit Card',
  cash:        'Cash',
};

// Map description keywords → category so we can filter without a separate field
function inferCategory(tx: PaymentTransaction): Cat {
  const desc = tx.description?.toLowerCase() ?? '';
  if (desc.includes('membership'))                         return 'Membership';
  if (desc.includes('court') || desc.includes('booking')) return 'Bookings';
  if (desc.includes('event') || desc.includes('party') || desc.includes('package')) return 'Events';
  if (tx.items && tx.items.length > 0)                    return 'Marketplace';
  return 'All';
}

function txEmoji(tx: PaymentTransaction): string {
  const cat = inferCategory(tx);
  if (cat === 'Membership')  return '👑';
  if (cat === 'Bookings')    return '🏟️';
  if (cat === 'Events')      return '🎉';
  if (cat === 'Marketplace') return '🛒';
  return '💳';
}

export default function TransactionsScreen() {
  const { user }                              = useAuthStore();
  const { transactions, isLoading, loadTransactions } = useCartStore();
  const [cat, setCat]                         = useState<Cat>('All');
  const [refreshing, setRefreshing]           = useState(false);

  const load = async () => {
    if (user?.id) await loadTransactions(user.id);
  };

  useEffect(() => { load(); }, [user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const filtered = transactions.filter((tx) => {
    if (cat === 'All') return true;
    return inferCategory(tx) === cat;
  });

  const totalSpent = filtered.reduce((s, tx) => s + tx.amount, 0);

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Transaction History</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.catRow}
        contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.sm }}
      >
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[s.catChip, cat === c && s.catChipActive]}
            onPress={() => setCat(c)}
          >
            <Text style={[s.catLabel, cat === c && s.catLabelActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Body */}
      {isLoading && !refreshing ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={s.loaderText}>Loading transactions…</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        >
          {/* Summary card */}
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Total spent ({cat})</Text>
            <Text style={s.summaryAmount}>₱{totalSpent.toLocaleString()}</Text>
            <Text style={s.summaryCount}>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</Text>
          </View>

          {filtered.length === 0 ? (
            <EmptyState
              emoji="💳"
              title="No transactions"
              subtitle="Transactions will appear here after payment"
            />
          ) : (
            filtered.map((tx) => (
              <Card key={tx.id} style={s.txCard}>
                <View style={s.txLeft}>
                  <Text style={{ fontSize: 28 }}>{txEmoji(tx)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.txDesc}>{tx.description}</Text>
                    <Text style={s.txMeta}>
                      {tx.createdAt ? tx.createdAt.slice(0, 10) : '—'} · {METHOD_LABEL[tx.method] ?? tx.method}
                    </Text>
                  </View>
                </View>
                <View style={s.txRight}>
                  <Text style={s.txAmount}>₱{tx.amount.toLocaleString()}</Text>
                  <View
                    style={[
                      s.txStatus,
                      {
                        backgroundColor:
                          tx.status === 'success' || tx.status === 'paid'
                            ? COLORS.primaryLight
                            : tx.status === 'failed'
                            ? '#FDECEA'
                            : '#FFF8E1',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        s.txStatusText,
                        {
                          color:
                            tx.status === 'success' || tx.status === 'paid'
                              ? COLORS.primaryDark
                              : tx.status === 'failed'
                              ? COLORS.error
                              : COLORS.amber,
                        },
                      ]}
                    >
                      {tx.status === 'success' || tx.status === 'paid'
                        ? '✓ Paid'
                        : tx.status === 'failed'
                        ? '✕ Failed'
                        : tx.status === 'refunded'
                        ? '↩ Refunded'
                        : '⏳ Pending'}
                    </Text>
                  </View>
                </View>
              </Card>
            ))
          )}

          <View style={{ height: SPACING.xxl }} />
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: COLORS.background },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:        { width: 40 },
  backText:       { fontSize: 22, color: COLORS.primary },
  title:          { fontSize: 18, fontWeight: '700', color: COLORS.text },
  catRow:         { maxHeight: 56, paddingVertical: SPACING.sm, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  catChip:        { paddingHorizontal: SPACING.lg, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  catChipActive:  { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catLabel:       { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  catLabelActive: { color: '#fff' },
  loader:         { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
  loaderText:     { fontSize: 14, color: COLORS.textSecondary },
  content:        { padding: SPACING.lg },
  summaryCard:    { backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.xl },
  summaryLabel:   { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  summaryAmount:  { fontSize: 36, fontWeight: '900', color: '#fff' },
  summaryCount:   { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  txCard:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  txLeft:         { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  txDesc:         { fontSize: 14, fontWeight: '600', color: COLORS.text },
  txMeta:         { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  txRight:        { alignItems: 'flex-end', gap: 4 },
  txAmount:       { fontSize: 16, fontWeight: '800', color: COLORS.text },
  txStatus:       { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full },
  txStatusText:   { fontSize: 10, fontWeight: '700' },
});