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

// --- Fix: Define theme locally ---
const COLORS = {
  primary: '#185FA5',
  primaryDark: '#134c85',
  primaryLight: '#2a7bbd',
  secondary: '#1D9E75',
  amber: '#EF9F27',
  success: '#10B981',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  background: '#0F0F1A',
  card: '#1A1A2E',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  border: 'rgba(255,255,255,0.08)',
};

const RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// --- Fix: Define ChatMessage type locally ---
interface ChatMessage {
  id: string;
  content: string;
  senderType: 'user' | 'ai';
  timestamp: Date;
}

// --- Fix: Define useAICoach hook locally ---
function useAICoach(mode: 'gym' | 'court') {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      content: mode === 'gym' 
        ? "Hi! I'm your AI Fitness Coach 🤖\n\nI can help you with:\n• Workout plans tailored to your goals\n• Nutrition advice\n• Exercise form tips\n\nWhat would you like to know?"
        : "Hi! I'm your Court Assistant 🏟️\n\nI can help you with:\n• Court bookings & availability\n• Event package inquiries\n• Scheduling questions\n\nHow can I help you today?",
      senderType: 'ai',
      timestamp: new Date(),
    };
    return [welcomeMsg];
  });
  
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      content,
      senderType: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Simulate AI response (replace with actual API call in production)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiResponse = getAIResponse(content, mode);
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: aiResponse,
      senderType: 'ai',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const clearChat = () => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      content: mode === 'gym' 
        ? "Hi! I'm your AI Fitness Coach 🤖\n\nI can help you with:\n• Workout plans tailored to your goals\n• Nutrition advice\n• Exercise form tips\n\nWhat would you like to know?"
        : "Hi! I'm your Court Assistant 🏟️\n\nI can help you with:\n• Court bookings & availability\n• Event package inquiries\n• Scheduling questions\n\nHow can I help you today?",
      senderType: 'ai',
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
  };

  return { messages, loading, sendMessage, clearChat };
}

function getAIResponse(input: string, mode: 'gym' | 'court'): string {
  const lower = input.toLowerCase();
  
  if (mode === 'gym') {
    if (lower.includes('workout') || lower.includes('plan')) {
      return "I'd be happy to help you create a workout plan! 💪\n\nTo build the best plan for you, I need to know:\n1. What's your main goal? (muscle, weight loss, endurance)\n2. How many days per week can you train?\n3. Do you have any injuries or limitations?\n\nTell me more and let's get started!";
    }
    if (lower.includes('nutrition') || lower.includes('diet') || lower.includes('food')) {
      return "Great question about nutrition! 🥗\n\nHere are some basics:\n• **Protein**: 1.6-2.2g per kg bodyweight\n• **Carbs**: Your main energy source\n• **Fats**: 0.5-1g per kg for hormones\n\nWould you like a specific meal plan or macro breakdown?";
    }
    if (lower.includes('class') || lower.includes('beginner')) {
      return "For beginners, I recommend these classes:\n\n🧘 **Yoga** - Perfect for flexibility & form\n💪 **Beginner HIIT** - Great for conditioning\n🏃 **Couch to 5K** - Build running basics\n🕐 Classes are available from 6AM onwards\n\nWould you like to join one?";
    }
  } else {
    if (lower.includes('court') || lower.includes('available')) {
      return "Court availability depends on the day and time. Here's what we have:\n\n🏀 **Basketball** - ₱300/hr\n🏐 **Volleyball** - ₱250/hr\n🏸 **Badminton** - ₱200/hr\n🎾 **Pickleball** - ₱200/hr\n\nMost courts are available before 6PM. Want me to check specific dates?";
    }
    if (lower.includes('book') || lower.includes('booking')) {
      return "To book a court, here's the process:\n\n1. Choose your sport & date\n2. Select available time slots\n3. Confirm payment\n\nYou can book up to 2 weeks in advance. Would you like to proceed?";
    }
    if (lower.includes('event') || lower.includes('package')) {
      return "We have several event packages! 🎉\n\n🎂 **Birthday Bash** - ₱5,000 (up to 100 guests)\n👨‍👩‍👧‍👦 **Family Reunion** - ₱8,000 (up to 150)\n🎄 **Christmas Party** - ₱10,000 (up to 200)\n\nWhich one interests you?";
    }
  }
  
  return "Thanks for your message! 😊\n\nI'm here to help with any questions about our " + 
    (mode === 'gym' ? "gym, workouts, or nutrition" : "courts, bookings, or events") + 
    ". What else would you like to know?";
}

