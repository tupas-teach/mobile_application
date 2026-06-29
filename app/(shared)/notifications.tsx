import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'promo' | 'reminder' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id:'1', type:'booking',  title:'Booking Confirmed! 🎉',        body:'Main Basketball Court booked for today 6:00–8:00 PM.',            time:'2 min ago',  read:false },
  { id:'2', type:'reminder', title:'Class starts in 30 min ⏰',    body:'HIIT Blast with Coach Rico Cruz starts at 7:00 AM.',              time:'30 min ago', read:false },
  { id:'3', type:'payment',  title:'Payment Successful 💳',        body:'Payment of ₱1,299 for Premium Membership received.',              time:'1 hr ago',   read:false },
  { id:'4', type:'promo',    title:'Weekend Promo 🏃',             body:'20% off all Saturday HIIT classes this weekend. Book now!',       time:'3 hrs ago',  read:true  },
  { id:'5', type:'system',   title:'New coach joined FlexZone 👋', body:'Coach Elena Ramos (Pilates & Yoga) is now available for bookings.',time:'Yesterday',  read:true  },
  { id:'6', type:'reminder', title:'Court booking tomorrow 🏀',    body:'Reminder: Basketball Court booking tomorrow at 4:00 PM.',         time:'Yesterday',  read:true  },
  { id:'7', type:'promo',    title:'Marketplace Flash Sale 🛍️',   body:'30% off all protein supplements today only!',                     time:'2 days ago', read:true  },
  { id:'8', type:'system',   title:'App Update Available',         body:'FlexZone v1.1 is now available with new features.',               time:'3 days ago', read:true  },
];

const TYPE_CONFIG: Record<Notification['type'], { emoji: string; color: string; bg: string }> = {
  booking:  { emoji:'📅', color:COLORS.primary,      bg:COLORS.primaryLight },
  payment:  { emoji:'💳', color:'#185FA5',            bg:'#E6F1FB'           },
  promo:    { emoji:'🎁', color:'#B45309',            bg:'#FAEEDA'           },
  reminder: { emoji:'⏰', color:COLORS.amber,         bg:'#FEF9C3'           },
  system:   { emoji:'🔔', color:COLORS.textSecondary, bg:COLORS.background   },
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const markRead    = (id: string) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Notifications</Text>
          {unreadCount > 0 && <Text style={s.unreadCount}>{unreadCount} unread</Text>}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} style={s.markAllBtn}>
            <Text style={s.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyEmoji}>🔕</Text>
            <Text style={s.emptyTitle}>No notifications yet</Text>
            <Text style={s.emptySub}>We'll notify you about bookings, promos, and updates.</Text>
          </View>
        ) : (
          notifications.map((notif) => {
            const cfg = TYPE_CONFIG[notif.type];
            return (
              <TouchableOpacity key={notif.id}
                style={[s.notifCard, !notif.read && s.notifCardUnread]}
                onPress={() => markRead(notif.id)} activeOpacity={0.85}>
                <View style={[s.notifIcon, { backgroundColor: cfg.bg }]}>
                  <Text style={{ fontSize: 20 }}>{cfg.emoji}</Text>
                </View>
                <View style={s.notifBody}>
                  <Text style={[s.notifTitle, !notif.read && s.notifTitleUnread]}>{notif.title}</Text>
                  <Text style={s.notifText} numberOfLines={2}>{notif.body}</Text>
                  <Text style={s.notifTime}>{notif.time}</Text>
                </View>
                {!notif.read && <View style={[s.unreadDot, { backgroundColor: cfg.color }]} />}
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:        { flex: 1, backgroundColor: COLORS.background },
  header:           { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:          { width: 40, alignItems: 'center' },
  backText:         { fontSize: 22, color: COLORS.primary },
  title:            { fontSize: 20, fontWeight: '700', color: COLORS.text },
  unreadCount:      { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  markAllBtn:       { padding: 6 },
  markAllText:      { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  list:             { padding: SPACING.lg, gap: SPACING.sm },
  notifCard:        { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 0.5, borderColor: COLORS.border, position: 'relative' },
  notifCardUnread:  { backgroundColor: '#F0FBF7', borderColor: COLORS.primary + '30' },
  notifIcon:        { width: 44, height: 44, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifBody:        { flex: 1, gap: 3 },
  notifTitle:       { fontSize: 14, fontWeight: '500', color: COLORS.text },
  notifTitleUnread: { fontWeight: '700' },
  notifText:        { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  notifTime:        { fontSize: 11, color: COLORS.textMuted },
  unreadDot:        { position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4 },
  empty:            { alignItems: 'center', paddingTop: 80, gap: SPACING.md },
  emptyEmoji:       { fontSize: 48 },
  emptyTitle:       { fontSize: 18, fontWeight: '700', color: COLORS.text },
  emptySub:         { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
});
