import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useCoachApplicationStore } from '@/store/coachApplicationStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SPECIALTY_OPTIONS = ['HIIT', 'Yoga', 'Boxing', 'Strength', 'Cardio', 'Full Body'];

// Lookup map avoids TS narrowing issues that chained ternaries cause
// when myApplication.status has already been narrowed by an outer `if`.
const STATUS_COLORS: Record<string, string> = {
  approved:  COLORS.success,
  rejected:  COLORS.error,
  pending:   COLORS.warning,
  reviewing: COLORS.warning,
};

export default function CoachApply() {
  const { submitApplication, loading, myApplication } = useCoachApplicationStore();
  const [formData, setFormData] = useState({
    applicantName:  '',
    applicantEmail: '',
    applicantPhone: '',
    experience:     '',
    bio:            '',
    portfolioNote:  '',
    expectedRate:   '',
    specialties:    [] as string[],
  });

  const toggleSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.applicantName.trim() || !formData.applicantEmail.trim() || !formData.expectedRate.trim()) {
      Alert.alert('Missing Fields', 'Please fill in name, email, and expected rate');
      return;
    }
    if (formData.specialties.length === 0) {
      Alert.alert('Missing Selection', 'Please select at least one specialty');
      return;
    }

    try {
      await submitApplication({
        applicantName:  formData.applicantName.trim(),
        applicantEmail: formData.applicantEmail.trim(),
        applicantPhone: formData.applicantPhone.trim(),
        experience:     formData.experience.trim(),
        bio:            formData.bio.trim(),
        portfolioNote:  formData.portfolioNote.trim(),
        expectedRate:   parseInt(formData.expectedRate, 10),
        specialties:    formData.specialties,
      });
      Alert.alert('Success', 'Your application has been submitted!');
      router.back();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to submit application';
      Alert.alert('Error', message);
    }
  };

  // ── Already applied ─────────────────────────────────────────────────────────
  if (myApplication && myApplication.status !== 'rejected') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Coach Application</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.statusTitle}>Your Application Status</Text>
          <Text style={[styles.status, { color: STATUS_COLORS[myApplication.status] }]}>
            {myApplication.status.toUpperCase()}
          </Text>
          {myApplication.reviewNote && (
            <Text style={styles.reviewNote}>{myApplication.reviewNote}</Text>
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    );
  }

  // ── Application form ────────────────────────────────────────────────────────
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Apply as Coach</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput style={styles.input} placeholder="Your full name" placeholderTextColor={COLORS.textMuted}
          value={formData.applicantName} onChangeText={(text) => setFormData((p) => ({ ...p, applicantName: text }))}
          editable={!loading} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email *</Text>
        <TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor={COLORS.textMuted}
          value={formData.applicantEmail} onChangeText={(text) => setFormData((p) => ({ ...p, applicantEmail: text }))}
          keyboardType="email-address" autoCapitalize="none" editable={!loading} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} placeholder="+63 XXX XXXX XXX" placeholderTextColor={COLORS.textMuted}
          value={formData.applicantPhone} onChangeText={(text) => setFormData((p) => ({ ...p, applicantPhone: text }))}
          keyboardType="phone-pad" editable={!loading} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Years of Experience</Text>
        <TextInput style={styles.input} placeholder="e.g., 5 years" placeholderTextColor={COLORS.textMuted}
          value={formData.experience} onChangeText={(text) => setFormData((p) => ({ ...p, experience: text }))}
          editable={!loading} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Expected Rate (₱/hour) *</Text>
        <TextInput style={styles.input} placeholder="500" placeholderTextColor={COLORS.textMuted}
          value={formData.expectedRate} onChangeText={(text) => setFormData((p) => ({ ...p, expectedRate: text }))}
          keyboardType="numeric" editable={!loading} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Specialties *</Text>
        <View style={styles.specialtyGrid}>
          {SPECIALTY_OPTIONS.map((specialty) => (
            <TouchableOpacity key={specialty}
              style={[styles.specialtyChip, formData.specialties.includes(specialty) && styles.specialtyChipActive]}
              onPress={() => toggleSpecialty(specialty)} disabled={loading}>
              <Text style={[styles.specialtyText, formData.specialties.includes(specialty) && styles.specialtyTextActive]}>
                {specialty}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Tell us about yourself..."
          placeholderTextColor={COLORS.textMuted} value={formData.bio}
          onChangeText={(text) => setFormData((p) => ({ ...p, bio: text }))} multiline numberOfLines={4} editable={!loading} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Portfolio / Certifications</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Share your portfolio link or certification details..."
          placeholderTextColor={COLORS.textMuted} value={formData.portfolioNote}
          onChangeText={(text) => setFormData((p) => ({ ...p, portfolioNote: text }))} multiline numberOfLines={4} editable={!loading} />
      </View>

      <TouchableOpacity style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitBtnText}>{loading ? 'Submitting...' : 'Submit Application'}</Text>
      </TouchableOpacity>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingBottom: SPACING.lg },
  back: { fontSize: 22, color: COLORS.primary, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  statusBox: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.xl, borderWidth: 0.5, borderColor: COLORS.border },
  statusTitle: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
  status: { fontSize: 20, fontWeight: '800', marginTop: SPACING.sm },
  reviewNote: { fontSize: 13, color: COLORS.textSecondary, marginTop: SPACING.md, lineHeight: 18 },
  section: { marginBottom: SPACING.lg },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  input: { backgroundColor: COLORS.card, borderWidth: 0.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, color: COLORS.text, fontSize: 14 },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: SPACING.md },
  specialtyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  specialtyChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card },
  specialtyChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  specialtyText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  specialtyTextActive: { color: '#fff' },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.xl },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
