import { createClient } from '@supabase/supabase-js';
import type { Booking, User } from '../types';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const signUp = (email: string, password: string) =>
  supabase.auth.signUp({ email, password });

export const signOut    = () => supabase.auth.signOut();
export const getSession = () => supabase.auth.getSession();

// ─── Profiles ─────────────────────────────────────────────────────────────────
// Maps to a `profiles` table in Supabase (linked to auth.users via id).

export const fetchProfile = (userId: string) =>
  supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

export const upsertProfile = (profile: Partial<User> & { id: string }) =>
  supabase.from('profiles').upsert(profile);

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const fetchBookings = (userId: string) =>
  supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

export const createBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) =>
  supabase
    .from('bookings')
    .insert({
      user_id:        booking.userId,
      court_id:       booking.courtId,
      court_name:     booking.courtName,
      date:           booking.date,
      time_slots:     booking.timeSlots,
      duration:       booking.duration,
      category:       booking.category,
      total_amount:   booking.totalAmount,
      status:         booking.status,
      payment_status: booking.paymentStatus,
      payment_method: booking.paymentMethod,
      notes:          booking.notes,
      guest_count:    booking.guestCount,
      event_type:     booking.eventType,
    })
    .select()
    .single();

export const updateBookingStatus = (id: string, status: Booking['status']) =>
  supabase.from('bookings').update({ status }).eq('id', id);

export const cancelBooking = (id: string) =>
  updateBookingStatus(id, 'cancelled');

/**
 * Returns all booked time slots for a given court + date (excluding cancelled).
 * Use this to mark slots as unavailable in the time slot picker.
 */
export const fetchBookedSlots = (courtId: string, date: string) =>
  supabase
    .from('bookings')
    .select('time_slots')
    .eq('court_id', courtId)
    .eq('date', date)
    .neq('status', 'cancelled');

// ─── Products ─────────────────────────────────────────────────────────────────
// Supabase column: in_stock (snake_case)

export const fetchProducts = (filters?: { forGym?: boolean; forCourt?: boolean; category?: string }) => {
  let q = supabase
    .from('products')
    .select('*')
    .eq('in_stock', true);

  if (filters?.forGym)    q = q.eq('for_gym', true);
  if (filters?.forCourt)  q = q.eq('for_court', true);
  if (filters?.category)  q = q.eq('category', filters.category);

  return q;
};

export const fetchProductById = (id: string) =>
  supabase.from('products').select('*').eq('id', id).single();

// ─── Transactions ─────────────────────────────────────────────────────────────

export const fetchTransactions = (userId: string) =>
  supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

export const createTransaction = (tx: {
  userId: string;
  amount: number;
  method: string;
  status: string;
  reference: string;
  description: string;
  bookingId?: string;
  items?: unknown[];
}) =>
  supabase
    .from('transactions')
    .insert({
      user_id:     tx.userId,
      amount:      tx.amount,
      method:      tx.method,
      status:      tx.status,
      reference:   tx.reference,
      description: tx.description,
      booking_id:  tx.bookingId,
      items:       tx.items ?? [],
    })
    .select()
    .single();

// ─── Messages ─────────────────────────────────────────────────────────────────

export const fetchMessages = (userId: string) =>
  supabase
    .from('messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

export const sendMessage = (msg: {
  userId: string;
  content: string;
  senderType: 'user' | 'admin' | 'ai';
}) =>
  supabase.from('messages').insert({
    user_id:     msg.userId,
    content:     msg.content,
    sender_type: msg.senderType,
  });

export const subscribeToMessages = (
  userId: string,
  callback: (payload: unknown) => void,
) =>
  supabase
    .channel(`messages:${userId}`)
    .on(
      'postgres_changes',
      {
        event:  'INSERT',
        schema: 'public',
        table:  'messages',
        filter: `user_id=eq.${userId}`,
      },
      callback,
    )
    .subscribe();

// ─── Membership ───────────────────────────────────────────────────────────────

export const fetchMembership = (userId: string) =>
  supabase
    .from('memberships')
    .select('*')
    .eq('user_id', userId)
    .single();

export const upsertMembership = (data: {
  userId: string;
  tier: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'cancelled';
}) =>
  supabase
    .from('memberships')
    .upsert({
      user_id:    data.userId,
      tier:       data.tier,
      expires_at: data.expiresAt,
      status:     data.status,
    });

// ─── Courts (optional: load from DB instead of hardcoded) ────────────────────

export const fetchCourts = () =>
  supabase
    .from('courts')
    .select('*')
    .eq('active', true);
