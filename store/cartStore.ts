import { API_BASE } from '@/lib/config';
import { create } from 'zustand';
import type { CartItem, PaymentTransaction, Product } from '../types';

async function getAuthHeader(): Promise<Record<string, string>> {
  // Pull JWT from authStore without a hook (outside React)
  const { useAuthStore } = await import('./authStore');
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const ALL_PRODUCTS: Product[] = [
  // ... keep your existing ALL_PRODUCTS array exactly as-is
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
      const headers = await getAuthHeader();
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
      const headers = await getAuthHeader();
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