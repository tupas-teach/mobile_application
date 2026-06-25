import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

function SettingRow({ label, sub, value, onToggle }: { label: string; sub?: string; value: boolean; onToggle: () => void }) {
  return (
    <View style={s.settingRow}>
      <View style={{ flex: 1 }}>
        <Text style={s.settingLabel}>{label}</Text>
        {sub && <Text style={s.settingSub}>{sub}</Text>}
      </View>
      <Switch value={value} onValueChange={onToggle} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor="#fff" />
    </View>
  );
}

export default function SettingsScreen() {
  const [pushNotif,    setPush]    = useState(true);
  const [emailNotif,   setEmail]   = useState(true);
  const [smsNotif,     setSms]     = useState(false);
  const [bookingRemind,setBooking] = useState(true);
  const [promoOffers,  setPromo]   = useState(false);
  const [darkMode,     setDark]    = useState(false);
  const [showSecurity, setShowSec] = useState(false);

  // Password change state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw,     setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handleChangePassword = () => {
    if (!currentPw || !newPw || !confirmPw) { Alert.alert('Required', 'Please fill all password fields.'); return; }
    if (newPw !== confirmPw) { Alert.alert('Mismatch', 'New passwords do not match.'); return; }
    if (newPw.length < 8)   { Alert.alert('Too short', 'Password must be at least 8 characters.'); return; }
    Alert.alert('Success ✅', 'Your password has been updated successfully.', [
      { text: 'OK', onPress: () => { setCurrentPw(''); setNewPw(''); setConfirmPw(''); setShowSec(false); } },
    ]);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {/* Notifications */}
        <Text style={s.sectionTitle}>Notifications</Text>
        <View style={s.card}>
          <SettingRow label="Push Notifications" sub="Session reminders and booking updates" value={pushNotif} onToggle={() => setPush(!pushNotif)} />
          <View style={s.divider} />
          <SettingRow label="Email Notifications" sub="Receipts and account updates via email" value={emailNotif} onToggle={() => setEmail(!emailNotif)} />
          <View style={s.divider} />
          <SettingRow label="SMS Notifications" sub="Text alerts for bookings" value={smsNotif} onToggle={() => setSms(!smsNotif)} />
          <View style={s.divider} />
          <SettingRow label="Booking Reminders" sub="Remind me 1 hour before sessions" value={bookingRemind} onToggle={() => setBooking(!bookingRemind)} />
          <View style={s.divider} />
          <SettingRow label="Promo & Offers" sub="Special deals and membership offers" value={promoOffers} onToggle={() => setPromo(!promoOffers)} />
        </View>

        {/* Display */}
        <Text style={s.sectionTitle}>Display</Text>
        <View style={s.card}>
          <SettingRow label="Dark Mode" sub="Switch to dark theme" value={darkMode} onToggle={() => { setDark(!darkMode); Alert.alert('Coming Soon', 'Dark mode will be available in the next update.'); }} />
        </View>

        {/* Privacy */}
        <Text style={s.sectionTitle}>Privacy</Text>
        <View style={s.card}>
          {[
            { label: 'Privacy Policy',    action: () => Alert.alert('Privacy Policy', 'Opens in browser in production.') },
            { label: 'Terms of Service',  action: () => Alert.alert('Terms', 'Opens in browser in production.') },
            { label: 'Delete Account',    action: () => Alert.alert('Delete Account', 'This will permanently delete your account. Contact support@flexzone.ph', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive' }]) },
          ].map((item, i, arr) => (
            <TouchableOpacity key={item.label} onPress={item.action} style={[s.linkRow, i < arr.length - 1 && s.divider]}>
              <Text style={[s.linkLabel, item.label === 'Delete Account' && { color: COLORS.error }]}>{item.label}</Text>
              <Text style={s.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Security */}
        <Text style={s.sectionTitle}>Security</Text>
        <View style={s.card}>
          <TouchableOpacity style={s.linkRow} onPress={() => setShowSec(!showSecurity)}>
            <Text style={s.linkLabel}>Change Password</Text>
            <Text style={s.arrow}>{showSecurity ? '∨' : '›'}</Text>
          </TouchableOpacity>

          {showSecurity && (
            <View style={s.passwordSection}>
              <View style={s.divider} />
              {[
                { label: 'Current Password', value: currentPw, setter: setCurrentPw },
                { label: 'New Password',      value: newPw,     setter: setNewPw     },
                { label: 'Confirm Password',  value: confirmPw, setter: setConfirmPw },
              ].map((f) => (
                <View key={f.label} style={s.pwGroup}>
                  <Text style={s.pwLabel}>{f.label}</Text>
                  <TextInput style={s.pwInput} secureTextEntry placeholder="••••••••"
                    placeholderTextColor={COLORS.textMuted} value={f.value} onChangeText={f.setter} />
                </View>
              ))}
              <TouchableOpacity style={s.updateBtn} onPress={handleChangePassword}>
                <Text style={s.updateBtnText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: COLORS.background },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:         { width: 40 },
  backText:        { fontSize: 22, color: COLORS.primary },
  title:           { fontSize: 18, fontWeight: '700', color: COLORS.text },
  content:         { padding: SPACING.lg },
  sectionTitle:    { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: SPACING.sm, marginTop: SPACING.lg, paddingLeft: 4 },
  card:            { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 0.5, borderColor: COLORS.border },
  settingRow:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  settingLabel:    { fontSize: 15, fontWeight: '500', color: COLORS.text },
  settingSub:      { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  divider:         { height: 0.5, backgroundColor: COLORS.border, marginHorizontal: SPACING.md },
  linkRow:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: 15 },
  linkLabel:       { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.text },
  arrow:           { fontSize: 20, color: COLORS.textMuted },
  passwordSection: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  pwGroup:         { marginTop: SPACING.md },
  pwLabel:         { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  pwInput:         { backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 15, color: COLORS.text },
  updateBtn:       { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.lg },
  updateBtnText:   { color: '#fff', fontWeight: '700', fontSize: 15 },
});
