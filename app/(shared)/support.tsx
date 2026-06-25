import { Button, Card } from '@/components/UI';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const FAQS = [
  { q: 'How do I cancel a booking?', a: 'Go to My Bookings → tap the booking → tap Cancel. Cancellations made 24hrs before are fully refunded.' },
  { q: 'How do I upgrade my membership?', a: 'Go to Profile → Membership → choose your plan → tap Upgrade.' },
  { q: 'When does my membership expire?', a: 'Check the expiry date in Profile → Membership. You\'ll get a reminder 7 days before.' },
  { q: 'Can I use the court without a membership?', a: 'Yes! Court bookings are available to all users. Gym access requires a membership.' },
  { q: 'How do I contact a coach?', a: 'Go to Coaches tab → tap a coach → tap Message to start chatting.' },
];

export default function SupportScreen() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [subject, setSubject]   = useState('');
  const [message, setMessage]   = useState('');
  const [sending, setSending]   = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) { Alert.alert('Required', 'Please fill in both fields.'); return; }
    setSending(true);
    await new Promise<void>((r) => setTimeout(r, 1000));
    setSending(false);
    Alert.alert('Sent! ✅', 'Our support team will reply within 24 hours.', [
      { text: 'OK', onPress: () => { setSubject(''); setMessage(''); } },
    ]);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.title}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {/* Quick contacts */}
        <Text style={s.sectionTitle}>Contact Us</Text>
        <View style={s.contactGrid}>
          {[
            { emoji: '💬', label: 'Live Chat',  sub: 'Typically replies in minutes', action: () => router.push('/(court)/chat' as never) },
            { emoji: '📞', label: 'Call Us',    sub: '+63 32 888 1234',              action: () => Linking.openURL('tel:+63328881234') },
            { emoji: '📧', label: 'Email',      sub: 'hello@flexzone.ph',            action: () => Linking.openURL('mailto:hello@flexzone.ph') },
            { emoji: '📍', label: 'Visit Us',   sub: 'Consolacion, Cebu',            action: () => Alert.alert('Address', 'MacArthur Highway, Consolacion, Cebu\nOpen: 6AM–11PM daily') },
          ].map((c) => (
            <TouchableOpacity key={c.label} style={s.contactCard} onPress={c.action} activeOpacity={0.8}>
              <Text style={{ fontSize: 28, marginBottom: 4 }}>{c.emoji}</Text>
              <Text style={s.contactLabel}>{c.label}</Text>
              <Text style={s.contactSub}>{c.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <Text style={s.sectionTitle}>Frequently Asked</Text>
        {FAQS.map((faq, i) => (
          <TouchableOpacity key={i} style={s.faqCard} onPress={() => setExpanded(expanded === i ? null : i)} activeOpacity={0.85}>
            <View style={s.faqHeader}>
              <Text style={s.faqQ}>❓ {faq.q}</Text>
              <Text style={s.faqArrow}>{expanded === i ? '∧' : '∨'}</Text>
            </View>
            {expanded === i && <Text style={s.faqA}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}

        {/* Send message */}
        <Text style={s.sectionTitle}>Send a Message</Text>
        <Card>
          <View style={s.group}>
            <Text style={s.label}>Subject</Text>
            <TextInput style={s.input} placeholder="e.g. Issue with my booking" placeholderTextColor={COLORS.textMuted}
              value={subject} onChangeText={setSubject} />
          </View>
          <View style={s.group}>
            <Text style={s.label}>Message</Text>
            <TextInput style={[s.input, s.textarea]} placeholder="Describe your concern in detail..."
              placeholderTextColor={COLORS.textMuted} value={message} onChangeText={setMessage} multiline numberOfLines={4} />
          </View>
          <Button title="Send Message" onPress={handleSend} loading={sending} />
        </Card>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.background },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:      { width: 40 },
  backText:     { fontSize: 22, color: COLORS.primary },
  title:        { fontSize: 18, fontWeight: '700', color: COLORS.text },
  content:      { padding: SPACING.lg },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: SPACING.md, marginTop: SPACING.lg, paddingLeft: 4 },
  contactGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm },
  contactCard:  { width: '47%', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', borderWidth: 0.5, borderColor: COLORS.border },
  contactLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  contactSub:   { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2 },
  faqCard:      { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 0.5, borderColor: COLORS.border },
  faqHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ:         { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.text },
  faqArrow:     { fontSize: 16, color: COLORS.textMuted, marginLeft: SPACING.sm },
  faqA:         { fontSize: 13, color: COLORS.textSecondary, marginTop: SPACING.sm, lineHeight: 20 },
  group:        { marginBottom: SPACING.md },
  label:        { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input:        { backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 15, color: COLORS.text },
  textarea:     { height: 100, textAlignVertical: 'top' },
});
