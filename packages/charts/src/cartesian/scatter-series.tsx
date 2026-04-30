// ─────────────────────────────────────────────────
// <ScatterSeries> — Scatter plot series
// ─────────────────────────────────────────────────
// Plots data as individual points on an X/Y grid.
// Each point is an SVG circle positioned by the
// cartesian scales.
//
// Usage:
//   <Chart data={data}>
//     <ScatterSeries field="revenue" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { useChartContext, useCartesianContext } from '@kodemaven/viskit-core';
import type { BaseSeriesProps } from '@kodemaven/viskit-core';

export interface ScatterSeriesProps<TDatum = Record<string, unknown>>
  extends BaseSeriesProps<TDatum> {
  /** Point radius in px (default: 4) */
  radius?: number;
  /** Shape of each point */
  shape?: 'circle' | 'square' | 'diamond';
}

export function ScatterSeries<TDatum extends Record<string, unknown>>({
  field,
  color,
  opacity = 1,
  radius = 4,
  'aria-label': ariaLabel,
}: ScatterSeriesProps<TDatum>) {
  const { data, colorScale } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  const resolvedColor = color ?? colorScale(field as string);

  const points = useMemo(() => {
    return (data as TDatum[]).map((d, i) => {
      const domainValue = xScale.domain[i];
      const x = (xScale.scale(domainValue) as number) + (xScale.bandwidth ? xScale.bandwidth / 2 : 0);
      const y = yScale.scale(d[field] as unknown) as number;

      return { x, y, datum: d };
    }).filter((pt) => !Number.isNaN(pt.x) && !Number.isNaN(pt.y));
  }, [data, field, xScale, yScale]);

  return (
    <g
      role="list"
      aria-label={ariaLabel ?? `${field as string} points`}
    >
      {points.map((pt, i) => {
        const isActive = hoveredIndex === i;
        const pointOpacity = hoveredIndex !== null && !isActive ? opacity * 0.35 : opacity;
        const activeR = isActive ? radius + 3 : radius;

        return (
          <g key={i}>
            {/* Pulse ring on active */}
            {isActive && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={activeR + 6}
                fill={resolvedColor}
                opacity={0.12}
              />
            )}
            {/* Outer glow on active */}
            {isActive && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={activeR + 3}
                fill="none"
                stroke={resolvedColor}
                strokeWidth={1.5}
                opacity={0.3}
              />
            )}
            {/* Main point */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={activeR}
              fill={resolvedColor}
              opacity={pointOpacity}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 2 : 0}
              role="listitem"
              aria-label={`${field as string}: ${String(pt.datum[field])}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{
                cursor: 'pointer',
                transition: 'r 200ms ease, opacity 200ms ease',
              }}
            />
            {/* Value label */}
            {isActive && (
              <text
                x={pt.x}
                y={pt.y - activeR - 10}
                textAnchor="middle"
                fill={resolvedColor}
                fontSize={11}
                fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                {typeof pt.datum[field] === 'number'
                  ? (pt.datum[field] as number).toLocaleString()
                  : String(pt.datum[field])}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
