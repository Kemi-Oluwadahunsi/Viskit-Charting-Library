// ─────────────────────────────────────────────────
// <SlopeSeries> — Before/after comparison
// ─────────────────────────────────────────────────
// Renders lines connecting two vertical axes showing
// how values changed from one state to another.
// Great for before/after or period-over-period comparison.
//
// Usage:
//   <Chart data={comparisonData} height={400}>
//     <SlopeSeries startField="before" endField="after" nameField="label" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { scaleLinear } from 'd3-scale';
import { useChartContext } from '@viskit/core';

export interface SlopeSeriesProps<TDatum = Record<string, unknown>> {
  /** Numeric field for the start (left) value */
  startField: keyof TDatum & string;
  /** Numeric field for the end (right) value */
  endField: keyof TDatum & string;
  /** Field for the line label */
  nameField?: keyof TDatum & string;
  /** Horizontal padding from edges in px (default: 60) */
  gutterWidth?: number;
  /** Dot radius (default: 5) */
  dotRadius?: number;
  /** Line stroke width (default: 2) */
  strokeWidth?: number;
  /** Opacity 0–1 (default: 0.8) */
  opacity?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function SlopeSeries<TDatum extends Record<string, unknown>>({
  startField,
  endField,
  nameField,
  gutterWidth = 60,
  dotRadius = 5,
  strokeWidth = 2,
  opacity = 0.8,
  'aria-label': ariaLabel,
}: SlopeSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const slopes = useMemo(() => {
    const typedData = data as TDatum[];
    const leftX = gutterWidth;
    const rightX = innerWidth - gutterWidth;

    // Compute global value range across both fields
    const allValues = typedData.flatMap((d) => [
      Number(d[startField]) || 0,
      Number(d[endField]) || 0,
    ]);
    const vMin = Math.min(...allValues);
    const vMax = Math.max(...allValues);

    const yScale = scaleLinear()
      .domain([vMin, vMax])
      .range([innerHeight - 20, 20])
      .nice();

    return typedData.map((d, i) => {
      const startVal = Number(d[startField]) || 0;
      const endVal = Number(d[endField]) || 0;
      const name = nameField ? String(d[nameField]) : `Series ${i + 1}`;
      const color = colorScale(name);
      const increased = endVal >= startVal;

      return {
        leftX,
        rightX,
        y1: yScale(startVal),
        y2: yScale(endVal),
        startVal,
        endVal,
        name,
        color,
        increased,
      };
    });
  }, [data, startField, endField, nameField, gutterWidth, innerWidth, innerHeight, colorScale]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Slope chart'}>
      {/* Axis lines */}
      <line
        x1={slopes[0]?.leftX ?? 0}
        y1={0}
        x2={slopes[0]?.leftX ?? 0}
        y2={innerHeight}
        stroke="#475569"
        strokeWidth={1}
        opacity={0.4}
      />
      <line
        x1={slopes[0]?.rightX ?? innerWidth}
        y1={0}
        x2={slopes[0]?.rightX ?? innerWidth}
        y2={innerHeight}
        stroke="#475569"
        strokeWidth={1}
        opacity={0.4}
      />

      {/* Column headers */}
      <text x={slopes[0]?.leftX ?? 0} y={8} textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight={600}>
        {startField as string}
      </text>
      <text x={slopes[0]?.rightX ?? innerWidth} y={8} textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight={600}>
        {endField as string}
      </text>

      {/* Slope lines */}
      {slopes.map((s, i) => {
        const isActive = hovered === i;
        const dimmed = hovered !== null && !isActive;

        return (
          <g
            key={i}
            role="listitem"
            aria-label={`${s.name}: ${s.startVal} → ${s.endVal}`}
            tabIndex={0}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
            style={{ cursor: 'pointer' }}
          >
            {/* Connection line */}
            <line
              x1={s.leftX}
              y1={s.y1}
              x2={s.rightX}
              y2={s.y2}
              stroke={s.color}
              strokeWidth={isActive ? strokeWidth + 1 : strokeWidth}
              opacity={dimmed ? opacity * 0.15 : opacity}
              style={{ transition: 'opacity 200ms ease' }}
            />
            {/* Start dot */}
            <circle
              cx={s.leftX}
              cy={s.y1}
              r={isActive ? dotRadius + 2 : dotRadius}
              fill={s.color}
              opacity={dimmed ? 0.2 : 1}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 2 : 0}
            />
            {/* End dot */}
            <circle
              cx={s.rightX}
              cy={s.y2}
              r={isActive ? dotRadius + 2 : dotRadius}
              fill={s.color}
              opacity={dimmed ? 0.2 : 1}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 2 : 0}
            />
            {/* Labels */}
            <text
              x={s.leftX - 8}
              y={s.y1}
              textAnchor="end"
              dominantBaseline="central"
              fill={dimmed ? '#475569' : s.color}
              fontSize={11}
              fontWeight={isActive ? 700 : 500}
              style={{ pointerEvents: 'none', transition: 'fill 200ms ease' }}
            >
              {s.startVal}
            </text>
            <text
              x={s.rightX + 8}
              y={s.y2}
              textAnchor="start"
              dominantBaseline="central"
              fill={dimmed ? '#475569' : s.color}
              fontSize={11}
              fontWeight={isActive ? 700 : 500}
              style={{ pointerEvents: 'none', transition: 'fill 200ms ease' }}
            >
              {s.endVal}
            </text>
            {/* Name label on the right */}
            {isActive && (
              <text
                x={s.rightX + 8}
                y={s.y2 - 14}
                textAnchor="start"
                fill={s.color}
                fontSize={10}
                fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                {s.name} {s.increased ? '↑' : '↓'}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
