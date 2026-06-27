import { API_URL } from '@/lib/config';

let authToken: string | null = null;
export const setToken   = (token: string | null) => { authToken = token; };
export const clearToken = () => { authToken = null; };

async function request<T>(method: string, path: string, body?: object): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = data?.message ?? data?.error ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export const apiLogin    = (email: string, password: string) =>
  request<{ user: any; token: string }>('POST', '/auth/login', { email, password });

export const apiRegister = (name: string, email: string, password: string) =>
  request<{ user: any; token: string }>('POST', '/auth/register', {
    name, email, password, password_confirmation: password,
  });

export const apiMe              = () => request<any>('GET', '/auth/me');
export const apiUpdateProfile   = (data: { name?: string; phone?: string }) =>
  request<any>('PUT', '/auth/profile', data);
export const apiLogout          = () => request<any>('POST', '/auth/logout');
export const apiGetBookings     = () => request<any[]>('GET', '/bookings');
export const apiCreateBooking   = (booking: object) => request<any>('POST', '/bookings', booking);
export const apiCancelBooking   = (id: string | number) => request<any>('PUT', `/bookings/${id}/cancel`, {});
export const apiGetBookedSlots  = (courtId: string, date: string) =>
  request<{ booked_slots: string[] }>('GET', `/bookings/slots?court_id=${courtId}&date=${date}`);
export const apiGetProducts     = (type?: 'gym' | 'court', category?: string) => {
  const params = new URLSearchParams();
  if (type)     params.set('type', type);
  if (category) params.set('category', category);
  const qs = params.toString();
  return request<any[]>('GET', `/products${qs ? `?${qs}` : ''}`);
};
export const apiGetProductById    = (id: string | number) => request<any>('GET', `/products/${id}`);
export const apiGetTransactions   = () => request<any[]>('GET', '/transactions');
export const apiCreateTransaction = (tx: object) => request<any>('POST', '/transactions', tx);
export const apiGetCourts         = () => request<any[]>('GET', '/courts');
export const apiGetCourtById      = (id: string | number) => request<any>('GET', `/courts/${id}`);
export const apiGetMembership     = () => request<any>('GET', '/membership');
export const apiUpsertMembership  = (data: { tier: string; expires_at: string }) =>
  request<any>('POST', '/membership', data);
export const apiGetMessages       = () => request<any[]>('GET', '/messages');
export const apiSendMessage       = (content: string, senderType: 'user' | 'admin' | 'ai') =>
  request<any>('POST', '/messages', { content, sender_type: senderType });
