import { Badge, Card, IntensityBar, SectionHeader } from '@/components/UI';
import { COLORS, RADIUS, SHADOW, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useGymStore } from '@/store/gymStore';
import { useLiveStore } from '@/store/liveStore';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DAYS     = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const ACTIVITY = [3,5,2,7,6,4,1];
const MAX_ACT  = Math.max(...ACTIVITY);

const TIER_LABEL: Record<string,string> = { basic:'Basic', premium:'Premium', vip:'VIP Elite' };
const TIER_COLOR: Record<string,string> = { basic:'#185FA5', premium:COLORS.primary, vip:COLORS.amber };

const SEARCH_INDEX = [
  { label:'Sessions',       sub:'Book gym classes',        emoji:'📅', path:'/(gym)/session'        },
  { label:'Coaches',        sub:'Browse fitness coaches',  emoji:'👥', path:'/(gym)/coaches'         },
  { label:'Equipment',      sub:'Live availability',       emoji:'🏋️', path:'/(gym)/equipment'       },
  { label:'AI Coach',       sub:'Get a personal plan',     emoji:'🤖', path:'/(gym)/ai-coach'        },
  { label:'Membership',     sub:'Plans & upgrades',        emoji:'👑', path:'/(gym)/membership'      },
  { label:'Gym Shop',       sub:'Supplements & apparel',   emoji:'🛍️', path:'/(gym)/marketplace'     },
  { label:'Live Dashboard', sub:'Real-time gym stats',     emoji:'📊', path:'/(gym)/live-dashboard'  },
  { label:'Apply as Coach', sub:'Join the FlexZone team',  emoji:'🎯', path:'/(gym)/coach-apply'     },
  { label:'Book a Court',   sub:'Reserve a sports court',  emoji:'🏀', path:'/(court)/book'          },
  { label:'Court Events',   sub:'Packages & venues',       emoji:'🎉', path:'/(court)/events'        },
  { label:'My Bookings',    sub:'Upcoming & past',         emoji:'📆', path:'/(shared)/my-bookings'  },
  { label:'Profile',        sub:'Edit your account',       emoji:'👤', path:'/(shared)/profile'      },
  { label:'Settings',       sub:'Notifications, security', emoji:'⚙️', path:'/(shared)/settings'     },
  { label:'Help & Support', sub:'FAQs & contact us',       emoji:'🆘', path:'/(shared)/support'      },
  {label: 'Coach Profile',  sub: 'View coach details',     emoji: '🧑‍🏫',path: '/(gym)/coach-profile',},
 
];

function greeting():string { const h=new Date().getHours(); return h<12?'Good morning':h<17?'Good afternoon':'Good evening'; }

