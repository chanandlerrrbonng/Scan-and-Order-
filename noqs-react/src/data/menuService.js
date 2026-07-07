const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
const CACHE_KEY = 'noqs:menuCache:v4';   // bumped again to drop any bad cached data

export async function fetchMenu({ signal } = {}) {
  try {
    // Public storefront request — deliberately NO Authorization header,
    // so the server returns only available items via the anonymous path.
    const res = await fetch(`${API_BASE}/menu`, { cache: 'no-cache', signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let data = await res.json();
    if (!Array.isArray(data)) throw new Error('Malformed payload');

    // Show item unless it is explicitly marked unavailable.
    // (available === undefined or true → show; only false hides it.)
    data = data.filter((i) => i.available !== false);

    // Only cache a non-empty result, so an empty/error response never
    // poisons the cache and hides the whole menu on the next load.
    if (data.length > 0) {
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
    }
    return { data, fromCache: false };
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.error('[menu] fetch failed:', err);
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (Array.isArray(cached) && cached.length) {
        return { data: cached.filter((i) => i.available !== false), fromCache: true };
      }
    } catch {}
    throw err;
  }
}
