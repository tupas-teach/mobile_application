/**
 * app/(auth)/register.tsx
 *
 * FIX: register() now passes `phone` to authStore.
 * Previously phone was collected but never sent — backend rejected it
 * silently or registration succeeded but phone was null.
 *
 * Also: success modal navigates to login (not auto-login) so the
 * root _layout.tsx guard handles the redirect cleanly.
 */

import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Modal, Platform,
  ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { Badge, Button } from '../../components/UI';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export default function RegisterScreen() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [phone, setPhone]     = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed]   = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { register, isLoading } = useAuthStore();

  const validatePhone = (p: string) => /^(09|\+639)\d{9}$/.test(p.trim());
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  // Build the full PH number from the prefix + digits the user typed
  const fullPhone = phone.startsWith('09') || phone.startsWith('+639')
    ? phone
    : `09${phone}`;

  const handleRegister = async () => {
    if (!name.trim())                           return Alert.alert('Missing field', 'Please enter your full name.');
    if (!email.trim() || !validateEmail(email)) return Alert.alert('Invalid email', 'Please enter a valid email address.');
    if (!phone.trim() || !validatePhone(fullPhone)) return Alert.alert('Invalid phone', 'Please enter a valid PH mobile number (e.g. 09171234567).');
    if (!password.trim())                       return Alert.alert('Missing field', 'Please enter a password.');
    if (password.length < 8)                    return Alert.alert('Weak password', 'Password must be at least 8 characters.');
    if (password !== confirm)                   return Alert.alert('Password mismatch', 'Passwords do not match.');
    if (!agreed)                                return Alert.alert('Terms required', 'Please agree to the Terms & Privacy Policy.');

    try {
      // ✅ FIX: pass phone as 4th argument
      await register(name, email, password, fullPhone);
      setShowSuccess(true);
    } catch (err: any) {
      Alert.alert('Registration failed', err.message || 'Something went wrong. Please try again.');
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColor = ['transparent', COLORS.error, COLORS.amber, COLORS.success][strength];
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'][strength];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>FLEX<Text style={styles.logoAccent}>ZONE</Text></Text>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Start your fitness journey today</Text>
        </View>

        <View style={styles.planBadge}>
          <Text style={styles.planIcon}>🎉</Text>
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={styles.planTitle}>Free Basic plan to start</Text>
            <Text style={styles.planSub}>Upgrade anytime to Premium or VIP Elite</Text>
          </View>
          <Badge label="P599/mo" color={COLORS.primaryDark} bgColor={COLORS.primaryLight} />
        </View>

        <View style={styles.form}>
          {/* Full name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full name</Text>
            <TextInput style={styles.input} placeholder="Juan Dela Cruz" placeholderTextColor={COLORS.textMuted}
              value={name} onChangeText={setName} autoCapitalize="words" autoCorrect={false} />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email address</Text>
            <TextInput style={styles.input} placeholder="you@email.com" placeholderTextColor={COLORS.textMuted}
              value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile number</Text>
            <View style={styles.phoneRow}>
              <View style={styles.phonePrefix}>
                <Text style={styles.phonePrefixText}>+63</Text>
              </View>
              <TextInput
                style={[styles.input, styles.phoneInput]}
                placeholder="9171234567"
                placeholderTextColor={COLORS.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={11}
              />
            </View>
            <Text style={styles.hintText}>Enter 10 digits after +63, e.g. 9171234567</Text>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="Min. 8 characters" placeholderTextColor={COLORS.textMuted}
              value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
            {password.length > 0 && (
              <View style={styles.strengthRow}>
                {[1, 2, 3].map((i) => (
                  <View key={i} style={[styles.strengthBar, { backgroundColor: i <= strength ? strengthColor : COLORS.border }]} />
                ))}
                <Text style={[styles.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
              </View>
            )}
          </View>

          {/* Confirm password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              style={[styles.input, confirm.length > 0 && confirm !== password && { borderColor: COLORS.error }]}
              placeholder="Repeat your password" placeholderTextColor={COLORS.textMuted}
              value={confirm} onChangeText={setConfirm} secureTextEntry autoCapitalize="none" />
            {confirm.length > 0 && confirm !== password && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

          {/* Terms */}
          <TouchableOpacity style={styles.checkRow} onPress={() => setAgreed(!agreed)} activeOpacity={0.8}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>
              I agree to the <Text style={styles.link}>Terms of Service</Text>{' and '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <Button title="Create Account" onPress={handleRegister} loading={isLoading} style={{ marginTop: SPACING.sm }} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── Success Modal ─────────────────────────────────────────────── */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.successTitle}>Account Created!</Text>
            <Text style={styles.successSub}>
              Welcome to FlexZone, <Text style={{ fontWeight: '700' }}>{name}</Text>!{'\n'}
              Your account has been successfully created.
            </Text>
            <View style={styles.successInfo}>
              <Text style={styles.successInfoText}>📧 {email}</Text>
              <Text style={styles.successInfoText}>📱 {fullPhone}</Text>
              <Text style={styles.successInfoText}>🏅 Basic Member</Text>
            </View>
            {/* Navigate to gym — root _layout guard will allow since isAuthenticated = true */}
            <TouchableOpacity
              style={styles.successBtn}
              onPress={() => {
                setShowSuccess(false);
                router.replace('/(gym)');
              }}
            >
              <Text style={styles.successBtnText}>Get Started 🚀</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: COLORS.background },
  scroll:           { flexGrow: 1, padding: SPACING.xl },
  header:           { alignItems: 'center', paddingTop: 50, paddingBottom: SPACING.xl },
  logo:             { fontSize: 28, fontWeight: '800', color: COLORS.primaryDark, letterSpacing: -1, marginBottom: SPACING.lg },
  logoAccent:       { color: COLORS.primary },
  title:            { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  subtitle:         { fontSize: 15, color: COLORS.textSecondary },
  planBadge:        { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.primary + '30' },
  planIcon:         { fontSize: 22 },
  planTitle:        { fontSize: 14, fontWeight: '600', color: COLORS.primaryDark },
  planSub:          { fontSize: 12, color: COLORS.primary },
  form:             {},
  inputGroup:       { marginBottom: SPACING.md },
  label:            { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input:            { backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 15, color: COLORS.text },
  phoneRow:         { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  phonePrefix:      { backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, justifyContent: 'center' },
  phonePrefixText:  { fontSize: 15, color: COLORS.text, fontWeight: '600' },
  phoneInput:       { flex: 1 },
  hintText:         { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  strengthRow:      { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  strengthBar:      { flex: 1, height: 4, borderRadius: 2, marginRight: SPACING.sm },
  strengthLabel:    { fontSize: 12, fontWeight: '600', minWidth: 40 },
  errorText:        { fontSize: 12, color: COLORS.error, marginTop: 2 },
  checkRow:         { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.md },
  checkbox:         { width: 20, height: 20, borderRadius: 5, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginTop: 1, marginRight: SPACING.sm },
  checkboxChecked:  { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkLabel:       { flex: 1, fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  link:             { color: COLORS.primary, fontWeight: '500' },
  footer:           { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.md, paddingBottom: SPACING.xl },
  footerText:       { fontSize: 15, color: COLORS.textSecondary },
  footerLink:       { fontSize: 15, color: COLORS.primary, fontWeight: '600' },
  modalOverlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  modalCard:        { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', width: '100%' },
  successEmoji:     { fontSize: 56, marginBottom: SPACING.md },
  successTitle:     { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm },
  successSub:       { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.lg },
  successInfo:      { backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md, width: '100%', marginBottom: SPACING.lg, gap: SPACING.xs },
  successInfoText:  { fontSize: 14, color: COLORS.text },
  successBtn:       { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, width: '100%', alignItems: 'center' },
  successBtnText:   { color: '#fff', fontSize: 16, fontWeight: '700' },
});