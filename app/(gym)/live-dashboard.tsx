import { Card, SectionHeader } from '@/components/UI';
import { COLORS, RADIUS, SHADOW, SPACING } from '@/constants/theme';
import { useGymStore } from '@/store/gymStore';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

function PulseDot({ color }: { color: string }) {
  const [op, setOp] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setOp((v) => (v > 0.3 ? 0.3 : 1)), 800);
    return () => clearInterval(t);
  }, []);
  return <View style={[s.pulseDot, { backgroundColor: color, opacity: op }]} />;
}

export default function LiveDashboardScreen() {
  const { equipment, sessions } = useGymStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const totalAvailable = equipment.reduce((sum, e) => sum + e.available, 0);
  const totalEquipment = equipment.reduce((sum, e) => sum + e.total, 0);
  const gymLoad = totalEquipment > 0 ? Math.round(((totalEquipment - totalAvailable) / totalEquipment) * 100) : 0;
  const activeSessions = sessions.filter((sess) => sess.bookedSlots < sess.slots);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.title}>Live Dashboard</Text>
        <View style={s.liveBadge}><PulseDot color="#fff" /><Text style={s.liveText}>LIVE</Text></View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Clock */}
        <View style={s.clockCard}>
          <Text style={s.clockTime}>
            {now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Manila' })}
          </Text>
          <Text style={s.clockDate}>
            {now.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Asia/Manila' })}
          </Text>
        </View>

        {/* Stats grid */}
        <View style={s.statsGrid}>
          <View style={[s.statCard, { borderTopColor: gymLoad > 70 ? COLORS.error : COLORS.primary }]}>
            <Text style={s.statEmoji}>🏋️</Text>
            <Text style={[s.statValue, { color: gymLoad > 70 ? COLORS.error : COLORS.primary }]}>{gymLoad}%</Text>
            <Text style={s.statLabel}>Gym Load</Text>
          </View>
          <View style={[s.statCard, { borderTopColor: COLORS.secondary }]}>
            <Text style={s.statEmoji}>📅</Text>
            <Text style={[s.statValue, { color: COLORS.secondary }]}>{activeSessions.length}</Text>
            <Text style={s.statLabel}>Open Sessions</Text>
          </View>
          <View style={[s.statCard, { borderTopColor: COLORS.amber }]}>
            <Text style={s.statEmoji}>✅</Text>
            <Text style={[s.statValue, { color: COLORS.amber }]}>{totalAvailable}</Text>
            <Text style={s.statLabel}>Equip. Free</Text>
          </View>
          <View style={[s.statCard, { borderTopColor: '#185FA5' }]}>
            <Text style={s.statEmoji}>📊</Text>
            <Text style={[s.statValue, { color: '#185FA5' }]}>{totalEquipment}</Text>
            <Text style={s.statLabel}>Total Equip.</Text>
          </View>
        </View>

        {/* Sessions */}
        <SectionHeader title="Sessions right now" />
        {activeSessions.slice(0, 5).map((sess) => {
          const pct = (sess.bookedSlots / sess.slots) * 100;
          return (
            <Card key={sess.id} style={s.sessionCard}>
              <View style={s.sessionTop}>
                <View style={[s.sessionDot, { backgroundColor: sess.color }]} />
                <Text style={s.sessionName}>{sess.name}</Text>
                <Text style={s.sessionTime}>{sess.time}</Text>
              </View>
              <View style={s.barTrack}>
                <View style={[s.bar, { width: `${pct}%` as any, backgroundColor: sess.color }]} />
              </View>
              <Text style={s.sessionMeta}>{sess.bookedSlots}/{sess.slots} booked · {sess.coach}</Text>
            </Card>
          );
        })}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: COLORS.background },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:    { width: 40 },
  backText:   { fontSize: 22, color: COLORS.primary },
  title:      { fontSize: 18, fontWeight: '700', color: COLORS.text },
  liveBadge:  { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.error, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
  liveText:   { color: '#fff', fontSize: 11, fontWeight: '800' },
  pulseDot:   { width: 7, height: 7, borderRadius: 4 },
  content:    { padding: SPACING.lg },
  clockCard:  { backgroundColor: '#1A1A2E', borderRadius: RADIUS.xl, padding: SPACING.xl, marginBottom: SPACING.lg, alignItems: 'center' },
  clockTime:  { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  clockDate:  { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  statsGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: SPACING.lg },
  statCard:   { width: (width - SPACING.lg * 2 - 10) / 2, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 0.5, borderColor: COLORS.border, borderTopWidth: 3, alignItems: 'center', ...SHADOW.sm },
  statEmoji:  { fontSize: 22, marginBottom: 4 },
  statValue:  { fontSize: 24, fontWeight: '900' },
  statLabel:  { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  sessionCard:{ marginBottom: SPACING.sm },
  sessionTop: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  sessionDot: { width: 8, height: 8, borderRadius: 4 },
  sessionName:{ fontSize: 14, fontWeight: '700', color: COLORS.text, flex: 1 },
  sessionTime:{ fontSize: 12, color: COLORS.textSecondary },
  barTrack:   { height: 5, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden', marginVertical: 4 },
  bar:        { height: 5, borderRadius: 3 },
  sessionMeta:{ fontSize: 11, color: COLORS.textMuted },
});
