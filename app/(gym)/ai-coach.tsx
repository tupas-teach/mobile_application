import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useAICoach } from '@/hooks';
import { useAuthStore } from '@/store/authStore';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  View,
} from 'react-native';

const QUICK_PROMPTS = [
  'Create me a 4-week weight loss plan',
  "What should I eat before HIIT?",
  'Best classes for building muscle',
  'I only have 30 min, what should I do?',
  'Suggest a meal plan with Filipino food',
  'How do I prevent muscle soreness?',
];

export default function AICoachScreen() {
  const { messages, loading, sendMessage, clearChat } = useAICoach('gym');
  const { user } = useAuthStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    await sendMessage(text);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.aiAvatar}>
          <Text style={styles.aiAvatarEmoji}>🤖</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>AI Coach</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Powered by Claude · Always online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={clearChat}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Membership context */}
      <View style={styles.tierBanner}>
        <Text style={styles.tierText}>
          {user?.membership === 'basic' ? '⚡ Upgrade to Premium for full AI Coach plans & nutrition tracking' : `✨ ${user?.membership === 'vip' ? 'VIP Elite' : 'Premium'} — Full AI Coach access active`}
        </Text>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.bubble, msg.senderType === 'user' ? styles.userBubble : styles.aiBubble]}
          >
            {msg.senderType === 'ai' && (
              <Text style={styles.senderLabel}>🤖 AI Coach</Text>
            )}
            <Text style={[styles.bubbleText, msg.senderType === 'user' && styles.userBubbleText]}>
              {msg.content}
            </Text>
            <Text style={[styles.timestamp, msg.senderType === 'user' && styles.userTimestamp]}>
              {msg.timestamp.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.aiBubble}>
            <Text style={styles.senderLabel}>🤖 AI Coach</Text>
            <View style={styles.typingRow}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.typingText}>Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick prompts */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickBar} contentContainerStyle={styles.quickContent}>
        {QUICK_PROMPTS.map((p) => (
          <TouchableOpacity key={p} style={styles.quickChip} onPress={() => { setInput(p); }}>
            <Text style={styles.quickText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask your AI Coach..."
          placeholderTextColor={COLORS.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendIcon}>▶</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  aiAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  aiAvatarEmoji: { fontSize: 22 },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.success },
  onlineText: { fontSize: 11, color: COLORS.textSecondary },
  clearBtn: { padding: 6 },
  clearText: { fontSize: 14, color: COLORS.primary },
  tierBanner: { backgroundColor: COLORS.primaryLight, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  tierText: { fontSize: 12, color: COLORS.primaryDark, fontWeight: '500' },
  messages: { flex: 1 },
  messagesContent: { padding: SPACING.lg, gap: SPACING.md },
  bubble: { maxWidth: '82%', borderRadius: 16, padding: SPACING.md },
  aiBubble: { backgroundColor: COLORS.card, alignSelf: 'flex-start', borderRadius: 4, borderTopLeftRadius: 16, borderWidth: 0.5, borderColor: COLORS.border },
  userBubble: { backgroundColor: COLORS.primary, alignSelf: 'flex-end', borderRadius: 4, borderTopRightRadius: 16 },
  senderLabel: { fontSize: 11, color: COLORS.primary, fontWeight: '700', marginBottom: 4 },
  bubbleText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  userBubbleText: { color: '#fff' },
  timestamp: { fontSize: 10, color: COLORS.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  userTimestamp: { color: 'rgba(255,255,255,0.7)' },
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  typingText: { fontSize: 13, color: COLORS.textSecondary },
  quickBar: { maxHeight: 44, borderTopWidth: 0.5, borderTopColor: COLORS.border },
  quickContent: { paddingHorizontal: SPACING.lg, alignItems: 'center', gap: SPACING.sm },
  quickChip: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 6 },
  quickText: { fontSize: 12, color: COLORS.primaryDark, fontWeight: '500' },
  inputRow: { flexDirection: 'row', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.card, borderTopWidth: 0.5, borderTopColor: COLORS.border, paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.md },
  input: { flex: 1, backgroundColor: COLORS.background, borderRadius: RADIUS.full, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, fontSize: 15, color: COLORS.text, maxHeight: 100, borderWidth: 1, borderColor: COLORS.border },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: COLORS.border },
  sendIcon: { color: '#fff', fontSize: 16 },
});
