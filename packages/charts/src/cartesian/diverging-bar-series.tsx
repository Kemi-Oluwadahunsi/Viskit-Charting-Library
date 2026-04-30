// ─────────────────────────────────────────────────
// <DivergingBarSeries> — Bars extending both directions
// ─────────────────────────────────────────────────
// Renders horizontal bars that extend left (negative)
// and right (positive) from a center axis. Perfect
// for population pyramids, survey results, or any
// data with two opposing measures.
//
// Usage:
//   <Chart data={data} height={400}>
//     <DivergingBarSeries positiveField="male" negativeField="female" nameField="ageGroup" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { useChartContext } from '@kodemaven/viskit-core';

export interface DivergingBarSeriesProps<TDatum = Record<string, unknown>> {
  /** Field for positive (right-side) values */
  positiveField: keyof TDatum & string;
  /** Field for negative (left-side) values */
  negativeField: keyof TDatum & string;
  /** Field for row labels */
  nameField?: keyof TDatum & string;
  /** Color for positive bars */
  positiveColor?: string;
  /** Color for negative bars */
  negativeColor?: string;
  /** Bar padding ratio (default: 0.2) */
  barPadding?: number;
  /** Corner radius (default: 3) */
  radius?: number;
  /** Opacity 0–1 (default: 1) */
  opacity?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function DivergingBarSeries<TDatum extends Record<string, unknown>>({
  positiveField,
  negativeField,
  nameField,
  positiveColor,
  negativeColor,
  barPadding = 0.2,
  radius = 3,
  opacity = 1,
  'aria-label': ariaLabel,
}: DivergingBarSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;
  const cx = innerWidth / 2;

  const resolvedPosColor = positiveColor ?? colorScale(positiveField);
  const resolvedNegColor = negativeColor ?? colorScale(negativeField);

  const bars = useMemo(() => {
    const typedData = data as TDatum[];
    if (typedData.length === 0) return { items: [], maxVal: 0, yScale: null as ReturnType<typeof scaleBand<string>> | null };

    const names = typedData.map((d, i) =>
      nameField ? String(d[nameField]) : `Row ${i + 1}`,
    );

    const posValues = typedData.map((d) => Math.abs(Number(d[positiveField]) || 0));
    const negValues = typedData.map((d) => Math.abs(Number(d[negativeField]) || 0));
    const maxVal = Math.max(...posValues, ...negValues, 1);

    const yScale = scaleBand<string>()
      .domain(names)
      .range([0, innerHeight])
      .padding(barPadding);

    const xScale = scaleLinear()
      .domain([0, maxVal])
      .range([0, cx - 4]);

    const items = typedData.map((d, i) => {
      const name = names[i]!;
      const posVal = Math.abs(Number(d[positiveField]) || 0);
      const negVal = Math.abs(Number(d[negativeField]) || 0);
      const y = yScale(name) ?? 0;
      const h = yScale.bandwidth();

      return {
        name,
        posVal,
        negVal,
        y,
        height: h,
        posWidth: xScale(posVal),
        negWidth: xScale(negVal),
        datum: d,
      };
    });

    return { items, maxVal, yScale };
  }, [data, positiveField, negativeField, nameField, barPadding, innerWidth, innerHeight, cx]);

  return (
    <g
      role="list"
      aria-label={ariaLabel ?? 'Diverging bar chart'}
    >
      {/* Center axis line */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={innerHeight}
        stroke="#94A3B8"
        strokeWidth={1}
        strokeDasharray="4,4"
      />

      {bars.items.map((bar, i) => (
        <g
          key={bar.name}
          role="listitem"
          aria-label={`${bar.name}: ${negativeField} ${bar.negVal}, ${positiveField} ${bar.posVal}`}
          onMouseEnter={() => handleEnter(i)}
          onMouseLeave={handleLeave}
          style={{ cursor: 'pointer' }}
        >
          {/* Negative (left) bar */}
          <rect
            x={cx - bar.negWidth}
            y={bar.y}
            width={Math.max(0, bar.negWidth)}
            height={bar.height}
            rx={radius}
            ry={radius}
            fill={resolvedNegColor}
            opacity={hovered === null || hovered === i ? opacity : opacity * 0.4}
            stroke={hovered === i ? '#fff' : 'none'}
            strokeWidth={hovered === i ? 1.5 : 0}
          />

          {/* Positive (right) bar */}
          <rect
            x={cx}
            y={bar.y}
            width={Math.max(0, bar.posWidth)}
            height={bar.height}
            rx={radius}
            ry={radius}
            fill={resolvedPosColor}
            opacity={hovered === null || hovered === i ? opacity : opacity * 0.4}
            stroke={hovered === i ? '#fff' : 'none'}
            strokeWidth={hovered === i ? 1.5 : 0}
          />

          {/* Row label (left-aligned) */}
          <text
            x={cx - bar.negWidth - 6}
            y={bar.y + bar.height / 2}
            textAnchor="end"
            dominantBaseline="central"
            fontSize={10}
            fill="#94A3B8"
            pointerEvents="none"
          >
            {bar.name}
          </text>

          {/* Positive value label */}
          {bar.posWidth > 30 && (
            <text
              x={cx + bar.posWidth - 4}
              y={bar.y + bar.height / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontSize={9}
              fill="#fff"
              fontWeight={600}
              pointerEvents="none"
            >
              {bar.posVal}
            </text>
          )}

          {/* Negative value label */}
          {bar.negWidth > 30 && (
            <text
              x={cx - bar.negWidth + 4}
              y={bar.y + bar.height / 2}
              textAnchor="start"
              dominantBaseline="central"
              fontSize={9}
              fill="#fff"
              fontWeight={600}
              pointerEvents="none"
            >
              {bar.negVal}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}
