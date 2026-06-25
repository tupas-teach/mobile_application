import { COLORS, RADIUS, SHADOW, SPACING } from '@/constants/theme';
import { useGymStore } from '@/store/gymStore';
import { useLiveStore } from '@/store/liveStore';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions, ScrollView, StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── Search index — everything searchable in the app ─────────────────────────
const ALL_SEARCHABLE = [
  // Gym screens
  { type:'screen', label:'Sessions',       sub:'View & book gym classes',          emoji:'📅', path:'/(gym)/session',       tag:'gym'   },
  { type:'screen', label:'Coaches',        sub:'Browse fitness coaches',           emoji:'👥', path:'/(gym)/coaches',        tag:'gym'   },
  { type:'screen', label:'Equipment',      sub:'Live equipment availability',      emoji:'🏋️', path:'/(gym)/equipment',      tag:'gym'   },
  { type:'screen', label:'Gym Shop',       sub:'Supplements & apparel',            emoji:'🛍️', path:'/(gym)/marketplace',    tag:'gym'   },
  { type:'screen', label:'AI Coach',       sub:'Get a personalized plan',          emoji:'🤖', path:'/(gym)/ai-coach',       tag:'gym'   },
  { type:'screen', label:'Membership',     sub:'Plans & upgrade options',          emoji:'👑', path:'/(gym)/membership',     tag:'gym'   },
  { type:'screen', label:'Live Dashboard', sub:'Real-time gym stats',              emoji:'📊', path:'/(gym)/live-dashboard', tag:'gym'   },
  { type:'screen', label:'Apply as Coach', sub:'Join the FlexZone team',           emoji:'🎯', path:'/(gym)/coach-apply',    tag:'gym'   },
  // Court screens
  { type:'screen', label:'Book a Court',   sub:'Reserve basketball, volleyball…',  emoji:'📋', path:'/(court)/book',         tag:'court' },
  { type:'screen', label:'Court Events',   sub:'Birthday, corporate, weddings',    emoji:'🎉', path:'/(court)/events',       tag:'court' },
  { type:'screen', label:'Court Shop',     sub:'Drinks, snacks & gear',            emoji:'🛒', path:'/(court)/marketplace',  tag:'court' },
  { type:'screen', label:'Court Chat',     sub:'Message the admin team',           emoji:'💬', path:'/(court)/chat',         tag:'court' },
  // Shared
  { type:'screen', label:'My Bookings',    sub:'Upcoming & past bookings',         emoji:'📆', path:'/(shared)/my-bookings', tag:'account' },
  { type:'screen', label:'Transactions',   sub:'Payment history',                  emoji:'💳', path:'/(shared)/transactions', tag:'account' },
  { type:'screen', label:'Settings',       sub:'Notifications, security',          emoji:'⚙️', path:'/(shared)/settings',    tag:'account' },
  { type:'screen', label:'Help & Support', sub:'FAQs & contact us',               emoji:'🆘', path:'/(shared)/support',     tag:'account' },
  { type:'screen', label:'Profile',        sub:'Edit your account',               emoji:'👤', path:'/(shared)/profile',     tag:'account' },
  // Courts
  { type:'court', label:'Basketball',      sub:'₱300/hr · Main Court',            emoji:'🏀', path:'/(court)/book',         tag:'court' },
  { type:'court', label:'Volleyball',      sub:'₱250/hr · Court A',               emoji:'🏐', path:'/(court)/book',         tag:'court' },
  { type:'court', label:'Badminton',       sub:'₱200/hr · 4 courts',              emoji:'🏸', path:'/(court)/book',         tag:'court' },
  { type:'court', label:'Pickleball',      sub:'₱200/hr · 2 courts',              emoji:'🎾', path:'/(court)/book',         tag:'court' },
  { type:'court', label:'Table Tennis',    sub:'₱150/hr · 4 tables',              emoji:'🏓', path:'/(court)/book',         tag:'court' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function LiveBadge() {
  const [op, setOp] = useState(1);
  useEffect(() => { const t = setInterval(() => setOp(v => v > 0.3 ? 0.3 : 1), 900); return () => clearInterval(t); }, []);
  return (
    <View style={c.liveBadge}>
      <View style={[c.liveDot, { opacity: op }]} />
      <Text style={c.liveText}>LIVE</Text>
    </View>
  );
}

function PulseDot({ color }: { color: string }) {
  const [op, setOp] = useState(1);
  useEffect(() => { const t = setInterval(() => setOp(v => v > 0.3 ? 0.3 : 1), 800); return () => clearInterval(t); }, []);
  return <View style={[s.pulseDot, { backgroundColor: color, opacity: op }]} />;
}

const COURT_STATUS = [
  { id:'A', sport:'🏀', name:'Basketball A', status:'occupied',  info:'Ballers vs Hoops · 18 min left' },
  { id:'B', sport:'🏐', name:'Volleyball B',  status:'occupied',  info:'Smash Squad · 32 min left'      },
  { id:'C', sport:'🏸', name:'Badminton C1', status:'available', info:'Available for booking'           },
  { id:'D', sport:'🏸', name:'Badminton C2', status:'available', info:'Available for booking'           },
  { id:'E', sport:'🏓', name:'Table Tennis', status:'occupied',  info:'Singles match · 5 min left'     },
];

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function HomeDashboardScreen() {
  const { sessions }         = useGymStore();
  const { stats, startLive, stopLive } = useLiveStore();
  const [query, setQuery]    = useState('');
  const [focused, setFocused]= useState(false);
  const [now, setNow]        = useState(new Date());

  useEffect(() => { startLive(); return () => stopLive(); }, []);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_SEARCHABLE.filter(
      (item) => item.label.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q) || item.tag.includes(q)
    ).slice(0, 8);
  }, [query]);

  const timeStr = now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Manila' });
  const dateStr = now.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Asia/Manila' });
  const h = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' })).getHours();
  const greetEmoji = h < 6 ? '🌙' : h < 12 ? '🌤️' : h < 18 ? '☀️' : '🌙';

  const activeSessions = sessions.filter(sess => sess.bookedSlots < sess.slots).slice(0, 4);

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Home Dashboard</Text>
        <LiveBadge />
      </View>

      {/* Search bar */}
      <View style={s.searchWrap}>
        <View style={[s.searchBar, focused && s.searchBarFocused]}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Search courts, sessions, coaches, screens..."
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={s.clearBtn}>
              <Text style={s.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search results dropdown */}
        {focused && results.length > 0 && (
          <View style={s.dropdown}>
            {results.map((item, i) => (
              <TouchableOpacity key={i} style={[s.dropRow, i < results.length - 1 && s.dropDivider]}
                onPress={() => { setQuery(''); router.push(item.path as never); }}>
                <Text style={s.dropEmoji}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.dropLabel}>{item.label}</Text>
                  <Text style={s.dropSub}>{item.sub}</Text>
                </View>
                <View style={[s.dropTag, { backgroundColor: item.tag === 'gym' ? COLORS.primaryLight : item.tag === 'court' ? '#E6F1FB' : COLORS.background }]}>
                  <Text style={[s.dropTagText, { color: item.tag === 'gym' ? COLORS.primaryDark : item.tag === 'court' ? '#185FA5' : COLORS.textSecondary }]}>
                    {item.tag}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {focused && query.length > 2 && results.length === 0 && (
          <View style={s.dropdown}>
            <View style={s.dropRow}>
              <Text style={s.dropEmoji}>😕</Text>
              <Text style={s.dropLabel}>No results for "{query}"</Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Clock */}
        <View style={s.clockCard}>
          <View style={s.clockTop}>
            <View>
              <Text style={s.clockEmoji}>{greetEmoji}</Text>
              <Text style={s.clockDate}>{dateStr}</Text>
            </View>
            <LiveBadge />
          </View>
          <Text style={s.clockTime}>{timeStr}</Text>
          <Text style={s.clockTz}>Philippine Standard Time (UTC+8)</Text>
        </View>

        {/* Live stats */}
        <View style={s.statsGrid}>
          {[
            { label:'In gym now',    value:stats.membersInGym,    emoji:'🏋️', color:COLORS.primary,   path:'/(gym)/live-dashboard'  },
            { label:'Courts active', value:stats.courtsOccupied,  emoji:'🏟️', color:'#185FA5',         path:'/(court)/index'         },
            { label:'Open sessions', value:activeSessions.length, emoji:'📅', color:COLORS.secondary,  path:'/(gym)/session'         },
            { label:'Court queue',   value:stats.courtQueue,      emoji:'⏳', color:COLORS.amber,      path:'/(court)/book'          },
          ].map((st) => (
            <TouchableOpacity key={st.label} style={s.statCard} onPress={() => router.push(st.path as never)} activeOpacity={0.8}>
              <Text style={s.statEmoji}>{st.emoji}</Text>
              <Text style={[s.statValue, { color: st.color }]}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick nav */}
        <Text style={s.sectionTitle}>🏃 Quick Navigation</Text>
        <View style={s.quickGrid}>
          {[
            { emoji:'📅', label:'Sessions',    color:'#1D9E75', bg:'#E1F5EE', path:'/(gym)/session'       },
            { emoji:'👥', label:'Coaches',     color:'#534AB7', bg:'#EEEDFE', path:'/(gym)/coaches'        },
            { emoji:'🏋️', label:'Equipment',  color:'#D85A30', bg:'#FAECE7', path:'/(gym)/equipment'      },
            { emoji:'🤖', label:'AI Coach',    color:'#185FA5', bg:'#E6F1FB', path:'/(gym)/ai-coach'       },
            { emoji:'🏀', label:'Book Court',  color:'#EF9F27', bg:'#FAEEDA', path:'/(court)/book'         },
            { emoji:'🎉', label:'Events',      color:'#B45309', bg:'#FEF3C7', path:'/(court)/events'       },
            { emoji:'🛍️', label:'Gym Shop',   color:'#0F6E56', bg:'#E1F5EE', path:'/(gym)/marketplace'    },
            { emoji:'🛒', label:'Court Shop',  color:'#1A1A2E', bg:'#F3F4F6', path:'/(court)/marketplace'  },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={[s.quickCard, { backgroundColor: item.bg }]}
              onPress={() => router.push(item.path as never)} activeOpacity={0.82}>
              <Text style={s.quickEmoji}>{item.emoji}</Text>
              <Text style={[s.quickLabel, { color: item.color }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Court availability */}
        <Text style={s.sectionTitle}>🏟️ Court Availability</Text>
        {COURT_STATUS.map((court) => {
          const avail = court.status === 'available';
          const dotColor = avail ? COLORS.success : COLORS.error;
          return (
            <TouchableOpacity key={court.id} style={[s.courtRow, { borderLeftColor: dotColor, borderLeftWidth: 4 }]}
              onPress={() => router.push('/(court)/book' as never)} activeOpacity={0.85}>
              <Text style={s.courtEmoji}>{court.sport}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.courtName}>{court.name}</Text>
                <Text style={[s.courtInfo, avail && { color: COLORS.success }]}>{court.info}</Text>
              </View>
              <View style={s.courtStatusBadge}>
                <PulseDot color={dotColor} />
                <Text style={[s.courtStatusText, { color: dotColor }]}>{avail ? 'Open' : 'In Use'}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={s.bookCourtBtn} onPress={() => router.push('/(court)/book' as never)}>
          <Text style={s.bookCourtBtnText}>📋  Book a Court Now</Text>
        </TouchableOpacity>

        {/* Active sessions */}
        <Text style={s.sectionTitle}>💪 Active Gym Sessions</Text>
        {activeSessions.map((sess) => {
          const pct = (sess.bookedSlots / sess.slots) * 100;
          const full = sess.bookedSlots >= sess.slots;
          return (
            <TouchableOpacity key={sess.id} style={s.sessionCard}
              onPress={() => router.push('/(gym)/session' as never)} activeOpacity={0.85}>
              <View style={s.sessionTop}>
                <View style={[s.sessionTag, { backgroundColor: sess.color + '22' }]}>
                  <Text style={[s.sessionTagText, { color: sess.color }]}>{sess.type}</Text>
                </View>
                <Text style={s.sessionTime}>{sess.time}</Text>
              </View>
              <Text style={s.sessionName}>{sess.name}</Text>
              <Text style={s.sessionCoach}>👤 {sess.coach}</Text>
              <View style={s.barRow}>
                <View style={s.barTrack}>
                  <View style={[s.barFill, { width: `${pct}%` as any, backgroundColor: full ? COLORS.error : sess.color }]} />
                </View>
                <Text style={[s.barText, { color: full ? COLORS.error : COLORS.textSecondary }]}>
                  {full ? 'Full' : `${sess.slots - sess.bookedSlots} left`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: SPACING.xxl * 2 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container:        { flex: 1, backgroundColor: COLORS.background },
  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:          { width: 40 },
  backText:         { fontSize: 22, color: COLORS.primary, fontWeight: '600' },
  headerTitle:      { fontSize: 18, fontWeight: '700', color: COLORS.text },

  // Search
  searchWrap:       { backgroundColor: COLORS.card, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderBottomWidth: 0.5, borderBottomColor: COLORS.border, zIndex: 100 },
  searchBar:        { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border, height: 44 },
  searchBarFocused: { borderColor: COLORS.primary, backgroundColor: '#fff' },
  searchIcon:       { fontSize: 16, marginRight: SPACING.sm },
  searchInput:      { flex: 1, fontSize: 15, color: COLORS.text, height: '100%' },
  clearBtn:         { padding: 6 },
  clearText:        { fontSize: 14, color: COLORS.textMuted },
  dropdown:         { position: 'absolute', top: 58, left: SPACING.lg, right: SPACING.lg, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.md, zIndex: 999 },
  dropRow:          { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.sm },
  dropDivider:      { borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  dropEmoji:        { fontSize: 22, width: 32 },
  dropLabel:        { fontSize: 14, fontWeight: '600', color: COLORS.text },
  dropSub:          { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  dropTag:          { paddingHorizontal: 7, paddingVertical: 3, borderRadius: RADIUS.full },
  dropTagText:      { fontSize: 10, fontWeight: '700' },

  content:          { padding: SPACING.lg },

  // Clock
  clockCard:        { backgroundColor: '#0F172A', borderRadius: RADIUS.xl, padding: SPACING.xl, marginBottom: SPACING.lg },
  clockTop:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  clockEmoji:       { fontSize: 28, marginBottom: 4 },
  clockDate:        { fontSize: 13, color: 'rgba(255,255,255,0.55)' },
  clockTime:        { fontSize: 40, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  clockTz:          { fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 },

  // Stats
  statsGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  statCard:         { width: (width - SPACING.lg * 2 - SPACING.sm) / 2, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 0.5, borderColor: COLORS.border, alignItems: 'center', ...SHADOW.sm },
  statEmoji:        { fontSize: 22, marginBottom: 4 },
  statValue:        { fontSize: 26, fontWeight: '900' },
  statLabel:        { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },

  sectionTitle:     { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md, marginTop: SPACING.sm },

  // Quick nav
  quickGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  quickCard:        { width: (width - SPACING.lg * 2 - SPACING.sm * 3) / 4, borderRadius: RADIUS.lg, padding: SPACING.sm, alignItems: 'center', gap: 4, minHeight: 72, justifyContent: 'center' },
  quickEmoji:       { fontSize: 24 },
  quickLabel:       { fontSize: 10, fontWeight: '700', textAlign: 'center' },

  // Courts
  courtRow:         { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 0.5, borderColor: COLORS.border, overflow: 'hidden' },
  courtEmoji:       { fontSize: 24, marginRight: SPACING.md },
  courtName:        { fontSize: 14, fontWeight: '600', color: COLORS.text },
  courtInfo:        { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  courtStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  courtStatusText:  { fontSize: 12, fontWeight: '700' },
  bookCourtBtn:     { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.sm, marginBottom: SPACING.sm },
  bookCourtBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  pulseDot:         { width: 8, height: 8, borderRadius: 4 },

  // Sessions
  sessionCard:      { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 0.5, borderColor: COLORS.border },
  sessionTop:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  sessionTag:       { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 },
  sessionTagText:   { fontSize: 11, fontWeight: '700' },
  sessionTime:      { fontSize: 12, color: COLORS.textSecondary },
  sessionName:      { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  sessionCoach:     { fontSize: 12, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  barRow:           { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  barTrack:         { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  barFill:          { height: '100%', borderRadius: 3 },
  barText:          { fontSize: 11, fontWeight: '600', minWidth: 40, textAlign: 'right' },
});

const c = StyleSheet.create({
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.error, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
  liveDot:   { width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff', marginRight: 5 },
  liveText:  { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
});
