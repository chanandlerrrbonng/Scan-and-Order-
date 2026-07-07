import { getStoredToken } from '../context/AuthContext.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

async function req(path, { method = 'GET', body } = {}) {
  const token = getStoredToken();
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) throw new Error('Your session expired — please sign in again.');
    if (res.status === 403) throw new Error('You don’t have permission to do that.');
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data;
}

export const adminApi = {
  getMenu:         ()           => req('/menu'),
  setAvailability: (id, a)      => req(`/menu/${id}/availability`, { method: 'PATCH', body: { available: a } }),
  setStock:        (id, n)      => req(`/menu/${id}/stock`,        { method: 'PATCH', body: { stockCount: n } }),
  updateItem:      (id, patch)  => req(`/menu/${id}`,            { method: 'PUT', body: patch }),
  createItem:      (item)       => req('/menu',                  { method: 'POST', body: item }),
  deleteItem:      (id)         => req(`/menu/${id}`,            { method: 'DELETE' }),
  listOrders:      ()           => req('/orders'),
  advanceOrder:    (id, status) => req(`/orders/${id}`,          { method: 'PUT', body: { status } }),
  getAnalytics:    ()           => req('/analytics/revenue'),

  // ── Merchant Inbox (StoreFront Copilot §3.6) ──
  listSessions:    ()           => req('/inbox/sessions'),
  getSession:      (key)        => req(`/inbox/sessions/${encodeURIComponent(key)}`),
  setSessionMode:  (key, mode)  => req(`/inbox/sessions/${encodeURIComponent(key)}/mode`, { method: 'PATCH', body: { mode } })
};

// Expose token so the socket client can authenticate if needed.
export { getStoredToken };
