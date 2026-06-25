import { Avatar } from '@/components/UI';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useCoachChatStore } from '@/store/coachChatStore';
import { useGymStore } from '@/store/gymStore';
import type { ChatMessage } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CoachChatScreen() {
  const { coachId } = useLocalSearchParams<{ coachId: string }>();
  const { coaches }  = useGymStore();
  const { threads, openThread, sendMessage, markRead } = useCoachChatStore();
  const [text, setText] = useState('');

  const coach  = coaches.find((c) => c.id === coachId);
  const thread = coachId ? threads[coachId] : undefined;

  useEffect(() => {
    if (coach && coachId) openThread(coachId, coach.name, coach.initials, coach.color);
  }, [coach, coachId]);

  useEffect(() => {
    if (coachId) markRead(coachId);
  }, [coachId, thread?.messages.length]);

  const handleSend = () => {
    if (!text.trim() || !coachId) return;
    sendMessage(coachId, text.trim());
    setText('');
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const mine = item.senderType === 'user';
    return (
      <View style={[s.bubbleRow, mine && s.bubbleRowMine]}>
        {!mine && coach && <Avatar initials={coach.initials} color={coach.color} size={32} />}
        <View style={[s.bubble, mine ? s.bubbleMine : s.bubbleTheirs]}>
          <Text style={[s.bubbleText, mine && { color: '#fff' }]}>{item.content}</Text>
          <Text style={[s.bubbleTime, mine && { color: 'rgba(255,255,255,0.7)' }]}>
            {new Date(item.timestamp).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        {coach && <Avatar initials={coach.initials} color={coach.color} size={36} />}
        <View style={{ flex: 1, marginLeft: SPACING.sm }}>
          <Text style={s.name}>{coach?.name ?? 'Coach'}</Text>
          <Text style={s.status}>{coach?.available ? '🟢 Online' : '⚪ Offline'}</Text>
        </View>
      </View>

      <FlatList data={thread?.messages ?? []} keyExtractor={(m) => m.id} renderItem={renderItem}
        contentContainerStyle={s.list} />

      <View style={s.inputRow}>
        <TextInput style={s.input} placeholder="Type a message..." placeholderTextColor={COLORS.textMuted}
          value={text} onChangeText={setText} multiline />
        <TouchableOpacity style={s.sendBtn} onPress={handleSend}>
          <Text style={s.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.background },
  header:      { flexDirection: 'row', alignItems: 'center', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:     { width: 36 },
  backText:    { fontSize: 22, color: COLORS.primary },
  name:        { fontSize: 15, fontWeight: '700', color: COLORS.text },
  status:      { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  list:        { padding: SPACING.lg, gap: SPACING.sm },
  bubbleRow:   { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm, marginBottom: SPACING.sm },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubble:      { maxWidth: '75%', borderRadius: RADIUS.lg, padding: SPACING.md },
  bubbleTheirs:{ backgroundColor: COLORS.card, borderWidth: 0.5, borderColor: COLORS.border },
  bubbleMine:  { backgroundColor: COLORS.primary },
  bubbleText:  { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  bubbleTime:  { fontSize: 10, color: COLORS.textMuted, marginTop: 4, textAlign: 'right' },
  inputRow:    { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.card, borderTopWidth: 0.5, borderTopColor: COLORS.border },
  input:       { flex: 1, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: 10, fontSize: 14, color: COLORS.text, maxHeight: 100 },
  sendBtn:     { backgroundColor: COLORS.primary, borderRadius: 99, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  sendText:    { color: '#fff', fontSize: 16, fontWeight: '700' },
});
