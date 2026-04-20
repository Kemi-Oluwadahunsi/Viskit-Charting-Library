// ─────────────────────────────────────────────────
// Cartesian Context
// ─────────────────────────────────────────────────
// Carries X/Y scales and coordinate info for charts
// that plot on a rectangular grid (line, bar, scatter,
// area, etc.). Only available inside cartesian charts.
// ─────────────────────────────────────────────────

import { createContext, useContext, type ReactNode } from 'react';
import type { CartesianContextValue } from '../types';

const CartesianContext = createContext<CartesianContextValue | null>(null);

/**
 * Read the cartesian coordinate context.
 * Must be called inside a cartesian chart (not a pie/radar).
 */
export function useCartesianContext(): CartesianContextValue {
  const ctx = useContext(CartesianContext);

  if (!ctx) {
    throw new Error(
      '[VisKit] useCartesianContext must be used inside a cartesian chart. ' +
      'This hook is not available in polar charts (Pie, Radar, etc.).',
    );
  }

  return ctx;
}

interface CartesianProviderProps {
  value: CartesianContextValue;
  children: ReactNode;
}

export function CartesianProvider({ value, children }: CartesianProviderProps) {
  return (
    <CartesianContext.Provider value={value}>
      {children}
    </CartesianContext.Provider>
  );
}
