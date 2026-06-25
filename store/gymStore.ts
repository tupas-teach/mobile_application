import type {
  CartItem,
  Coach,
  Equipment,
  Product,
  Session,
} from '@/types';
import { create } from 'zustand';

// Re-export for any file still importing Coach/Session/Product from gymStore
export type { Coach, Product, Session };

export interface GymState {
  sessions:       Session[];
  coaches:        Coach[];
  equipment:      Equipment[];
  products:       Product[];
  bookedSessions: string[];
  cartItems:      CartItem[];
  bookSession:    (id: string) => void;
  cancelBooking:  (id: string) => void;
  addToCart:      (product: Product) => void;
  removeFromCart: (id: string) => void;
}

export const useGymStore = create<GymState>((set) => ({
  bookedSessions: ['1'],

  sessions: [
    { id: '1', name: 'HIIT Blast',           coach: 'Coach Rico Cruz',  type: 'HIIT',     intensity: 'High',   time: '7:00 AM',  duration: 45, slots: 12, bookedSlots: 7,  color: '#1D9E75' },
    { id: '2', name: 'Morning Yoga',          coach: 'Coach Ana Reyes', type: 'Yoga',     intensity: 'Low',    time: '8:30 AM',  duration: 60, slots: 8,  bookedSlots: 5,  color: '#534AB7' },
    { id: '3', name: 'Boxing Fundamentals',   coach: 'Coach Migs Santos',type: 'Boxing',  intensity: 'High',   time: '10:00 AM', duration: 60, slots: 6,  bookedSlots: 4,  color: '#D85A30' },
    { id: '4', name: 'Strength & Power',      coach: 'Coach Rico Cruz',  type: 'Strength',intensity: 'High',   time: '12:00 PM', duration: 75, slots: 10, bookedSlots: 3,  color: '#EF9F27' },
    { id: '5', name: 'Cardio Burn',           coach: 'Coach Lena Tan',  type: 'Cardio',   intensity: 'Medium', time: '4:00 PM',  duration: 45, slots: 15, bookedSlots: 9,  color: '#185FA5' },
    { id: '6', name: 'Evening Yoga',          coach: 'Coach Ana Reyes', type: 'Yoga',     intensity: 'Low',    time: '6:00 PM',  duration: 60, slots: 10, bookedSlots: 2,  color: '#534AB7' },
    { id: '7', name: 'HIIT & Core',           coach: 'Coach Lena Tan',  type: 'HIIT',     intensity: 'High',   time: '7:00 PM',  duration: 45, slots: 12, bookedSlots: 11, color: '#1D9E75' },
  ],

  coaches: [
    { id: '1', name: 'Rico Cruz',  initials: 'RC', specialties: ['HIIT', 'Strength', 'Boxing'],    rating: 4.9, reviews: 128, experience: '5 yrs', bio: 'Certified strength & conditioning coach. Former national-level athlete.',      available: true,  color: '#1D9E75', sessionRate: 500 },
    { id: '2', name: 'Ana Reyes',  initials: 'AR', specialties: ['Yoga', 'Pilates', 'Meditation'], rating: 4.8, reviews: 94,  experience: '7 yrs', bio: 'Registered yoga teacher (RYT-500) specializing in Vinyasa and Yin.',          available: true,  color: '#534AB7', sessionRate: 450 },
    { id: '3', name: 'Migs Santos',initials: 'MS', specialties: ['Boxing', 'HIIT', 'Cardio'],      rating: 4.7, reviews: 76,  experience: '4 yrs', bio: 'Former amateur boxing champion turned fitness coach.',                        available: false, color: '#D85A30', sessionRate: 480 },
    { id: '4', name: 'Lena Tan',   initials: 'LT', specialties: ['Cardio', 'HIIT', 'Zumba'],       rating: 4.6, reviews: 61,  experience: '3 yrs', bio: 'High-energy coach who makes every session a party.',                          available: true,  color: '#185FA5', sessionRate: 400 },
  ],

  equipment: [
    { id: '1', name: 'Treadmills',      status: 'Available',  usage: 60,  total: 8,  available: 5,  location: 'Cardio Floor'    },
    { id: '2', name: 'Squat Racks',     status: 'In Use',     usage: 90,  total: 4,  available: 1,  location: 'Weights Zone'    },
    { id: '3', name: 'Rowing Machines', status: 'Available',  usage: 25,  total: 4,  available: 3,  location: 'Cardio Floor'    },
    { id: '4', name: 'Boxing Bags',     status: 'In Use',     usage: 100, total: 6,  available: 0,  location: 'Studio 2'        },
    { id: '5', name: 'Spin Bikes',      status: 'Available',  usage: 17,  total: 12, available: 10, location: 'Studio 1'        },
    { id: '6', name: 'Bench Press',     status: 'In Use',     usage: 60,  total: 5,  available: 2,  location: 'Weights Zone'    },
    { id: '7', name: 'Cable Machines',  status: 'Available',  usage: 33,  total: 6,  available: 4,  location: 'Weights Zone'    },
    { id: '8', name: 'Pull-up Bars',    status: 'Available',  usage: 0,   total: 4,  available: 4,  location: 'Functional Area' },
  ],

  products: [
    { id: 'p1',  name: 'Whey Protein 2kg',   category: 'Supplements', price: 1899, image: '🥛', rating: 4.8, reviews: 92, inStock: true,  description: 'Premium whey protein concentrate.',          forGym: true               },
    { id: 'p2',  name: 'Pre-Workout Energy',  category: 'Supplements', price: 699,  image: '⚡', rating: 4.6, reviews: 65, inStock: true,  description: 'High-energy pre-workout formula.',           forGym: true               },
    { id: 'p3',  name: 'BCAA Capsules',       category: 'Supplements', price: 549,  image: '💊', rating: 4.5, reviews: 47, inStock: true,  description: 'Branch-chain amino acids for recovery.',     forGym: true               },
    { id: 'p4',  name: 'Creatine',            category: 'Supplements', price: 799,  image: '🧪', rating: 4.7, reviews: 58, inStock: true,  description: 'Pure creatine monohydrate.',                 forGym: true               },
    { id: 'p5',  name: 'FlexZone Tee',        category: 'Apparel',     price: 450,  image: '👕', rating: 4.7, reviews: 34, inStock: true,  description: 'Moisture-wicking gym tee.',                  forGym: true               },
    { id: 'p6',  name: 'Training Shorts',     category: 'Apparel',     price: 599,  image: '🩳', rating: 4.4, reviews: 28, inStock: true,  description: '4-way stretch training shorts.',             forGym: true               },
    { id: 'p7',  name: 'Gym Gloves',          category: 'Equipment',   price: 349,  image: '🥊', rating: 4.6, reviews: 53, inStock: true,  description: 'Half-finger gloves with wrist support.',     forGym: true               },
    { id: 'p8',  name: 'Resistance Bands',    category: 'Equipment',   price: 299,  image: '🔗', rating: 4.5, reviews: 39, inStock: false, description: 'Set of 5 resistance levels.',                forGym: true               },
    { id: 'p9',  name: 'Foam Roller',         category: 'Equipment',   price: 399,  image: '🛢️',rating: 4.3, reviews: 22, inStock: true,  description: 'Deep tissue foam roller for recovery.',      forGym: true               },
    { id: 'p10', name: 'Lifting Belt',        category: 'Equipment',   price: 899,  image: '🏋️',rating: 4.8, reviews: 61, inStock: true,  description: 'Genuine leather weightlifting belt.',        forGym: true               },
    { id: 'p11', name: 'Sports Drink',        category: 'Beverages',   price: 60,   image: '🥤', rating: 4.2, reviews: 88, inStock: true,  description: 'Electrolyte sports drink.',                  forGym: true, forCourt: true },
    { id: 'p12', name: 'Protein Bar',         category: 'Beverages',   price: 89,   image: '🍫', rating: 4.5, reviews: 72, inStock: true,  description: '20g protein bar.',                           forGym: true               },
  ],

  cartItems: [],

  bookSession: (id) =>
    set((state) => ({
      bookedSessions: state.bookedSessions.includes(id)
        ? state.bookedSessions
        : [...state.bookedSessions, id],
    })),

  cancelBooking: (id) =>
    set((state) => ({
      bookedSessions: state.bookedSessions.filter((s) => s !== id),
    })),

  addToCart: (product: Product) =>
    set((state) => {
      const existing = state.cartItems.find((i) => i.id === product.id);
      if (existing) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return {
        cartItems: [
          ...state.cartItems,
          { id: product.id, name: product.name, price: product.price, qty: 1, product },
        ],
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.id !== id),
    })),
}));