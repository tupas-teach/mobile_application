import { useGymStore } from '@/store/gymStore'; // ✅ store only, no Product re-export
import type { Product } from '@/types'; // ✅ direct import — not re-exported from gymStore
import React, { useState } from 'react';
import {
  Alert, Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Badge, Button, Card } from '../../components/UI';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

const CATEGORIES = ['All', 'Supplements', 'Apparel', 'Equipment'] as const;
type Cat = (typeof CATEGORIES)[number];

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  const rating  = product.rating  ?? 0;
  const inStock = product.inStock ?? true;

  return (
    <Card style={styles.productCard}>
      <Text style={styles.productEmoji}>{product.image}</Text>
      <Badge
        label={product.category}
        color={
          product.category === 'Supplements' ? COLORS.success :
          product.category === 'Apparel'     ? COLORS.secondary :
                                               COLORS.amber
        }
        bgColor={
          product.category === 'Supplements' ? COLORS.primaryLight :
          product.category === 'Apparel'     ? '#EEEDFE' :
                                               '#FAEEDA'
        }
        size="sm"
      />
      <Text style={styles.productName}>{product.name}</Text>
      <View style={styles.ratingRow}>
        <Text style={styles.stars}>{'★'.repeat(Math.round(rating))}</Text>
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
      <View style={styles.productBottom}>
        <Text style={styles.price}>₱{product.price.toLocaleString()}</Text>
        <TouchableOpacity
          style={[styles.addBtn, !inStock && styles.addBtnDisabled]}
          onPress={onAdd}
          disabled={!inStock}
        >
          <Text style={styles.addBtnText}>{inStock ? '+ Add' : 'Out'}</Text>
        </TouchableOpacity>
      </View>
      {!inStock && (
        <View style={styles.outBadge}>
          <Text style={styles.outText}>Out of stock</Text>
        </View>
      )}
    </Card>
  );
}

