import { Avatar, Badge, Button, Card } from '@/components/UI';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useCoachChatStore } from '@/store/coachChatStore';
import { useGymStore } from '@/store/gymStore';
import type { Coach } from '@/types';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: 12, color: i <= Math.round(rating) ? COLORS.amber : COLORS.border }}>★</Text>
      ))}
      <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginLeft: 2 }}>{rating}</Text>
    </View>
  );
}

function CoachModal({ coach, visible, onClose }: { coach: Coach | null; visible: boolean; onClose: () => void }) {
  const { openThread } = useCoachChatStore();
  if (!coach) return null;

  const handleMessage = () => {
    onClose();
    openThread(coach.id, coach.name, coach.initials, coach.color);
    router.push({ pathname: '/(gym)/coach-chat' as never, params: { coachId: coach.id } });
  };

  const handleViewProfile = () => {
    onClose();
    // ── UPDATED: moved from /(gym)/coach-profile → /(shared)/coach-profile ──
    router.push({ pathname: '/(shared)/coach-profile' as never, params: { coachId: coach.id } });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <TouchableOpacity style={modal.closeBtn} onPress={onClose}>
            <Text style={modal.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={modal.coachHeader}>
            <Avatar initials={coach.initials} color={coach.color} size={64} />
            <View style={{ flex: 1 }}>
              <Text style={modal.coachName}>{coach.name}</Text>
              <StarRating rating={coach.rating} />
              <Text style={modal.reviewCount}>{coach.reviews} reviews · {coach.experience} experience</Text>
              <View style={[modal.availBadge, { backgroundColor: coach.available ? COLORS.primaryLight : '#FEF3C7' }]}>
                <Text style={[modal.availText, { color: coach.available ? COLORS.primaryDark : '#92400E' }]}>
                  {coach.available ? '● Available today' : '○ Unavailable today'}
                </Text>
              </View>
            </View>
          </View>

          <Text style={modal.sectionLabel}>About</Text>
          <Text style={modal.bio}>{coach.bio}</Text>

          <Text style={modal.sectionLabel}>Specialties</Text>
          <View style={modal.specialties}>
            {coach.specialties.map((s: string) => (
              <Badge key={s} label={s} color={coach.color} bgColor={coach.color + '20'} />
            ))}
          </View>

          <TouchableOpacity style={modal.profileBtn} onPress={handleViewProfile}>
            <Text style={modal.profileBtnText}>View Full Profile (About · Schedule · Reviews) →</Text>
          </TouchableOpacity>

          <View style={modal.actions}>
            <Button
              title="📅 Book a session"
              onPress={() => {
                onClose();
                router.push({
                  pathname: '/(shared)/payment' as never,
                  params: { type: 'coach', total: String(coach.sessionRate ?? 500), packageName: `Session with ${coach.name}` },
                });
              }}
              disabled={!coach.available}
              style={{ flex: 1 }}
            />
            <Button title="💬 Message" onPress={handleMessage} variant="outline" style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function CoachesScreen() {
  const { coaches } = useGymStore();
  const [selected, setSelected] = useState<Coach | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openCoach = (coach: Coach) => { setSelected(coach); setModalVisible(true); };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Coaches</Text>
        <Text style={styles.sub}>Expert trainers, real results</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {coaches.map((coach) => (
          <TouchableOpacity key={coach.id} onPress={() => openCoach(coach)} activeOpacity={0.85}>
            <Card style={styles.coachCard}>
              <View style={styles.coachTop}>
                <Avatar initials={coach.initials} color={coach.color} size={56} />
                <View style={styles.coachInfo}>
                  <Text style={styles.coachName}>{coach.name}</Text>
                  <StarRating rating={coach.rating} />
                  <Text style={styles.coachMeta}>{coach.reviews} reviews · {coach.experience}</Text>
                </View>
                <View style={[styles.availDot, { backgroundColor: coach.available ? COLORS.primary : COLORS.textMuted }]} />
              </View>

              <View style={styles.specialtiesRow}>
                {coach.specialties.map((s: string) => (
                  <Badge key={s} label={s} color={coach.color} bgColor={coach.color + '15'} size="sm" />
                ))}
              </View>

              <Text style={styles.coachBio} numberOfLines={2}>{coach.bio}</Text>

              <View style={styles.cardFooter}>
                {/* ── UPDATED: moved from /(gym)/coach-profile → /(shared)/coach-profile ── */}
                <TouchableOpacity onPress={() => router.push({ pathname: '/(shared)/coach-profile' as never, params: { coachId: coach.id } })}>
                  <Text style={styles.viewProfile}>View profile →</Text>
                </TouchableOpacity>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => openCoach(coach)}>
                    <Text style={styles.actionText}>Book</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnOutline]}
                    onPress={() => router.push({ pathname: '/(gym)/coach-chat' as never, params: { coachId: coach.id } })}>
                    <Text style={[styles.actionText, { color: COLORS.primary }]}>Message</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        <View style={styles.cta}>
          <Text style={styles.ctaEmoji}>🎯</Text>
          <Text style={styles.ctaTitle}>Are you a fitness professional?</Text>
          <Text style={styles.ctaSub}>Join FlexZone as a coach and grow your client base.</Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/(gym)/coach-apply' as never)}>
            <Text style={styles.ctaBtnText}>Apply to coach</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      <CoachModal coach={selected} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: COLORS.background },
  header:           { paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  title:            { fontSize: 26, fontWeight: '700', color: COLORS.text },
  sub:              { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  list:             { padding: SPACING.lg },
  coachCard:        { marginBottom: SPACING.md },
  coachTop:         { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, marginBottom: SPACING.md },
  coachInfo:        { flex: 1, gap: 2 },
  coachName:        { fontSize: 17, fontWeight: '700', color: COLORS.text },
  coachMeta:        { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  availDot:         { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  specialtiesRow:   { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: SPACING.sm },
  coachBio:         { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: SPACING.md },
  cardFooter:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewProfile:      { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  actions:          { flexDirection: 'row', gap: SPACING.sm },
  actionBtn:        { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.md, backgroundColor: COLORS.primary },
  actionBtnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary },
  actionText:       { fontSize: 13, fontWeight: '600', color: '#fff' },
  cta:              { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.sm },
  ctaEmoji:         { fontSize: 36 },
  ctaTitle:         { fontSize: 16, fontWeight: '700', color: COLORS.primaryDark, textAlign: 'center' },
  ctaSub:           { fontSize: 13, color: COLORS.primary, textAlign: 'center', lineHeight: 18 },
  ctaBtn:           { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, marginTop: SPACING.xs },
  ctaBtnText:       { color: '#fff', fontWeight: '700', fontSize: 14 },
});

const modal = StyleSheet.create({
  overlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: COLORS.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl, paddingBottom: 40 },
  closeBtn:     { alignSelf: 'flex-end', padding: 8, marginBottom: SPACING.sm },
  closeText:    { fontSize: 18, color: COLORS.textSecondary },
  coachHeader:  { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.lg },
  coachName:    { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  reviewCount:  { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  availBadge:   { marginTop: 6, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  availText:    { fontSize: 11, fontWeight: '600' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm, marginTop: SPACING.md },
  bio:          { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  specialties:  { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  profileBtn:   { backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  profileBtnText:{ fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  actions:      { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.md },
});
