import { COLORS, RADIUS, SHADOW, SPACING } from '@/constants/theme';
import { mockPayment } from '@/lib/paymongo';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { useCartStore } from '@/store/cartStore';
import type { Booking, PaymentMethod, PaymentTransaction } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type PayLocal = 'gcash' | 'maya' | 'credit_card' | 'cash';

const METHODS: { id: PayLocal; emoji: string; label: string; color: string }[] = [
  { id:'gcash',       emoji:'💚', label:'GCash',             color:'#0066CC' },
  { id:'maya',        emoji:'💜', label:'Maya',              color:'#5E2D91' },
  { id:'credit_card', emoji:'💳', label:'Credit/Debit Card', color:'#1A1A2E' },
  { id:'cash',        emoji:'💵', label:'Cash on-site',      color:'#0F6E56' },
];

export default function PaymentScreen() {
  const params = useLocalSearchParams<{
    type:string; tier?:string; courtId?:string; courtName?:string;
    total?:string; slots?:string; date?:string; packageName?:string;
  }>();

  const { user }                              = useAuthStore();
  const { cartItems, cartTotal, clearCart, addTransaction } = useCartStore();
  const { selectedCourt, selectedDate, selectedSlots, addBooking, clearSelection } = useBookingStore();
  const [method,  setMethod]  = useState<PayLocal|null>(null);
  const [loading, setLoading] = useState(false);

  const getAmount = ():number => {
    if (params.type === 'cart')       return cartTotal();
    if (params.total)                 return parseInt(params.total, 10);
    if (params.type === 'membership') {
      const prices:Record<string,number> = { basic:599, premium:1299, vip:2499 };
      return prices[params.tier ?? 'basic'] ?? 599;
    }
    return 0;
  };

  const getTitle = ():string => {
    if (params.type === 'membership') return `${(params.tier ?? 'basic').toUpperCase()} Membership`;
    if (params.type === 'court')      return `Court Booking — ${params.courtName ?? selectedCourt?.name}`;
    if (params.type === 'event')      return params.packageName ?? 'Event Package';
    if (params.type === 'cart')       return 'Marketplace Order';
    return 'Payment';
  };

  const amount = getAmount();
  const title  = getTitle();

  const handlePay = async () => {
    if (!method) { Alert.alert('Select payment','Please choose a payment method.'); return; }
    setLoading(true);
    try {
      const result = await mockPayment(amount, method as PaymentMethod);
      if (result.success) {
        const tx: PaymentTransaction = {
          id: result.reference, userId: user?.id ?? '1', amount,
          method: method as PaymentMethod, status:'success',
          reference: result.reference, createdAt: new Date().toISOString(),
          description: title,
          items: params.type === 'cart' ? cartItems : undefined,
        };
        addTransaction(tx);

        // Create court booking record
        if (params.type === 'court' && selectedCourt) {
          const booking: Booking = {
            id: result.reference, userId: user?.id ?? '1',
            courtId: selectedCourt.id, courtName: selectedCourt.name,
            date: selectedDate,
            timeSlots: selectedSlots.map((id) => id),
            duration: selectedSlots.length, category: selectedCourt.type,
            totalAmount: amount, status:'confirmed', paymentStatus:'paid',
            paymentMethod: method, createdAt: new Date().toISOString(),
          };
          addBooking(booking);
          clearSelection();
        }

        if (params.type === 'cart') clearCart();

        router.replace({
          pathname: '/(shared)/receipt/[id]' as never,
          params: { id: result.reference, type: params.type, amount: amount.toString() },
        });
      }
    } catch {
      Alert.alert('Payment failed','Please try again or choose a different method.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Payment</Text>
        <View style={{ width:40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={s.summaryCard}>
          <Text style={s.summaryEmoji}>🔐</Text>
          <Text style={s.summaryTitle}>{title}</Text>
          <Text style={s.summaryAmount}>₱{amount.toLocaleString()}</Text>
          <Text style={s.summaryNote}>Secure payment powered by PayMongo</Text>
        </View>

        {/* Cart items */}
        {params.type === 'cart' && cartItems.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Order items</Text>
            {cartItems.map((item) => (
              <View key={item.id} style={s.orderRow}>
                <Text style={s.orderEmoji}>{item.product?.image ?? '📦'}</Text>
                <Text style={s.orderName} numberOfLines={1}>{item.name}</Text>
                <Text style={s.orderQty}>×{item.qty}</Text>
                <Text style={s.orderPrice}>₱{(item.price * item.qty).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Court booking summary */}
        {params.type === 'court' && selectedCourt && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Booking details</Text>
            <View style={s.detailCard}>
              {[
                ['Court',    selectedCourt.name],
                ['Date',     selectedDate],
                ['Slots',    selectedSlots.length + ' hour(s)'],
                ['Rate',     `₱${selectedCourt.pricePerHour}/hr`],
              ].map(([k,v]) => (
                <View key={k} style={s.detailRow}>
                  <Text style={s.detailKey}>{k}</Text>
                  <Text style={s.detailVal}>{v}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Payment methods */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Payment method</Text>
          <View style={s.methodsGrid}>
            {METHODS.map((m) => {
              const active = method === m.id;
              return (
                <TouchableOpacity key={m.id}
                  style={[s.methodCard, active && { borderColor:m.color, borderWidth:2 }]}
                  onPress={() => setMethod(m.id)} activeOpacity={0.8}>
                  <Text style={s.methodEmoji}>{m.emoji}</Text>
                  <Text style={[s.methodLabel, active && { color:m.color }]}>{m.label}</Text>
                  {active && (
                    <View style={[s.checkDot,{backgroundColor:m.color}]}>
                      <Text style={s.checkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Total */}
        <View style={s.totalCard}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.totalValue}>₱{amount.toLocaleString()}</Text>
        </View>

        <TouchableOpacity style={[s.payBtn,(!method||loading)&&s.payBtnDim]}
          onPress={handlePay} disabled={!method||loading} activeOpacity={0.85}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.payBtnText}>Pay ₱{amount.toLocaleString()} →</Text>
          }
        </TouchableOpacity>

        <Text style={s.secureNote}>🔒 256-bit SSL encryption · Secured by PayMongo</Text>
        <View style={{ height:40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex:1, backgroundColor:COLORS.background },
  header:       { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingTop:54, paddingHorizontal:SPACING.lg, paddingBottom:SPACING.md, backgroundColor:COLORS.card, borderBottomWidth:0.5, borderBottomColor:COLORS.border },
  backBtn:      { width:40, height:40, alignItems:'center', justifyContent:'center' },
  backText:     { fontSize:22, color:COLORS.primary },
  headerTitle:  { fontSize:17, fontWeight:'700', color:COLORS.text },
  content:      { padding:SPACING.lg, gap:SPACING.lg },
  summaryCard:  { backgroundColor:COLORS.primaryLight, borderRadius:RADIUS.xl, padding:SPACING.xl, alignItems:'center', gap:SPACING.sm, borderWidth:1, borderColor:COLORS.primary+'30' },
  summaryEmoji: { fontSize:40 },
  summaryTitle: { fontSize:16, fontWeight:'600', color:COLORS.primaryDark, textAlign:'center' },
  summaryAmount:{ fontSize:36, fontWeight:'900', color:COLORS.primary },
  summaryNote:  { fontSize:12, color:COLORS.primaryDark+'80' },
  section:      { gap:SPACING.md },
  sectionTitle: { fontSize:13, fontWeight:'700', color:COLORS.textSecondary, textTransform:'uppercase', letterSpacing:0.5 },
  orderRow:     { flexDirection:'row', alignItems:'center', gap:SPACING.sm, backgroundColor:COLORS.card, borderRadius:RADIUS.md, padding:SPACING.md, borderWidth:0.5, borderColor:COLORS.border },
  orderEmoji:   { fontSize:22 },
  orderName:    { flex:1, fontSize:13, fontWeight:'500', color:COLORS.text },
  orderQty:     { fontSize:13, color:COLORS.textSecondary },
  orderPrice:   { fontSize:13, fontWeight:'700', color:COLORS.text },
  detailCard:   { backgroundColor:COLORS.card, borderRadius:RADIUS.lg, overflow:'hidden', borderWidth:0.5, borderColor:COLORS.border },
  detailRow:    { flexDirection:'row', justifyContent:'space-between', padding:SPACING.md, borderBottomWidth:0.5, borderBottomColor:COLORS.border },
  detailKey:    { fontSize:13, color:COLORS.textSecondary },
  detailVal:    { fontSize:13, fontWeight:'600', color:COLORS.text },
  methodsGrid:  { flexDirection:'row', flexWrap:'wrap', gap:SPACING.sm },
  methodCard:   { width:'48%', backgroundColor:COLORS.card, borderRadius:RADIUS.lg, borderWidth:1.5, borderColor:COLORS.border, padding:SPACING.md, alignItems:'center', gap:SPACING.xs, position:'relative', ...SHADOW.sm },
  methodEmoji:  { fontSize:28 },
  methodLabel:  { fontSize:12, fontWeight:'600', color:COLORS.text, textAlign:'center' },
  checkDot:     { position:'absolute', top:6, right:6, width:18, height:18, borderRadius:9, alignItems:'center', justifyContent:'center' },
  checkText:    { color:'#fff', fontSize:10, fontWeight:'700' },
  totalCard:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:COLORS.card, borderRadius:RADIUS.lg, padding:SPACING.lg, borderWidth:1, borderColor:COLORS.border },
  totalLabel:   { fontSize:16, fontWeight:'600', color:COLORS.text },
  totalValue:   { fontSize:24, fontWeight:'900', color:COLORS.primary },
  payBtn:       { backgroundColor:COLORS.primary, borderRadius:RADIUS.lg, padding:SPACING.lg, alignItems:'center' },
  payBtnDim:    { opacity:0.5 },
  payBtnText:   { color:'#fff', fontSize:17, fontWeight:'800' },
  secureNote:   { textAlign:'center', fontSize:12, color:COLORS.textMuted },
});
