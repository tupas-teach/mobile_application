import { Badge, Card, SectionHeader } from '@/components/UI';
import { CONFIG } from '@/constants/config';
import { COLORS, RADIUS, SHADOW, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SEARCH_INDEX = [
  { label:'Book Basketball',  sub:'Main Court · ₱300/hr',       emoji:'🏀', path:'/(court)/book'        },
  { label:'Book Volleyball',  sub:'Court A · ₱250/hr',          emoji:'🏐', path:'/(court)/book'        },
  { label:'Book Badminton',   sub:'4 courts · ₱200/hr',         emoji:'🏸', path:'/(court)/book'        },
  { label:'Book Pickleball',  sub:'2 courts · ₱200/hr',         emoji:'🎾', path:'/(court)/book'        },
  { label:'Book Table Tennis',sub:'4 tables · ₱150/hr',         emoji:'🏓', path:'/(court)/book'        },
  { label:'Event Packages',   sub:'Birthday, corporate, weddings',emoji:'🎉', path:'/(court)/events'     },
  { label:'Birthday Bash',    sub:'₱5,000 · up to 100 guests',  emoji:'🎂', path:'/(court)/events'      },
  { label:'Corporate Event',  sub:'₱12,000 · full day',         emoji:'🏢', path:'/(court)/events'      },
  { label:'Wedding Reception',sub:'₱15,000 · full day',         emoji:'💍', path:'/(court)/events'      },
  { label:'Court Shop',       sub:'Drinks, snacks & gear',       emoji:'🛒', path:'/(court)/marketplace' },
  { label:'Chat with Admin',  sub:'Get help or custom booking',  emoji:'💬', path:'/(court)/court-chat'        },
  { label:'My Bookings',      sub:'View your reservations',      emoji:'📆', path:'/(shared)/my-bookings'},
];

const SPORT_CATEGORIES = [
  { emoji:'🏀', label:'Basketball', color:COLORS.accent,   bg:COLORS.accentLight,    courtId:'c1', price:'₱300/hr' },
  { emoji:'🏐', label:'Volleyball', color:'#185FA5',        bg:'#E6F1FB',             courtId:'c2', price:'₱250/hr' },
  { emoji:'🏸', label:'Badminton',  color:COLORS.secondary, bg:COLORS.secondaryLight, courtId:'c3', price:'₱200/hr' },
  { emoji:'🎾', label:'Pickleball', color:COLORS.primary,   bg:COLORS.primaryLight,   courtId:'c4', price:'₱200/hr' },
  { emoji:'🏓', label:'Table Tennis',color:COLORS.amber,    bg:COLORS.amberLight,     courtId:'c5', price:'₱150/hr' },
  { emoji:'🎉', label:'Events',     color:'#B45309',         bg:'#FAEEDA',             courtId:'c6', price:'From ₱5k' },
] as const;

export default function CourtDashboardScreen() {
  const { user }          = useAuthStore();
  const { myBookings, setSelectedCourt, courts } = useBookingStore();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const activeBookings = myBookings.filter((b) => b.status === 'confirmed');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter((i) => i.label.toLowerCase().includes(q) || i.sub.toLowerCase().includes(q)).slice(0,7);
  }, [query]);

  const openMaps = () => {
    Linking.openURL(`https://maps.google.com/?q=${CONFIG.lat},${CONFIG.lng}`)
      .catch(() => Alert.alert('Address', CONFIG.address));
  };

  return (
    <View style={s.container}>
      {/* Search bar */}
      <View style={s.searchWrap}>
        <View style={[s.searchBar, focused && s.searchBarFocused]}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput style={s.searchInput} placeholder="Search courts, events, packages..."
            placeholderTextColor={COLORS.textMuted} value={query} onChangeText={setQuery}
            onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)}
            clearButtonMode="while-editing" />
          {query.length > 0 && <TouchableOpacity onPress={() => setQuery('')} style={s.clearBtn}><Text style={s.clearText}>✕</Text></TouchableOpacity>}
        </View>
        {focused && results.length > 0 && (
          <View style={s.dropdown}>
            {results.map((item, i) => (
              <TouchableOpacity key={i} style={[s.dropRow, i < results.length-1 && s.dropDivider]}
                onPress={() => { setQuery(''); router.push(item.path as never); }}>
                <Text style={s.dropEmoji}>{item.emoji}</Text>
                <View style={{flex:1}}>
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

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.title}>FlexZone Courts 🏟️</Text>
            <Text style={s.sub}>Sports Complex · Consolacion, Cebu</Text>
          </View>
          <View style={s.headerActions}>
            <TouchableOpacity onPress={() => router.push('/(shared)/notifications' as never)} style={s.bellBtn}>
              <Text style={{fontSize:22}}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(shared)/profile' as never)}>
              <View style={s.avatarBtn}><Text style={s.avatarText}>{user?.name?.charAt(0) ?? 'U'}</Text></View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Map card */}
        <TouchableOpacity style={s.mapCard} onPress={openMaps} activeOpacity={0.9}>
          <View style={s.mapVisual}>
            <View style={s.mapGrid}>{[...Array(20)].map((_,i)=><View key={i} style={s.mapCell}/>)}</View>
            <View style={s.mapPin}>
              <View style={s.mapPinCircle}><Text style={{fontSize:18}}>🏟️</Text></View>
              <View style={s.mapPinShadow}/>
              <Text style={s.mapPinLabel}>FlexZone</Text>
            </View>
            <View style={s.mapDirBtn}><Text style={s.mapDirText}>▶ Get Directions</Text></View>
          </View>
          <View style={s.mapFooter}>
            <View style={{flex:1}}>
              <Text style={s.mapTitle}>{CONFIG.courtName}</Text>
              <Text style={s.mapAddress}>{CONFIG.address}</Text>
            </View>
            <View style={s.openBadge}>
              <View style={s.openDot}/>
              <Text style={s.openText}>Open · 6AM–11PM</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Active booking */}
        {activeBookings.length > 0 && (
          <>
            <SectionHeader title="Your Active Bookings" />
            {activeBookings.slice(0,1).map((b) => (
              <Card key={b.id} style={s.activeCard}>
                <View style={s.activeRow}>
                  <Text style={{fontSize:28}}>🏀</Text>
                  <View style={{flex:1}}>
                    <Text style={s.activeName}>{b.courtName}</Text>
                    <Text style={s.activeMeta}>{b.date} · {b.timeSlots.join(' – ')}</Text>
                  </View>
                  <Badge label="Confirmed ✓" color={COLORS.primaryDark} bgColor={COLORS.primaryLight} size="sm" />
                </View>
                <View style={s.activeFooter}>
                  <Text style={s.refText}>Ref: {b.id.toUpperCase()}</Text>
                  <TouchableOpacity onPress={() => router.push({pathname:'/(shared)/receipt/[id]' as never,params:{id:b.id}})}>
                    <Text style={s.receiptLink}>View receipt →</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </>
        )}

        {/* Sport categories */}
        <SectionHeader title="Book a Court" action="See all" onAction={() => router.push('/(court)/book' as never)} />
        <View style={s.catGrid}>
          {SPORT_CATEGORIES.map((cat) => {
            const court = courts.find((c) => c.id === cat.courtId);
            const unavailable = court && !court.available;
            return (
              <TouchableOpacity key={cat.label}
                style={[s.catCard, {backgroundColor:cat.bg}, unavailable && s.catCardDim]}
                onPress={() => {
                  if (cat.label === 'Events') { router.push('/(court)/events' as never); return; }
                  setSelectedCourt(court ?? null);
                  router.push('/(court)/book' as never);
                }} activeOpacity={0.82}>
                <Text style={s.catEmoji}>{cat.emoji}</Text>
                <Text style={[s.catLabel,{color:cat.color}]}>{cat.label}</Text>
                <Text style={s.catPrice}>{cat.price}</Text>
                {unavailable && <View style={s.fullTag}><Text style={s.fullTagText}>Full</Text></View>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Courts list */}
        <SectionHeader title="Court Availability" />
        {courts.map((court) => (
          <Card key={court.id} style={s.courtRow} onPress={() => { setSelectedCourt(court); router.push('/(court)/book' as never); }}>
            <Text style={s.courtEmoji}>{court.image}</Text>
            <View style={{flex:1}}>
              <Text style={s.courtName}>{court.name}</Text>
              <Text style={s.courtMeta}>Capacity: {court.capacity} · ₱{court.pricePerHour}/hr</Text>
              <View style={s.amenitiesRow}>
                {court.amenities.slice(0,2).map((a) => (
                  <View key={a} style={s.amenityTag}><Text style={s.amenityText}>{a}</Text></View>
                ))}
              </View>
            </View>
            <View style={[s.availPill,{backgroundColor:court.available?COLORS.primaryLight:COLORS.errorLight}]}>
              <Text style={[s.availText,{color:court.available?COLORS.primaryDark:COLORS.error}]}>
                {court.available?'Available':'Occupied'}
              </Text>
            </View>
          </Card>
        ))}

        <View style={{height:SPACING.xxl}}/>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex:1, backgroundColor:COLORS.background },
  searchWrap:   { backgroundColor:COLORS.card, paddingHorizontal:SPACING.lg, paddingTop:SPACING.sm, paddingBottom:SPACING.sm, borderBottomWidth:0.5, borderBottomColor:COLORS.border, zIndex:100 },
  searchBar:    { flexDirection:'row', alignItems:'center', backgroundColor:COLORS.background, borderRadius:RADIUS.lg, paddingHorizontal:SPACING.md, borderWidth:1.5, borderColor:COLORS.border, height:44 },
  searchBarFocused:{ borderColor:COLORS.primary },
  searchIcon:   { fontSize:16, marginRight:SPACING.sm },
  searchInput:  { flex:1, fontSize:15, color:COLORS.text, height:'100%' },
  clearBtn:     { padding:6 },
  clearText:    { fontSize:14, color:COLORS.textMuted },
  dropdown:     { position:'absolute', top:54, left:0, right:0, backgroundColor:COLORS.card, borderRadius:RADIUS.lg, borderWidth:1, borderColor:COLORS.border, ...SHADOW.md, zIndex:999 },
  dropRow:      { flexDirection:'row', alignItems:'center', padding:SPACING.md, gap:SPACING.sm },
  dropDivider:  { borderBottomWidth:0.5, borderBottomColor:COLORS.border },
  dropEmoji:    { fontSize:20, width:30 },
  dropLabel:    { fontSize:14, fontWeight:'600', color:COLORS.text },
  dropSub:      { fontSize:11, color:COLORS.textSecondary, marginTop:1 },
  dropArrow:    { fontSize:18, color:COLORS.textMuted },
  content:      { padding:SPACING.lg },
  header:       { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', paddingTop:16, marginBottom:SPACING.lg },
  headerActions:{ flexDirection:'row', alignItems:'center', gap:SPACING.md },
  bellBtn:      { paddingTop:2 },
  avatarBtn:    { width:40, height:40, borderRadius:20, backgroundColor:COLORS.primaryLight, alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:COLORS.primary },
  avatarText:   { fontSize:16, fontWeight:'800', color:COLORS.primaryDark },
  title:        { fontSize:24, fontWeight:'700', color:COLORS.text },
  sub:          { fontSize:13, color:COLORS.textSecondary, marginTop:2 },
  mapCard:      { backgroundColor:COLORS.card, borderRadius:RADIUS.xl, marginBottom:SPACING.xl, overflow:'hidden', ...SHADOW.sm, borderWidth:0.5, borderColor:COLORS.border },
  mapVisual:    { height:110, backgroundColor:'#E8F5F0', position:'relative', overflow:'hidden' },
  mapGrid:      { flexDirection:'row', flexWrap:'wrap', position:'absolute', top:0, left:0, right:0, bottom:0 },
  mapCell:      { width:'10%', borderWidth:0.3, borderColor:COLORS.primary+'20' },
  mapPin:       { position:'absolute', top:'20%', left:'42%', alignItems:'center' },
  mapPinCircle: { width:40, height:40, borderRadius:20, backgroundColor:COLORS.primary, alignItems:'center', justifyContent:'center', ...SHADOW.md },
  mapPinShadow: { width:12, height:4, backgroundColor:'rgba(0,0,0,0.15)', borderRadius:6, marginTop:2 },
  mapPinLabel:  { fontSize:10, fontWeight:'700', color:COLORS.primaryDark, backgroundColor:COLORS.primaryLight, paddingHorizontal:6, paddingVertical:2, borderRadius:4, marginTop:2 },
  mapDirBtn:    { position:'absolute', bottom:8, right:10, backgroundColor:COLORS.primary, borderRadius:RADIUS.full, paddingHorizontal:10, paddingVertical:4 },
  mapDirText:   { color:'#fff', fontSize:11, fontWeight:'700' },
  mapFooter:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:SPACING.md },
  mapTitle:     { fontSize:13, fontWeight:'700', color:COLORS.text },
  mapAddress:   { fontSize:11, color:COLORS.textSecondary, marginTop:1 },
  openBadge:    { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:COLORS.primaryLight, paddingHorizontal:8, paddingVertical:4, borderRadius:RADIUS.full },
  openDot:      { width:6, height:6, borderRadius:3, backgroundColor:COLORS.primary },
  openText:     { fontSize:11, fontWeight:'600', color:COLORS.primaryDark },
  activeCard:   { marginBottom:SPACING.md },
  activeRow:    { flexDirection:'row', alignItems:'center', gap:SPACING.md, marginBottom:SPACING.sm },
  activeName:   { fontSize:15, fontWeight:'700', color:COLORS.text },
  activeMeta:   { fontSize:12, color:COLORS.textSecondary, marginTop:2 },
  activeFooter: { flexDirection:'row', justifyContent:'space-between', borderTopWidth:0.5, borderTopColor:COLORS.border, paddingTop:SPACING.sm },
  refText:      { fontSize:12, color:COLORS.textMuted },
  receiptLink:  { fontSize:13, color:COLORS.primary, fontWeight:'600' },
  catGrid:      { flexDirection:'row', flexWrap:'wrap', gap:SPACING.sm, marginBottom:SPACING.lg },
  catCard:      { width:'31%', borderRadius:RADIUS.lg, padding:SPACING.md, alignItems:'center', gap:4, position:'relative', ...SHADOW.sm, borderWidth:0.5, borderColor:COLORS.border },
  catCardDim:   { opacity:0.5 },
  catEmoji:     { fontSize:28 },
  catLabel:     { fontSize:12, fontWeight:'700', textAlign:'center' },
  catPrice:     { fontSize:10, color:COLORS.textSecondary },
  fullTag:      { position:'absolute', top:5, right:5, backgroundColor:COLORS.errorLight, borderRadius:RADIUS.sm, paddingHorizontal:4, paddingVertical:1 },
  fullTagText:  { fontSize:9, color:COLORS.error, fontWeight:'700' },
  courtRow:     { flexDirection:'row', alignItems:'center', gap:SPACING.md, marginBottom:SPACING.sm },
  courtEmoji:   { fontSize:28 },
  courtName:    { fontSize:14, fontWeight:'600', color:COLORS.text },
  courtMeta:    { fontSize:12, color:COLORS.textSecondary, marginTop:2 },
  amenitiesRow: { flexDirection:'row', gap:4, marginTop:4 },
  amenityTag:   { backgroundColor:COLORS.background, borderRadius:RADIUS.full, paddingHorizontal:8, paddingVertical:2 },
  amenityText:  { fontSize:10, color:COLORS.textSecondary },
  availPill:    { paddingHorizontal:8, paddingVertical:4, borderRadius:RADIUS.full },
  availText:    { fontSize:11, fontWeight:'700' },
});
