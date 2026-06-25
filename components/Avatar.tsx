// src/components/UI/Avatar.tsx
import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';

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

interface AvatarProps {
  initials?: string;
  uri?: string;
  color?: string;
  size?: number;
  style?: ViewStyle;
  showOnline?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  initials = '?',
  uri,
  color = COLORS.primary,
  size = 44,
  style,
  showOnline = false,
}) => {
  return (
    <View style={[{ width: size, height: size }, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <View
          style={[
            styles.initials,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color + '20',
              borderColor: color + '40',
            },
          ]}
        >
          <Text
            style={[
              styles.initialsText,
              { color, fontSize: size * 0.32, lineHeight: size * 0.38 },
            ]}
          >
            {initials.slice(0, 2).toUpperCase()}
          </Text>
        </View>
      )}

      {showOnline && (
        <View
          style={[
            styles.onlineDot,
            {
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: size * 0.14,
              bottom: 0,
              right: 0,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  initials: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  initialsText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  onlineDot: {
    position: 'absolute',
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
});

export default Avatar;