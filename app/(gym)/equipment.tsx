import { Card, SectionHeader } from '@/components/UI';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useGymStore } from '@/store/gymStore';
import type { Equipment } from '@/types';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// ─── Sub-components ───────────────────────────────────────────────────────────

function AvailabilityDot({ ratio }: { ratio: number }) {
  const color =
    ratio === 0 ? COLORS.error : ratio < 0.3 ? COLORS.amber : COLORS.success;
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

function EquipmentBar({ available, total }: { available: number; total: number }) {
  const ratio = total > 0 ? available / total : 0;
  const color =
    ratio === 0 ? COLORS.error : ratio < 0.3 ? COLORS.amber : COLORS.success;
  return (
    <View style={styles.barTrack}>
      <View
        style={[
          styles.bar,
          { width: `${ratio * 100}%` as any, backgroundColor: color },
        ]}
      />
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EquipmentScreen() {
  const { equipment } = useGymStore();
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time polling every 30 s
  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise<void>((r) => setTimeout(r, 1000));
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  // All equipment items are guaranteed to have total / available (see types)
  const totalAvailable = equipment.reduce((s, e) => s + e.available, 0);
  const totalEquipment = equipment.reduce((s, e) => s + e.total, 0);
  const busyEquipment  = equipment.filter((e) => e.available === 0);
  const gymLoad =
    totalEquipment > 0
      ? Math.round(((totalEquipment - totalAvailable) / totalEquipment) * 100)
      : 0;

  const loadColor =
    gymLoad > 80 ? COLORS.error : gymLoad > 50 ? COLORS.amber : COLORS.success;
  const loadLabel =
    gymLoad > 80 ? 'Very Busy 🔴' : gymLoad > 50 ? 'Moderate 🟡' : 'Light 🟢';

  // Group items by location — location is always a string (required field)
  const locations = [...new Set(equipment.map((e) => e.location))];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Equipment Status</Text>
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>
            Live · Updated{' '}
            {lastUpdated.toLocaleTimeString('en-PH', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>

      {/* Gym load overview */}
      <Card style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Gym Load</Text>
        <View style={styles.overviewRow}>
          <View>
            <Text style={[styles.loadPercent, { color: loadColor }]}>
              {gymLoad}%
            </Text>
            <Text style={styles.loadLabel}>{loadLabel}</Text>
          </View>
          <View style={styles.overviewStats}>
            {[
              { value: totalAvailable,              label: 'Available', color: undefined        },
              { value: totalEquipment - totalAvailable, label: 'In use',   color: COLORS.error   },
              { value: totalEquipment,              label: 'Total',    color: undefined        },
            ].map((s) => (
              <View key={s.label} style={styles.overviewStat}>
                <Text style={[styles.overviewValue, s.color ? { color: s.color } : undefined]}>
                  {s.value}
                </Text>
                <Text style={styles.overviewStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Load bar */}
        <View style={[styles.barTrack, styles.loadBarTrack]}>
          <View
            style={[
              styles.bar,
              styles.loadBar,
              { width: `${gymLoad}%` as any, backgroundColor: loadColor },
            ]}
          />
        </View>
      </Card>

      {/* Full-equipment alert */}
      {busyEquipment.length > 0 && (
        <View style={styles.alertBox}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Equipment fully in use</Text>
            <Text style={styles.alertSub}>
              {busyEquipment.map((e) => e.name).join(', ')}
            </Text>
          </View>
        </View>
      )}

      {/* Equipment grouped by location */}
      {locations.map((location) => {
        const items = equipment.filter((e) => e.location === location);
        return (
          <View key={location}>
            <SectionHeader title={location} />
            <Card style={styles.locationCard}>
              {items.map((item: Equipment, i) => {
                const ratio   = item.total > 0 ? item.available / item.total : 0;
                const isFull  = item.available === 0;
                const isAll   = item.available === item.total;
                const status  = isFull ? 'Full' : isAll ? 'All free' : `${item.available} of ${item.total} free`;
                const statusColor =
                  isFull ? COLORS.error
                  : item.available < item.total * 0.3 ? COLORS.amber
                  : COLORS.success;

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.equipRow,
                      i < items.length - 1 && styles.equipBorder,
                    ]}
                  >
                    <View style={styles.equipLeft}>
                      <AvailabilityDot ratio={ratio} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.equipName}>{item.name}</Text>
                        <EquipmentBar
                          available={item.available}
                          total={item.total}
                        />
                      </View>
                    </View>
                    <Text style={[styles.equipStatus, { color: statusColor }]}>
                      {status}
                    </Text>
                  </View>
                );
              })}
            </Card>
          </View>
        );
      })}

      {/* Peak hours tips */}
      <Card style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Peak hours today</Text>
        {[
          { time: '7–9 AM',   load: 85, label: 'Very busy'       },
          { time: '12–2 PM',  load: 70, label: 'Busy'            },
          { time: '5–8 PM',   load: 92, label: 'Extremely busy'  },
          { time: '9–11 AM',  load: 30, label: 'Quiet ✓'         },
        ].map((h) => (
          <View key={h.time} style={styles.tipRow}>
            <Text style={styles.tipTime}>{h.time}</Text>
            <View
              style={[
                styles.tipBar,
                {
                  width: `${h.load}%` as any,
                  backgroundColor:
                    h.load > 80 ? COLORS.error
                    : h.load > 60 ? COLORS.amber
                    : COLORS.success,
                },
              ]}
            />
            <Text style={styles.tipLabel}>{h.label}</Text>
          </View>
        ))}
      </Card>

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: COLORS.background },
  content:           { padding: SPACING.lg },
  header:            { paddingTop: 54, paddingBottom: SPACING.md },
  title:             { fontSize: 26, fontWeight: '700', color: COLORS.text },
  liveRow:           { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  liveDot:           { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  liveText:          { fontSize: 12, color: COLORS.textSecondary },

  overviewCard:      { marginBottom: SPACING.lg },
  overviewTitle:     { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, marginBottom: SPACING.sm },
  overviewRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  loadPercent:       { fontSize: 40, fontWeight: '800' },
  loadLabel:         { fontSize: 14, color: COLORS.textSecondary },
  overviewStats:     { flexDirection: 'row', gap: SPACING.lg },
  overviewStat:      { alignItems: 'center' },
  overviewValue:     { fontSize: 22, fontWeight: '700', color: COLORS.text },
  overviewStatLabel: { fontSize: 11, color: COLORS.textSecondary },

  barTrack:          { height: 5, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  bar:               { height: 5, borderRadius: 3 },
  loadBarTrack:      { height: 8, marginTop: SPACING.sm },
  loadBar:           { height: 8 },

  alertBox:          { flexDirection: 'row', gap: SPACING.md, backgroundColor: '#FEF3C7', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, alignItems: 'flex-start' },
  alertIcon:         { fontSize: 20 },
  alertTitle:        { fontSize: 14, fontWeight: '600', color: '#92400E' },
  alertSub:          { fontSize: 13, color: '#B45309', marginTop: 2 },

  locationCard:      { marginBottom: SPACING.lg, padding: 0, overflow: 'hidden' },
  equipRow:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  equipBorder:       { borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  equipLeft:         { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  dot:               { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  equipName:         { fontSize: 14, fontWeight: '500', color: COLORS.text, marginBottom: 4 },
  equipStatus:       { fontSize: 13, fontWeight: '600', flexShrink: 0 },

  tipsCard:          { marginBottom: SPACING.lg },
  tipsTitle:         { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  tipRow:            { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  tipTime:           { fontSize: 12, color: COLORS.textSecondary, width: 70 },
  tipBar:            { height: 8, borderRadius: 4, maxWidth: 120 },
  tipLabel:          { fontSize: 12, color: COLORS.textSecondary, flex: 1 },
});
