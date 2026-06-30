import { ALL_PRODUCTS, useCartStore } from '@/store/cartStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/UI';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import type { Product as ProductType } from '../../types';

const STYLES_EXTRA = { errorLight: '#FEE2E2' };

const COURT_CATEGORIES = ['All', 'Court Gear', 'Beverages', 'Accessories'] as const;
type Cat = (typeof COURT_CATEGORIES)[number];

export default function CourtMarketplaceScreen() {
  const [filter, setFilter] = useState<Cat>('All');
  const { addToCart, cartCount, cartItems, removeFromCart, updateQty } = useCartStore();

  const products = ALL_PRODUCTS.filter((p: ProductType) => p.forCourt || p.category === 'Beverages');
  const filtered = filter === 'All' ? products : products.filter((p: ProductType) => p.category === filter);
  const count = cartCount();

  const cartTotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price ?? item.price ?? 0) * (item.qty ?? 0);
  }, 0);

  // ✅ FIX: Pass total to payment so it shows correct amount
  const navigateToPayment = () =>
    router.push({
      pathname: '/(shared)/payment',
      params: { type: 'cart', total: cartTotal.toString() },
    } as any);

  // ✅ FIX: Cart icon now opens a full cart view with navigate option
  const openCart = () => {
    if (count === 0) { Alert.alert('Cart is empty', 'Add some items first!'); return; }
    const lines = cartItems.map((i) => `${i.name} x${i.qty}  ₱${((i.product?.price ?? i.price) * i.qty).toLocaleString()}`).join('\n');
    Alert.alert(
      `🛒 Cart (${count} items)`,
      `${lines}\n\n──────────\nTotal: ₱${cartTotal.toLocaleString()}`,
      [
        { text: 'Keep Shopping', style: 'cancel' },
        { text: 'Checkout →', onPress: navigateToPayment },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Court Shop 🛒</Text>
          <Text style={styles.sub}>Sports gear & refreshments</Text>
        </View>
        {/* ✅ FIX: Tapping cart icon opens cart summary with checkout button */}
        <TouchableOpacity style={styles.cartBtn} onPress={openCart}>
          <Text style={{ fontSize: 24 }}>🛒</Text>
          {count > 0 && (
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{count}</Text></View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
        {COURT_CATEGORIES.map((c) => (
          <TouchableOpacity key={c} style={[styles.chip, filter === c && styles.chipActive]} onPress={() => setFilter(c)}>
            <Text style={[styles.chipLabel, filter === c && styles.chipLabelActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filtered.map((product: ProductType) => (
            <View key={product.id} style={styles.productCard}>
              <Text style={styles.productEmoji}>{product.image}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDesc} numberOfLines={2}>{product.description}</Text>
              <View style={styles.ratingRow}>
               <Text style={styles.stars}>{'★'.repeat(Math.round(product.rating ?? 0))}</Text>
               <Text style={styles.ratingText}>{product.rating ?? 0} ({product.reviews ?? 0})</Text>
              </View>
              <View style={styles.productBottom}>
                <Text style={styles.price}>₱{product.price.toLocaleString()}</Text>
                <TouchableOpacity
                  style={[styles.addBtn, !product.inStock && styles.addBtnDisabled]}
                  onPress={() => { addToCart(product as any); }}
                  disabled={!product.inStock}
                >
                  <Text style={styles.addBtnText}>{product.inStock ? '+' : '✗'}</Text>
                </TouchableOpacity>
              </View>
              {!product.inStock && (
                <View style={styles.outBadge}><Text style={styles.outText}>Out</Text></View>
              )}
            </View>
          ))}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ✅ FIX: Checkout bar always visible when cart has items, shows total + navigates to payment */}
      {count > 0 && (
        <View style={styles.checkoutBar}>
          <View>
            <Text style={styles.checkoutCount}>{count} item{count > 1 ? 's' : ''}</Text>
            <Text style={styles.checkoutTotal}>₱{cartTotal.toLocaleString()}</Text>
          </View>
          <Button
            title="View Cart & Pay →"
            onPress={navigateToPayment}
            size="sm"
            style={{ paddingHorizontal: SPACING.xl }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#0F0F1E' },
  header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  title:           { fontSize: 24, fontWeight: '700', color: '#fff' },
  sub:             { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  cartBtn:         { position: 'relative', padding: 8 },
  cartBadge:       { position: 'absolute', top: 4, right: 4, backgroundColor: COLORS.error, borderRadius: 99, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText:   { color: '#fff', fontSize: 10, fontWeight: '700' },
  filterBar:       { maxHeight: 48 },
  filterContent:   { paddingHorizontal: SPACING.lg, gap: SPACING.sm, alignItems: 'center' },
  chip:            { paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: '#1A1A2E', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  chipActive:      { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipLabel:       { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.5)' },
  chipLabelActive: { color: '#fff' },
  content:         { padding: SPACING.lg },
  grid:            { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  productCard:     { width: '48%', backgroundColor: '#1A1A2E', borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)', position: 'relative' },
  productEmoji:    { fontSize: 36, marginBottom: SPACING.sm },
  productName:     { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 2 },
  productDesc:     { fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 15, marginBottom: SPACING.sm },
  ratingRow:       { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.sm },
  stars:           { fontSize: 11, color: COLORS.amber },
  ratingText:      { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  productBottom:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price:           { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  addBtn:          { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  addBtnDisabled:  { backgroundColor: '#2A2A3E' },
  addBtnText:      { color: '#fff', fontSize: 18, fontWeight: '700' },
  outBadge:        { position: 'absolute', top: 8, right: 8, backgroundColor: STYLES_EXTRA.errorLight, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  outText:         { fontSize: 9, color: COLORS.error, fontWeight: '700' },
  checkoutBar:     { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, paddingBottom: 24, backgroundColor: '#1A1A2E', borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.15)' },
  checkoutCount:   { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  checkoutTotal:   { fontSize: 18, fontWeight: '800', color: '#fff' },
});
