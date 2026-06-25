import { Button } from '@/components/UI';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
  const { user, setUser } = useAuthStore();
  const [name,      setName]      = useState(user?.name ?? '');
  const [email,     setEmail]     = useState(user?.email ?? '');
  const [phone,     setPhone]     = useState(user?.phone ?? '');
  const [emergency, setEmergency] = useState('');
  const [loading,   setLoading]   = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) { Alert.alert('Required', 'Name and email are required.'); return; }
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 800));
    setUser({ ...user!, name: name.trim(), email: email.trim(), phone: phone.trim() });
    setLoading(false);
    Alert.alert('Saved', 'Your profile has been updated.', [{ text: 'OK', onPress: () => router.back() }]);
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.title}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <TouchableOpacity style={s.avatarWrap} onPress={() => Alert.alert('Photo', 'Photo upload available in production.')}>
          <View style={s.avatar}><Text style={s.avatarText}>{name.charAt(0).toUpperCase() || 'U'}</Text></View>
          <View style={s.avatarEditBadge}><Text style={{ color: '#fff', fontSize: 12 }}>📷</Text></View>
          <Text style={s.avatarHint}>Tap to change photo</Text>
        </TouchableOpacity>

        {[
          { label: 'Full Name *',        value: name,      setter: setName,      placeholder: 'Juan Dela Cruz',       kb: 'default' as const  },
          { label: 'Email Address *',    value: email,     setter: setEmail,     placeholder: 'you@email.com',        kb: 'email-address' as const },
          { label: 'Phone Number',       value: phone,     setter: setPhone,     placeholder: '+63 9XX XXX XXXX',     kb: 'phone-pad' as const },
          { label: 'Emergency Contact',  value: emergency, setter: setEmergency, placeholder: 'Name & number',        kb: 'default' as const  },
        ].map((f) => (
          <View key={f.label} style={s.group}>
            <Text style={s.label}>{f.label}</Text>
            <TextInput style={s.input} placeholder={f.placeholder} placeholderTextColor={COLORS.textMuted}
              value={f.value} onChangeText={f.setter} keyboardType={f.kb}
              autoCapitalize={f.kb === 'default' ? 'words' : 'none'} />
          </View>
        ))}

        <Button title="Save Changes" onPress={handleSave} loading={loading} style={{ marginTop: SPACING.lg }} />
        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: COLORS.background },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:        { width: 40 },
  backText:       { fontSize: 22, color: COLORS.primary },
  title:          { fontSize: 18, fontWeight: '700', color: COLORS.text },
  content:        { padding: SPACING.lg },
  avatarWrap:     { alignItems: 'center', marginBottom: SPACING.xl, position: 'relative' },
  avatar:         { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: COLORS.primary },
  avatarText:     { fontSize: 36, fontWeight: '800', color: COLORS.primaryDark },
  avatarEditBadge:{ position: 'absolute', bottom: 22, right: '33%', backgroundColor: COLORS.primary, borderRadius: 99, width: 26, height: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  avatarHint:     { fontSize: 12, color: COLORS.textSecondary, marginTop: SPACING.sm },
  group:          { marginBottom: SPACING.lg },
  label:          { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input:          { backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 15, color: COLORS.text },
});
