// src/components/UI/Button.tsx
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
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

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
type ButtonSize   = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftEmoji?: string;
  rightEmoji?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; text: string; border: string }> = {
  primary:   { bg: COLORS.primary,    text: '#fff',           border: 'transparent' },
  secondary: { bg: COLORS.secondary,  text: '#fff',           border: 'transparent' },
  outline:   { bg: 'transparent',     text: COLORS.primary,   border: COLORS.primary },
  ghost:     { bg: 'transparent',     text: COLORS.primary,   border: 'transparent' },
  danger:    { bg: COLORS.error,      text: '#fff',           border: 'transparent' },
  dark:      { bg: '#1A1A2E',         text: '#fff',           border: 'rgba(255,255,255,0.15)' },
};

const SIZE_STYLES: Record<ButtonSize, { py: number; px: number; fontSize: number; radius: number }> = {
  xs: { py: 5,  px: 10, fontSize: 12, radius: RADIUS.sm },
  sm: { py: 8,  px: 14, fontSize: 13, radius: RADIUS.md },
  md: { py: 13, px: 20, fontSize: 15, radius: RADIUS.md },
  lg: { py: 16, px: 24, fontSize: 16, radius: RADIUS.lg },
  xl: { py: 18, px: 28, fontSize: 17, radius: RADIUS.lg },
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftEmoji,
  rightEmoji,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const v = VARIANT_STYLES[variant];
  const s = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: variant === 'outline' || variant === 'dark' ? 1.5 : 0,
          paddingVertical: s.py,
          paddingHorizontal: s.px,
          borderRadius: s.radius,
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'auto',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' || variant === 'danger' || variant === 'dark' ? '#fff' : COLORS.primary}
          size="small"
        />
      ) : (
        <View style={styles.inner}>
          {leftEmoji  && <Text style={[styles.emoji, { fontSize: s.fontSize }]}>{leftEmoji}</Text>}
          <Text
            style={[
              styles.label,
              { color: v.text, fontSize: s.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightEmoji && <Text style={[styles.emoji, { fontSize: s.fontSize }]}>{rightEmoji}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  emoji: {
    lineHeight: 22,
  },
});

export default Button;