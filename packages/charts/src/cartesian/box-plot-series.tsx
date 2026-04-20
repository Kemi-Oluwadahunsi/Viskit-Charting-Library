// ─────────────────────────────────────────────────
// <BoxPlotSeries> — Quartile distribution (box + whiskers)
// ─────────────────────────────────────────────────
// Renders box-and-whisker plots showing distribution:
// median, Q1–Q3 box, whiskers, and optional outliers.
//
// Data should have pre-computed statistics per group:
//   { group: 'A', min: 10, q1: 25, median: 35, q3: 45, max: 60 }
//
// Usage:
//   <Chart data={statData} height={400}>
//     <BoxPlotSeries
//       field="median" groupField="group"
//       minField="min" q1Field="q1" q3Field="q3" maxField="max"
//     />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { useChartContext, useCartesianContext } from '@viskit/core';

export interface BoxPlotSeriesProps<TDatum = Record<string, unknown>> {
  /** Field for the median value */
  field: keyof TDatum & string;
  /** Field for the minimum (lower whisker) */
  minField: keyof TDatum & string;
  /** Field for Q1 (25th percentile) */
  q1Field: keyof TDatum & string;
  /** Field for Q3 (75th percentile) */
  q3Field: keyof TDatum & string;
  /** Field for the maximum (upper whisker) */
  maxField: keyof TDatum & string;
  /** Override fill color */
  color?: string;
  /** Width ratio of box to band (0–1, default: 0.5) */
  boxWidth?: number;
  /** Whisker cap width ratio (0–1, default: 0.3) */
  capWidth?: number;
  /** Opacity 0–1 (default: 0.85) */
  opacity?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function BoxPlotSeries<TDatum extends Record<string, unknown>>({
  field,
  minField,
  q1Field,
  q3Field,
  maxField,
  color,
  boxWidth = 0.5,
  capWidth = 0.3,
  opacity = 0.85,
  'aria-label': ariaLabel,
}: BoxPlotSeriesProps<TDatum>) {
  const { data, colorScale } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const resolvedColor = color ?? colorScale(field as string);

  const boxes = useMemo(() => {
    const typedData = data as TDatum[];
    const bandwidth = xScale.bandwidth ?? 20;
    const bw = bandwidth * boxWidth;
    const cw = bandwidth * capWidth;

    return typedData.map((d, i) => {
      const median = Number(d[field]) || 0;
      const min = Number(d[minField]) || 0;
      const q1 = Number(d[q1Field]) || 0;
      const q3 = Number(d[q3Field]) || 0;
      const max = Number(d[maxField]) || 0;

      const domainValue = xScale.domain[i];
      const xBase = xScale.scale(domainValue) as number;
      const xCenter = xBase + bandwidth / 2;

      const yMin = yScale.scale(min as unknown) as number;
      const yQ1 = yScale.scale(q1 as unknown) as number;
      const yMedian = yScale.scale(median as unknown) as number;
      const yQ3 = yScale.scale(q3 as unknown) as number;
      const yMax = yScale.scale(max as unknown) as number;

      return {
        xCenter,
        boxX: xCenter - bw / 2,
        boxW: bw,
        capHalfW: cw / 2,
        yMin,
        yQ1,
        yMedian,
        yQ3,
        yMax,
        median,
        min,
        q1,
        q3,
        max,
      };
    });
  }, [data, field, minField, q1Field, q3Field, maxField, xScale, yScale, boxWidth, capWidth]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Box plot'}>
      {boxes.map((b, i) => {
        const isActive = hovered === i;
        const fillOpacity = hovered !== null && !isActive ? opacity * 0.35 : opacity;

        return (
          <g
            key={i}
            role="listitem"
            aria-label={`Min:${b.min} Q1:${b.q1} Med:${b.median} Q3:${b.q3} Max:${b.max}`}
            tabIndex={0}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
            style={{ cursor: 'pointer' }}
          >
            {/* Whisker line (min to max) */}
            <line
              x1={b.xCenter}
              y1={b.yMax}
              x2={b.xCenter}
              y2={b.yMin}
              stroke={resolvedColor}
              strokeWidth={1.5}
              opacity={fillOpacity}
            />
            {/* Max cap */}
            <line
              x1={b.xCenter - b.capHalfW}
              y1={b.yMax}
              x2={b.xCenter + b.capHalfW}
              y2={b.yMax}
              stroke={resolvedColor}
              strokeWidth={2}
              opacity={fillOpacity}
            />
            {/* Min cap */}
            <line
              x1={b.xCenter - b.capHalfW}
              y1={b.yMin}
              x2={b.xCenter + b.capHalfW}
              y2={b.yMin}
              stroke={resolvedColor}
              strokeWidth={2}
              opacity={fillOpacity}
            />
            {/* IQR box (Q1 to Q3) */}
            <rect
              x={b.boxX}
              y={b.yQ3}
              width={b.boxW}
              height={Math.max(1, b.yQ1 - b.yQ3)}
              fill={resolvedColor}
              opacity={fillOpacity}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 2 : 0}
              rx={2}
            />
            {/* Median line */}
            <line
              x1={b.boxX}
              y1={b.yMedian}
              x2={b.boxX + b.boxW}
              y2={b.yMedian}
              stroke="#fff"
              strokeWidth={2}
              opacity={fillOpacity}
            />
            {/* Hover label */}
            {isActive && (
              <text
                x={b.xCenter}
                y={b.yMax - 10}
                textAnchor="middle"
                fill={resolvedColor}
                fontSize={10}
                fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                {`Med: ${b.median}`}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
