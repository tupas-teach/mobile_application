/**
 * ✅ FIX 03 — app/(auth)/login.tsx
 *
 * PROBLEM:
 *   After await login() succeeded, the screen called:
 *     router.replace('/(gym)' as any);
 *   But _layout.tsx ALSO watches isAuthenticated and calls
 *   router.replace('/(gym)') at the same time.
 *   Two navigations at once = undefined behavior = stuck screen.
 *
 * FIX:
 *   Remove router.replace from handleLogin.
 *   The _layout.tsx guard will detect isAuthenticated = true
 *   and navigate automatically. Only ONE redirect fires.
 *
 * CHANGE SUMMARY:
 *   Line removed: router.replace('/(gym)' as any);
 *   Import removed: router (no longer needed for post-login nav)
 *   Import kept: router (still needed for forgot-password and register links)
 *
 * HOW TO APPLY:
 *   Replace the ENTIRE content of:
 *   📄 c:/Users/Dell/FlexZone/app/(auth)/login.tsx
 *   with the code below ↓
 */

// ============================================================
// PASTE THIS INTO: app/(auth)/login.tsx
// ============================================================

import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { Button } from '../../components/UI';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    try {
      await login(email, password);
      // ✅ NO router.replace here!
      // _layout.tsx detects isAuthenticated = true and redirects to /(gym)
    } catch {
      Alert.alert('Login failed', 'Invalid credentials. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>FLEX<Text style={styles.logoAccent}>ZONE</Text></Text>
          </View>
          <Text style={styles.tagline}>SmartGym & Court Booking</Text>
          <Text style={styles.welcome}>Welcome back! 👋</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@email.com"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0, paddingRight: 48 }]}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                <Text style={{ fontSize: 16 }}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password' as any)} style={styles.forgotLink}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button title="Sign In" onPress={handleLogin} loading={isLoading} style={styles.loginBtn} />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.oauthRow}>
            <TouchableOpacity style={styles.oauthBtn} onPress={() => Alert.alert('Google OAuth', 'Would connect to Google OAuth')}>
              <Text style={styles.oauthIcon}>🇬</Text>
              <Text style={styles.oauthLabel}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.oauthBtn, { marginLeft: SPACING.md }]} onPress={() => Alert.alert('Apple OAuth', 'Would connect to Apple Sign In')}>
              <Text style={styles.oauthIcon}>🍎</Text>
              <Text style={styles.oauthLabel}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
            <Text style={styles.footerLink}>Sign up free</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.xl },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: SPACING.xxl },
  logoContainer: { backgroundColor: COLORS.primaryLight, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.md },
  logo: { fontSize: 32, fontWeight: '800', color: COLORS.primaryDark, letterSpacing: -1 },
  logoAccent: { color: COLORS.primary },
  tagline: { fontSize: 12, color: COLORS.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: SPACING.xxl },
  welcome: { fontSize: 26, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  subtitle: { fontSize: 15, color: COLORS.textSecondary },
  form: {},
  inputGroup: { marginBottom: SPACING.md },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: { backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 15, color: COLORS.text },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, overflow: 'hidden' },
  eyeBtn: { position: 'absolute', right: 14, padding: 4 },
  forgotLink: { alignSelf: 'flex-end', marginBottom: SPACING.md },
  forgotText: { color: COLORS.primary, fontSize: 14, fontWeight: '500' },
  loginBtn: { marginBottom: SPACING.md },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xs },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 13, color: COLORS.textMuted, marginHorizontal: SPACING.md },
  oauthRow: { flexDirection: 'row', marginTop: SPACING.sm },
  oauthBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingVertical: 13 },
  oauthIcon: { fontSize: 18, marginRight: SPACING.sm },
  oauthLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xxl, paddingBottom: SPACING.xl },
  footerText: { fontSize: 15, color: COLORS.textSecondary },
  footerLink: { fontSize: 15, color: COLORS.primary, fontWeight: '600' },
});