export default function DashboardScreen() {
  const { user }    = useAuthStore();
  const { sessions, bookedSessions } = useGymStore();
  const { stats, startLive, stopLive } = useLiveStore();
  const [query, setQuery]   = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(() => { startLive(); return () => stopLive(); }, []);

  const booked        = sessions.filter((s) => bookedSessions.includes(s.id));
  const todaySessions = sessions.slice(0,4);
  const tier          = user?.membership ?? 'basic';

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter((i) => i.label.toLowerCase().includes(q) || i.sub.toLowerCase().includes(q)).slice(0,6);
  }, [query]);

  return (
    <View style={s.container}>
      {/* Search bar - sticky at top */}
      <View style={s.searchWrap}>
        <View style={[s.searchBar, focused && s.searchBarFocused]}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput style={s.searchInput} placeholder="Search sessions, coaches, courts..."
            placeholderTextColor={COLORS.textMuted} value={query} onChangeText={setQuery}
            onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)}
            clearButtonMode="while-editing" />
          {query.length > 0 && <TouchableOpacity onPress={() => setQuery('')} style={s.clearBtn}><Text style={s.clearText}>✕</Text></TouchableOpacity>}
        </View>
        {/* Dropdown */}
        {focused && results.length > 0 && (
          <View style={s.dropdown}>
            {results.map((item, i) => (
              <TouchableOpacity key={i} style={[s.dropRow, i < results.length-1 && s.dropDivider]}
                onPress={() => { setQuery(''); router.push(item.path as never); }}>
                <Text style={s.dropEmoji}>{item.emoji}</Text>
                <View style={{ flex:1 }}>
                  <Text style={s.dropLabel}>{item.label}</Text>
                  <Text style={s.dropSub}>{item.sub}</Text>
                </View>
                <Text style={s.dropArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {focused && query.length > 1 && results.length === 0 && (
          <View style={s.dropdown}>
            <View style={s.dropRow}><Text style={s.dropEmoji}>😕</Text><Text style={s.dropLabel}>No results for "{query}"</Text></View>
          </View>
        )}
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View style={{ flex:1 }}>
            <Text style={s.greeting}>{greeting()}, {user?.name?.split(' ')[0] ?? 'Champ'} 👋</Text>
            <Text style={s.date}>{new Date().toLocaleDateString('en-PH',{weekday:'long',month:'long',day:'numeric'})}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(gym)/membership' as never)} style={{ marginRight: SPACING.sm }}>
            <Badge label={TIER_LABEL[tier]} color={TIER_COLOR[tier]} bgColor={TIER_COLOR[tier]+'20'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(shared)/profile' as never)}>
            <View style={s.avatarBtn}><Text style={s.avatarText}>{user?.name?.charAt(0) ?? 'U'}</Text></View>
          </TouchableOpacity>
        </View>

        {/* Stat cards */}
        <View style={s.statsRow}>
          {[
            { value:stats.membersInGym,    label:'Live now',        emoji:'🔴' },
            { value:todaySessions.length,  label:"Today's classes", emoji:'📅' },
            { value:booked.length,         label:'Your bookings',   emoji:'✅' },
          ].map((stat) => (
            <View key={stat.label} style={s.statCard}>
              <Text style={s.statEmoji}>{stat.emoji}</Text>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Weekly chart */}
        <Card style={s.chartCard}>
          <Text style={s.chartTitle}>This week's activity</Text>
          <View style={s.chartRow}>
            {ACTIVITY.map((val,i) => (
              <View key={i} style={s.chartCol}>
                <View style={s.barTrack}>
                  <View style={[s.bar,{height:`${(val/MAX_ACT)*100}%` as any,backgroundColor:i===4?COLORS.primary:COLORS.primaryLight}]} />
                </View>
                <Text style={s.barLabel}>{DAYS[i]}</Text>
              </View>
            ))}
          </View>
          <Text style={s.chartSub}>28 sessions this month · On track 🔥</Text>
        </Card>

        {/* Today's classes */}
        <SectionHeader title="Today's classes" action="See all" onAction={() => router.push('/(gym)/session' as never)} />
        {todaySessions.map((session) => (
          <TouchableOpacity key={session.id} style={s.sessionCard} onPress={() => router.push('/(gym)/session' as never)} activeOpacity={0.85}>
            <View style={[s.sessionDot,{backgroundColor:session.color}]} />
            <View style={s.sessionInfo}>
              <Text style={s.sessionName}>{session.name}</Text>
              <Text style={s.sessionMeta}>{session.time} · {session.coach} · {session.duration}min</Text>
            </View>
            <View style={s.sessionRight}>
              <IntensityBar level={session.intensity} />
              <Text style={s.sessionSlots}>{session.slots-session.bookedSlots} slots left</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Your bookings */}
        {booked.length > 0 && (
          <>
            <SectionHeader title="Your bookings" />
            {booked.slice(0,2).map((b) => (
              <Card key={b.id} style={s.bookingCard}>
                <View style={[s.bookingBar,{backgroundColor:b.color}]} />
                <View style={{flex:1}}>
                  <Text style={s.bookingName}>{b.name}</Text>
                  <Text style={s.bookingMeta}>{b.time} · {b.coach}</Text>
                </View>
                <Badge label="Booked ✓" color={COLORS.primaryDark} bgColor={COLORS.primaryLight} size="sm" />
              </Card>
            ))}
          </>
        )}

        {/* Quick access */}
        <SectionHeader title="Quick access" />
        <View style={s.quickRow}>
          {[
            {emoji:'🏋️',label:'Equipment', path:'/(gym)/equipment'   },
            {emoji:'👥',label:'Coaches',   path:'/(gym)/coaches'     },
            {emoji:'🛍️',label:'Shop',      path:'/(gym)/marketplace' },
            {emoji:'🤖',label:'AI Coach',  path:'/(gym)/ai-coach'    },
            {emoji:'🧑‍🏫',label:'Coach Profile',path:'/(gym)/coach-profile'},
          ].map((item) => (
            <TouchableOpacity key={item.label} style={s.quickCard} onPress={() => router.push(item.path as never)} activeOpacity={0.8}>
              <Text style={s.quickEmoji}>{item.emoji}</Text>
              <Text style={s.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live banner */}
        <TouchableOpacity style={s.liveBanner} onPress={() => router.push('/(gym)/live-dashboard' as never)} activeOpacity={0.9}>
          <View style={s.liveBadge}><View style={s.liveDot}/><Text style={s.liveLabel}>LIVE</Text></View>
          <View style={{flex:1,marginLeft:12}}>
            <Text style={s.liveBannerTitle}>{stats.membersInGym} members in gym right now</Text>
            <Text style={s.liveBannerSub}>Real-time dashboard →</Text>
          </View>
          <Text style={{fontSize:22}}>📊</Text>
        </TouchableOpacity>

        {/* Court banner */}
        <TouchableOpacity style={s.courtBanner} onPress={() => router.replace('/(court)' as never)} activeOpacity={0.9}>
          <Text style={{fontSize:32}}>🏀</Text>
          <View style={{flex:1,marginLeft:12}}>
            <Text style={s.courtBannerTitle}>Basketball Court Available</Text>
            <Text style={s.courtBannerSub}>Switch to Court Booking →</Text>
          </View>
          <View style={s.courtLive}>
            <View style={{width:7,height:7,borderRadius:4,backgroundColor:'#fff',marginRight:5}}/>
            <Text style={{color:'#fff',fontSize:10,fontWeight:'800'}}>LIVE</Text>
          </View>
        </TouchableOpacity>

        <View style={{height:SPACING.xxl}} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:        { flex:1, backgroundColor:COLORS.background },
  // Search
  searchWrap:       { backgroundColor:COLORS.card, paddingHorizontal:SPACING.lg, paddingTop:SPACING.sm, paddingBottom:SPACING.sm, borderBottomWidth:0.5, borderBottomColor:COLORS.border, zIndex:100 },
  searchBar:        { flexDirection:'row', alignItems:'center', backgroundColor:COLORS.background, borderRadius:RADIUS.lg, paddingHorizontal:SPACING.md, borderWidth:1.5, borderColor:COLORS.border, height:44 },
  searchBarFocused: { borderColor:COLORS.primary },
  searchIcon:       { fontSize:16, marginRight:SPACING.sm },
  searchInput:      { flex:1, fontSize:15, color:COLORS.text, height:'100%' },
  clearBtn:         { padding:6 },
  clearText:        { fontSize:14, color:COLORS.textMuted },
  dropdown:         { position:'absolute', top:54, left:0, right:0, backgroundColor:COLORS.card, borderRadius:RADIUS.lg, borderWidth:1, borderColor:COLORS.border, ...SHADOW.md, zIndex:999 },
  dropRow:          { flexDirection:'row', alignItems:'center', padding:SPACING.md, gap:SPACING.sm },
  dropDivider:      { borderBottomWidth:0.5, borderBottomColor:COLORS.border },
  dropEmoji:        { fontSize:20, width:30 },
  dropLabel:        { fontSize:14, fontWeight:'600', color:COLORS.text },
  dropSub:          { fontSize:11, color:COLORS.textSecondary, marginTop:1 },
  dropArrow:        { fontSize:18, color:COLORS.textMuted },
  // Main content
  scroll:           { flex:1 },
  content:          { padding:SPACING.lg },
  header:           { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', paddingTop:16, marginBottom:SPACING.xl },
  greeting:         { fontSize:22, fontWeight:'700', color:COLORS.text },
  date:             { fontSize:13, color:COLORS.textSecondary, marginTop:2 },
  avatarBtn:        { width:40, height:40, borderRadius:20, backgroundColor:COLORS.primaryLight, alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:COLORS.primary },
  avatarText:       { fontSize:16, fontWeight:'800', color:COLORS.primaryDark },
  statsRow:         { flexDirection:'row', marginBottom:SPACING.xl, gap:SPACING.sm },
  statCard:         { flex:1, backgroundColor:COLORS.card, borderRadius:RADIUS.lg, padding:SPACING.md, alignItems:'center', borderWidth:0.5, borderColor:COLORS.border, ...SHADOW.sm },
  statEmoji:        { fontSize:18, marginBottom:4 },
  statValue:        { fontSize:22, fontWeight:'700', color:COLORS.text },
  statLabel:        { fontSize:11, color:COLORS.textSecondary, textAlign:'center', marginTop:2 },
  chartCard:        { marginBottom:SPACING.xl },
  chartTitle:       { fontSize:15, fontWeight:'600', color:COLORS.text, marginBottom:SPACING.md },
  chartRow:         { flexDirection:'row', height:80, alignItems:'flex-end' },
  chartCol:         { flex:1, alignItems:'center' },
  barTrack:         { flex:1, width:'100%', justifyContent:'flex-end', backgroundColor:COLORS.background, borderRadius:4 },
  bar:              { width:'100%', borderRadius:4, minHeight:4 },
  barLabel:         { fontSize:10, color:COLORS.textSecondary, marginTop:4 },
  chartSub:         { fontSize:12, color:COLORS.textSecondary, marginTop:SPACING.sm },
  sessionCard:      { flexDirection:'row', alignItems:'center', backgroundColor:COLORS.card, borderRadius:RADIUS.md, padding:SPACING.md, marginBottom:SPACING.sm, borderWidth:0.5, borderColor:COLORS.border },
  sessionDot:       { width:10, height:10, borderRadius:5, marginRight:SPACING.md },
  sessionInfo:      { flex:1 },
  sessionName:      { fontSize:14, fontWeight:'600', color:COLORS.text },
  sessionMeta:      { fontSize:12, color:COLORS.textSecondary, marginTop:2 },
  sessionRight:     { alignItems:'flex-end' },
  sessionSlots:     { fontSize:11, color:COLORS.textSecondary, marginTop:4 },
  bookingCard:      { flexDirection:'row', alignItems:'center', marginBottom:SPACING.sm },
  bookingBar:       { width:4, height:40, borderRadius:2, marginRight:SPACING.md },
  bookingName:      { fontSize:14, fontWeight:'600', color:COLORS.text },
  bookingMeta:      { fontSize:12, color:COLORS.textSecondary },
  quickRow:         { flexDirection:'row', gap:SPACING.sm, marginBottom:SPACING.lg },
  quickCard:        { flex:1, backgroundColor:COLORS.card, borderRadius:RADIUS.lg, padding:SPACING.md, alignItems:'center', borderWidth:0.5, borderColor:COLORS.border },
  quickEmoji:       { fontSize:24, marginBottom:6 },
  quickLabel:       { fontSize:11, color:COLORS.textSecondary, fontWeight:'500' },
  liveBanner:       { flexDirection:'row', alignItems:'center', backgroundColor:COLORS.primary, borderRadius:RADIUS.lg, padding:SPACING.md, marginBottom:SPACING.sm },
  liveBadge:        { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(0,0,0,0.25)', borderRadius:99, paddingHorizontal:8, paddingVertical:4 },
  liveDot:          { width:7, height:7, borderRadius:4, backgroundColor:'#fff', marginRight:5 },
  liveLabel:        { color:'#fff', fontSize:10, fontWeight:'800', letterSpacing:0.5 },
  liveBannerTitle:  { fontSize:14, fontWeight:'700', color:'#fff' },
  liveBannerSub:    { fontSize:12, color:'rgba(255,255,255,0.75)', marginTop:1 },
  courtBanner:      { flexDirection:'row', alignItems:'center', backgroundColor:'#1A1A2E', borderRadius:RADIUS.lg, padding:SPACING.lg, marginBottom:SPACING.lg },
  courtBannerTitle: { fontSize:15, fontWeight:'700', color:'#fff' },
  courtBannerSub:   { fontSize:12, color:'#E87722', marginTop:2 },
  courtLive:        { flexDirection:'row', alignItems:'center', backgroundColor:'#E24B4A', borderRadius:99, paddingHorizontal:8, paddingVertical:4 },
});