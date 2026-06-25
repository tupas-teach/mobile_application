import React, { useState } from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { CONFIG } from '../../constants/config';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface CourtMapProps {
  style?: ViewStyle;
  compact?: boolean;
}

const CourtMap: React.FC<CourtMapProps> = ({ style, compact = false }) => {
  const [pressed, setPressed] = useState(false);

  const openMaps = () => {
    const url = `https://maps.google.com/?q=${CONFIG.lat},${CONFIG.lng}&query=FlexZone+Sports+Complex`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Maps unavailable', 'Could not open Google Maps. Please search for "FlexZone Sports Complex, Consolacion, Cebu."')
    );
  };

  if (compact) {
    return (
      <TouchableOpacity style={[styles.compact, style]} onPress={openMaps} activeOpacity={0.85}>
        <Text style={styles.compactPin}>📍</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.compactTitle}>{CONFIG.courtName}</Text>
          <Text style={styles.compactAddress}>{CONFIG.address}</Text>
        </View>
        <Text style={styles.compactArrow}>↗</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={openMaps}
      activeOpacity={0.92}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {/* Simulated map grid */}
      <View style={styles.mapArea}>
        {/* Grid lines */}
        {[...Array(5)].map((_, r) => (
          <View key={r} style={styles.mapRow}>
            {[...Array(10)].map((_, c) => (
              <View
                key={c}
                style={[
                  styles.mapCell,
                  r === 2 && c >= 3 && c <= 6 && styles.mapHighlight,
                ]}
              />
            ))}
          </View>
        ))}

        {/* Road lines */}
        <View style={styles.roadH} />
        <View style={styles.roadV} />

        {/* Pin marker */}
        <View style={styles.pinContainer}>
          <View style={styles.pinBubble}>
            <Text style={styles.pinEmoji}>🏟️</Text>
          </View>
          <View style={styles.pinShadow} />
          <Text style={styles.pinLabel}>FlexZone</Text>
        </View>

        {/* Overlay CTA */}
        <View style={styles.ctaOverlay}>
          <Text style={styles.ctaText}>▶ Open in Google Maps</Text>
        </View>
      </View>

      {/* Info footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerTitle}>{CONFIG.courtName}</Text>
          <Text style={styles.footerAddress}>{CONFIG.address}</Text>
        </View>
        <View style={styles.footerRight}>
          <View style={styles.openBadge}>
            <View style={styles.openDot} />
            <Text style={styles.openText}>Open</Text>
          </View>
          <Text style={styles.footerHours}>6 AM – 11 PM</Text>
        </View>
      </View>

      {/* Quick info row */}
      <View style={styles.infoRow}>
        {[
          { emoji: '🚗', label: 'Free parking (10 cars)' },
          { emoji: '📞', label: CONFIG.phone },
          { emoji: '📏', label: '~1.2 km away' },
        ].map((info) => (
          <View key={info.label} style={styles.infoItem}>
            <Text style={styles.infoEmoji}>{info.emoji}</Text>
            <Text style={styles.infoText}>{info.label}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  mapArea: {
    height: 140,
    backgroundColor: '#13132A',
    position: 'relative',
    overflow: 'hidden',
  },
  mapRow: {
    flexDirection: 'row',
    flex: 1,
  },
  mapCell: {
    flex: 1,
    borderWidth: 0.3,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  mapHighlight: {
    backgroundColor: 'rgba(29,158,117,0.12)',
  },
  roadH: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '35%',
    width: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  pinContainer: {
    position: 'absolute',
    top: '20%',
    left: '38%',
    alignItems: 'center',
  },
  pinBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  pinEmoji: { fontSize: 18 },
  pinShadow: {
    width: 10,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 5,
    marginTop: 2,
  },
  pinLabel: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
    backgroundColor: 'rgba(29,158,117,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  ctaOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    backgroundColor: 'rgba(29,158,117,0.9)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ctaText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  footerLeft: { flex: 1 },
  footerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  footerAddress: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  footerRight: { alignItems: 'flex-end', gap: 3 },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  openDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  openText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  footerHours: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  infoRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  infoEmoji: { fontSize: 12 },
  infoText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    flex: 1,
  },
  // Compact
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: '#1A1A2E',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  compactPin: { fontSize: 22 },
  compactTitle: { fontSize: 13, fontWeight: '700', color: '#fff' },
  compactAddress: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  compactArrow: { fontSize: 18, color: COLORS.primary },
});

export default CourtMap;