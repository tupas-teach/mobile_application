import { Button, Card, SectionHeader } from '@/components/UI';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { EVENT_PACKAGES } from '@/store/bookingStore';
import type { EventPackage } from '@/types';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

function PackageModal({
  pkg,
  visible,
  onClose,
}: {
  pkg: EventPackage | null;
  visible: boolean;
  onClose: () => void;
}) {
  if (!pkg) return null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={m.overlay}>
        <View style={m.sheet}>
          <TouchableOpacity style={m.closeBtn} onPress={onClose}>
            <Text style={m.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={m.emoji}>{pkg.emoji}</Text>
          <Text style={m.pkgName}>{pkg.name}</Text>
          <View style={[m.typeBadge, { backgroundColor: pkg.color + '20' }]}>
            <Text style={[m.typeText, { color: pkg.color }]}>{pkg.eventType}</Text>
          </View>
          <View style={m.priceRow}>
            <Text style={m.price}>₱{pkg.price.toLocaleString()}</Text>
            <Text style={m.pricePer}> / {pkg.duration}</Text>
          </View>
          <Text style={m.guests}>👥 Up to {pkg.maxGuests} guests</Text>
          <Text style={m.includesTitle}>What's included:</Text>
          <View style={m.includesList}>
            {pkg.includes.map((item) => (
              <View key={item} style={m.includeRow}>
                <Text style={[m.check, { color: pkg.color }]}>✓</Text>
                <Text style={m.includeText}>{item}</Text>
              </View>
            ))}
          </View>
          <Button
            title={`Book ${pkg.name} · ₱${pkg.price.toLocaleString()}`}
            onPress={() => {
              onClose();
              router.push({
                pathname: '/(shared)/payment' as never,
                params: {
                  type: 'event',
                  packageName: pkg.name,
                  total: pkg.price.toString(),
                },
              });
            }}
            style={{ marginTop: SPACING.lg, backgroundColor: pkg.color }}
          />
          <TouchableOpacity
            style={m.chatLink}
            onPress={() => {
              onClose();
              router.push('/(court)/court-chat' as never);
            }}
          >
            <Text style={m.chatLinkText}>💬 Chat with admin for custom requirements</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function EventsScreen() {
  const [selected, setSelected] = useState<EventPackage | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Event Venue Packages 🎉</Text>
        <Text style={s.sub}>Host your special moments at FlexZone</Text>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Card style={s.heroBanner}>
          <Text style={{ fontSize: 40 }}>🏟️</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.heroTitle}>FlexZone Multi-Purpose Hall</Text>
            <Text style={s.heroSub}>Capacity: 200 pax · Full PA · AC · Parking</Text>
          </View>
        </Card>

        <SectionHeader title="Event Packages" />

        {EVENT_PACKAGES.map((pkg) => {
          // ── FIX 2: build a single merged ViewStyle instead of passing an array ──
          const pkgCardStyle: ViewStyle = {
            ...StyleSheet.flatten(s.pkgCard),
            borderLeftColor: pkg.color,
            borderLeftWidth: 4,
          };

          return (
            <TouchableOpacity
              key={pkg.id}
              activeOpacity={0.85}
              onPress={() => {
                setSelected(pkg);
                setModalVisible(true);
              }}
            >
              <Card style={pkgCardStyle}>
                <View style={s.pkgHeader}>
                  <Text style={s.pkgEmoji}>{pkg.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.pkgName}>{pkg.name}</Text>
                    <Text style={s.pkgMeta}>
                      {pkg.eventType} · {pkg.duration} · {pkg.maxGuests} guests max
                    </Text>
                  </View>
                  <View style={s.pkgPriceCol}>
                    <Text style={[s.pkgPrice, { color: pkg.color }]}>
                      ₱{pkg.price.toLocaleString()}
                    </Text>
                    <Text style={s.pkgPriceSub}>all-in</Text>
                  </View>
                </View>
                <View style={s.includesRow}>
                  {pkg.includes.slice(0, 4).map((item) => (
                    <Text key={item} style={[s.includeItem, { color: pkg.color }]}>
                      ✓ {item}
                    </Text>
                  ))}
                  {pkg.includes.length > 4 && (
                    <Text style={s.moreIncludes}>+{pkg.includes.length - 4} more</Text>
                  )}
                </View>
                <Text style={s.viewDetails}>View full details & book →</Text>
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* Custom CTA */}
        <Card style={s.customCard}>
          <Text style={{ fontSize: 36, textAlign: 'center', marginBottom: SPACING.sm }}>
            ✨
          </Text>
          <Text style={s.customTitle}>Need a custom package?</Text>
          <Text style={s.customSub}>
            Chat with our admin team for custom arrangements, catering partnerships,
            and special add-ons.
          </Text>
          <Button
            title="💬 Chat with Admin"
            onPress={() => router.push('/(court)/court-chat' as never)}
            variant="outline"
            style={{ marginTop: SPACING.md }}
          />
        </Card>

        {/* FAQ */}
        <SectionHeader title="Frequently Asked" />
        {[
          {
            q: 'How far in advance should I book?',
            a: 'We recommend booking at least 2 weeks ahead for events, especially on weekends.',
          },
          {
            q: 'Can I bring outside catering?',
            a: 'Yes! You may bring your own caterer. We have a dedicated catering area and kitchen access.',
          },
          {
            q: 'Is there a refund if I cancel?',
            a: 'Full refund up to 7 days before event. 50% refund 3–6 days before. No refund within 48 hours.',
          },
          {
            q: 'Is parking available?',
            a: 'Yes, we have a free parking area that accommodates up to 50 vehicles.',
          },
        ].map((faq) => (
          <Card key={faq.q} style={s.faqCard}>
            <Text style={s.faqQ}>❓ {faq.q}</Text>
            <Text style={s.faqA}>{faq.a}</Text>
          </Card>
        ))}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      <PackageModal
        pkg={selected}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.background },
  header:       { paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  title:        { fontSize: 22, fontWeight: '700', color: COLORS.text },
  sub:          { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  content:      { padding: SPACING.lg },
  heroBanner:   { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.xl },
  heroTitle:    { fontSize: 15, fontWeight: '700', color: COLORS.text },
  heroSub:      { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  pkgCard:      { marginBottom: SPACING.md, overflow: 'hidden' },
  pkgHeader:    { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, marginBottom: SPACING.md },
  pkgEmoji:     { fontSize: 32 },
  pkgName:      { fontSize: 16, fontWeight: '700', color: COLORS.text },
  pkgMeta:      { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  pkgPriceCol:  { alignItems: 'flex-end' },
  pkgPrice:     { fontSize: 18, fontWeight: '800' },
  pkgPriceSub:  { fontSize: 10, color: COLORS.textMuted },
  includesRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: SPACING.sm },
  includeItem:  { fontSize: 12, fontWeight: '500' },
  moreIncludes: { fontSize: 12, color: COLORS.textMuted },
  viewDetails:  { fontSize: 13, color: COLORS.primary, fontWeight: '600', marginTop: 4 },
  customCard:   { marginBottom: SPACING.xl, alignItems: 'center' },
  customTitle:  { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  customSub:    { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  faqCard:      { marginBottom: SPACING.sm },
  faqQ:         { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  faqA:         { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
});

const m = StyleSheet.create({
  overlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet:         { backgroundColor: COLORS.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl, paddingBottom: 40 },
  closeBtn:      { alignSelf: 'flex-end', padding: 8, marginBottom: SPACING.sm },
  closeText:     { fontSize: 18, color: COLORS.textSecondary },
  emoji:         { fontSize: 56, textAlign: 'center', marginBottom: SPACING.sm },
  pkgName:       { fontSize: 24, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.sm },
  typeBadge:     { alignSelf: 'center', paddingHorizontal: SPACING.md, paddingVertical: 5, borderRadius: RADIUS.full, marginBottom: SPACING.md },
  typeText:      { fontSize: 13, fontWeight: '700' },
  priceRow:      { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 4 },
  price:         { fontSize: 36, fontWeight: '900', color: COLORS.text },
  pricePer:      { fontSize: 16, color: COLORS.textSecondary, marginBottom: 4 },
  guests:        { textAlign: 'center', color: COLORS.textSecondary, fontSize: 14, marginBottom: SPACING.lg },
  includesTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm },
  includesList:  { gap: 8 },
  includeRow:    { flexDirection: 'row', gap: SPACING.sm, alignItems: 'center' },
  check:         { fontSize: 16, fontWeight: '700' },
  includeText:   { fontSize: 14, color: COLORS.text },
  chatLink:      { marginTop: SPACING.md, alignItems: 'center' },
  chatLinkText:  { fontSize: 13, color: COLORS.primary },
});