import { EVENT_PACKAGES } from '@/store/bookingStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { Button, Card } from '../../components/UI';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

// --- Fix: Define EventPackage type locally ---
interface EventPackage {
  id: string;
  name: string;
  eventType: string;
  emoji: string;
  color: string;
  price: number;
  duration: string;
  maxGuests: number;
  includes: string[];
}

function PackageModal({ pkg, visible, onClose }: { pkg: EventPackage | null; visible: boolean; onClose: () => void }) {
  if (!pkg) return null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <TouchableOpacity style={modal.close} onPress={onClose}>
            <Text style={modal.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={modal.emoji}>{pkg.emoji}</Text>
          <Text style={modal.pkgName}>{pkg.name}</Text>
          <View style={[modal.typeBadge, { backgroundColor: pkg.color + '20' }]}>
            <Text style={[modal.typeText, { color: pkg.color }]}>{pkg.eventType}</Text>
          </View>
          <View style={modal.priceRow}>
            <Text style={modal.price}>₱{pkg.price.toLocaleString()}</Text>
            <Text style={modal.pricePer}> / {pkg.duration}</Text>
          </View>
          <Text style={modal.maxGuests}>👥 Up to {pkg.maxGuests} guests</Text>
          <Text style={modal.includesTitle}>What's included:</Text>
          <View style={modal.includesList}>
            {pkg.includes.map((item: string) => (
              <View key={item} style={modal.includeRow}>
                <Text style={[modal.checkIcon, { color: pkg.color }]}>✓</Text>
                <Text style={modal.includeText}>{item}</Text>
              </View>
            ))}
          </View>
          <Button
            title={`Book ${pkg.name} · ₱${pkg.price.toLocaleString()}`}
            onPress={() => {
              onClose();
              router.push({ pathname: '/(shared)/payment', params: { type: 'event', packageId: pkg.id, packageName: pkg.name, total: pkg.price.toString() } } as any);
            }}
            style={{ marginTop: SPACING.lg, backgroundColor: pkg.color }}
          />
          <TouchableOpacity style={modal.chatLink} onPress={() => { onClose(); router.push('/(court)/court-chat' as any); }}>
            <Text style={modal.chatLinkText}>💬 Chat with admin for custom requirements</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function EventsScreen() {
  const [selected, setSelected] = useState<EventPackage | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // --- Fix: Create a function to generate the card style ---
  const getPackageCardStyle = (color: string): ViewStyle => {
    return {
      backgroundColor: '#1A1A2E',
      borderColor: 'rgba(255,255,255,0.05)',
      marginBottom: SPACING.md,
      overflow: 'hidden' as const,
      borderLeftColor: color,
      borderLeftWidth: 4,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Event Venue Packages 🎉</Text>
        <Text style={styles.sub}>Host your special moments at FlexZone</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroEmoji}>🏟️</Text>
          <View>
            <Text style={styles.heroTitle}>FlexZone Multi-Purpose Hall</Text>
            <Text style={styles.heroSub}>Capacity: 200 pax · Full PA · AC · Parking</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Event Packages</Text>
        {EVENT_PACKAGES.map((pkg) => (
          <TouchableOpacity
            key={pkg.id}
            activeOpacity={0.85}
            onPress={() => { setSelected(pkg); setModalVisible(true); }}
          >
            {/* --- Fix: Use a single style object instead of array --- */}
            <Card style={getPackageCardStyle(pkg.color) as ViewStyle}>
              <View style={styles.pkgHeader}>
                <Text style={styles.pkgEmoji}>{pkg.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pkgName}>{pkg.name}</Text>
                  <Text style={styles.pkgType}>{pkg.eventType} · {pkg.duration} · {pkg.maxGuests} guests max</Text>
                </View>
                <View style={styles.pkgPriceCol}>
                  <Text style={[styles.pkgPrice, { color: pkg.color }]}>₱{pkg.price.toLocaleString()}</Text>
                  <Text style={styles.pkgPriceSub}>all-in</Text>
                </View>
              </View>
              <View style={styles.pkgIncludes}>
                {pkg.includes.slice(0, 4).map((item) => (
                  <Text key={item} style={[styles.includeItem, { color: pkg.color }]}>✓ {item}</Text>
                ))}
                {pkg.includes.length > 4 && (
                  <Text style={styles.moreItems}>+{pkg.includes.length - 4} more included</Text>
                )}
              </View>
              <Text style={styles.viewDetails}>View full details & book →</Text>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Custom event CTA */}
        <Card style={styles.customCard as ViewStyle}>
          <Text style={styles.customEmoji}>✨</Text>
          <Text style={styles.customTitle}>Need a custom package?</Text>
          <Text style={styles.customSub}>
            Planning something unique? Chat with our admin team for custom event arrangements, catering partnerships, and special add-ons.
          </Text>
          <Button
            title="💬 Chat with Admin"
            onPress={() => router.push('/(court)/court-chat' as any)}
            variant="outline"
            style={{ marginTop: SPACING.md }}
          />
        </Card>

        {/* FAQ */}
        <Text style={styles.sectionTitle}>Frequently Asked</Text>
        {[
          { q: 'How far in advance should I book?', a: 'We recommend booking at least 2 weeks ahead for events, especially on weekends.' },
          { q: 'Can I bring outside catering?', a: 'Yes! You may bring your own caterer. We have a dedicated catering area and kitchen access.' },
          { q: 'Is there a refund if I cancel?', a: 'Full refund up to 7 days before event. 50% refund 3–6 days before. No refund within 48 hours.' },
          { q: 'Is parking available?', a: 'Yes, we have a free parking area that accommodates up to 50 vehicles.' },
        ].map((faq) => (
          <Card key={faq.q} style={styles.faqCard as ViewStyle}>
            <Text style={styles.faqQ}>❓ {faq.q}</Text>
            <Text style={styles.faqA}>{faq.a}</Text>
          </Card>
        ))}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      <PackageModal pkg={selected} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1E' },
  header: { paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  title: { fontSize: 22, fontWeight: '700', color: '#fff' },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  content: { padding: SPACING.lg },
  heroBanner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: '#1A1A2E', borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  heroEmoji: { fontSize: 40 },
  heroTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: SPACING.md },
  pkgCard: { backgroundColor: '#1A1A2E', borderColor: 'rgba(255,255,255,0.05)', marginBottom: SPACING.md, overflow: 'hidden' },
  pkgHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, marginBottom: SPACING.md },
  pkgEmoji: { fontSize: 32 },
  pkgName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  pkgType: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 },
  pkgPriceCol: { alignItems: 'flex-end' },
  pkgPrice: { fontSize: 20, fontWeight: '800' },
  pkgPriceSub: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  pkgIncludes: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: SPACING.sm },
  includeItem: { fontSize: 12, fontWeight: '500' },
  moreItems: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  viewDetails: { fontSize: 13, color: COLORS.primary, fontWeight: '600', marginTop: 4 },
  customCard: { backgroundColor: '#1A1A2E', borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', marginBottom: SPACING.xl },
  customEmoji: { fontSize: 36, marginBottom: SPACING.sm },
  customTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: SPACING.sm },
  customSub: { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 20 },
  faqCard: { backgroundColor: '#1A1A2E', borderColor: 'rgba(255,255,255,0.05)', marginBottom: SPACING.sm },
  faqQ: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: SPACING.xs },
  faqA: { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 18 },
});

const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#1A1A2E', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl, paddingBottom: 40 },
  close: { alignSelf: 'flex-end', padding: 8, marginBottom: SPACING.sm },
  closeText: { color: 'rgba(255,255,255,0.4)', fontSize: 18 },
  emoji: { fontSize: 56, textAlign: 'center', marginBottom: SPACING.sm },
  pkgName: { fontSize: 24, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: SPACING.sm },
  typeBadge: { alignSelf: 'center', paddingHorizontal: SPACING.md, paddingVertical: 5, borderRadius: RADIUS.full, marginBottom: SPACING.md },
  typeText: { fontSize: 13, fontWeight: '700' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 4 },
  price: { fontSize: 36, fontWeight: '900', color: '#fff' },
  pricePer: { fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  maxGuests: { textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: SPACING.lg },
  includesTitle: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.5)', marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  includesList: { gap: 8 },
  includeRow: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'center' },
  checkIcon: { fontSize: 16, fontWeight: '700' },
  includeText: { fontSize: 14, color: '#fff' },
  chatLink: { marginTop: SPACING.md, alignItems: 'center' },
  chatLinkText: { fontSize: 13, color: COLORS.primary },
});