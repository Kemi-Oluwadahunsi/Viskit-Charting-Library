// ─────────────────────────────────────────────────
// <ParallelCoordinatesSeries> — Multi-axis comparison
// ─────────────────────────────────────────────────
// Renders parallel vertical axes, one per numeric field,
// with polylines connecting each datum's values across axes.
// Great for comparing multivariate data.
//
// Usage:
//   <Chart data={cars} height={400}>
//     <ParallelCoordinatesSeries fields={['mpg','hp','weight','accel']} />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { scaleLinear, scalePoint } from 'd3-scale';
import { useChartContext } from '@kodemaven/viskit-core';

export interface ParallelCoordinatesSeriesProps<TDatum = Record<string, unknown>> {
  /** Numeric field keys to create axes for */
  fields: Array<keyof TDatum & string>;
  /** Optional field for line color grouping */
  colorField?: keyof TDatum & string;
  /** Line stroke width (default: 1.5) */
  strokeWidth?: number;
  /** Line opacity (default: 0.5) */
  opacity?: number;
  /** Axis tick count per axis (default: 5) */
  tickCount?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function ParallelCoordinatesSeries<TDatum extends Record<string, unknown>>({
  fields,
  colorField,
  strokeWidth = 1.5,
  opacity = 0.5,
  tickCount = 5,
  'aria-label': ariaLabel,
}: ParallelCoordinatesSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const { axes, lines } = useMemo(() => {
    const typedData = data as TDatum[];
    if (typedData.length === 0 || fields.length === 0) return { axes: [], lines: [] };

    // Horizontal position of each axis
    const xScale = scalePoint<string>()
      .domain(fields as string[])
      .range([0, innerWidth])
      .padding(0.1);

    // Build a yScale per field
    const yScales = new Map<string, ReturnType<typeof scaleLinear>>();
    for (const field of fields) {
      const vals = typedData.map((d) => Number(d[field]) || 0);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      yScales.set(
        field as string,
        scaleLinear().domain([min, max]).range([innerHeight, 0]).nice(),
      );
    }

    // Build axis descriptors
    const axisDescriptors = fields.map((field) => {
      const x = xScale(field as string) ?? 0;
      const yScale = yScales.get(field as string)!;
      const ticks = yScale.ticks(tickCount);
      return { field: field as string, x, yScale, ticks };
    });

    // Build polylines
    const lineDescriptors = typedData.map((datum, i) => {
      const points = fields.map((field) => {
        const x = xScale(field as string) ?? 0;
        const y = yScales.get(field as string)!(Number(datum[field]) || 0);
        return `${x},${y}`;
      });
      const group = colorField ? String(datum[colorField]) : `line-${i}`;
      return {
        path: `M${points.join('L')}`,
        color: colorScale(group),
        group,
        index: i,
      };
    });

    return { axes: axisDescriptors, lines: lineDescriptors };
  }, [data, fields, colorField, innerWidth, innerHeight, colorScale, tickCount]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Parallel coordinates chart'}>
      {/* Axes */}
      {axes.map((axis) => (
        <g key={axis.field}>
          <line
            x1={axis.x} y1={0} x2={axis.x} y2={innerHeight}
            stroke="#475569" strokeWidth={1} opacity={0.4}
          />
          <text
            x={axis.x} y={-10}
            textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight={600}
          >
            {axis.field}
          </text>
          {axis.ticks.map((tick) => (
            <g key={tick} transform={`translate(${axis.x}, ${axis.yScale(tick)})`}>
              <line x1={-4} x2={4} stroke="#64748b" strokeWidth={1} />
              <text x={-8} textAnchor="end" dominantBaseline="central" fill="#64748b" fontSize={9}>
                {tick}
              </text>
            </g>
          ))}
        </g>
      ))}

      {/* Lines */}
      {lines.map((line) => (
        <path
          key={line.index}
          d={line.path}
          fill="none"
          stroke={line.color}
          strokeWidth={hovered === line.index ? strokeWidth * 2 : strokeWidth}
          opacity={hovered !== null && hovered !== line.index ? opacity * 0.3 : opacity}
          role="listitem"
          aria-label={`${line.group}`}
          tabIndex={0}
          onMouseEnter={() => handleEnter(line.index)}
          onMouseLeave={handleLeave}
          style={{ cursor: 'pointer', transition: 'opacity 200ms ease, stroke-width 200ms ease' }}
        />
      ))}
    </g>
  );
}
