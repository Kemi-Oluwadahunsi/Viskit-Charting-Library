// ─────────────────────────────────────────────────
// <WaterfallSeries> — Running totals / cumulative effect
// ─────────────────────────────────────────────────
// Renders a waterfall chart showing how individual
// values contribute to a running total. Positive bars
// go up, negative go down, totals are distinct.
//
// Usage:
//   <Chart data={pnlData} height={400}>
//     <WaterfallSeries field="amount" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { useChartContext, useCartesianContext } from '@viskit/core';
import type { BaseSeriesProps } from '@viskit/core';

export interface WaterfallSeriesProps<TDatum = Record<string, unknown>>
  extends BaseSeriesProps<TDatum> {
  /** Field indicating if a datum is a total row (boolean field) */
  totalField?: keyof TDatum & string;
  /** Color for positive increments (default: '#22c55e') */
  positiveColor?: string;
  /** Color for negative decrements (default: '#ef4444') */
  negativeColor?: string;
  /** Color for total bars (default: '#6366f1') */
  totalColor?: string;
  /** Corner radius on bars (default: 2) */
  radius?: number;
  /** Show connector lines between bars (default: true) */
  connectors?: boolean;
}

export function WaterfallSeries<TDatum extends Record<string, unknown>>({
  field,
  totalField,
  positiveColor = '#22c55e',
  negativeColor = '#ef4444',
  totalColor = '#6366f1',
  radius = 2,
  connectors = true,
  opacity = 1,
  'aria-label': ariaLabel,
}: WaterfallSeriesProps<TDatum>) {
  const { data } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const bars = useMemo(() => {
    const typedData = data as TDatum[];
    const bandwidth = xScale.bandwidth ?? 20;
    let runningTotal = 0;

    return typedData.map((d, i) => {
      const value = Number(d[field]) || 0;
      const isTotal = totalField ? Boolean(d[totalField]) : false;

      let start: number;
      let end: number;
      let color: string;

      if (isTotal) {
        start = 0;
        end = runningTotal;
        color = totalColor;
      } else {
        start = runningTotal;
        runningTotal += value;
        end = runningTotal;
        color = value >= 0 ? positiveColor : negativeColor;
      }

      const domainValue = xScale.domain[i];
      const x = xScale.scale(domainValue) as number;
      const yStart = yScale.scale(start as unknown) as number;
      const yEnd = yScale.scale(end as unknown) as number;
      const barTop = Math.min(yStart, yEnd);
      const barHeight = Math.max(1, Math.abs(yStart - yEnd));

      return {
        x,
        y: barTop,
        width: bandwidth,
        height: barHeight,
        color,
        value,
        runningTotal: isTotal ? runningTotal : end,
        isTotal,
        connectorY: yEnd,
      };
    });
  }, [data, field, totalField, xScale, yScale, positiveColor, negativeColor, totalColor]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Waterfall chart'}>
      {/* Connector lines */}
      {connectors &&
        bars.map((bar, i) => {
          if (i === bars.length - 1) return null;
          const next = bars[i + 1];
          if (!next) return null;

          return (
            <line
              key={`conn-${i}`}
              x1={bar.x + bar.width}
              y1={bar.connectorY}
              x2={next.x}
              y2={bar.connectorY}
              stroke="#475569"
              strokeWidth={1}
              strokeDasharray="3,3"
              opacity={0.5}
            />
          );
        })}

      {/* Bars */}
      {bars.map((bar, i) => {
        const isActive = hovered === i;

        return (
          <g key={i}>
            <rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              rx={radius}
              ry={radius}
              fill={bar.color}
              opacity={hovered !== null && !isActive ? opacity * 0.35 : opacity}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 2 : 0}
              role="listitem"
              aria-label={`${bar.isTotal ? 'Total' : (bar.value >= 0 ? '+' : '')}${bar.value.toLocaleString()}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
            />
            {isActive && (
              <text
                x={bar.x + bar.width / 2}
                y={bar.y - 8}
                textAnchor="middle"
                fill={bar.color}
                fontSize={11}
                fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                {bar.isTotal ? bar.runningTotal.toLocaleString() : `${bar.value >= 0 ? '+' : ''}${bar.value.toLocaleString()}`}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
