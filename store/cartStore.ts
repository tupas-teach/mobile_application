import { create } from 'zustand';
import type { CartItem, PaymentTransaction, Product } from '../types';

// ─── ALL PRODUCTS — single source of truth ────────────────────────────────────
// Both gym marketplace and court marketplace import from here.

export const ALL_PRODUCTS: Product[] = [
  // Gym — Supplements
  { id: 'p1',  name: 'Whey Protein 2kg',   category: 'Supplements', price: 1899, image: '🥛', rating: 4.8, reviews: 92, inStock: true,  description: 'Premium whey protein concentrate.',      forGym: true  },
  { id: 'p2',  name: 'Pre-Workout Energy', category: 'Supplements', price: 699,  image: '⚡', rating: 4.6, reviews: 65, inStock: true,  description: 'High-energy pre-workout formula.',       forGym: true  },
  { id: 'p3',  name: 'BCAA Capsules',      category: 'Supplements', price: 549,  image: '💊', rating: 4.5, reviews: 47, inStock: true,  description: 'Branch-chain amino acids for recovery.', forGym: true  },
  { id: 'p4',  name: 'Creatine',           category: 'Supplements', price: 799,  image: '🧪', rating: 4.7, reviews: 58, inStock: true,  description: 'Pure creatine monohydrate.',             forGym: true  },
  // Gym — Apparel
  { id: 'p5',  name: 'FlexZone Tee',       category: 'Apparel',     price: 450,  image: '👕', rating: 4.7, reviews: 34, inStock: true,  description: 'Moisture-wicking gym tee.',              forGym: true  },
  { id: 'p6',  name: 'Training Shorts',    category: 'Apparel',     price: 599,  image: '🩳', rating: 4.4, reviews: 28, inStock: true,  description: '4-way stretch training shorts.',         forGym: true  },
  // Gym — Equipment
  { id: 'p7',  name: 'Gym Gloves',         category: 'Equipment',   price: 349,  image: '🥊', rating: 4.6, reviews: 53, inStock: true,  description: 'Half-finger gloves with wrist support.', forGym: true  },
  { id: 'p8',  name: 'Resistance Bands',   category: 'Equipment',   price: 299,  image: '🔗', rating: 4.5, reviews: 39, inStock: false, description: 'Set of 5 resistance levels.',            forGym: true  },
  { id: 'p9',  name: 'Foam Roller',        category: 'Equipment',   price: 399,  image: '🛢️', rating: 4.3, reviews: 22, inStock: true,  description: 'Deep tissue foam roller for recovery.',  forGym: true  },
  { id: 'p10', name: 'Lifting Belt',       category: 'Equipment',   price: 899,  image: '🏋️', rating: 4.8, reviews: 61, inStock: true,  description: 'Genuine leather weightlifting belt.',    forGym: true  },
  // Shared — Beverages
  { id: 'p11', name: 'Sports Drink',       category: 'Beverages',   price: 60,   image: '🥤', rating: 4.2, reviews: 88, inStock: true,  description: 'Electrolyte sports drink.',              forGym: true, forCourt: true },
  { id: 'p12', name: 'Protein Bar',        category: 'Beverages',   price: 89,   image: '🍫', rating: 4.5, reviews: 72, inStock: true,  description: '20g protein bar.',                       forGym: true  },
  // Court — Gear
  { id: 'c1',  name: 'Basketball',         category: 'Court Gear',  price: 599,  image: '🏀', rating: 4.6, reviews: 45, inStock: true,  description: 'Official size basketball.',              forCourt: true },
  { id: 'c2',  name: 'Volleyball',         category: 'Court Gear',  price: 549,  image: '🏐', rating: 4.5, reviews: 38, inStock: true,  description: 'Official size volleyball.',              forCourt: true },
  { id: 'c3',  name: 'Badminton Racket',   category: 'Court Gear',  price: 899,  image: '🏸', rating: 4.7, reviews: 52, inStock: true,  description: 'Carbon fiber racket.',                   forCourt: true },
  { id: 'c4',  name: 'Shuttlecocks (6pc)', category: 'Court Gear',  price: 299,  image: '🪶', rating: 4.4, reviews: 29, inStock: true,  description: 'Premium feather shuttlecocks.',          forCourt: true },
  { id: 'c5',  name: 'Tennis Balls (3pc)', category: 'Court Gear',  price: 199,  image: '🎾', rating: 4.3, reviews: 21, inStock: true,  description: 'Professional tennis balls.',             forCourt: true },
  // Court — Accessories
  { id: 'c6',  name: 'Sports Tape',        category: 'Accessories', price: 89,   image: '🩹', rating: 4.5, reviews: 34, inStock: true,  description: 'Athletic tape for injuries.',            forCourt: true },
  { id: 'c7',  name: 'Grip Powder',        category: 'Accessories', price: 149,  image: '🧴', rating: 4.2, reviews: 18, inStock: true,  description: 'Grip enhanced powder.',                  forCourt: true },
  { id: 'c8',  name: 'Water Bottle',       category: 'Beverages',   price: 199,  image: '🍶', rating: 4.4, reviews: 56, inStock: true,  description: '1L sports bottle.',                      forCourt: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const gymProducts   = ALL_PRODUCTS.filter((p) => p.forGym);
export const courtProducts = ALL_PRODUCTS.filter((p) => p.forCourt);

// ─── Store ────────────────────────────────────────────────────────────────────

interface CartState {
  cartItems:    CartItem[];
  transactions: PaymentTransaction[];
  isLoading:    boolean;

  addToCart:      (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQty:      (id: string, qty: number) => void;
  clearCart:      () => void;

  addTransaction: (tx: PaymentTransaction) => Promise<void>;
  loadTransactions: (userId: string) => Promise<void>;

  cartTotal: () => number;
  cartCount: () => number;
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
    // Optimistically update local state first
    set((s) => ({ transactions: [tx, ...s.transactions] }));
    try {
      await createTransaction({
        userId:      tx.userId,
        amount:      tx.amount,
        method:      tx.method,
        status:      tx.status,
        reference:   tx.reference,
        description: tx.description,
        bookingId:   tx.bookingId,
        items:       tx.items,
      });
    } catch (e) {
      console.error('[CartStore] Failed to persist transaction:', e);
    }
  },

  loadTransactions: async (userId) => {
    set({ isLoading: true });
    try {
      const { data, error } = await fetchTransactions(userId);
      if (error) throw error;
      const mapped: PaymentTransaction[] = (data ?? []).map((row: Record<string, unknown>) => ({
        id:          row.id as string,
        userId:      row.user_id as string,
        amount:      row.amount as number,
        method:      row.method as PaymentTransaction['method'],
        status:      row.status as PaymentTransaction['status'],
        reference:   row.reference as string,
        createdAt:   row.created_at as string,
        description: row.description as string,
        items:       row.items as CartItem[] | undefined,
        bookingId:   row.booking_id as string | undefined,
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