interface AIChatProps {
  mode?: 'gym' | 'court';
  style?: ViewStyle;
  quickPrompts?: string[];
}

const AIChat: React.FC<AIChatProps> = ({
  mode = 'gym',
  style,
  quickPrompts,
}) => {
  const { messages, loading, sendMessage, clearChat } = useAICoach(mode);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const defaultQuickPrompts =
    mode === 'gym'
      ? ['Create a workout plan', 'Nutrition for weight loss', 'Best class for beginners']
      : ['Court availability?', 'Book a basketball court', 'Event packages'];

  const prompts = quickPrompts ?? defaultQuickPrompts;

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');
    await sendMessage(msg);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 18 }}>{mode === 'gym' ? '🤖' : '🏟️'}</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>
              {mode === 'gym' ? 'AI Fitness Coach' : 'Court Assistant'}
            </Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Always online · Claude AI</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map((msg: ChatMessage) => (
          <View
            key={msg.id}
            style={[
              styles.bubbleRow,
              msg.senderType === 'user' && styles.bubbleRowUser,
            ]}
          >
            {msg.senderType !== 'user' && (
              <View style={styles.aiAvatarSm}>
                <Text style={{ fontSize: 12 }}>{mode === 'gym' ? '🤖' : '🏟️'}</Text>
              </View>
            )}
            <View
              style={[
                styles.bubble,
                msg.senderType === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              {msg.senderType !== 'user' && (
                <Text style={styles.aiLabel}>
                  {mode === 'gym' ? 'AI Coach' : 'Court Assistant'}
                </Text>
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
                  styles.timeStamp,
                  msg.senderType === 'user' && styles.userTimeStamp,
                ]}
              >
                {msg.timestamp.toLocaleTimeString('en-PH', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={styles.bubbleRow}>
            <View style={styles.aiAvatarSm}>
              <Text style={{ fontSize: 12 }}>{mode === 'gym' ? '🤖' : '🏟️'}</Text>
            </View>
            <View style={styles.aiBubble}>
              <View style={styles.typingRow}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.typingText}>Thinking…</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick prompts */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickBar}
        contentContainerStyle={styles.quickContent}
      >
        {prompts.map((p) => (
          <TouchableOpacity
            key={p}
            style={styles.quickChip}
            onPress={() => handleSend(p)}
            disabled={loading}
          >
            <Text style={styles.quickText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message…"
          placeholderTextColor={COLORS.textMuted}
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
            (!input.trim() || loading) && styles.sendBtnDisabled,
          ]}
          onPress={() => handleSend()}
          disabled={!input.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendIcon}>▶</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  onlineText: { fontSize: 11, color: COLORS.textSecondary },
  clearBtn: { padding: 6 },
  clearText: { fontSize: 14, color: COLORS.primary },
  messages: { flex: 1 },
  messagesContent: { padding: SPACING.lg, gap: SPACING.md },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm },
  bubbleRowUser: { flexDirection: 'row-reverse' },
  aiAvatarSm: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: SPACING.md },
  aiBubble: { backgroundColor: COLORS.card, borderTopLeftRadius: 4, borderWidth: 0.5, borderColor: COLORS.border },
  userBubble: { backgroundColor: COLORS.primary, borderTopRightRadius: 4 },
  aiLabel: { fontSize: 10, color: COLORS.primary, fontWeight: '700', marginBottom: 4 },
  bubbleText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  userBubbleText: { color: '#fff' },
  timeStamp: { fontSize: 10, color: COLORS.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  userTimeStamp: { color: 'rgba(255,255,255,0.6)' },
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: 4 },
  typingText: { fontSize: 13, color: COLORS.textSecondary },
  quickBar: { maxHeight: 44, borderTopWidth: 0.5, borderTopColor: COLORS.border },
  quickContent: { paddingHorizontal: SPACING.lg, alignItems: 'center', gap: SPACING.sm },
  quickChip: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 6 },
  quickText: { fontSize: 12, color: COLORS.primaryDark, fontWeight: '500' },
  inputRow: {
    flexDirection: 'row', gap: SPACING.sm, padding: SPACING.md,
    backgroundColor: COLORS.card, borderTopWidth: 0.5, borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.md,
  },
  input: {
    flex: 1, backgroundColor: COLORS.background, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, fontSize: 15, color: COLORS.text,
    maxHeight: 100, borderWidth: 1, borderColor: COLORS.border,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: COLORS.border },
  sendIcon: { color: '#fff', fontSize: 16 },
});

export default AIChat;