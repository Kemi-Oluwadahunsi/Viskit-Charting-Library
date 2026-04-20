// ─────────────────────────────────────────────────
// <PieSeries> — Pie / Donut chart series
// ─────────────────────────────────────────────────
// Renders arcs for each datum using d3-shape's pie
// layout. Set innerRadius > 0 for a donut chart.
//
// Usage:
//   <Chart data={data}>
//     <PieSeries field="value" nameField="label" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { pie as d3Pie, arc as d3Arc } from 'd3-shape';
import { useChartContext } from '@viskit/core';
import type { BaseSeriesProps } from '@viskit/core';

export interface PieSeriesProps<TDatum = Record<string, unknown>>
  extends BaseSeriesProps<TDatum> {
  /** Field for the label/name of each segment */
  nameField?: keyof TDatum & string;
  /** Inner radius ratio (0–1). 0 = full pie, >0 = donut */
  innerRadius?: number;
  /** Outer radius ratio (0–1, default: 0.8) */
  outerRadius?: number;
  /** Gap between segments in degrees */
  padAngle?: number;
  /** Corner rounding on arc segments */
  cornerRadius?: number;
}

export function PieSeries<TDatum extends Record<string, unknown>>({
  field,
  nameField,
  color,
  innerRadius = 0,
  outerRadius = 0.8,
  padAngle = 0.02,
  cornerRadius = 2,
  opacity = 1,
  'aria-label': ariaLabel,
}: PieSeriesProps<TDatum>) {
  const { data, colorScale, dimensions } = useChartContext<TDatum>();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const handleEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  // Center and radius calculations
  const cx = dimensions.innerWidth / 2;
  const cy = dimensions.innerHeight / 2;
  const maxRadius = Math.min(cx, cy);
  const resolvedOuter = maxRadius * outerRadius;
  const resolvedInner = maxRadius * innerRadius;
  const hoverOuter = resolvedOuter + 8; // expanded radius on hover

  const arcs = useMemo(() => {
    const pieLayout = d3Pie<TDatum>()
      .value((d) => Number(d[field]) || 0)
      .padAngle(padAngle)
      .sort(null); // Preserve data order

    const arcGenerator = d3Arc<unknown, { startAngle: number; endAngle: number }>()
      .innerRadius(resolvedInner)
      .outerRadius(resolvedOuter)
      .cornerRadius(cornerRadius);

    const hoverArcGenerator = d3Arc<unknown, { startAngle: number; endAngle: number }>()
      .innerRadius(resolvedInner)
      .outerRadius(hoverOuter)
      .cornerRadius(cornerRadius);

    // Centroid generator for label positioning
    const centroidGenerator = d3Arc<unknown, { startAngle: number; endAngle: number }>()
      .innerRadius((resolvedInner + hoverOuter) / 2)
      .outerRadius((resolvedInner + hoverOuter) / 2);

    const total = (data as TDatum[]).reduce(
      (sum, d) => sum + (Number(d[field]) || 0),
      0,
    );

    return pieLayout(data as TDatum[]).map((slice, i) => {
      const name = nameField
        ? String((slice.data as TDatum)[nameField])
        : `Segment ${i + 1}`;

      const centroid = centroidGenerator.centroid(slice);

      return {
        path: arcGenerator(slice) ?? '',
        hoverPath: hoverArcGenerator(slice) ?? '',
        color: color ?? colorScale(name),
        label: name,
        value: slice.value,
        percent: total > 0 ? ((slice.value / total) * 100).toFixed(1) : '0',
        datum: slice.data,
        centroidX: centroid[0],
        centroidY: centroid[1],
      };
    });
  }, [data, field, nameField, color, colorScale, resolvedInner, resolvedOuter, hoverOuter, padAngle, cornerRadius]);

  return (
    <g
      transform={`translate(${cx}, ${cy})`}
      role="list"
      aria-label={ariaLabel ?? `${field as string} pie`}
    >
      {arcs.map((arc, i) => {
        const isActive = hoveredIndex === i;
        const arcOpacity =
          hoveredIndex !== null && !isActive ? opacity * 0.4 : opacity;

        return (
          <g key={i}>
            <path
              d={isActive ? arc.hoverPath : arc.path}
              fill={arc.color}
              opacity={arcOpacity}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 2 : 0}
              role="listitem"
              aria-label={`${arc.label}: ${arc.value}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{
                cursor: 'pointer',
                transition: 'd 250ms ease, opacity 200ms ease',
                filter: isActive
                  ? `drop-shadow(0 0 6px ${arc.color})`
                  : 'none',
              }}
            />
            {/* Value label on hover */}
            {isActive && (
              <text
                x={arc.centroidX}
                y={arc.centroidY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize={11}
                fontWeight={700}
                style={{
                  pointerEvents: 'none',
                  textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                }}
              >
                {arc.percent}%
              </text>
            )}
          </g>
        );
      })}
      {/* Center donut label */}
      {innerRadius > 0 && hoveredIndex !== null && arcs[hoveredIndex] && (
        <g style={{ pointerEvents: 'none' }}>
          <text
            textAnchor="middle"
            dominantBaseline="central"
            y={-8}
            fill="#fff"
            fontSize={14}
            fontWeight={700}
          >
            {arcs[hoveredIndex].label}
          </text>
          <text
            textAnchor="middle"
            dominantBaseline="central"
            y={12}
            fill="#aaa"
            fontSize={12}
          >
            {arcs[hoveredIndex].value.toLocaleString()}
          </text>
        </g>
      )}
    </g>
  );
}
