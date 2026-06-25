import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

const COLORS = {
  primary: '#1D9E75',
  primaryDark: '#0F6E56',
  primaryLight: '#E1F5EE',
  success: '#1D9E75',
  error: '#E24B4A',
  textMuted: '#6B7280',
  textSecondary: '#9CA3AF',
};

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
const RADIUS  = { sm: 6, md: 8, lg: 12, full: 9999 };

interface AdminMessage {
  id: string;
  content: string;
  senderType: 'user' | 'admin';
  senderName: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: AdminMessage = {
  id: 'init',
  content:
    "Hi! 👋 Welcome to FlexZone Court Support.\n\nI'm here to help you with:\n• Court reservations & availability\n• Event venue bookings\n• Package customization\n• Payment questions\n\nHow can I assist you today?",
  senderType: 'admin',
  senderName: 'FlexZone Admin',
  timestamp: new Date(),
};

const QUICK_MESSAGES = [
  'Is the basketball court available this weekend?',
  'I want to book for a birthday party',
  'What are your event packages?',
  'Do you allow outside catering?',
  'How do I pay for my booking?',
];

const AUTO_REPLIES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['available', 'weekend', 'open'],
    reply:
      'Yes! The Main Basketball Court is available this weekend. Saturday 8AM–6PM and Sunday 8AM–8PM slots are open. Would you like to book now?',
  },
  {
    keywords: ['birthday', 'party', 'celebration'],
    reply:
      "Great choice! 🎂 Our Birthday Bash package starts at ₱5,000 and includes 8 hours venue, sound system, tables & chairs, and decoration. We accommodate up to 100 guests. When is the special day?",
  },
  {
    keywords: ['package', 'event', 'packages'],
    reply:
      "We have 5 event packages:\n🎂 Birthday Bash – ₱5,000\n👨‍👩‍👧 Reunion – ₱8,000\n🎄 Christmas/Fiesta – ₱10,000\n🏢 Corporate – ₱12,000\n💍 Wedding Reception – ₱15,000\n\nAll include the multi-purpose hall. Need details on any?",
  },
  {
    keywords: ['catering', 'food', 'outside'],
    reply:
      'Yes, outside caterers are allowed! 🍽️ We have a designated catering area and kitchen access. Just let us know your caterer\'s details when booking so we can coordinate setup time.',
  },
  {
    keywords: ['pay', 'payment', 'gcash', 'maya', 'card'],
    reply:
      'We accept:\n💚 GCash\n💜 Maya (PayMaya)\n💳 Credit/Debit Card\n💵 Cash (on-site)\n\nA 50% deposit is required to confirm event bookings.',
  },
  {
    keywords: ['cancel', 'refund'],
    reply:
      'Our cancellation policy:\n✅ Full refund: 7+ days before event\n⚠️ 50% refund: 3–6 days before\n❌ No refund: within 48 hours\n\nPlease contact us as soon as possible if you need to cancel.',
  },
  {
    keywords: ['schedule', 'time', 'hour', 'hours'],
    reply:
      "We're open daily from 6:00 AM to 11:00 PM. Courts can be booked in 1-hour increments. Events and full-day packages have flexible scheduling. What time works best for you?",
  },
];

function getAutoReply(message: string): Promise<string> {
  return new Promise((resolve) => {
    const delay = 1200 + Math.random() * 1200;
    setTimeout(() => {
      const lower = message.toLowerCase();
      const match = AUTO_REPLIES.find((r) =>
        r.keywords.some((k) => lower.includes(k))
      );
      resolve(
        match?.reply ??
          "Thanks for reaching out! 😊 Our team will get back to you shortly. For immediate help, call us at +63 32 888 1234. Is there anything else I can help with?"
      );
    }, delay);
  });
}

interface AdminChatProps {
  style?: ViewStyle;
  userName?: string;
}

