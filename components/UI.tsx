import { COLORS, RADIUS, SHADOW, SPACING } from '@/constants/theme';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  /** 'primary' and 'solid' both map to a filled green button */
  variant?: 'primary' | 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isSolid    = variant === 'primary' || variant === 'solid';
  const isOutline  = variant === 'outline';
  const isGhost    = variant === 'ghost';

  const paddingVertical  = size === 'sm' ? 9  : size === 'lg' ? 16 : 13;
  const fontSize         = size === 'sm' ? 13 : size === 'lg' ? 17 : 15;

  return (
    <TouchableOpacity
      style={[
        btn.base,
        isSolid   && btn.solid,
        isOutline && btn.outline,
        isGhost   && btn.ghost,
        isDisabled && btn.disabled,
        { paddingVertical },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isSolid ? '#fff' : COLORS.primary} />
      ) : (
        <Text style={[
          btn.text,
          (isOutline || isGhost) && btn.textAlt,
          { fontSize },
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const btn = StyleSheet.create({
  base:    { borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.lg },
  solid:   { backgroundColor: COLORS.primary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
  ghost:   { backgroundColor: 'transparent' },
  disabled:{ opacity: 0.5 },
  text:    { color: '#fff', fontWeight: '700' },
  textAlt: { color: COLORS.primary },
});

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** When provided, Card renders as TouchableOpacity */
  onPress?: () => void;
}

export function Card({ children, style, onPress }: CardProps) {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={[card.base, style]}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[card.base, style]}>{children}</View>;
}

const card = StyleSheet.create({
  base: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
});

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md';
}

export function Badge({
  label,
  color   = COLORS.primary,
  bgColor = COLORS.primaryLight,
  size    = 'md',
}: BadgeProps) {
  return (
    <View style={[
      badge.wrap,
      {
        backgroundColor:  bgColor,
        paddingHorizontal: size === 'sm' ? 6  : 10,
        paddingVertical:   size === 'sm' ? 2  : 4,
      },
    ]}>
      <Text style={[badge.text, { color, fontSize: size === 'sm' ? 10 : 12 }]}>
        {label}
      </Text>
    </View>
  );
}

const badge = StyleSheet.create({
  wrap: { borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  text: { fontWeight: '700' },
});

// ─── Avatar ───────────────────────────────────────────────────────────────────
interface AvatarProps {
  initials: string;
  color?: string;
  size?: number;
}

export function Avatar({ initials, color = COLORS.primary, size = 48 }: AvatarProps) {
  return (
    <View style={[
      av.wrap,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '25' },
    ]}>
      <Text style={[av.text, { color, fontSize: size * 0.33 }]}>{initials}</Text>
    </View>
  );
}

const av = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: '800' },
});

// ─── SectionHeader ────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <View style={sh.row}>
      <Text style={sh.title}>{title}</Text>
      {action && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={sh.action}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const sh = StyleSheet.create({
  row:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md, marginTop: SPACING.sm },
  title:  { fontSize: 17, fontWeight: '800', color: COLORS.text },
  action: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
});

// ─── IntensityBar ─────────────────────────────────────────────────────────────
interface IntensityBarProps {
  level: 'Low' | 'Medium' | 'High';
}

export function IntensityBar({ level }: IntensityBarProps) {
  const LEVELS = { Low: 1, Medium: 2, High: 3 };
  const CLRS   = { Low: COLORS.success, Medium: COLORS.amber, High: COLORS.error };
  const count  = LEVELS[level];
  const color  = CLRS[level];
  return (
    <View style={ib.row}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={[ib.bar, { backgroundColor: i <= count ? color : COLORS.border }]} />
      ))}
      <Text style={[ib.label, { color }]}>{level}</Text>
    </View>
  );
}

const ib = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center' },
  bar:   { width: 8, height: 14, borderRadius: 2, marginRight: 2 },
  label: { fontSize: 10, fontWeight: '600', marginLeft: 4 },
});

// ─── EmptyState ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ emoji, title, subtitle }: EmptyStateProps) {
  return (
    <View style={es.wrap}>
      <Text style={es.emoji}>{emoji}</Text>
      <Text style={es.title}>{title}</Text>
      {subtitle && <Text style={es.sub}>{subtitle}</Text>}
    </View>
  );
}

const es = StyleSheet.create({
  wrap:  { alignItems: 'center', paddingVertical: SPACING.xxl },
  emoji: { fontSize: 40, marginBottom: SPACING.md },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  sub:   { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
});
