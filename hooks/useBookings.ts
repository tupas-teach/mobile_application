import { useEffect } from 'react';
import { useBookingStore } from '../store/bookingStore';
import type { Booking } from '../types';

/**
 * Replaces the old stub that returned an empty array after a timeout.
 */
export function useBookings(userId: string) {
  const { myBookings, isLoading, error, loadBookings, cancelBooking } = useBookingStore();

  useEffect(() => {
    if (userId) loadBookings(userId);
  }, [userId]);

  return {
    bookings: myBookings as Booking[],
    loading:  isLoading,
    error,
    refetch:  () => loadBookings(userId),
    cancel:   cancelBooking,
  };
}
