const CACHE_KEY = 'noqs:menuCache:v2';

export async function fetchMenu({ signal } = {}) {
  try {
    const res = await fetch('/menu.json', { cache: 'no-cache', signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Malformed payload');
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
    return { data, fromCache: false };
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (Array.isArray(cached) && cached.length) {
        return { data: cached, fromCache: true };
      }
    } catch {}
    throw err;
  }
}
