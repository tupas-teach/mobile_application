import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary:       '#1D9E75',
  primaryDark:   '#0F6E56',
  primaryLight:  '#E1F5EE',
  secondary:     '#534AB7',
  secondaryLight:'#EEEDFE',
  amber:         '#EF9F27',
  amberLight:    '#FAEEDA',
  error:         '#E24B4A',
  errorLight:    '#FCEBEB',
  text:          '#111827',
  textSecondary: '#6B7280',
  textMuted:     '#9CA3AF',
  border:        '#E5E7EB',
  card:          '#FFFFFF',
  background:    '#F8F9FA',
};

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };
const RADIUS  = { sm: 6, md: 10, lg: 14, full: 999 };

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description?: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  columns?: 2 | 3;
  darkMode?: boolean;
  style?: ViewStyle;
}

function Stars({ rating, dark }: { rating: number; dark?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{
            fontSize: 10,
            color: i <= Math.round(rating) ? COLORS.amber : (dark ? 'rgba(255,255,255,0.15)' : COLORS.border),
          }}
        >
          ★
        </Text>
      ))}
      <Text style={{ fontSize: 10, color: dark ? 'rgba(255,255,255,0.4)' : COLORS.textMuted, marginLeft: 2 }}>
        {rating}
      </Text>
    </View>
  );
}

function CategoryBadge({ category, dark }: { category: string; dark?: boolean }) {
  const map: Record<string, { color: string; bg: string }> = {
    Supplements: { color: COLORS.primaryDark, bg: COLORS.primaryLight },
    Apparel:     { color: '#3C3489',          bg: COLORS.secondaryLight },
    Equipment:   { color: '#854F0B',          bg: COLORS.amberLight },
    'Court Gear':{ color: '#9B1C1C',          bg: COLORS.errorLight },
    Beverages:   { color: '#185FA5',          bg: '#E6F1FB' },
    Accessories: { color: '#374151',          bg: '#F3F4F6' },
  };
  const c = map[category] ?? { color: COLORS.textSecondary, bg: COLORS.background };
  return (
    <View style={[badge.pill, { backgroundColor: dark ? 'rgba(255,255,255,0.08)' : c.bg }]}>
      <Text style={[badge.text, { color: dark ? 'rgba(255,255,255,0.6)' : c.color }]}>
        {category}
      </Text>
    </View>
  );
}

const badge = StyleSheet.create({
  pill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  text: { fontSize: 9, fontWeight: '700' },
});

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  columns = 2,
  darkMode = false,
  style,
}) => {
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const cardWidth =
    columns === 3
      ? (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.sm * 2) / 3
      : (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.sm) / 2;

  const handleAdd = (product: Product) => {
    if (!product.inStock) return;
    onAddToCart(product);
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
    Alert.alert('Added! 🛍️', `${product.name} added to cart`, [
      { text: 'Continue', style: 'cancel' },
    ]);
  };

  const bg   = darkMode ? '#1A1A2E'              : COLORS.card;
  const txt  = darkMode ? '#fff'                 : COLORS.text;
  const sub  = darkMode ? 'rgba(255,255,255,0.4)': COLORS.textSecondary;
  const bdr  = darkMode ? 'rgba(255,255,255,0.08)': COLORS.border;

  return (
    <View style={[grid.container, style]}>
      {products.map((product) => {
        const added = addedIds.has(product.id);
        return (
          <View
            key={product.id}
            style={[
              grid.card,
              { width: cardWidth, backgroundColor: bg, borderColor: bdr },
            ]}
          >
            {/* Out of stock overlay */}
            {!product.inStock && (
              <View style={grid.outOverlay}>
                <Text style={grid.outText}>Out of Stock</Text>
              </View>
            )}

            {/* Image / emoji */}
            <View style={[grid.imageBox, { backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : COLORS.background }]}>
              <Text style={grid.emoji}>{product.image}</Text>
            </View>

            {/* Body */}
            <View style={grid.body}>
              <CategoryBadge category={product.category} dark={darkMode} />

              <Text style={[grid.name, { color: txt }]} numberOfLines={2}>
                {product.name}
              </Text>

              {product.description && (
                <Text style={[grid.desc, { color: sub }]} numberOfLines={2}>
                  {product.description}
                </Text>
              )}

              <Stars rating={product.rating} dark={darkMode} />

              {/* Price + Add btn */}
              <View style={grid.footer}>
                <Text style={[grid.price, { color: darkMode ? COLORS.primary : COLORS.text }]}>
                  ₱{product.price.toLocaleString()}
                </Text>
                <TouchableOpacity
                  style={[
                    grid.addBtn,
                    { backgroundColor: added ? '#10B981' : (product.inStock ? COLORS.primary : COLORS.border) },
                  ]}
                  onPress={() => handleAdd(product)}
                  disabled={!product.inStock || added}
                  activeOpacity={0.8}
                >
                  <Text style={grid.addBtnText}>
                    {added ? '✓' : product.inStock ? '+' : '✗'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const grid = StyleSheet.create({
  container:  { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  card:       { borderRadius: RADIUS.lg, borderWidth: 0.5, overflow: 'hidden', position: 'relative' },
  outOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 10, alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.lg },
  outText:    { fontSize: 12, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  imageBox:   { height: 90, alignItems: 'center', justifyContent: 'center' },
  emoji:      { fontSize: 42 },
  body:       { padding: SPACING.sm, gap: SPACING.xs },
  name:       { fontSize: 13, fontWeight: '700', lineHeight: 17, marginTop: 2 },
  desc:       { fontSize: 11, lineHeight: 15 },
  footer:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.xs },
  price:      { fontSize: 15, fontWeight: '800' },
  addBtn:     { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 22 },
});

export default ProductGrid;

