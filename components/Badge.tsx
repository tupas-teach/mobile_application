// src/components/UI/Badge.tsx
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

// --- Fix: Define theme locally ---
const COLORS = {
  primary: '#185FA5',
  primaryDark: '#134c85',
  primaryLight: '#2a7bbd',
  secondary: '#1D9E75',
  amber: '#EF9F27',
  success: '#10B981',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  background: '#0F0F1A',
  card: '#1A1A2E',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  border: 'rgba(255,255,255,0.08)',
};

const RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

type BadgeVariant = 'solid' | 'soft' | 'outline';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
type BadgeColor = 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'gray' | 'custom';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  badgeColor?: BadgeColor;
  color?: string;
  bgColor?: string;
  emoji?: string;
  style?: ViewStyle;
  dot?: boolean;
}

const COLOR_MAP: Record<BadgeColor, { text: string; bg: string; border: string }> = {
  green:  { text: '#0F6E56', bg: '#E1F5EE', border: '#1D9E75' },
  blue:   { text: '#185FA5', bg: '#E6F1FB', border: '#2E86C1' },
  amber:  { text: '#854F0B', bg: '#FAEEDA', border: '#EF9F27' },
  red:    { text: '#9B1C1C', bg: '#FCEBEB', border: '#E24B4A' },
  purple: { text: '#3C3489', bg: '#EEEDFE', border: '#534AB7' },
  gray:   { text: '#374151', bg: '#F3F4F6', border: '#9CA3AF' },
  custom: { text: COLORS.primary, bg: COLORS.primaryLight, border: COLORS.primary },
};

const SIZE_MAP: Record<BadgeSize, { px: number; py: number; fontSize: number }> = {
  xs: { px: 5,  py: 1, fontSize: 9  },
  sm: { px: 7,  py: 2, fontSize: 11 },
  md: { px: 10, py: 4, fontSize: 12 },
  lg: { px: 14, py: 6, fontSize: 14 },
};

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'soft',
  size = 'md',
  badgeColor = 'green',
  color,
  bgColor,
  emoji,
  style,
  dot = false,
}) => {
  const palette = COLOR_MAP[badgeColor];
  const sizing  = SIZE_MAP[size];

  const textColor = color  ?? palette.text;
  const bg        = bgColor ?? (variant === 'solid' ? palette.border : variant === 'outline' ? 'transparent' : palette.bg);
  const border    = variant === 'outline' ? palette.border : 'transparent';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderColor: border,
          paddingHorizontal: sizing.px,
          paddingVertical: sizing.py,
          borderWidth: variant === 'outline' ? 1.5 : 0,
        },
        style,
      ]}
    >
      {dot && (
        <View
          style={[
            styles.dot,
            { backgroundColor: variant === 'solid' ? '#fff' : palette.border },
          ]}
        />
      )}
      {emoji && <Text style={[styles.emoji, { fontSize: sizing.fontSize }]}>{emoji}</Text>}
      <Text
        style={[
          styles.label,
          {
            color: variant === 'solid' ? '#fff' : textColor,
            fontSize: sizing.fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: RADIUS.full,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  emoji: {
    lineHeight: 18,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});

export default Badge;