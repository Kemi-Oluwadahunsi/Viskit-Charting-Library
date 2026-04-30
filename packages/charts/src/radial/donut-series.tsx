// ─────────────────────────────────────────────────
// <DonutSeries> — Dedicated donut chart (wraps PieSeries)
// ─────────────────────────────────────────────────
// A convenience component that renders a donut chart
// with a configurable thickness, optional center label,
// and all the features of PieSeries.
//
// Usage:
//   <Chart data={data} height={400}>
//     <DonutSeries field="value" nameField="label" centerLabel="Total" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { pie as d3Pie, arc as d3Arc } from 'd3-shape';
import { useChartContext } from '@kodemaven/viskit-core';

export interface DonutSeriesProps<TDatum = Record<string, unknown>> {
  /** Numeric field for segment size */
  field: keyof TDatum & string;
  /** Field for the label/name of each segment */
  nameField?: keyof TDatum & string;
  /** Donut thickness as a ratio of outer radius (default: 0.35) */
  thickness?: number;
  /** Text to show in the center of the donut */
  centerLabel?: string;
  /** Gap between segments in radians (default: 0.03) */
  padAngle?: number;
  /** Corner rounding on arc segments (default: 3) */
  cornerRadius?: number;
  /** Opacity 0–1 (default: 1) */
  opacity?: number;
  /** Override fill color for all segments */
  color?: string;
  /** ARIA label */
  'aria-label'?: string;
}

export function DonutSeries<TDatum extends Record<string, unknown>>({
  field,
  nameField,
  thickness = 0.35,
  centerLabel,
  padAngle = 0.03,
  cornerRadius = 3,
  opacity = 1,
  color,
  'aria-label': ariaLabel,
}: DonutSeriesProps<TDatum>) {
  const { data, colorScale, dimensions } = useChartContext<TDatum>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  const cx = dimensions.innerWidth / 2;
  const cy = dimensions.innerHeight / 2;
  const maxRadius = Math.min(cx, cy);
  const outerR = maxRadius * 0.85;
  const innerR = outerR * (1 - thickness);
  const hoverOuterR = outerR + 6;

  const { arcs, total } = useMemo(() => {
    const pieLayout = d3Pie<TDatum>()
      .value((d) => Number(d[field]) || 0)
      .padAngle(padAngle)
      .sort(null);

    const arcGen = d3Arc<unknown, { startAngle: number; endAngle: number }>()
      .innerRadius(innerR)
      .outerRadius(outerR)
      .cornerRadius(cornerRadius);

    const hoverArcGen = d3Arc<unknown, { startAngle: number; endAngle: number }>()
      .innerRadius(innerR)
      .outerRadius(hoverOuterR)
      .cornerRadius(cornerRadius);

    const centroidGen = d3Arc<unknown, { startAngle: number; endAngle: number }>()
      .innerRadius((innerR + outerR) / 2)
      .outerRadius((innerR + outerR) / 2);

    const total = (data as TDatum[]).reduce(
      (sum, d) => sum + (Number(d[field]) || 0),
      0,
    );

    const arcs = pieLayout(data as TDatum[]).map((slice, i) => {
      const name = nameField
        ? String((slice.data as TDatum)[nameField])
        : `Segment ${i + 1}`;
      const centroid = centroidGen.centroid(slice);

      return {
        path: arcGen(slice) ?? '',
        hoverPath: hoverArcGen(slice) ?? '',
        color: color ?? colorScale(name),
        label: name,
        value: slice.value,
        percent: total > 0 ? ((slice.value / total) * 100).toFixed(1) : '0',
        centroidX: centroid[0],
        centroidY: centroid[1],
      };
    });

    return { arcs, total };
  }, [data, field, nameField, color, colorScale, innerR, outerR, hoverOuterR, padAngle, cornerRadius]);

  return (
    <g
      transform={`translate(${cx}, ${cy})`}
      role="list"
      aria-label={ariaLabel ?? `${field as string} donut chart`}
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
                filter: isActive ? `drop-shadow(0 0 6px ${arc.color})` : 'none',
              }}
            />
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

      {/* Center content */}
      <g style={{ pointerEvents: 'none' }}>
        {centerLabel && hoveredIndex === null && (
          <>
            <text
              textAnchor="middle"
              dominantBaseline="central"
              y={-10}
              fill="#94A3B8"
              fontSize={12}
            >
              {centerLabel}
            </text>
            <text
              textAnchor="middle"
              dominantBaseline="central"
              y={12}
              fill="#fff"
              fontSize={18}
              fontWeight={700}
            >
              {total.toLocaleString()}
            </text>
          </>
        )}
        {hoveredIndex !== null && arcs[hoveredIndex] && (
          <>
            <text
              textAnchor="middle"
              dominantBaseline="central"
              y={-10}
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
              fill="#94A3B8"
              fontSize={12}
            >
              {arcs[hoveredIndex].value.toLocaleString()} ({arcs[hoveredIndex].percent}%)
            </text>
          </>
        )}
      </g>
    </g>
  );
}
