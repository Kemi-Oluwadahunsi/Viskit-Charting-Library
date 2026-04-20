// ─────────────────────────────────────────────────
// Polar Context
// ─────────────────────────────────────────────────
// Carries radial coordinate info for charts that
// plot on a circular grid (pie, donut, radar, gauge,
// radial bar, etc.).
// ─────────────────────────────────────────────────

import { createContext, useContext, type ReactNode } from 'react';
import type { PolarContextValue } from '../types';

const PolarContext = createContext<PolarContextValue | null>(null);

/**
 * Read the polar coordinate context.
 * Must be called inside a polar chart (Pie, Radar, etc.).
 */
export function usePolarContext(): PolarContextValue {
  const ctx = useContext(PolarContext);

  if (!ctx) {
    throw new Error(
      '[VisKit] usePolarContext must be used inside a polar chart. ' +
      'This hook is not available in cartesian charts (Line, Bar, etc.).',
    );
  }

  return ctx;
}

interface PolarProviderProps {
  value: PolarContextValue;
  children: ReactNode;
}

export function PolarProvider({ value, children }: PolarProviderProps) {
  return (
    <PolarContext.Provider value={value}>
      {children}
    </PolarContext.Provider>
  );
}
