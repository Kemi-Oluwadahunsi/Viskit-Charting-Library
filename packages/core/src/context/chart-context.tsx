// ─────────────────────────────────────────────────
// Chart Context
// ─────────────────────────────────────────────────
// The top-level context that every chart child reads
// from. Carries data, dimensions, color mapping, and
// active state. Created by the <Chart> component.
// ─────────────────────────────────────────────────

import { createContext, useContext, type ReactNode } from 'react';
import type { ChartContextValue } from '../types';

const ChartContext = createContext<ChartContextValue | null>(null);

/**
 * Read the chart context. Must be called inside a <Chart> component.
 * Throws a clear error if used outside a chart tree.
 */
export function useChartContext<
  TDatum = Record<string, unknown>,
>(): ChartContextValue<TDatum> {
  const ctx = useContext(ChartContext);

  if (!ctx) {
    throw new Error(
      '[VisKit] useChartContext must be used inside a <Chart> component. ' +
      'Wrap your series and primitives in <Chart data={...}>.',
    );
  }

  return ctx as ChartContextValue<TDatum>;
}

interface ChartProviderProps {
  value: ChartContextValue;
  children: ReactNode;
}

/**
 * Internal provider — used by the <Chart> component to supply context.
 * Not intended for direct consumer use.
 */
export function ChartProvider({ value, children }: ChartProviderProps) {
  return (
    <ChartContext.Provider value={value}>
      {children}
    </ChartContext.Provider>
  );
}
