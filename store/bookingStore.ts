import { create } from 'zustand';
import {
  cancelBooking as dbCancelBooking,
  createBooking as dbCreateBooking,
  fetchBookedSlots,
  fetchBookings,
} from '../lib/supabase';
import type { Booking, Court, EventPackage, TimeSlot } from '../types';

// ─── Static seed data (courts / packages stay hardcoded; slots become dynamic) ─

export const COURTS: Court[] = [
  { id: 'c1', name: 'Main Basketball Court', type: 'Basketball',   capacity: 20,  pricePerHour: 300, available: true,  amenities: ['LED Lighting', 'Scoreboard', 'Bleachers', 'Air Cooled'], image: '🏀' },
  { id: 'c2', name: 'Volleyball Court A',    type: 'Volleyball',   capacity: 12,  pricePerHour: 250, available: true,  amenities: ['Standard Net', 'LED Lighting', 'Scoreboard'], image: '🏐' },
  { id: 'c3', name: 'Badminton Courts (4)',  type: 'Badminton',    capacity: 8,   pricePerHour: 200, available: false, amenities: ['4 Courts', 'Feather/Synthetic shuttles', 'Racket rental'], image: '🏸' },
  { id: 'c4', name: 'Pickleball Court',      type: 'Pickleball',   capacity: 8,   pricePerHour: 200, available: true,  amenities: ['2 Courts', 'Paddle rental', 'Balls provided'], image: '🎾' },
  { id: 'c5', name: 'Table Tennis Room',     type: 'TableTennis',  capacity: 4,   pricePerHour: 150, available: true,  amenities: ['4 Tables', 'Paddle rental', 'AC'], image: '🏓' },
  { id: 'c6', name: 'Multi-Purpose Hall',    type: 'Multi-purpose',capacity: 200, pricePerHour: 500, pricePerDay: 8000, available: true, amenities: ['Full PA System', 'Stage', 'AC', 'Catering Space', 'Parking', 'WiFi'], image: '🏟️' },
];

export const BASE_TIME_SLOTS: TimeSlot[] = [
  { id: 't1',  time: '6:00 AM',  available: true },
  { id: 't2',  time: '7:00 AM',  available: true },
  { id: 't3',  time: '8:00 AM',  available: true },
  { id: 't4',  time: '9:00 AM',  available: true },
  { id: 't5',  time: '10:00 AM', available: true },
  { id: 't6',  time: '11:00 AM', available: true },
  { id: 't7',  time: '12:00 PM', available: true },
  { id: 't8',  time: '1:00 PM',  available: true },
  { id: 't9',  time: '2:00 PM',  available: true },
  { id: 't10', time: '3:00 PM',  available: true },
  { id: 't11', time: '4:00 PM',  available: true },
  { id: 't12', time: '5:00 PM',  available: true },
  { id: 't13', time: '6:00 PM',  available: true },
  { id: 't14', time: '7:00 PM',  available: true },
  { id: 't15', time: '8:00 PM',  available: true },
  { id: 't16', time: '9:00 PM',  available: true },
];

export const EVENT_PACKAGES: EventPackage[] = [
  { id: 'e1', name: 'Birthday Bash',         eventType: 'Birthday Party',    emoji: '🎂', price: 5000,  duration: '8 hours',  maxGuests: 100, includes: ['Venue', 'Sound System', 'Tables & Chairs', 'Decoration Package', 'Security Guard', 'WiFi'], color: '#D85A30' },
  { id: 'e2', name: 'Family Reunion',        eventType: 'Reunion',           emoji: '👨‍👩‍👧‍👦', price: 8000,  duration: '10 hours', maxGuests: 150, includes: ['Venue', 'Sound System', 'Tables & Chairs', 'Projector & Screen', 'Security Guard', 'Parking', 'WiFi'], color: '#534AB7' },
  { id: 'e3', name: 'Fiesta / Xmas Party',  eventType: 'Christmas Party',   emoji: '🎄', price: 10000, duration: '12 hours', maxGuests: 200, includes: ['Venue', 'Full PA System', 'Stage', 'Lights', 'Tables & Chairs', 'Decoration', 'Security', 'WiFi', 'Parking'], color: '#1D9E75' },
  { id: 'e4', name: 'Corporate Event',       eventType: 'Corporate Event',   emoji: '🏢', price: 12000, duration: 'Full day',  maxGuests: 180, includes: ['Venue', 'AV Equipment', 'Projector', 'PA System', 'Tables & Chairs', 'Registration Area', 'WiFi', 'Parking', 'Security'], color: '#185FA5' },
  { id: 'e5', name: 'Wedding Reception',     eventType: 'Wedding Reception', emoji: '💍', price: 15000, duration: 'Full day',  maxGuests: 200, includes: ['Venue', 'Stage', 'Bridal Suite', 'Full PA', 'Lights', 'Tables & Chairs', 'Flower Decor', 'WiFi', 'Security', 'Parking'], color: '#EF9F27' },
];

