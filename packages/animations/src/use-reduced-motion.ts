// ─────────────────────────────────────────────────
// useReducedMotion — Respects OS accessibility
// ─────────────────────────────────────────────────
// Reads the user's prefers-reduced-motion setting.
// When true, all VisKit animations resolve instantly
// (duration = 0, springs = immediate).
//
// This hook is checked in every animated component
// so accessibility is automatic, not opt-in.
// ─────────────────────────────────────────────────

import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(QUERY);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