const AdminChat: React.FC<AdminChatProps> = ({ style, userName = 'Guest' }) => {
  const [messages, setMessages] = useState<AdminMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [adminTyping, setAdminTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || adminTyping) return;
    setInput('');

    const userMsg: AdminMessage = {
      id: Date.now().toString(),
      content: msg,
      senderType: 'user',
      senderName: userName,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setAdminTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    const reply = await getAutoReply(msg);
    setAdminTyping(false);

    const adminMsg: AdminMessage = {
      id: (Date.now() + 1).toString(),
      content: reply,
      senderType: 'admin',
      senderName: 'FlexZone Admin',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, adminMsg]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.adminAvatar}>
          <Text style={styles.adminAvatarEmoji}>🏟️</Text>
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>FlexZone Court Admin</Text>
          <Text style={styles.headerStatus}>● Online · Replies in minutes</Text>
        </View>
        <Text style={styles.callIcon}>📞</Text>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        <View style={styles.dateStamp}>
          <Text style={styles.dateStampText}>Today</Text>
        </View>

        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.msgRow,
              msg.senderType === 'user' && styles.msgRowUser,
            ]}
          >
            {msg.senderType === 'admin' && (
              <View style={styles.adminAvatarSm}>
                <Text style={{ fontSize: 14 }}>🏟️</Text>
              </View>
            )}
            <View
              style={[
                styles.bubble,
                msg.senderType === 'user'
                  ? styles.userBubble
                  : styles.adminBubble,
              ]}
            >
              {msg.senderType === 'admin' && (
                <Text style={styles.senderLabel}>FlexZone Admin</Text>
              )}
              <Text
                style={[
                  styles.bubbleText,
                  msg.senderType === 'user' && styles.userBubbleText,
                ]}
              >
                {msg.content}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  msg.senderType === 'user' && styles.userTimestamp,
                ]}
              >
                {msg.timestamp.toLocaleTimeString('en-PH', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {msg.senderType === 'user' ? ' ✓✓' : ''}
              </Text>
            </View>
          </View>
        ))}

        {adminTyping && (
          <View style={styles.msgRow}>
            <View style={styles.adminAvatarSm}>
              <Text style={{ fontSize: 14 }}>🏟️</Text>
            </View>
            <View style={styles.adminBubble}>
              <View style={styles.typingDots}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={styles.typingDot} />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick messages */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickBar}
        contentContainerStyle={styles.quickContent}
      >
        {QUICK_MESSAGES.map((q) => (
          <TouchableOpacity
            key={q}
            style={styles.quickChip}
            onPress={() => handleSend(q)}
            disabled={adminTyping}
          >
            <Text style={styles.quickText}>{q}</Text>
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
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!input.trim() || adminTyping) && styles.sendBtnDisabled,
          ]}
          onPress={() => handleSend()}
          disabled={!input.trim() || adminTyping}
        >
          {adminTyping ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendText}>▶</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#0F0F1E' },
  header:          { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: '#1A1A2E', borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.1)' },
  adminAvatar:     { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E1F5EE', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  adminAvatarEmoji:{ fontSize: 22 },
  onlineDot:       { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success, borderWidth: 2, borderColor: '#1A1A2E' },
  headerInfo:      { flex: 1 },
  headerName:      { fontSize: 15, fontWeight: '700', color: '#fff' },
  headerStatus:    { fontSize: 11, color: COLORS.success, marginTop: 2 },
  callIcon:        { fontSize: 22 },
  messages:        { flex: 1 },
  messagesContent: { padding: SPACING.lg, gap: SPACING.md },
  dateStamp:       { alignItems: 'center', marginBottom: SPACING.sm },
  dateStampText:   { fontSize: 12, color: 'rgba(255,255,255,0.3)', backgroundColor: '#1A1A2E', paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.full },
  msgRow:          { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-end' },
  msgRowUser:      { flexDirection: 'row-reverse' },
  adminAvatarSm:   { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E1F5EE', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble:          { maxWidth: '78%', borderRadius: 16, padding: SPACING.md },
  adminBubble:     { backgroundColor: '#1A1A2E', borderTopLeftRadius: 4, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)' },
  userBubble:      { backgroundColor: COLORS.primary, borderTopRightRadius: 4 },
  senderLabel:     { fontSize: 11, color: COLORS.primary, fontWeight: '700', marginBottom: 4 },
  bubbleText:      { fontSize: 14, color: '#fff', lineHeight: 20 },
  userBubbleText:  { color: '#fff' },
  timestamp:       { fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4, alignSelf: 'flex-end' },
  userTimestamp:   { color: 'rgba(255,255,255,0.6)' },
  typingDots:      { flexDirection: 'row', gap: 5, padding: 4 },
  typingDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  quickBar:        { maxHeight: 44, borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.08)' },
  quickContent:    { paddingHorizontal: SPACING.lg, alignItems: 'center', gap: SPACING.sm },
  quickChip:       { backgroundColor: '#1A1A2E', borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  quickText:       { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  inputRow:        { flexDirection: 'row', gap: SPACING.sm, padding: SPACING.md, backgroundColor: '#1A1A2E', borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.1)', paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.md },
  input:           { flex: 1, backgroundColor: '#0F0F1E', borderRadius: RADIUS.full, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, fontSize: 15, color: '#fff', maxHeight: 100, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  sendBtn:         { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: '#2A2A3E' },
  sendText:        { color: '#fff', fontSize: 16 },
});

export default AdminChat;

