import { Avatar, EmptyState } from '@/components/UI';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useCoachChatStore } from '@/store/coachChatStore';
import { useGymStore } from '@/store/gymStore';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CoachInboxScreen() {
  const { threads } = useCoachChatStore();
  const { coaches } = useGymStore();
  const threadList = Object.values(threads);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Messages</Text>
        <View style={{ width: 40 }} />
      </View>

      {threadList.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState emoji="💬" title="No conversations yet"
            subtitle="Tap on a coach's profile to start chatting" />
          <TouchableOpacity onPress={() => router.push('/(gym)/coaches' as never)} style={s.ctaBtn}>
            <Text style={s.ctaText}>Browse Coaches</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.content}>
          {threadList.map((thread) => {
            const lastMsg = thread.messages[thread.messages.length - 1];
            const unread  = thread.messages.filter((m) => !m.read && m.senderType !== 'user').length;
            const coach   = coaches.find((c) => c.id === thread.coachId);
            return (
              <TouchableOpacity key={thread.coachId} style={s.row}
                onPress={() => router.push({ pathname: '/(gym)/coach-chat' as never, params: { coachId: thread.coachId } })}>
                <Avatar initials={thread.coachInitials} color={thread.coachColor} />
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <Text style={s.name}>{thread.coachName}</Text>
                  <Text style={s.preview} numberOfLines={1}>{lastMsg?.content}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={s.time}>{lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }) : ''}</Text>
                  {unread > 0 && <View style={s.unreadDot}><Text style={s.unreadText}>{unread}</Text></View>}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:   { width: 40 },
  backText:  { fontSize: 22, color: COLORS.primary },
  title:     { fontSize: 18, fontWeight: '700', color: COLORS.text },
  content:   { padding: SPACING.lg },
  row:       { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 0.5, borderColor: COLORS.border },
  name:      { fontSize: 15, fontWeight: '700', color: COLORS.text },
  preview:   { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  time:      { fontSize: 11, color: COLORS.textMuted },
  unreadDot: { marginTop: 4, backgroundColor: COLORS.error, borderRadius: 99, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  unreadText:{ color: '#fff', fontSize: 10, fontWeight: '800' },
  ctaBtn:    { alignSelf: 'center', backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, marginTop: SPACING.md },
  ctaText:   { color: '#fff', fontWeight: '700', fontSize: 14 },
});
