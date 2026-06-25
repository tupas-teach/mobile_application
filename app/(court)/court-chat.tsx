import { useAuthStore } from '@/store/authStore';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'admin',
    text: 'Hi! Welcome to FlexZone Court support 👋 How can we help you today?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    sender: 'admin',
    text: 'We can help with court bookings, event packages, equipment questions, or any other inquiries.',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
];

const QUICK_REPLIES = [
  'Is Court 1 available today?',
  'I need to cancel my booking',
  'Event package details?',
  'What are your opening hours?',
  'Can I bring outside catering?',
];

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === 'user';
  return (
    <View style={[styles.bubbleWrapper, isUser ? styles.bubbleRight : styles.bubbleLeft]}>
      {!isUser && (
        <View style={styles.adminAvatar}>
          <Text style={styles.adminAvatarText}>FZ</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.adminBubble]}>
        <Text style={[styles.bubbleText, isUser && styles.userBubbleText]}>
          {message.text}
        </Text>
        <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
          {message.timestamp.toLocaleTimeString('en-PH', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [adminTyping, setAdminTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setAdminTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    setTimeout(() => {
      setAdminTyping(false);
      const replies: Record<string, string> = {
        'Is Court 1 available today?':
          'Court 1 (Basketball) is available from 2 PM onwards today! Want me to reserve it for you?',
        'I need to cancel my booking':
          "No problem! Please share your booking reference number and I'll process the cancellation right away.",
        'Event package details?':
          'We have 4 event packages starting at ₱5,999. Check the Events tab for full details, or I can walk you through them here!',
        'What are your opening hours?':
          'FlexZone Courts are open Monday–Sunday, 6 AM to 11 PM. Last booking accepted at 9 PM.',
        'Can I bring outside catering?':
          'Yes! Outside caterers are welcome. We have a dedicated kitchen area and prep space. A ₱500 kitchen access fee applies.',
      };
      const reply =
        replies[trimmed] ??
        'Thanks for your message! Our team will get back to you shortly. For urgent concerns, call us at 0917-FLEXZONE.';
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: reply,
          sender: 'admin',
          timestamp: new Date(),
        },
      ]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.adminInfo}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>FZ</Text>
            <View style={styles.onlineDot} />
          </View>
          <View>
            <Text style={styles.headerName}>FlexZone Courts</Text>
            <Text style={styles.headerStatus}>● Online · Typically replies in minutes</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {/* Date label */}
        <View style={styles.dateLabelRow}>
          <View style={styles.dateLabelLine} />
          <Text style={styles.dateLabel}>Today</Text>
          <View style={styles.dateLabelLine} />
        </View>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {adminTyping && (
          <View style={[styles.bubbleWrapper, styles.bubbleLeft]}>
            <View style={styles.adminAvatar}>
              <Text style={styles.adminAvatarText}>FZ</Text>
            </View>
            <View style={styles.adminBubble}>
              <View style={styles.typingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick replies */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickBar}
        contentContainerStyle={styles.quickContent}
      >
        {QUICK_REPLIES.map((r) => (
          <TouchableOpacity
            key={r}
            style={styles.quickChip}
            onPress={() => sendMessage(r)}
          >
            <Text style={styles.quickText}>{r}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={input}
          onChangeText={setInput}
          multiline
          // FIX: blurOnSubmit=false prevents newline-on-submit conflict on Android
          blurOnSubmit={false}
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={() => sendMessage(input)}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim()}
        >
          <Text style={styles.sendIcon}>▶</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1E' },
  header: {
    paddingTop: 54,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: '#1A1A2E',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  // FIX: replaced gap with marginRight on headerAvatar
  adminInfo: { flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { position: 'relative', marginRight: SPACING.md },
  headerAvatarText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    textAlign: 'center',
    lineHeight: 44,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: '#1A1A2E',
  },
  headerName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  headerStatus: { fontSize: 11, color: COLORS.success, marginTop: 2 },
  messages: { flex: 1 },
  messagesContent: { padding: SPACING.lg },
  dateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dateLabelLine: { flex: 1, height: 0.5, backgroundColor: 'rgba(255,255,255,0.1)' },
  dateLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '500',
    marginHorizontal: SPACING.sm, // FIX: was gap on parent
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: SPACING.sm, // FIX: was gap on parent
  },
  bubbleLeft: { alignSelf: 'flex-start', maxWidth: '82%' },
  bubbleRight: { alignSelf: 'flex-end', maxWidth: '82%', flexDirection: 'row-reverse' },
  adminAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginRight: SPACING.sm, // FIX: was gap on parent
  },
  adminAvatarText: { color: '#fff', fontWeight: '800', fontSize: 10 },
  bubble: {
    borderRadius: 16,
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  adminBubble: {
    backgroundColor: '#1A1A2E',
    borderTopLeftRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 4,
  },
  bubbleText: { fontSize: 14, color: '#fff', lineHeight: 20 },
  userBubbleText: { color: '#fff' },
  timestamp: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: { color: 'rgba(255,255,255,0.6)' },
  typingDots: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginRight: 5, // FIX: was gap on parent
  },
  dot1: {},
  dot2: { opacity: 0.6 },
  dot3: { opacity: 0.3 },
  quickBar: {
    maxHeight: 48,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  quickContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm, // FIX: prevents chip clipping
    alignItems: 'center',
  },
  quickChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
    marginRight: SPACING.sm, // FIX: was gap on parent
  },
  quickText: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  inputRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: '#1A1A2E',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.md,
    alignItems: 'flex-end', // FIX: keep send btn at bottom when input grows
  },
  input: {
    flex: 1,
    backgroundColor: '#0F0F1E',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    fontSize: 15,
    color: '#fff',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginRight: SPACING.sm, // FIX: was gap on parent
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.1)' },
  sendIcon: { color: '#fff', fontSize: 16 },
});