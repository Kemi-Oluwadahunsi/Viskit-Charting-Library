// ─────────────────────────────────────────────────
// <RidgeLineSeries> — Overlapping density plots (joy plot)
// ─────────────────────────────────────────────────
// Renders vertically stacked area curves that overlap,
// creating a ridge-line (joy plot) visualization.
// Each row represents one group with its density curve.
//
// Usage:
//   <Chart data={densityData} height={400}>
//     <RidgeLineSeries fields={['jan','feb','mar']} />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { scaleLinear } from 'd3-scale';
import { area as d3Area, curveBasis } from 'd3-shape';
import { useChartContext } from '@kodemaven/viskit-core';

export interface RidgeLineSeriesProps<TDatum = Record<string, unknown>> {
  /** Numeric field keys — each becomes one ridge row */
  fields: Array<keyof TDatum & string>;
  /** Overlap factor 0–1 (default: 0.5). Higher = more overlap */
  overlap?: number;
  /** Fill opacity (default: 0.6) */
  fillOpacity?: number;
  /** Stroke width (default: 1.5) */
  strokeWidth?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function RidgeLineSeries<TDatum extends Record<string, unknown>>({
  fields,
  overlap = 0.5,
  fillOpacity = 0.6,
  strokeWidth = 1.5,
  'aria-label': ariaLabel,
}: RidgeLineSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const ridges = useMemo(() => {
    const typedData = data as TDatum[];
    if (typedData.length === 0 || fields.length === 0) return [];

    const rowCount = fields.length;
    const rowHeight = innerHeight / rowCount;
    const overlapPx = rowHeight * overlap;

    // xScale: index-based across data points
    const xScale = scaleLinear()
      .domain([0, typedData.length - 1])
      .range([0, innerWidth]);

    // Find global max value for consistent ridge height
    let globalMax = 0;
    for (const field of fields) {
      for (const datum of typedData) {
        const val = Number(datum[field]) || 0;
        if (val > globalMax) globalMax = val;
      }
    }

    // yScale for each ridge (maps value to height within the row)
    const ridgeHeight = rowHeight + overlapPx;
    const yScale = scaleLinear()
      .domain([0, globalMax])
      .range([0, ridgeHeight * 0.8]);

    return fields.map((field, i) => {
      const baseline = i * (rowHeight - overlapPx * 0.5) + rowHeight;

      const areaGen = d3Area<number>()
        .x((_d, idx) => xScale(idx))
        .y0(baseline)
        .y1((_d) => baseline - yScale(_d))
        .curve(curveBasis);

      const values = typedData.map((d) => Number(d[field]) || 0);
      const path = areaGen(values) ?? '';

      return {
        field: field as string,
        path,
        color: colorScale(field as string),
        baseline,
      };
    });
  }, [data, fields, overlap, innerWidth, innerHeight, colorScale]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Ridge line chart'}>
      {ridges.map((ridge, i) => (
        <g key={ridge.field}>
          <path
            d={ridge.path}
            fill={ridge.color}
            fillOpacity={hovered !== null && hovered !== i ? fillOpacity * 0.3 : fillOpacity}
            stroke={ridge.color}
            strokeWidth={hovered === i ? strokeWidth * 1.5 : strokeWidth}
            role="listitem"
            aria-label={ridge.field}
            tabIndex={0}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
            style={{ cursor: 'pointer', transition: 'fill-opacity 200ms ease' }}
          />
          <text
            x={-8}
            y={ridge.baseline}
            textAnchor="end"
            dominantBaseline="central"
            fill="#94a3b8"
            fontSize={11}
            fontWeight={500}
          >
            {ridge.field}
          </text>
        </g>
      ))}
    </g>
  );
}
