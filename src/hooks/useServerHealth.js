import { useEffect, useState } from 'react';

/**
 * Pings a hypothetical server-health endpoint on mount.
 * Demonstrates effect cleanup (AbortController + interval clear)
 * to prevent memory leaks on unmount.
 */
export function useServerHealth(pollMs = 60_000) {
  const [health, setHealth] = useState({
    kitchenOpen: true,
    latencyMs: null,
    lastCheck: null,
    status: 'idle'
  });

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function check() {
      const started = performance.now();
      try {
        // Replace with your real endpoint. We use menu.json as a stand-in.
        const res = await fetch('/menu.json', {
          signal: controller.signal,
          cache: 'no-store'
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        if (cancelled) return;
        setHealth({
          kitchenOpen: true,
          latencyMs: Math.round(performance.now() - started),
          lastCheck: new Date().toISOString(),
          status: 'ok'
        });
      } catch (err) {
        if (cancelled || err.name === 'AbortError') return;
        setHealth((h) => ({ ...h, kitchenOpen: false, status: 'error' }));
      }
    }

    check();                                  // run on mount
    const id = setInterval(check, pollMs);    // poll periodically

    // Cleanup: cancel in-flight + clear interval to prevent leaks
    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(id);
    };
  }, [pollMs]);

  return health;
}