function CartModal({ visible, onClose, cartItems, onRemove, onCheckout }: any) {
  const total = cartItems.reduce(
    (s: number, i: { product: Product; qty: number }) =>
      s + (i.product.price ?? 0) * (i.qty ?? 0),
    0,
  );
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={cart.overlay}>
        <View style={cart.sheet}>
          <View style={cart.header}>
            <Text style={cart.title}>Your cart 🛍️</Text>
            <TouchableOpacity onPress={onClose}><Text style={cart.close}>✕</Text></TouchableOpacity>
          </View>

          {cartItems.length === 0 ? (
            <View style={cart.empty}>
              <Text style={{ fontSize: 40 }}>🛒</Text>
              <Text style={cart.emptyText}>Your cart is empty</Text>
            </View>
          ) : (
            <>
              <ScrollView style={{ maxHeight: 300 }}>
                {cartItems.map((item: { product: Product; qty: number }) => (
                  <View key={item.product.id} style={cart.item}>
                    <Text style={cart.itemEmoji}>{item.product.image}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={cart.itemName}>{item.product.name}</Text>
                      <Text style={cart.itemPrice}>
                        ₱{item.product.price.toLocaleString()} × {item.qty}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => onRemove(item.product.id)}>
                      <Text style={cart.removeBtn}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <View style={cart.totalRow}>
                <Text style={cart.totalLabel}>Total</Text>
                <Text style={cart.totalValue}>₱{total.toLocaleString()}</Text>
              </View>
              <Button title="Checkout →" onPress={onCheckout} style={{ marginTop: SPACING.md }} />
              <Text style={cart.payInfo}>Accepts GCash, Maya, Credit/Debit Card</Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function MarketplaceScreen() {
  const [filter,      setFilter]      = useState<Cat>('All');
  const [cartVisible, setCartVisible] = useState(false);

  // ✅ products is in GymState — TypeScript sees it correctly now
  const { products, cartItems, addToCart, removeFromCart } = useGymStore();

  // ✅ explicit (p: Product) annotation satisfies strict mode
  const filtered = filter === 'All'
    ? products
    : products.filter((p: Product) => p.category === filter);

  const cartCount = cartItems.reduce((s, i) => s + (i.qty ?? 0), 0);

  // ✅ explicit (product: Product) annotation satisfies strict mode
  const handleAdd = (product: Product) => {
    addToCart(product);
    Alert.alert('Added! 🛍️', `${product.name} added to cart`, [
      { text: 'Continue',  style: 'cancel' },
      { text: 'View cart', onPress: () => setCartVisible(true) },
    ]);
  };

  const handleCheckout = () => {
    setCartVisible(false);
    Alert.alert('Order placed! 🎉', 'Your order will be ready for pickup at the gym desk.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Marketplace</Text>
          <Text style={styles.sub}>Supplements, apparel & gear</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => setCartVisible(true)}>
          <Text style={styles.cartIcon}>🛍️</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.promoBanner}>
        <Text style={styles.promoEmoji}>⚡</Text>
        <View>
          <Text style={styles.promoTitle}>Members get 10% off!</Text>
          <Text style={styles.promoSub}>Discount applied at checkout automatically</Text>
        </View>
        <Badge label="Active" color={COLORS.primaryDark} bgColor={COLORS.primaryLight} size="sm" />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} style={[styles.chip, filter === c && styles.chipActive]} onPress={() => setFilter(c)}>
            <Text style={[styles.chipLabel, filter === c && styles.chipLabelActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        <View style={styles.gridRow}>
          {filtered.map((product) => (
            <View key={product.id} style={styles.gridItem}>
              <ProductCard product={product} onAdd={() => handleAdd(product)} />
            </View>
          ))}
        </View>
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      <CartModal
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        cartItems={cartItems}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: COLORS.background },
  header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  title:           { fontSize: 26, fontWeight: '700', color: COLORS.text },
  sub:             { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  cartBtn:         { position: 'relative', padding: 8 },
  cartIcon:        { fontSize: 26 },
  cartBadge:       { position: 'absolute', top: 4, right: 4, backgroundColor: COLORS.error, borderRadius: 99, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText:   { color: '#fff', fontSize: 10, fontWeight: '700' },
  promoBanner:     { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginHorizontal: SPACING.lg, marginBottom: SPACING.sm, backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: SPACING.md },
  promoEmoji:      { fontSize: 22 },
  promoTitle:      { fontSize: 14, fontWeight: '700', color: COLORS.primaryDark },
  promoSub:        { fontSize: 12, color: COLORS.primary },
  filterBar:       { maxHeight: 50, marginBottom: SPACING.sm },
  filterContent:   { paddingHorizontal: SPACING.lg, gap: SPACING.sm, alignItems: 'center' },
  chip:            { paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  chipActive:      { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipLabel:       { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary },
  chipLabelActive: { color: '#fff' },
  grid:            { paddingHorizontal: SPACING.lg },
  gridRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  gridItem:        { width: '48%' },
  productCard:     { position: 'relative' },
  productEmoji:    { fontSize: 36, marginBottom: SPACING.sm },
  productName:     { fontSize: 14, fontWeight: '600', color: COLORS.text, marginVertical: 4 },
  ratingRow:       { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: SPACING.sm },
  stars:           { fontSize: 12, color: COLORS.amber },
  ratingText:      { fontSize: 12, color: COLORS.textSecondary },
  productBottom:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price:           { fontSize: 16, fontWeight: '700', color: COLORS.text },
  addBtn:          { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 6 },
  addBtnDisabled:  { backgroundColor: COLORS.border },
  addBtnText:      { color: '#fff', fontSize: 13, fontWeight: '600' },
  outBadge:        { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.errorLight, borderRadius: RADIUS.sm, paddingHorizontal: 6, paddingVertical: 2 },
  outText:         { fontSize: 10, color: COLORS.error, fontWeight: '600' },
});

const cart = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet:      { backgroundColor: COLORS.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl, paddingBottom: 40 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  title:      { fontSize: 20, fontWeight: '700', color: COLORS.text },
  close:      { fontSize: 18, color: COLORS.textSecondary, padding: 4 },
  empty:      { alignItems: 'center', paddingVertical: SPACING.xxl, gap: SPACING.md },
  emptyText:  { fontSize: 16, color: COLORS.textSecondary },
  item:       { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  itemEmoji:  { fontSize: 28 },
  itemName:   { fontSize: 14, fontWeight: '500', color: COLORS.text },
  itemPrice:  { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  removeBtn:  { color: COLORS.error, fontSize: 16, padding: 4 },
  totalRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingTop: SPACING.md, marginTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border },
  totalLabel: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  totalValue: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
  payInfo:    { textAlign: 'center', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.sm },
});