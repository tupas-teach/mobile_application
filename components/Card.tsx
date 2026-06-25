// src/components/UI/Card.tsx
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

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

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

type CardVariant = 'default' | 'flat' | 'elevated' | 'dark' | 'glass' | 'outlined';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: number;
  radius?: number;
}

const VARIANT_STYLES: Record<CardVariant, ViewStyle> = {
  default: {
    backgroundColor: COLORS.card,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  flat: {
    backgroundColor: COLORS.background,
    borderWidth: 0,
  },
  elevated: {
    backgroundColor: COLORS.card,
    borderWidth: 0,
    ...SHADOW.md,
  },
  dark: {
    backgroundColor: '#1A1A2E',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  glass: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  outlined: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
};

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
  onPress,
  padding = SPACING.lg,
  radius = RADIUS.lg,
}) => {
  const variantStyle = VARIANT_STYLES[variant];

  const composedStyle: ViewStyle[] = [
    styles.base,
    variantStyle,
    { borderRadius: radius, padding },
    style ?? {},
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.88}
        style={composedStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={composedStyle}>{children}</View>;
};

// ─── Sub-components ────────────────────────────────────────────────────────────

interface CardRowProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gap?: number;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
}

export const CardRow: React.FC<CardRowProps> = ({
  children,
  style,
  gap = SPACING.md,
  align = 'center',
  justify = 'flex-start',
}) => (
  <View style={[{ flexDirection: 'row', gap, alignItems: align, justifyContent: justify }, style]}>
    {children}
  </View>
);

interface CardDividerProps {
  color?: string;
  marginV?: number;
}

export const CardDivider: React.FC<CardDividerProps> = ({
  color = COLORS.border,
  marginV = SPACING.sm,
}) => (
  <View style={{ height: 0.5, backgroundColor: color, marginVertical: marginV }} />
);

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

export default Card;