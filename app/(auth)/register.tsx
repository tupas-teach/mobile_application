/**
 * ✅ FIX 04 — app/(auth)/register.tsx
 *
 * PROBLEM:
 *   Same as login.tsx — after await register() succeeded, the screen called:
 *     router.replace('/(gym)' as any);
 *   This conflicted with the automatic redirect in _layout.tsx.
 *
 * FIX:
 *   Remove router.replace from handleRegister.
 *   Let _layout.tsx handle the redirect automatically.
 *
 * CHANGE SUMMARY:
 *   Line removed: router.replace('/(gym)' as any);
 *   Everything else stays exactly the same.
 *
 * HOW TO APPLY:
 *   Replace the ENTIRE content of:
 *   📄 c:/Users/Dell/FlexZone/app/(auth)/register.tsx
 *   with the code below ↓
 */

// ============================================================
// PASTE THIS INTO: app/(auth)/register.tsx
// ============================================================

import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { Badge, Button } from '../../components/UI';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim())
      return Alert.alert('Missing fields', 'Please fill in all fields.');
    if (password !== confirm)
      return Alert.alert('Password mismatch', 'Passwords do not match.');
    if (password.length < 8)
      return Alert.alert('Weak password', 'Password must be at least 8 characters.');
    if (!agreed)
      return Alert.alert('Terms required', 'Please agree to the Terms & Privacy Policy.');
    try {
      await register(name, email, password);
      // ✅ NO router.replace here!
      // _layout.tsx detects isAuthenticated = true and redirects to /(gym)
    } catch {
      Alert.alert('Registration failed', 'Something went wrong. Please try again.');
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
          <Text style={styles.subtitle}>Start your fitness journey today 💪</Text>
        </View>

        <View style={styles.planBadge}>
          <Text style={styles.planIcon}>🎉</Text>
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={styles.planTitle}>Free Basic plan to start</Text>
            <Text style={styles.planSub}>Upgrade anytime to Premium or VIP Elite</Text>
          </View>
          <Badge label="₱599/mo" color={COLORS.primaryDark} bgColor={COLORS.primaryLight} />
        </View>

        <View style={styles.form}>
          {[
            { label: 'Full name', value: name, onChange: setName, placeholder: 'Juan Dela Cruz', type: 'default' as const },
            { label: 'Email address', value: email, onChange: setEmail, placeholder: 'you@email.com', type: 'email-address' as const },
          ].map((field) => (
            <View key={field.label} style={styles.inputGroup}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput style={styles.input} placeholder={field.placeholder} placeholderTextColor={COLORS.textMuted} value={field.value} onChangeText={field.onChange} keyboardType={field.type} autoCapitalize={field.type === 'default' ? 'words' : 'none'} autoCorrect={false} />
            </View>
          ))}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="Min. 8 characters" placeholderTextColor={COLORS.textMuted} value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
            {password.length > 0 && (
              <View style={styles.strengthRow}>
                {[1, 2, 3].map((i) => (
                  <View key={i} style={[styles.strengthBar, { backgroundColor: i <= strength ? strengthColor : COLORS.border }]} />
                ))}
                <Text style={[styles.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput style={[styles.input, confirm.length > 0 && confirm !== password && { borderColor: COLORS.error }]} placeholder="Repeat your password" placeholderTextColor={COLORS.textMuted} value={confirm} onChangeText={setConfirm} secureTextEntry autoCapitalize="none" />
            {confirm.length > 0 && confirm !== password && <Text style={styles.errorText}>Passwords don't match</Text>}
          </View>

          <TouchableOpacity style={styles.checkRow} onPress={() => setAgreed(!agreed)} activeOpacity={0.8}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>
              I agree to the <Text style={styles.link}>Terms of Service</Text>{' and '}<Text style={styles.link}>Privacy Policy</Text>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.xl },
  header: { alignItems: 'center', paddingTop: 50, paddingBottom: SPACING.xl },
  logo: { fontSize: 28, fontWeight: '800', color: COLORS.primaryDark, letterSpacing: -1, marginBottom: SPACING.lg },
  logoAccent: { color: COLORS.primary },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  subtitle: { fontSize: 15, color: COLORS.textSecondary },
  planBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.primary + '30' },
  planIcon: { fontSize: 22 },
  planTitle: { fontSize: 14, fontWeight: '600', color: COLORS.primaryDark },
  planSub: { fontSize: 12, color: COLORS.primary },
  form: {},
  inputGroup: { marginBottom: SPACING.md },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: { backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 15, color: COLORS.text },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2, marginRight: SPACING.sm },
  strengthLabel: { fontSize: 12, fontWeight: '600', minWidth: 40 },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 2 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.md },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginTop: 1, marginRight: SPACING.sm },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkLabel: { flex: 1, fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  link: { color: COLORS.primary, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.md, paddingBottom: SPACING.xl },
  footerText: { fontSize: 15, color: COLORS.textSecondary },
  footerLink: { fontSize: 15, color: COLORS.primary, fontWeight: '600' },
});