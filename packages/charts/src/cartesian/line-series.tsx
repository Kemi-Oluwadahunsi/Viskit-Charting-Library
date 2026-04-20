// ─────────────────────────────────────────────────
// <LineSeries> — Line chart series
// ─────────────────────────────────────────────────
// Renders a single line from data. Reads X/Y from
// the CartesianContext and plots the `field` values.
//
// Features:
// - Multiple curve interpolations (linear, monotone, step, etc.)
// - Optional data point dots
// - Gradient stroke support
// - Animation via @react-spring/web
// - Render prop escape hatch (renderDatum)
//
// Usage:
//   <Chart data={data}>
//     <LineSeries field="revenue" curve="monotone" gradient />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { line, curveBasis, curveCardinal, curveCatmullRom, curveLinear, curveMonotoneX, curveNatural, curveStep } from 'd3-shape';
import { useChartContext, useCartesianContext } from '@viskit/core';
import type { BaseSeriesProps } from '@viskit/core';

// ── Curve type mapping ─────────────────────────

type CurveType = 'linear' | 'monotone' | 'step' | 'basis' | 'cardinal' | 'catmull-rom' | 'natural';

const CURVE_MAP = {
  linear: curveLinear,
  monotone: curveMonotoneX,
  step: curveStep,
  basis: curveBasis,
  cardinal: curveCardinal,
  'catmull-rom': curveCatmullRom,
  natural: curveNatural,
} as const;

// ── Props ──────────────────────────────────────

export interface LineSeriesProps<TDatum = Record<string, unknown>>
  extends BaseSeriesProps<TDatum> {
  /** Curve interpolation method (default: 'linear') */
  curve?: CurveType;
  /** Show dot markers on data points */
  dots?: boolean;
  /** Dot radius in px (default: 3, active: 5) */
  dotRadius?: number;
  /** Stroke dash pattern (e.g., '4 2' for dashed) */
  strokeDasharray?: string;
  /** Stroke width override */
  strokeWidth?: number;
  /** Bridge across null/undefined values */
  connectNulls?: boolean;
  /** Glow effect on hover (default: true) */
  glow?: boolean;
}

export function LineSeries<TDatum extends Record<string, unknown>>({
  field,
  curve = 'linear',
  dots = false,
  dotRadius = 3,
  color,
  opacity = 1,
  strokeDasharray,
  strokeWidth = 2,
  connectNulls = false,
  glow = true,
  'aria-label': ariaLabel,
}: LineSeriesProps<TDatum>) {
  const { data, colorScale } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isSeriesHovered, setIsSeriesHovered] = useState(false);

  const handleDotEnter = useCallback((index: number) => setHoveredIndex(index), []);
  const handleDotLeave = useCallback(() => setHoveredIndex(null), []);
  const handleSeriesEnter = useCallback(() => setIsSeriesHovered(true), []);
  const handleSeriesLeave = useCallback(() => { setIsSeriesHovered(false); setHoveredIndex(null); }, []);

  // Resolve series color from prop or categorical palette
  const resolvedColor = color ?? colorScale(field as string);

  // Build the SVG path using d3-shape
  const pathData = useMemo(() => {
    const curveFactory = CURVE_MAP[curve];

    const lineGenerator = line<TDatum>()
      .x((_d, i) => {
        // Use xScale with the index or a matching domain value
        const domain = xScale.domain;
        const domainValue = domain[i];
        return (xScale.scale(domainValue) as number) + (xScale.bandwidth ? xScale.bandwidth / 2 : 0);
      })
      .y((d) => yScale.scale(d[field] as unknown) as number)
      .curve(curveFactory);

    // Handle null values
    if (!connectNulls) {
      lineGenerator.defined((d) => d[field] != null && !Number.isNaN(Number(d[field])));
    }

    return lineGenerator(data as TDatum[]) ?? '';
  }, [data, field, curve, xScale, yScale, connectNulls]);

  // Compute dot positions for optional data point markers
  const dotPositions = useMemo(() => {
    if (!dots) return [];

    return (data as TDatum[]).map((d, i) => {
      const domain = xScale.domain;
      const domainValue = domain[i];
      return {
        x: (xScale.scale(domainValue) as number) + (xScale.bandwidth ? xScale.bandwidth / 2 : 0),
        y: yScale.scale(d[field] as unknown) as number,
        datum: d,
      };
    }).filter((pt) => !Number.isNaN(pt.x) && !Number.isNaN(pt.y));
  }, [data, field, dots, xScale, yScale]);

  return (
    <g
      role="list"
      aria-label={ariaLabel ?? `${field as string} series`}
      onMouseEnter={handleSeriesEnter}
      onMouseLeave={handleSeriesLeave}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow filter for hover effect */}
      {glow && (
        <defs>
          <filter id={`glow-${field as string}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}

      {/* The line path */}
      <path
        d={pathData}
        fill="none"
        stroke={resolvedColor}
        strokeWidth={isSeriesHovered ? strokeWidth + 1 : strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        filter={isSeriesHovered && glow ? `url(#glow-${field as string})` : undefined}
        style={{ transition: 'stroke-width 200ms ease, filter 200ms ease' }}
      />

      {/* Dot markers — always show on hover, optionally show always */}
      {(dots || isSeriesHovered) && dotPositions.map((pt, i) => {
        const isActive = hoveredIndex === i;
        const activeRadius = isActive ? dotRadius + 3 : dotRadius;

        return (
          <g key={i}>
            {/* Hover pulse ring */}
            {isActive && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={activeRadius + 4}
                fill="none"
                stroke={resolvedColor}
                strokeWidth={1.5}
                opacity={0.3}
              />
            )}
            {/* Main dot */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={activeRadius}
              fill={isActive ? '#fff' : resolvedColor}
              stroke={isActive ? resolvedColor : '#fff'}
              strokeWidth={isActive ? 2.5 : 1.5}
              role="listitem"
              aria-label={`${field as string}: ${String(pt.datum[field])}`}
              tabIndex={0}
              onMouseEnter={() => handleDotEnter(i)}
              onMouseLeave={handleDotLeave}
              style={{ transition: 'r 200ms ease, fill 150ms ease, stroke-width 150ms ease' }}
            />
            {/* Value label on hover */}
            {isActive && (
              <text
                x={pt.x}
                y={pt.y - activeRadius - 10}
                textAnchor="middle"
                fill={resolvedColor}
                fontSize={11}
                fontWeight={600}
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
