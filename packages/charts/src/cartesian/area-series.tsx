// ─────────────────────────────────────────────────
// <AreaSeries> — Filled area chart series
// ─────────────────────────────────────────────────
// Renders a filled area beneath a line. Supports
// gradient fills and curve interpolation.
//
// Usage:
//   <Chart data={data}>
//     <AreaSeries field="revenue" gradient curve="monotone" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useId, useState, useCallback } from 'react';
import { area, line as d3Line, curveBasis, curveCardinal, curveCatmullRom, curveLinear, curveMonotoneX, curveNatural, curveStep } from 'd3-shape';
import { useChartContext, useCartesianContext } from '@viskit/core';
import type { BaseSeriesProps } from '@viskit/core';

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

export interface AreaSeriesProps<TDatum = Record<string, unknown>>
  extends BaseSeriesProps<TDatum> {
  /** Curve interpolation (default: 'linear') */
  curve?: CurveType;
  /** Stroke width for the top edge line */
  strokeWidth?: number;
}

export function AreaSeries<TDatum extends Record<string, unknown>>({
  field,
  curve = 'linear',
  color,
  opacity = 0.3,
  gradient = false,
  strokeWidth = 2,
  'aria-label': ariaLabel,
}: AreaSeriesProps<TDatum>) {
  const { data, colorScale } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const gradientId = useId();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleDotEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleDotLeave = useCallback(() => setHoveredIndex(null), []);

  const resolvedColor = color ?? colorScale(field as string);

  // Build the SVG area path
  const pathData = useMemo(() => {
    const curveFactory = CURVE_MAP[curve];

    const areaGenerator = area<TDatum>()
      .x((_d, i) => {
        const domainValue = xScale.domain[i];
        return (xScale.scale(domainValue) as number) + (xScale.bandwidth ? xScale.bandwidth / 2 : 0);
      })
      .y0(() => yScale.scale(0 as unknown) as number)
      .y1((d) => yScale.scale(d[field] as unknown) as number)
      .curve(curveFactory);

    areaGenerator.defined((d) => d[field] != null && !Number.isNaN(Number(d[field])));

    return areaGenerator(data as TDatum[]) ?? '';
  }, [data, field, curve, xScale, yScale]);

  // Top edge line (separate from area fill)
  const linePathData = useMemo(() => {
    const curveFactory = CURVE_MAP[curve];
    const lineGenerator = d3Line<TDatum>()
      .x((_d, i) => {
        const domainValue = xScale.domain[i];
        return (xScale.scale(domainValue) as number) + (xScale.bandwidth ? xScale.bandwidth / 2 : 0);
      })
      .y((d) => yScale.scale(d[field] as unknown) as number)
      .curve(curveFactory);
    lineGenerator.defined((d) => d[field] != null && !Number.isNaN(Number(d[field])));
    return lineGenerator(data as TDatum[]) ?? '';
  }, [data, field, curve, xScale, yScale]);

  // Dot positions for hover
  const dotPositions = useMemo(() => {
    return (data as TDatum[]).map((d, i) => {
      const domainValue = xScale.domain[i];
      return {
        x: (xScale.scale(domainValue) as number) + (xScale.bandwidth ? xScale.bandwidth / 2 : 0),
        y: yScale.scale(d[field] as unknown) as number,
        datum: d,
      };
    }).filter((pt) => !Number.isNaN(pt.x) && !Number.isNaN(pt.y));
  }, [data, field, xScale, yScale]);

  return (
    <g
      aria-label={ariaLabel ?? `${field as string} area`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setHoveredIndex(null); }}
      style={{ cursor: 'pointer' }}
    >
      {/* Gradient definition — only rendered when gradient is enabled */}
      {gradient && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="0" y1="0"
            x2="0" y2="1"
          >
            <stop offset="0%" stopColor={resolvedColor} stopOpacity={0.4} />
            <stop offset="100%" stopColor={resolvedColor} stopOpacity={0} />
          </linearGradient>
        </defs>
      )}

      {/* Filled area */}
      <path
        d={pathData}
        fill={gradient ? `url(#${gradientId})` : resolvedColor}
        opacity={gradient ? (isHovered ? 1 : 0.85) : (isHovered ? opacity + 0.1 : opacity)}
        style={{ transition: 'opacity 200ms ease' }}
      />

      {/* Top edge line */}
      <path
        d={linePathData}
        fill="none"
        stroke={resolvedColor}
        strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'stroke-width 200ms ease' }}
      />

      {/* Hover dots */}
      {isHovered && dotPositions.map((pt, i) => {
        const isActive = hoveredIndex === i;
        return (
          <g key={i}>
            {isActive && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={8}
                fill="none"
                stroke={resolvedColor}
                strokeWidth={1.5}
                opacity={0.3}
              />
            )}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={isActive ? 5 : 3}
              fill={isActive ? '#fff' : resolvedColor}
              stroke={isActive ? resolvedColor : '#fff'}
              strokeWidth={isActive ? 2.5 : 1.5}
              onMouseEnter={() => handleDotEnter(i)}
              onMouseLeave={handleDotLeave}
              style={{ transition: 'r 150ms ease' }}
            />
            {isActive && (
              <text
                x={pt.x}
                y={pt.y - 14}
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
