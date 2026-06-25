// === EquipmentStatus.tsx ===
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

// --- Fix: Define types locally ---
interface Equipment {
  id: string;
  name: string;
  location: string;
  available: number;
  total: number;
}

interface EquipmentStatusProps {
  equipment: Equipment;
  style?: ViewStyle;
  showBar?: boolean;
}

// --- Fix: Define theme locally ---
const COLORS = {
  primary: '#185FA5', primaryDark: '#134c85', primaryLight: '#2a7bbd',
  secondary: '#1D9E75', amber: '#EF9F27', success: '#10B981', error: '#EF4444',
  errorLight: '#FEE2E2', background: '#0F0F1A', card: '#1A1A2E',
  text: '#FFFFFF', textSecondary: '#9CA3AF', textMuted: '#6B7280',
  border: 'rgba(255,255,255,0.08)',
};

const RADIUS = { sm: 6, md: 8, lg: 12, full: 9999 };
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

function getStatus(available: number, total: number) {
  const ratio = available / total;
  if (available === 0) return { label: 'Full', color: COLORS.error, bg: COLORS.errorLight };
  if (ratio < 0.3) return { label: 'Almost full', color: COLORS.amber, bg: '#FAEEDA' };
  if (ratio === 1) return { label: 'All free', color: COLORS.success, bg: COLORS.primaryLight };
  return { label: `${available} free`, color: COLORS.success, bg: COLORS.primaryLight };
}

const EquipmentStatus: React.FC<EquipmentStatusProps> = ({
  equipment,
  style,
  showBar = true,
}) => {
  const { label, color, bg } = getStatus(equipment.available, equipment.total);
  const ratio = equipment.available / equipment.total;

  return (
    <View style={[styles.row, style]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={styles.info}>
        <Text style={styles.name}>{equipment.name}</Text>
        <Text style={styles.location}>{equipment.location}</Text>
        {showBar && (
          <View style={styles.barTrack}>
            <View style={[styles.bar, { width: `${ratio * 100}%`, backgroundColor: color }]} />
          </View>
        )}
      </View>
      <View>
        <View style={[styles.statusPill, { backgroundColor: bg }]}>
          <Text style={[styles.statusText, { color }]}>{label}</Text>
        </View>
        <Text style={styles.countText}>
          {equipment.available}/{equipment.total}
        </Text>
      </View>
    </View>
  );
};

// --- List version ---
interface EquipmentListProps {
  equipment: Equipment[];
  style?: ViewStyle;
}

export const EquipmentList: React.FC<EquipmentListProps> = ({ equipment, style }) => (
  <View style={[styles.list, style]}>
    {equipment.map((item, i) => (
      <View key={item.id}>
        <EquipmentStatus equipment={item} />
        {i < equipment.length - 1 && <View style={styles.divider} />}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.sm },
  dot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0, marginTop: 2, alignSelf: 'flex-start' },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  location: { fontSize: 11, color: COLORS.textMuted },
  barTrack: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, marginTop: 4, overflow: 'hidden' },
  bar: { height: 4, borderRadius: 2 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, alignSelf: 'flex-end' },
  statusText: { fontSize: 11, fontWeight: '700' },
  countText: { fontSize: 10, color: COLORS.textMuted, textAlign: 'right', marginTop: 2 },
  list: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 0.5, borderColor: COLORS.border },
  divider: { height: 0.5, backgroundColor: COLORS.border, marginLeft: SPACING.xxl },
});

export default EquipmentStatus;