import { API_BASE } from '@/lib/config';
import { create } from 'zustand';
import type { CartItem, PaymentTransaction, Product } from '../types';
import { useAuthStore } from './authStore'; // ✅ FIX: static import instead of dynamic import().
// The dynamic `await import('./authStore')` was triggering an async Metro
// chunk load on every call, which could fail with
// "LoadBundleFromServerRequestError: Could not load bundle" if the dev
// server connection hiccuped. A static import is bundled up front and
// avoids that runtime network dependency entirely.

function getAuthHeader(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * NOTE: This is a RESTORED/PLACEHOLDER product list.
 * Your original ALL_PRODUCTS data was lost (replaced with an empty
 * array + comment) in a previous file edit. I rebuilt this matching
 * your real `Product` type from types.ts exactly:
 * { id, name, category, price, image, rating?, reviews?, inStock?,
 *   description?, forGym?, forCourt? }
 *
 * Replace with your real catalog once you confirm the screen renders.
 */
export const ALL_PRODUCTS: Product[] = [
  // ---------------- Court Gear ----------------
  { id: 'p001', name: 'Basketball (Official Size 7)', category: 'Court Gear', price: 850, image: 'https://placehold.co/300x300?text=Basketball', rating: 4.6, reviews: 32, inStock: true, description: 'Official size indoor/outdoor basketball.', forGym: false, forCourt: true },
  { id: 'p002', name: 'Volleyball', category: 'Court Gear', price: 700, image: 'https://placehold.co/300x300?text=Volleyball', rating: 4.5, reviews: 21, inStock: true, description: 'Match-grade volleyball.', forGym: false, forCourt: true },
  { id: 'p003', name: 'Badminton Racket', category: 'Court Gear', price: 1200, image: 'https://placehold.co/300x300?text=Badminton+Racket', rating: 4.4, reviews: 14, inStock: true, description: 'Lightweight aluminum racket.', forGym: false, forCourt: true },
  { id: 'p004', name: 'Pickleball Paddle', category: 'Court Gear', price: 1500, image: 'https://placehold.co/300x300?text=Pickleball+Paddle', rating: 4.7, reviews: 18, inStock: true, description: 'Composite face pickleball paddle.', forGym: false, forCourt: true },
  { id: 'p005', name: 'Table Tennis Paddle Set', category: 'Court Gear', price: 600, image: 'https://placehold.co/300x300?text=Table+Tennis+Set', rating: 4.3, reviews: 9, inStock: true, description: 'Set of 2 paddles with 3 balls.', forGym: false, forCourt: true },

  // ---------------- Gym Gear ----------------
  { id: 'p006', name: 'Resistance Bands Set', category: 'Court Gear', price: 450, image: 'https://placehold.co/300x300?text=Resistance+Bands', rating: 4.5, reviews: 27, inStock: true, description: 'Set of 5 resistance bands, varying tension.', forGym: true, forCourt: false },
  { id: 'p007', name: 'Gym Gloves', category: 'Court Gear', price: 350, image: 'https://placehold.co/300x300?text=Gym+Gloves', rating: 4.2, reviews: 19, inStock: true, description: 'Padded weightlifting gloves.', forGym: true, forCourt: false },
  { id: 'p008', name: 'Yoga Mat', category: 'Court Gear', price: 550, image: 'https://placehold.co/300x300?text=Yoga+Mat', rating: 4.6, reviews: 33, inStock: true, description: 'Non-slip 6mm yoga/exercise mat.', forGym: true, forCourt: false },

  // ---------------- Beverages ----------------
  { id: 'p009', name: 'Bottled Water (500ml)', category: 'Beverages', price: 25, image: 'https://placehold.co/300x300?text=Water', rating: 4.8, reviews: 50, inStock: true, description: 'Purified drinking water.', forGym: true, forCourt: true },
  { id: 'p010', name: 'Sports Drink (Electrolyte)', category: 'Beverages', price: 45, image: 'https://placehold.co/300x300?text=Sports+Drink', rating: 4.5, reviews: 38, inStock: true, description: 'Electrolyte replacement drink.', forGym: true, forCourt: true },
  { id: 'p011', name: 'Protein Shake', category: 'Beverages', price: 120, image: 'https://placehold.co/300x300?text=Protein+Shake', rating: 4.4, reviews: 22, inStock: true, description: 'Ready-to-drink whey protein shake.', forGym: true, forCourt: false },

  // ---------------- Accessories ----------------
  { id: 'p012', name: 'Sweat Towel', category: 'Accessories', price: 150, image: 'https://placehold.co/300x300?text=Towel', rating: 4.6, reviews: 24, inStock: true, description: 'Quick-dry microfiber sports towel.', forGym: true, forCourt: true },
  { id: 'p013', name: 'Headband', category: 'Accessories', price: 100, image: 'https://placehold.co/300x300?text=Headband', rating: 4.3, reviews: 16, inStock: true, description: 'Moisture-wicking sports headband.', forGym: true, forCourt: true },
  { id: 'p014', name: 'Shaker Bottle', category: 'Accessories', price: 180, image: 'https://placehold.co/300x300?text=Shaker+Bottle', rating: 4.5, reviews: 20, inStock: true, description: '700ml protein shaker bottle.', forGym: true, forCourt: false },
];

export const gymProducts   = ALL_PRODUCTS.filter((p) => p.forGym);
export const courtProducts = ALL_PRODUCTS.filter((p) => p.forCourt);

interface CartState {
  cartItems:    CartItem[];
  transactions: PaymentTransaction[];
  isLoading:    boolean;

  addToCart:       (product: Product) => void;
  removeFromCart:  (id: string) => void;
  updateQty:       (id: string, qty: number) => void;
  clearCart:       () => void;
  addTransaction:  (tx: PaymentTransaction) => Promise<void>;
  loadTransactions:(userId: string) => Promise<void>;
  cartTotal:       () => number;
  cartCount:       () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems:    [],
  transactions: [],
  isLoading:    false,

  addToCart: (product) =>
    set((s) => {
      const existing = s.cartItems.find((i) => i.id === product.id);
      if (existing) {
        return { cartItems: s.cartItems.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { cartItems: [...s.cartItems, { id: product.id, name: product.name, price: product.price, qty: 1, product }] };
    }),

  removeFromCart: (id) =>
    set((s) => ({ cartItems: s.cartItems.filter((i) => i.id !== id) })),

  updateQty: (id, qty) =>
    set((s) => ({
      cartItems: qty <= 0
        ? s.cartItems.filter((i) => i.id !== id)
        : s.cartItems.map((i) => i.id === id ? { ...i, qty } : i),
    })),

  clearCart: () => set({ cartItems: [] }),

  addTransaction: async (tx) => {
    // Optimistic update
    set((s) => ({ transactions: [tx, ...s.transactions] }));
    try {
      const headers = getAuthHeader(); // ✅ FIX: no longer async
      await fetch(`${API_BASE}/transactions`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
          user_id:     tx.userId,
          amount:      tx.amount,
          method:      tx.method,
          status:      tx.status,
          reference:   tx.reference,
          description: tx.description,
          booking_id:  tx.bookingId ?? null,
          items:       tx.items      ?? null,
        }),
      });
    } catch (e) {
      console.error('[CartStore] Failed to persist transaction:', e);
    }
  },

  loadTransactions: async (userId) => {
    set({ isLoading: true });
    try {
      const headers = getAuthHeader(); // ✅ FIX: no longer async
      const res  = await fetch(`${API_BASE}/transactions?user_id=${userId}`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // Laravel typically wraps in { data: [...] }
      const rows: Record<string, unknown>[] = json.data ?? json;

      const mapped: PaymentTransaction[] = rows.map((row) => ({
        id:          String(row.id),
        userId:      String(row.user_id),
        amount:      Number(row.amount),
        method:      row.method      as PaymentTransaction['method'],
        status:      row.status      as PaymentTransaction['status'],
        reference:   String(row.reference   ?? ''),
        createdAt:   String(row.created_at  ?? ''),
        description: String(row.description ?? ''),
        items:       row.items      as CartItem[]   | undefined,
        bookingId:   row.booking_id as string       | undefined,
      }));

      set({ transactions: mapped, isLoading: false });
    } catch (e) {
      console.error('[CartStore] Failed to load transactions:', e);
      set({ isLoading: false });
    }
  },

  cartTotal: () => get().cartItems.reduce((sum, i) => sum + i.price * i.qty, 0),
  cartCount: () => get().cartItems.reduce((sum, i) => sum + i.qty, 0),
}));
