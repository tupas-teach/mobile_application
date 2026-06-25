import { Button } from '@/components/UI';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) { Alert.alert('Required', 'Please enter your email address.'); return; }
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
        <Text style={s.backText}>← Back</Text>
      </TouchableOpacity>
      <View style={s.content}>
        {!sent ? (
          <>
            <Text style={s.emoji}>🔐</Text>
            <Text style={s.title}>Forgot your password?</Text>
            <Text style={s.sub}>Enter your email and we'll send you a reset link.</Text>
            <View style={s.form}>
              <Text style={s.label}>Email address</Text>
              <TextInput style={s.input} placeholder="you@email.com" placeholderTextColor={COLORS.textMuted}
                value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoFocus />
            </View>
            <Button title="Send reset link" onPress={handleSend} loading={loading} style={s.btn} />
          </>
        ) : (
          <>
            <Text style={s.emoji}>📬</Text>
            <Text style={s.title}>Check your inbox</Text>
            <Text style={s.sub}>We sent a reset link to{'\n'}<Text style={{ fontWeight: '700', color: COLORS.text }}>{email}</Text></Text>
            <View style={s.tipBox}>
              <Text style={s.tipText}>💡 Didn't receive it? Check your spam folder.</Text>
            </View>
            <Button title="Back to login" onPress={() => router.replace('/(auth)/login' as never)} style={s.btn} />
            <TouchableOpacity style={s.resendLink} onPress={() => setSent(false)}>
              <Text style={s.resendText}>Resend email</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: COLORS.background },
  backBtn:    { paddingTop: 54, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.md },
  backText:   { fontSize: 16, color: COLORS.primary, fontWeight: '500' },
  content:    { flex: 1, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxl, alignItems: 'center' },
  emoji:      { fontSize: 56, marginBottom: SPACING.lg },
  title:      { fontSize: 26, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.sm },
  sub:        { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xl },
  form:       { width: '100%', gap: SPACING.xs, marginBottom: SPACING.lg },
  label:      { fontSize: 14, fontWeight: '600', color: COLORS.text },
  input:      { backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 15, color: COLORS.text },
  btn:        { width: '100%' },
  tipBox:     { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, width: '100%' },
  tipText:    { fontSize: 13, color: COLORS.primaryDark, lineHeight: 18 },
  resendLink: { marginTop: SPACING.md },
  resendText: { color: COLORS.primary, fontSize: 15, fontWeight: '500' },
});
