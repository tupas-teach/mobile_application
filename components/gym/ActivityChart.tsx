import React from 'react';
import { Dimensions, StyleSheet, Text, View, ViewStyle } from 'react-native';

// --- Fix: Define theme locally ---
const COLORS = {
  primary: '#185FA5', primaryDark: '#134c85', primaryLight: '#2a7bbd',
  secondary: '#1D9E75', amber: '#EF9F27', success: '#10B981', error: '#EF4444',
  errorLight: '#FEE2E2', background: '#0F0F1A', card: '#1A1A2E',
  text: '#FFFFFF', textSecondary: '#9CA3AF', textMuted: '#6B7280',
  border: 'rgba(255,255,255,0.08)',
};

// --- Fix: Add 'xs' to RADIUS ---
const RADIUS = { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, full: 9999 };
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DataPoint {
  label: string;
  value: number;
  highlight?: boolean;
}

interface ActivityChartProps {
  data: DataPoint[];
  title?: string;
  subtitle?: string;
  unit?: string;
  color?: string;
  showValues?: boolean;
  style?: ViewStyle;
}

const ActivityChart: React.FC<ActivityChartProps> = ({
  data,
  title,
  subtitle,
  unit = 'sessions',
  color = COLORS.primary,
  showValues = false,
  style,
}) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((s, d) => s + d.value, 0);
  const avg = total / data.length;

  return (
    <View style={[styles.container, style]}>
      {(title || subtitle) && (
        <View style={styles.header}>
          <View>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color }]}>{total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color }]}>{avg.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avg/day</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.chart}>
        {data.map((d, i) => {
          const heightPct = max > 0 ? (d.value / max) : 0;
          const barColor = d.highlight ? color : color + '60';
          return (
            <View key={i} style={styles.barCol}>
              {showValues && d.value > 0 && (
                <Text style={[styles.barValueLabel, { color }]}>{d.value}</Text>
              )}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max(heightPct * 100, 4)}%`,
                      backgroundColor: barColor,
                      borderRadius: heightPct === 1 ? RADIUS.sm : RADIUS.xs,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, d.highlight && { color, fontWeight: '700' }]}>
                {d.label}
              </Text>
            </View>
          );
        })}
      </View>

      {total > 0 && (
        <View style={styles.avgRow}>
          <View style={[styles.avgLine, { backgroundColor: color + '40' }]} />
          <Text style={[styles.avgLabel, { color }]}>Avg: {avg.toFixed(1)} {unit}</Text>
        </View>
      )}
    </View>
  );
};

// --- Streak chart variant ---
interface StreakChartProps {
  days: boolean[];
  label?: string;
  style?: ViewStyle;
}

export const StreakChart: React.FC<StreakChartProps> = ({ days, label = 'This week', style }) => {
  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const count = days.filter(Boolean).length;

  return (
    <View style={[streak.container, style]}>
      <View style={streak.header}>
        <Text style={streak.label}>{label}</Text>
        <Text style={streak.count}>{count}/7 days 🔥</Text>
      </View>
      <View style={streak.dots}>
        {days.map((active, i) => (
          <View key={i} style={streak.col}>
            <View style={[streak.dot, active ? streak.dotActive : streak.dotInactive]} />
            <Text style={streak.dayLabel}>{DAY_LABELS[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const streak = StyleSheet.create({
  container: { gap: SPACING.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  count: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  dots: { flexDirection: 'row', gap: SPACING.sm },
  col: { flex: 1, alignItems: 'center', gap: 4 },
  dot: { width: 36, height: 36, borderRadius: 18 },
  dotActive: { backgroundColor: COLORS.primary },
  dotInactive: { backgroundColor: COLORS.border },
  dayLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },
});

const styles = StyleSheet.create({
  container: { gap: SPACING.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.sm },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
  statDivider: { width: 1, height: 28, backgroundColor: COLORS.border },
  chart: { flexDirection: 'row', height: 90, gap: 6, alignItems: 'flex-end' },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 4 },
  barValueLabel: { fontSize: 9, fontWeight: '700' },
  barTrack: { flex: 1, width: '100%', justifyContent: 'flex-end', backgroundColor: COLORS.background, borderRadius: RADIUS.xs, overflow: 'hidden' },
  bar: { width: '100%' },
  barLabel: { fontSize: 10, color: COLORS.textSecondary },
  avgRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avgLine: { flex: 1, height: 1 },
  avgLabel: { fontSize: 11, fontWeight: '600' },
});

export default ActivityChart;