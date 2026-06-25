import { COLORS, RADIUS, SHADOW, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { useCartStore } from '@/store/cartStore';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TYPE_CONFIG: Record<string,{emoji:string;title:string;color:string}> = {
  membership:  { emoji:'👑', title:'Membership Activated!',   color:COLORS.amber   },
  court:       { emoji:'🏀', title:'Court Booked!',           color:'#185FA5'       },
  event:       { emoji:'🎉', title:'Event Reserved!',         color:'#B45309'       },
  cart:        { emoji:'🛍️', title:'Order Placed!',           color:COLORS.primary  },
  default:     { emoji:'✅', title:'Payment Successful!',     color:COLORS.primary  },
};

export default function ReceiptScreen() {
  const { id, type, amount } = useLocalSearchParams<{id:string;type:string;amount:string}>();
  const { user }             = useAuthStore();
  const { transactions }     = useCartStore();
  const { myBookings }       = useBookingStore();

  const tx      = transactions.find((t) => t.id === id || t.reference === id);
  const booking = myBookings.find((b) => b.id === id);
  const cfg     = TYPE_CONFIG[type ?? 'default'] ?? TYPE_CONFIG.default;
  const amtNum  = tx?.amount ?? parseInt(amount ?? '0', 10);
  const ref     = tx?.reference ?? id ?? 'N/A';
  const dateStr = tx ? new Date(tx.createdAt).toLocaleDateString('en-PH',{dateStyle:'long'}) : new Date().toLocaleDateString('en-PH',{dateStyle:'long'});

  const handleShare = async () => {
    try {
      await Share.share({
        message:`FlexZone Receipt\nRef: ${ref}\nAmount: ₱${amtNum.toLocaleString()}\nDate: ${dateStr}\nStatus: PAID ✓\n\nThank you for choosing FlexZone!\nhello@flexzone.ph`,
        title:'FlexZone Receipt',
      });
    } catch { /* ignore */ }
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={{ width:40 }} />
        <Text style={s.headerTitle}>Receipt</Text>
        <TouchableOpacity onPress={handleShare} style={s.shareBtn}>
          <Text style={s.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Success card */}
        <View style={[s.successCard, { borderColor:cfg.color+'30' }]}>
          <View style={[s.successCircle, { backgroundColor:cfg.color+'18' }]}>
            <Text style={s.successEmoji}>{cfg.emoji}</Text>
          </View>
          <Text style={[s.successTitle, { color:cfg.color }]}>{cfg.title}</Text>
          <Text style={s.successAmount}>₱{amtNum.toLocaleString()}</Text>
          <View style={s.paidBadge}>
            <Text style={s.paidText}>✓ PAID</Text>
          </View>
        </View>

        {/* Receipt details */}
        <View style={s.receiptCard}>
          <Text style={s.receiptHeading}>Transaction Details</Text>
          {[
            ['Reference No.',  ref.toUpperCase()],
            ['Date',           dateStr],
            ['Paid by',        user?.name ?? 'Member'],
            ['Payment method', (tx?.method ?? 'gcash').replace('_',' ').toUpperCase()],
            ['Status',         'PAID ✓'],
          ].map(([k,v]) => (
            <View key={k} style={s.row}>
              <Text style={s.rowKey}>{k}</Text>
              <Text style={[s.rowVal, k==='Status'&&{color:COLORS.success}]}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Booking details */}
        {booking && (
          <View style={s.receiptCard}>
            <Text style={s.receiptHeading}>Booking Details</Text>
            {[
              ['Court',    booking.courtName],
              ['Date',     booking.date],
              ['Time',     booking.timeSlots.join(', ')],
              ['Duration', `${booking.duration} hr(s)`],
              ['Category', booking.category],
            ].map(([k,v]) => (
              <View key={k} style={s.row}>
                <Text style={s.rowKey}>{k}</Text>
                <Text style={s.rowVal}>{v}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Cart items */}
        {tx?.items && tx.items.length > 0 && (
          <View style={s.receiptCard}>
            <Text style={s.receiptHeading}>Order Items</Text>
            {tx.items.map((item) => (
              <View key={item.id} style={s.itemRow}>
                <Text style={s.itemName}>{item.name}</Text>
                <Text style={s.itemQty}>×{item.qty}</Text>
                <Text style={s.itemPrice}>₱{(item.price*item.qty).toLocaleString()}</Text>
              </View>
            ))}
            <View style={[s.row,{borderTopWidth:1,borderTopColor:COLORS.border,marginTop:SPACING.sm,paddingTop:SPACING.sm}]}>
              <Text style={[s.rowKey,{fontWeight:'700'}]}>Total</Text>
              <Text style={[s.rowVal,{fontWeight:'900',color:COLORS.primary,fontSize:16}]}>₱{amtNum.toLocaleString()}</Text>
            </View>
          </View>
        )}

        {/* Business info */}
        <View style={s.bizCard}>
          <Text style={s.bizLogo}>FLEXZONE</Text>
          <Text style={s.bizInfo}>SmartGym & Sports Complex</Text>
          <Text style={s.bizInfo}>MacArthur Highway, Consolacion, Cebu</Text>
          <Text style={s.bizInfo}>+63 32 888 1234 · hello@flexzone.ph</Text>
          <Text style={s.bizInfo}>Open 6AM–11PM daily</Text>
        </View>

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity style={s.actionBtn} onPress={handleShare} activeOpacity={0.85}>
            <Text style={s.actionBtnText}>📤 Share Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.homeBtn} onPress={() => router.replace('/(gym)' as never)} activeOpacity={0.85}>
            <Text style={s.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height:40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:     { flex:1, backgroundColor:COLORS.background },
  header:        { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingTop:54, paddingHorizontal:SPACING.lg, paddingBottom:SPACING.md, backgroundColor:COLORS.card, borderBottomWidth:0.5, borderBottomColor:COLORS.border },
  headerTitle:   { fontSize:17, fontWeight:'700', color:COLORS.text },
  shareBtn:      { padding:6 },
  shareText:     { color:COLORS.primary, fontWeight:'600', fontSize:15 },
  content:       { padding:SPACING.lg, gap:SPACING.lg },
  successCard:   { backgroundColor:COLORS.card, borderRadius:RADIUS.xl, padding:SPACING.xl, alignItems:'center', gap:SPACING.md, borderWidth:1.5, ...SHADOW.sm },
  successCircle: { width:80, height:80, borderRadius:40, alignItems:'center', justifyContent:'center' },
  successEmoji:  { fontSize:40 },
  successTitle:  { fontSize:20, fontWeight:'800' },
  successAmount: { fontSize:36, fontWeight:'900', color:COLORS.text },
  paidBadge:     { backgroundColor:COLORS.primaryLight, paddingHorizontal:SPACING.lg, paddingVertical:6, borderRadius:RADIUS.full },
  paidText:      { color:COLORS.primaryDark, fontWeight:'700', fontSize:13 },
  receiptCard:   { backgroundColor:COLORS.card, borderRadius:RADIUS.lg, overflow:'hidden', borderWidth:0.5, borderColor:COLORS.border, ...SHADOW.sm },
  receiptHeading:{ fontSize:12, fontWeight:'700', color:COLORS.textSecondary, textTransform:'uppercase', letterSpacing:0.5, padding:SPACING.md, backgroundColor:COLORS.background },
  row:           { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:SPACING.md, paddingVertical:10, borderTopWidth:0.5, borderTopColor:COLORS.border },
  rowKey:        { fontSize:13, color:COLORS.textSecondary },
  rowVal:        { fontSize:13, fontWeight:'600', color:COLORS.text, maxWidth:'60%', textAlign:'right' },
  itemRow:       { flexDirection:'row', alignItems:'center', paddingHorizontal:SPACING.md, paddingVertical:8, borderTopWidth:0.5, borderTopColor:COLORS.border },
  itemName:      { flex:1, fontSize:13, color:COLORS.text },
  itemQty:       { fontSize:13, color:COLORS.textSecondary, marginRight:SPACING.md },
  itemPrice:     { fontSize:13, fontWeight:'600', color:COLORS.text },
  bizCard:       { backgroundColor:COLORS.primaryLight, borderRadius:RADIUS.lg, padding:SPACING.xl, alignItems:'center', gap:4 },
  bizLogo:       { fontSize:20, fontWeight:'900', color:COLORS.primaryDark, letterSpacing:-0.5 },
  bizInfo:       { fontSize:12, color:COLORS.primaryDark+'90', textAlign:'center' },
  actions:       { gap:SPACING.sm },
  actionBtn:     { backgroundColor:COLORS.primaryLight, borderRadius:RADIUS.lg, padding:SPACING.md, alignItems:'center', borderWidth:1, borderColor:COLORS.primary+'30' },
  actionBtnText: { color:COLORS.primaryDark, fontWeight:'700', fontSize:15 },
  homeBtn:       { backgroundColor:COLORS.primary, borderRadius:RADIUS.lg, padding:SPACING.md, alignItems:'center' },
  homeBtnText:   { color:'#fff', fontWeight:'700', fontSize:15 },
});