// ─── Store ────────────────────────────────────────────────────────────────────

interface BookingState {
  courts:        Court[];
  timeSlots:     TimeSlot[];   // updated dynamically when court+date changes
  eventPackages: EventPackage[];
  myBookings:    Booking[];
  selectedCourt: Court | null;
  selectedDate:  string;
  selectedSlots: string[];
  isLoading:     boolean;
  error:         string | null;

  /** Fetch real bookings for a user from Supabase */
  loadBookings:    (userId: string) => Promise<void>;
  /** Persist booking to Supabase, then update local state */
  addBooking:      (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<Booking | null>;
  /** Cancel in Supabase + local state */
  cancelBooking:   (id: string) => Promise<void>;
  /** Fetch booked slots from DB and mark unavailable */
  loadTimeSlots:   (courtId: string, date: string) => Promise<void>;
  setSelectedCourt:(court: Court | null) => void;
  setSelectedDate: (date: string) => void;
  toggleSlot:      (slotId: string) => void;
  clearSelection:  () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  courts:        COURTS,
  timeSlots:     BASE_TIME_SLOTS,
  eventPackages: EVENT_PACKAGES,
  myBookings:    [],
  selectedCourt: null,
  selectedDate:  new Date().toISOString().split('T')[0],
  selectedSlots: [],
  isLoading:     false,
  error:         null,

  // ── Load user bookings from Supabase ──────────────────────────────────────
  loadBookings: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await fetchBookings(userId);
      if (error) throw error;
      // Map snake_case DB columns → camelCase Booking type
      const mapped: Booking[] = (data ?? []).map((row: Record<string, unknown>) => ({
        id:            row.id as string,
        userId:        row.user_id as string,
        courtId:       row.court_id as string,
        courtName:     row.court_name as string,
        date:          row.date as string,
        timeSlots:     row.time_slots as string[],
        duration:      row.duration as number,
        category:      row.category as string,
        totalAmount:   row.total_amount as number,
        status:        row.status as Booking['status'],
        paymentStatus: row.payment_status as Booking['paymentStatus'],
        paymentMethod: row.payment_method as Booking['paymentMethod'],
        createdAt:     row.created_at as string,
        notes:         row.notes as string | undefined,
        guestCount:    row.guest_count as number | undefined,
        eventType:     row.event_type as Booking['eventType'],
      }));
      set({ myBookings: mapped, isLoading: false });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to load bookings.', isLoading: false });
    }
  },

  // ── Create booking in Supabase + update local state ───────────────────────
  addBooking: async (booking) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await dbCreateBooking(booking);
      if (error) throw error;
      const created = data as Booking;
      set((s) => ({ myBookings: [created, ...s.myBookings], isLoading: false }));
      return created;
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to create booking.', isLoading: false });
      return null;
    }
  },

  // ── Cancel booking ────────────────────────────────────────────────────────
  cancelBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await dbCancelBooking(id);
      if (error) throw error;
      set((s) => ({
        myBookings: s.myBookings.map((b) =>
          b.id === id ? { ...b, status: 'cancelled' } : b
        ),
        isLoading: false,
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to cancel booking.', isLoading: false });
    }
  },

  // ── Load real-time slot availability from DB ───────────────────────────────
  loadTimeSlots: async (courtId, date) => {
    try {
      const { data, error } = await fetchBookedSlots(courtId, date);
      if (error) throw error;

      // Flatten all booked time strings into a set
      const bookedTimes = new Set<string>(
        (data ?? []).flatMap((row: { time_slots: string[] }) => row.time_slots)
      );

      set({
        timeSlots: BASE_TIME_SLOTS.map((slot) => ({
          ...slot,
          available: !bookedTimes.has(slot.time),
        })),
      });
    } catch {
      // On error, fall back to all-available (safe default)
      set({ timeSlots: BASE_TIME_SLOTS });
    }
  },

  // ── Selection helpers ─────────────────────────────────────────────────────
  setSelectedCourt: (court) => {
    set({ selectedCourt: court, selectedSlots: [] });
    const { selectedDate } = get();
    if (court) get().loadTimeSlots(court.id, selectedDate);
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date, selectedSlots: [] });
    const { selectedCourt } = get();
    if (selectedCourt) get().loadTimeSlots(selectedCourt.id, date);
  },

  toggleSlot: (slotId) => set((s) => ({
    selectedSlots: s.selectedSlots.includes(slotId)
      ? s.selectedSlots.filter((id) => id !== slotId)
      : [...s.selectedSlots, slotId],
  })),

  clearSelection: () => set({
    selectedCourt: null,
    selectedSlots: [],
    selectedDate:  new Date().toISOString().split('T')[0],
    timeSlots:     BASE_TIME_SLOTS,
  }),
}));