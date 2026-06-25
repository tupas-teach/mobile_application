/**
 * services/api.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Laravel REST API wrapper for FlexZone.
 *
 * ✅ FIX: Now imports API_URL from 'lib/config' (the project's re-export hub)
 *         instead of directly from 'constants/config'. Either path works, but
 *         using lib/config keeps imports consistent across the project.
 *
 * Folder layout assumed:
 *   FlexZone/
 *     constants/config.ts   ← source of truth
 *     lib/config.ts         ← re-export hub
 *     services/api.ts       ← this file
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { API_URL } from '@/lib/config'; // ✅ FIX: uses lib/config re-export hub

// ─── Auth Token ───────────────────────────────────────────────────────────────
// Call setToken() after login and clearToken() after logout.

let authToken: string | null = null;

export const setToken   = (token: string)  => { authToken = token; };
export const clearToken = ()               => { authToken = null;  };

// ─── Core Request Helper ──────────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  body?: object,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept':       'application/json',   // Laravel expects this for JSON responses
  };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Laravel returns validation errors as { message, errors } with 422 status
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.message ?? data?.error ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
// Laravel Sanctum / Passport endpoints

export const apiLogin = (email: string, password: string) =>
  request<{ user: any; token: string }>('POST', '/auth/login', { email, password });

export const apiRegister = (name: string, email: string, password: string) =>
  request<{ user: any; token: string }>('POST', '/auth/register', {
    name,
    email,
    password,
    password_confirmation: password, // Laravel validation requires this
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
  request<{ booked_slots: string[] }>(
    'GET',
    `/bookings/slots?court_id=${courtId}&date=${date}`,
  );

// ─── Products ─────────────────────────────────────────────────────────────────

export const apiGetProducts = (type?: 'gym' | 'court', category?: string) => {
  const params = new URLSearchParams();
  if (type)     params.set('type', type);
  if (category) params.set('category', category);
  const qs = params.toString();
  return request<any[]>('GET', `/products${qs ? `?${qs}` : ''}`);
};

export const apiGetProductById = (id: string | number) =>
  request<any>('GET', `/products/${id}`);

// ─── Transactions ─────────────────────────────────────────────────────────────

export const apiGetTransactions = () =>
  request<any[]>('GET', '/transactions');

export const apiCreateTransaction = (tx: object) =>
  request<any>('POST', '/transactions', tx);

// ─── Courts ───────────────────────────────────────────────────────────────────

export const apiGetCourts = () =>
  request<any[]>('GET', '/courts');

export const apiGetCourtById = (id: string | number) =>
  request<any>('GET', `/courts/${id}`);

// ─── Membership ───────────────────────────────────────────────────────────────

export const apiGetMembership = () =>
  request<any>('GET', '/membership');

export const apiUpsertMembership = (data: {
  tier: string;
  expires_at: string;
}) => request<any>('POST', '/membership', data);

// ─── Messages / Support Chat ──────────────────────────────────────────────────

export const apiGetMessages = () =>
  request<any[]>('GET', '/messages');

export const apiSendMessage = (content: string, senderType: 'user' | 'admin' | 'ai') =>
  request<any>('POST', '/messages', { content, sender_type: senderType });
