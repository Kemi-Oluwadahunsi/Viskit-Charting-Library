// ─────────────────────────────────────────────────
// <BarSeries> — Bar chart series
// ─────────────────────────────────────────────────
// Renders vertical bars for each datum. Uses band
// scale from CartesianContext for X positioning.
//
// Features:
// - Rounded corners via borderRadius
// - Grouped and stacked modes (Phase 2)
// - Gradient fill support
// - Individual bar hover/click
//
// Usage:
//   <Chart data={data}>
//     <BarSeries field="revenue" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback, useId } from 'react';
import { useChartContext, useCartesianContext } from '@viskit/core';
import type { BaseSeriesProps } from '@viskit/core';

export interface BarSeriesProps<TDatum = Record<string, unknown>>
  extends BaseSeriesProps<TDatum> {
  /** Corner radius for bar tops (default: from theme) */
  radius?: number;
  /** Enable vertical gradient fill (default: true) */
  gradientFill?: boolean;
}

export function BarSeries<TDatum extends Record<string, unknown>>({
  field,
  color,
  opacity = 1,
  radius = 4,
  gradientFill = true,
  'aria-label': ariaLabel,
}: BarSeriesProps<TDatum>) {
  const { data, colorScale } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gradId = useId();

  const resolvedColor = color ?? colorScale(field as string);

  const handleEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  const bars = useMemo(() => {
    const bandwidth = xScale.bandwidth ?? 20;

    return (data as TDatum[]).map((d, i) => {
      const domainValue = xScale.domain[i];
      const x = xScale.scale(domainValue) as number;
      const yValue = Number(d[field]) || 0;
      const y = yScale.scale(yValue as unknown) as number;
      const baseline = yScale.scale(0 as unknown) as number;

      // Bar grows upward from the baseline (y=0)
      const barY = Math.min(y, baseline);
      const barHeight = Math.abs(baseline - y);

      return {
        x,
        y: barY,
        width: bandwidth,
        height: barHeight,
        value: yValue,
        datum: d,
      };
    });
  }, [data, field, xScale, yScale]);

  return (
    <g
      role="list"
      aria-label={ariaLabel ?? `${field as string} bars`}
    >
      {/* Gradient fill definition */}
      {gradientFill && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={resolvedColor} stopOpacity={1} />
            <stop offset="100%" stopColor={resolvedColor} stopOpacity={0.6} />
          </linearGradient>
        </defs>
      )}

      {bars.map((bar, i) => {
        const isActive = hoveredIndex === i;
        const barOpacity = hoveredIndex !== null && !isActive ? opacity * 0.4 : opacity;

        return (
          <g key={i}>
            {/* Glow behind active bar */}
            {isActive && (
              <rect
                x={bar.x - 2}
                y={bar.y - 2}
                width={bar.width + 4}
                height={Math.max(0, bar.height + 4)}
                rx={radius + 2}
                ry={radius + 2}
                fill={resolvedColor}
                opacity={0.15}
              />
            )}
            {/* Main bar */}
            <rect
              x={bar.x}
              y={isActive ? bar.y - 3 : bar.y}
              width={bar.width}
              height={Math.max(0, isActive ? bar.height + 3 : bar.height)}
              rx={radius}
              ry={radius}
              fill={gradientFill ? `url(#${gradId})` : resolvedColor}
              opacity={barOpacity}
              role="listitem"
              aria-label={`${field as string}: ${bar.value}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{
                cursor: 'pointer',
                transition: 'y 200ms ease, height 200ms ease, opacity 200ms ease',
              }}
            />
            {/* Value label on hover */}
            {isActive && (
              <text
                x={bar.x + bar.width / 2}
                y={bar.y - 10}
                textAnchor="middle"
                fill={resolvedColor}
                fontSize={11}
                fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                {bar.value.toLocaleString()}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
