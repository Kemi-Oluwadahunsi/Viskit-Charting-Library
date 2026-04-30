// ─────────────────────────────────────────────────
// <ViolinSeries> — Kernel density distribution shape
// ─────────────────────────────────────────────────
// Renders symmetric violin shapes showing the density
// distribution of values per category. Uses a simple
// Gaussian kernel density estimator.
//
// Data should have pre-computed density points:
//   { group: 'A', value: 35, density: 0.04 }
//
// Usage:
//   <Chart data={densityData} height={400}>
//     <ViolinSeries field="value" densityField="density" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { area as d3Area, curveCatmullRom } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { useChartContext, useCartesianContext } from '@kodemaven/viskit-core';

export interface ViolinSeriesProps<TDatum = Record<string, unknown>> {
  /** Numeric field for the value axis */
  field: keyof TDatum & string;
  /** Numeric field for the density at each value */
  densityField: keyof TDatum & string;
  /** Override fill color */
  color?: string;
  /** Width ratio of violin to band (0–1, default: 0.7) */
  violinWidth?: number;
  /** Opacity 0–1 (default: 0.7) */
  opacity?: number;
  /** Show median line (default: true) */
  showMedian?: boolean;
  /** ARIA label */
  'aria-label'?: string;
}

export function ViolinSeries<TDatum extends Record<string, unknown>>({
  field,
  densityField,
  color,
  violinWidth = 0.7,
  opacity = 0.7,
  showMedian = true,
  'aria-label': ariaLabel,
}: ViolinSeriesProps<TDatum>) {
  const { data, colorScale } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const resolvedColor = color ?? colorScale(field as string);

  const violins = useMemo(() => {
    const typedData = data as TDatum[];
    const bandwidth = xScale.bandwidth ?? 20;
    const halfW = (bandwidth * violinWidth) / 2;

    // Group data points by their x domain category
    const groups = new Map<string, Array<{ value: number; density: number }>>();
    typedData.forEach((d) => {
      // Find which category this datum belongs to
      const keys = Object.keys(d as Record<string, unknown>);
      const catField = keys.find((k) => typeof (d as Record<string, unknown>)[k] === 'string');
      const cat = catField ? String((d as Record<string, unknown>)[catField!]) : '';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push({
        value: Number(d[field]) || 0,
        density: Number(d[densityField]) || 0,
      });
    });

    return [...groups.entries()].map(([cat, points], groupIdx) => {
      const catIndex = xScale.domain.indexOf(cat as never);
      if (catIndex === -1) return null;

      const xCenter = (xScale.scale(xScale.domain[catIndex]) as number) + bandwidth / 2;

      // Find max density for scaling
      const maxDensity = Math.max(...points.map((p) => p.density));
      const densityScale = scaleLinear()
        .domain([0, maxDensity || 1])
        .range([0, halfW]);

      // Sort by value for path generation
      const sorted = [...points].sort((a, b) => a.value - b.value);

      const areaGen = d3Area<{ value: number; density: number }>()
        .x0((d) => xCenter - densityScale(d.density))
        .x1((d) => xCenter + densityScale(d.density))
        .y((d) => yScale.scale(d.value as unknown) as number)
        .curve(curveCatmullRom);

      const path = areaGen(sorted) ?? '';

      // Compute median
      const values = sorted.map((p) => p.value);
      const mid = Math.floor(values.length / 2);
      const median = values.length % 2 !== 0 ? values[mid]! : ((values[mid - 1]! + values[mid]!) / 2);

      return {
        path,
        xCenter,
        halfW,
        medianY: yScale.scale(median as unknown) as number,
        median,
        cat,
        groupIdx,
      };
    }).filter(Boolean) as Array<{
      path: string;
      xCenter: number;
      halfW: number;
      medianY: number;
      median: number;
      cat: string;
      groupIdx: number;
    }>;
  }, [data, field, densityField, xScale, yScale, violinWidth]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Violin plot'}>
      {violins.map((v, i) => {
        const isActive = hovered === i;

        return (
          <g key={v.cat}>
            <path
              d={v.path}
              fill={resolvedColor}
              opacity={hovered !== null && !isActive ? opacity * 0.35 : opacity}
              stroke={isActive ? '#fff' : resolvedColor}
              strokeWidth={isActive ? 2 : 1}
              strokeOpacity={isActive ? 1 : 0.3}
              role="listitem"
              aria-label={`${v.cat}: median ${v.median}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
            />
            {/* Median line */}
            {showMedian && (
              <line
                x1={v.xCenter - v.halfW * 0.5}
                y1={v.medianY}
                x2={v.xCenter + v.halfW * 0.5}
                y2={v.medianY}
                stroke="#fff"
                strokeWidth={2}
                opacity={hovered !== null && !isActive ? 0.3 : 0.8}
                style={{ pointerEvents: 'none' }}
              />
            )}
            {isActive && (
              <text
                x={v.xCenter}
                y={v.medianY - 14}
                textAnchor="middle"
                fill={resolvedColor}
                fontSize={11}
                fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                {`Med: ${v.median}`}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
