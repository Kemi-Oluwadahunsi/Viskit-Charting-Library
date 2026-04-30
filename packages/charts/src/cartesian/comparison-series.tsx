// ─────────────────────────────────────────────────
// <ComparisonSeries> — Tornado / butterfly comparison
// ─────────────────────────────────────────────────
// Renders side-by-side horizontal bars mirrored around
// a center axis for comparing two metrics. Similar to
// DivergingBarSeries but styled as a tornado/butterfly
// chart with header labels and metric comparison.
//
// Usage:
//   <Chart data={data} height={400}>
//     <ComparisonSeries leftField="2023" rightField="2024" nameField="category" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { useChartContext } from '@kodemaven/viskit-core';

export interface ComparisonSeriesProps<TDatum = Record<string, unknown>> {
  /** Field for left-side values */
  leftField: keyof TDatum & string;
  /** Field for right-side values */
  rightField: keyof TDatum & string;
  /** Field for row labels */
  nameField?: keyof TDatum & string;
  /** Color for left bars */
  leftColor?: string;
  /** Color for right bars */
  rightColor?: string;
  /** Bar padding ratio (default: 0.25) */
  barPadding?: number;
  /** Corner radius (default: 3) */
  radius?: number;
  /** Opacity 0–1 (default: 1) */
  opacity?: number;
  /** Show value labels on bars (default: true) */
  showValues?: boolean;
  /** ARIA label */
  'aria-label'?: string;
}

export function ComparisonSeries<TDatum extends Record<string, unknown>>({
  leftField,
  rightField,
  nameField,
  leftColor,
  rightColor,
  barPadding = 0.25,
  radius = 3,
  opacity = 1,
  showValues = true,
  'aria-label': ariaLabel,
}: ComparisonSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;
  const labelWidth = Math.min(innerWidth * 0.18, 80);
  const barAreaWidth = (innerWidth - labelWidth) / 2;

  const resolvedLeftColor = leftColor ?? colorScale(leftField);
  const resolvedRightColor = rightColor ?? colorScale(rightField);

  const bars = useMemo(() => {
    const typedData = data as TDatum[];
    if (typedData.length === 0) return [];

    const names = typedData.map((d, i) =>
      nameField ? String(d[nameField]) : `Row ${i + 1}`,
    );

    const leftValues = typedData.map((d) => Number(d[leftField]) || 0);
    const rightValues = typedData.map((d) => Number(d[rightField]) || 0);
    const maxVal = Math.max(...leftValues, ...rightValues, 1);

    const yScale = scaleBand<string>()
      .domain(names)
      .range([0, innerHeight])
      .padding(barPadding);

    const xScale = scaleLinear()
      .domain([0, maxVal])
      .range([0, barAreaWidth - 8]);

    const centerX = innerWidth / 2;

    return typedData.map((d, i) => {
      const name = names[i]!;
      const leftVal = leftValues[i]!;
      const rightVal = rightValues[i]!;
      const y = yScale(name) ?? 0;
      const h = yScale.bandwidth();
      const leftW = xScale(leftVal);
      const rightW = xScale(rightVal);

      return {
        name,
        leftVal,
        rightVal,
        y,
        height: h,
        leftX: centerX - labelWidth / 2 - leftW,
        leftWidth: leftW,
        rightX: centerX + labelWidth / 2,
        rightWidth: rightW,
        centerX,
        datum: d,
      };
    });
  }, [data, leftField, rightField, nameField, barPadding, innerWidth, innerHeight, barAreaWidth, labelWidth]);

  const centerX = innerWidth / 2;

  return (
    <g
      role="list"
      aria-label={ariaLabel ?? 'Comparison chart'}
    >
      {/* Column headers */}
      <text
        x={centerX - labelWidth / 2 - barAreaWidth / 2}
        y={-8}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill={resolvedLeftColor}
      >
        {String(leftField)}
      </text>
      <text
        x={centerX + labelWidth / 2 + barAreaWidth / 2}
        y={-8}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill={resolvedRightColor}
      >
        {String(rightField)}
      </text>

      {bars.map((bar, i) => (
        <g
          key={bar.name}
          role="listitem"
          aria-label={`${bar.name}: ${leftField} ${bar.leftVal}, ${rightField} ${bar.rightVal}`}
          onMouseEnter={() => handleEnter(i)}
          onMouseLeave={handleLeave}
          style={{ cursor: 'pointer' }}
        >
          {/* Left bar */}
          <rect
            x={bar.leftX}
            y={bar.y}
            width={Math.max(0, bar.leftWidth)}
            height={bar.height}
            rx={radius}
            ry={radius}
            fill={resolvedLeftColor}
            opacity={hovered === null || hovered === i ? opacity : opacity * 0.4}
            stroke={hovered === i ? '#fff' : 'none'}
            strokeWidth={hovered === i ? 1.5 : 0}
          />

          {/* Right bar */}
          <rect
            x={bar.rightX}
            y={bar.y}
            width={Math.max(0, bar.rightWidth)}
            height={bar.height}
            rx={radius}
            ry={radius}
            fill={resolvedRightColor}
            opacity={hovered === null || hovered === i ? opacity : opacity * 0.4}
            stroke={hovered === i ? '#fff' : 'none'}
            strokeWidth={hovered === i ? 1.5 : 0}
          />

          {/* Center label */}
          <text
            x={centerX}
            y={bar.y + bar.height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10}
            fontWeight={500}
            fill="#CBD5E1"
            pointerEvents="none"
          >
            {bar.name}
          </text>

          {/* Value labels */}
          {showValues && bar.leftWidth > 24 && (
            <text
              x={bar.leftX + 6}
              y={bar.y + bar.height / 2}
              textAnchor="start"
              dominantBaseline="central"
              fontSize={9}
              fontWeight={600}
              fill="#fff"
              pointerEvents="none"
            >
              {bar.leftVal}
            </text>
          )}
          {showValues && bar.rightWidth > 24 && (
            <text
              x={bar.rightX + bar.rightWidth - 6}
              y={bar.y + bar.height / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontSize={9}
              fontWeight={600}
              fill="#fff"
              pointerEvents="none"
            >
              {bar.rightVal}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}
