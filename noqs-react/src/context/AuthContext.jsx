import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
const TOKEN_KEY = 'noqs:token';

// Exported so adminApi can read the token without importing React.
export function getStoredToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
function storeToken(t) {
  try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authed | anon

  // On mount, verify the stored token (Bearer) with the server.
  useEffect(() => {
    const controller = new AbortController();
    const token = getStoredToken();
    if (!token) { setStatus('anon'); return () => controller.abort(); }

    fetch(`${API_BASE}/auth/me`, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) { setUser(data.user); setStatus('authed'); }
        else { storeToken(null); setStatus('anon'); }
      })
      .catch((e) => { if (e.name !== 'AbortError') { storeToken(null); setStatus('anon'); } });
    return () => controller.abort();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    storeToken(data.token);          // ← keep the token for Bearer auth
    setUser(data.user);
    setStatus('authed');
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    const token = getStoredToken();
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
    } finally {
      storeToken(null);
      setUser(null);
      setStatus('anon');
    }
  }, []);

  const value = useMemo(() => ({ user, status, login, logout }), [user, status, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
