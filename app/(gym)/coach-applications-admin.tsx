import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useCoachApplicationStore } from '@/store/coachApplicationStore';
import type { ApplicationStatus } from '@/types';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CoachApplicationsAdmin() {
  const { applications, fetchApplications, adminUpdateStatus, loading } = useCoachApplicationStore();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleSet = async (id: string, status: ApplicationStatus) => {
    try {
      await adminUpdateStatus(id, status);
      Alert.alert('Updated', `Application ${status}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update';
      Alert.alert('Error', message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Coach Applications</Text>
        <View style={{ width: 40 }} />
      </View>

      {applications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No applications found</Text>
        </View>
      ) : (
        applications.map((app) => (
          <View key={app.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{app.applicantName}</Text>
              <Text style={styles.meta}>{app.experience} · ₱{app.expectedRate}/hr</Text>
              <Text style={styles.metaSmall}>{app.specialties?.join(', ')}</Text>
              <Text style={styles.sub}>{app.status.toUpperCase()} · {new Date(app.submittedAt).toLocaleString()}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: COLORS.success }]}
                disabled={loading}
                onPress={() => handleSet(app.id, 'approved')}>
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: COLORS.error, marginTop: 8 }]}
                disabled={loading}
                onPress={() => handleSet(app.id, 'rejected')}>
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: COLORS.background },
  content:    { padding: SPACING.lg },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingBottom: SPACING.lg },
  back:       { fontSize: 22, color: COLORS.primary, fontWeight: '600' },
  title:      { fontSize: 20, fontWeight: '700', color: COLORS.text },
  empty:      { paddingTop: 80, alignItems: 'center' },
  emptyText:  { color: COLORS.textSecondary },
  card:       { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 0.5, borderColor: COLORS.border },
  name:       { fontSize: 15, fontWeight: '800', color: COLORS.text },
  meta:       { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },
  metaSmall:  { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  sub:        { fontSize: 12, color: COLORS.textMuted, marginTop: 6 },
  actions:    { marginLeft: 12, alignItems: 'flex-end' },
  btn:        { paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.md },
  btnText:    { color: '#fff', fontWeight: '700' },
});

