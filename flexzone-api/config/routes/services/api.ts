/**
 * services/api.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * REST API wrapper for FlexZone backend.
 * Replaces direct Supabase calls where a custom Laravel/Node backend is used.
 *
 * ✅ FIX: Import path changed from '../constants/config' which is correct
 *         when this file lives at:  FlexZone/services/api.ts
 *         and config lives at:      FlexZone/constants/config.ts
 *
 *         If your folder structure is different, adjust the path:
 *           services/api.ts         → '../constants/config'   ✅ (default)
 *           app/services/api.ts     → '../../constants/config'
 *           src/services/api.ts     → '../../constants/config'
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { API_URL } from '@/lib/config'; // ✅ FIX: API_URL now exists in config.ts

// ─── Auth Token (set after login) ────────────────────────────────────────────

let authToken: string | null = null;

export const setToken = (token: string | null) => { authToken = token; };

// ─── Core Request Helper ──────────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  body?: object,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'API error');
  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const apiLogin = (email: string, password: string) =>
  request<{ user: any; token: string }>('POST', '/auth/login', { email, password });

export const apiRegister = (name: string, email: string, password: string) =>
  request<{ user: any; token: string }>('POST', '/auth/register', {
    name, email, password, password_confirmation: password,
  });

export const apiMe = () =>
  request<any>('GET', '/auth/me');

export const apiUpdateProfile = (data: { name?: string; phone?: string }) =>
  request<any>('PUT', '/auth/profile', data);

export const apiLogout = () =>
  request<any>('POST', '/auth/logout');

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const apiGetBookings = () =>
  request<any[]>('GET', '/bookings');

export const apiCreateBooking = (booking: object) =>
  request<any>('POST', '/bookings', booking);

export const apiCancelBooking = (id: string | number) =>
  request<any>('PUT', `/bookings/${id}/cancel`, {});

export const apiGetBookedSlots = (courtId: string, date: string) =>
  request<{ booked_slots: string[] }>('GET', `/bookings/slots?court_id=${courtId}&date=${date}`);

// ─── Products ─────────────────────────────────────────────────────────────────

export const apiGetProducts = (type?: 'gym' | 'court', category?: string) => {
  const params = new URLSearchParams();
  if (type)     params.set('type', type);
  if (category) params.set('category', category);
  return request<any[]>('GET', `/products?${params.toString()}`);
};

// ─── Transactions ─────────────────────────────────────────────────────────────

export const apiGetTransactions = () =>
  request<any[]>('GET', '/transactions');

export const apiCreateTransaction = (tx: object) =>
  request<any>('POST', '/transactions', tx);

// ─── Courts ───────────────────────────────────────────────────────────────────

export const apiGetCourts = () =>
  request<any[]>('GET', '/courts');
