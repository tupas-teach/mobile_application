import { Button, Card } from '@/components/UI';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';

const TIERS = [
  {
    id: 'basic' as const,
    name: 'Basic',
    price: 599,
    emoji: '🏃',
    color: '#185FA5',
    bg: '#E6F1FB',
    popular: false,
    perks: [
      '✓ Gym floor access (unlimited)',
      '✓ 4 group classes per month',
      '✓ Equipment status app access',
      '✓ Marketplace access',
      '✓ Basic AI Coach (10 queries/month)',
      '✗ Priority booking',
      '✗ Coach messaging',
      '✗ Basketball court access',
    ],
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: 1299,
    emoji: '⭐',
    color: '#1D9E75',
    bg: '#E1F5EE',
    popular: true,
    perks: [
      '✓ Everything in Basic',
      '✓ Unlimited group classes',
      '✓ Priority class booking',
      '✓ Coach messaging (in-app)',
      '✓ Full AI Coach (unlimited)',
      '✓ Basketball/volleyball court (2 hrs free/month)',
      '✓ 5% marketplace discount',
      '✗ Personal training sessions',
    ],
  },
  {
    id: 'vip' as const,
    name: 'VIP Elite',
    price: 2499,
    emoji: '👑',
    color: '#B45309',
    bg: '#FAEEDA',
    popular: false,
    perks: [
      '✓ Everything in Premium',
      '✓ 2× personal training sessions/month',
      '✓ Nutrition consultations',
      '✓ VIP locker room & showers',
      '✓ 5 court hours/month free',
      '✓ 10% marketplace discount',
      '✓ Guest passes (2/month)',
      '✓ Event priority booking',
    ],
  },
];

const BENEFITS = [
  { emoji: '🎯', title: 'Unlimited classes',    sub: 'No more monthly limits — book as many HIIT, Yoga, Boxing sessions as you want.' },
  { emoji: '🤖', title: 'Full AI Coach access', sub: 'Get personalized workout plans, nutrition advice, and progress tracking.' },
  { emoji: '🏀', title: 'Court access included',sub: 'Premium+ members get free court hours every month.' },
  { emoji: '👥', title: 'Message your coach',   sub: 'Direct in-app messaging with FlexZone coaches.' },
];

export default function MembershipScreen() {
  const { user } = useAuthStore();
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (tierId: string) => {
    setUpgrading(tierId);
    await new Promise<void>((r) => setTimeout(r, 1500));
    setUpgrading(null);
    // Use `as any` — Expo Router TS types don't accept group-route strings directly
    router.push({
      pathname: '/(shared)/payment' as any,
      params: { type: 'membership', tier: tierId },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Membership Plans</Text>
        <Text style={styles.sub}>Choose the plan that fits your goals</Text>
        {user?.membership && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentText}>
              Current plan: {user.membership.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Tier cards */}
      {TIERS.map((tier) => {
        const isCurrent = user?.membership === tier.id;

        // Build the card style as a plain ViewStyle — no falsy values in the array
        const cardStyle: ViewStyle = {
          ...styles.tierCard,
          ...(tier.popular ? styles.tierCardFeatured : {}),
          borderColor: tier.popular ? tier.color : COLORS.border,
        };

        return (
          <Card key={tier.id} style={cardStyle}>
            {tier.popular && (
              <View style={[styles.popularTag, { backgroundColor: tier.color }]}>
                <Text style={styles.popularText}>⭐ Most Popular</Text>
              </View>
            )}

            {/* Tier header */}
            <View style={styles.tierHeader}>
              <View style={[styles.tierIconBg, { backgroundColor: tier.bg }]}>
                <Text style={{ fontSize: 28 }}>{tier.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.tierName, { color: tier.color }]}>
                  {tier.name}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceSymbol}>₱</Text>
                  <Text style={styles.price}>{tier.price.toLocaleString()}</Text>
                  <Text style={styles.pricePer}>/month</Text>
                </View>
              </View>
              {isCurrent && (
                <View style={[styles.activePill, { backgroundColor: tier.bg }]}>
                  <Text style={[styles.activeText, { color: tier.color }]}>
                    Active
                  </Text>
                </View>
              )}
            </View>

            {/* Perks list */}
            <View style={styles.perksList}>
              {tier.perks.map((perk) => (
                <Text
                  key={perk}
                  style={[
                    styles.perk,
                    perk.startsWith('✗') && styles.perkCrossed,
                  ]}
                >
                  {perk}
                </Text>
              ))}
            </View>

            {/* CTA */}
            {isCurrent ? (
              <View style={[styles.currentPlan, { backgroundColor: tier.bg }]}>
                <Text style={[styles.currentPlanText, { color: tier.color }]}>
                  ✓ Your current plan
                </Text>
              </View>
            ) : (
              <Button
                title={upgrading === tier.id ? 'Redirecting...' : `Get ${tier.name}`}
                onPress={() => handleUpgrade(tier.id)}
                loading={upgrading === tier.id}
                style={{ ...styles.upgradeBtn, backgroundColor: tier.color }}
              />
            )}
          </Card>
        );
      })}

      {/* Why upgrade */}
      <Card style={styles.compareCard}>
        <Text style={styles.compareTitle}>💡 Why upgrade?</Text>
        {BENEFITS.map((b) => (
          <View key={b.title} style={styles.benefit}>
            <Text style={{ fontSize: 24 }}>{b.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.benefitTitle}>{b.title}</Text>
              <Text style={styles.benefitSub}>{b.sub}</Text>
            </View>
          </View>
        ))}
      </Card>

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: COLORS.background },
  content:          { padding: SPACING.lg },
  header:           { paddingTop: 54, paddingBottom: SPACING.lg },
  title:            { fontSize: 26, fontWeight: '700', color: COLORS.text },
  sub:              { fontSize: 14, color: COLORS.textSecondary, marginTop: 2, marginBottom: SPACING.md },
  currentBadge:     { backgroundColor: COLORS.primaryLight, paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  currentText:      { fontSize: 13, color: COLORS.primaryDark, fontWeight: '600' },

  tierCard:         { marginBottom: SPACING.lg, position: 'relative', overflow: 'hidden', borderWidth: 1 },
  tierCardFeatured: { borderWidth: 2 },

  popularTag:       { position: 'absolute', top: 12, right: 12, borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4, zIndex: 1 },
  popularText:      { color: '#fff', fontSize: 11, fontWeight: '700' },

  tierHeader:       { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
  tierIconBg:       { width: 60, height: 60, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center' },
  tierName:         { fontSize: 20, fontWeight: '700', marginBottom: 2 },
  priceRow:         { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  priceSymbol:      { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  price:            { fontSize: 28, fontWeight: '800', color: COLORS.text },
  pricePer:         { fontSize: 13, color: COLORS.textSecondary, marginBottom: 3 },

  activePill:       { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  activeText:       { fontSize: 12, fontWeight: '700' },

  perksList:        { gap: 7, marginBottom: SPACING.lg },
  perk:             { fontSize: 13, color: COLORS.text, lineHeight: 18 },
  perkCrossed:      { color: COLORS.textMuted },

  upgradeBtn:       { borderRadius: RADIUS.md },
  currentPlan:      { borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  currentPlanText:  { fontSize: 14, fontWeight: '700' },

  compareCard:      { marginBottom: SPACING.lg },
  compareTitle:     { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  benefit:          { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md, alignItems: 'flex-start' },
  benefitTitle:     { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  benefitSub:       { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
});
