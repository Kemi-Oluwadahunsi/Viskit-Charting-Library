// ─────────────────────────────────────────────────
// <ChartGroup> — Synchronized multi-chart container
// ─────────────────────────────────────────────────
// Wraps multiple <Chart> instances and synchronizes
// their crosshair position, tooltip, and active state.
//
// Usage:
//   <ChartGroup>
//     <Chart data={data1}><LineSeries field="a" /></Chart>
//     <Chart data={data2}><BarSeries field="b" /></Chart>
//   </ChartGroup>
// ─────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

interface ChartGroupContextValue {
  /** Current crosshair x position (normalized 0–1) */
  crosshairX: number | null;
  /** Currently active datum index */
  activeIndex: number | null;
  /** Active series keys across all charts */
  activeKeys: Set<string>;
  /** Report crosshair position from a chart */
  setCrosshairX: (x: number | null) => void;
  /** Report active datum index from a chart */
  setActiveIndex: (index: number | null) => void;
  /** Toggle a series key */
  toggleKey: (key: string) => void;
}

const ChartGroupContext = createContext<ChartGroupContextValue | null>(null);

export interface ChartGroupProps {
  /** Child <Chart> components to synchronize */
  children: ReactNode;
  /** Layout direction (default: 'vertical') */
  layout?: 'vertical' | 'horizontal';
  /** Gap between charts in px (default: 16) */
  gap?: number;
  /** CSS class for the wrapper div */
  className?: string;
}

export function ChartGroup({
  children,
  layout = 'vertical',
  gap = 16,
  className,
}: ChartGroupProps) {
  const [crosshairX, setCrosshairX] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  const toggleKey = useCallback((key: string) => {
    setActiveKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const value = useMemo<ChartGroupContextValue>(
    () => ({ crosshairX, activeIndex, activeKeys, setCrosshairX, setActiveIndex, toggleKey }),
    [crosshairX, activeIndex, activeKeys, toggleKey],
  );

  return (
    <ChartGroupContext.Provider value={value}>
      <div
        className={className}
        style={{
          display: 'flex',
          flexDirection: layout === 'vertical' ? 'column' : 'row',
          gap: `${gap}px`,
          width: '100%',
        }}
      >
        {children}
      </div>
    </ChartGroupContext.Provider>
  );
}

export function useChartGroup(): ChartGroupContextValue | null {
  return useContext(ChartGroupContext);
}
