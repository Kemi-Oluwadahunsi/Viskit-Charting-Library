// ─────────────────────────────────────────────────
// <StreamGraphSeries> — Stacked area with organic flow
// ─────────────────────────────────────────────────
// Renders a streamgraph (offset stacked area chart)
// using d3-shape stack with wiggle offset for organic
// flowing shapes.
//
// Usage:
//   <Chart data={timeSeriesData} height={400}>
//     <StreamGraphSeries fields={['a','b','c']} />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { stack, stackOffsetWiggle, stackOrderInsideOut, area as d3Area, curveBasis } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { useChartContext } from '@viskit/core';

export interface StreamGraphSeriesProps<TDatum = Record<string, unknown>> {
  /** Array of numeric field keys to stack */
  fields: Array<keyof TDatum & string>;
  /** Opacity 0–1 (default: 0.8) */
  opacity?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function StreamGraphSeries<TDatum extends Record<string, unknown>>({
  fields,
  opacity = 0.8,
  'aria-label': ariaLabel,
}: StreamGraphSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const layers = useMemo(() => {
    const typedData = data as Array<Record<string, unknown>>;
    if (typedData.length === 0 || fields.length === 0) return [];

    const stackGen = stack<Record<string, unknown>>()
      .keys(fields as string[])
      .offset(stackOffsetWiggle)
      .order(stackOrderInsideOut);

    const stacked = stackGen(typedData);

    // xScale: index-based
    const xScale = scaleLinear()
      .domain([0, typedData.length - 1])
      .range([0, innerWidth]);

    // yScale: auto from stacked extent
    let yMin = Infinity;
    let yMax = -Infinity;
    for (const layer of stacked) {
      for (const point of layer) {
        if (point[0] < yMin) yMin = point[0];
        if (point[1] > yMax) yMax = point[1];
      }
    }

    const yScale = scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0]);

    const areaGen = d3Area<[number, number]>()
      .x((_d, i) => xScale(i))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(curveBasis);

    return stacked.map((layer) => ({
      key: layer.key,
      path: areaGen(layer as unknown as Array<[number, number]>) ?? '',
      color: colorScale(layer.key),
    }));
  }, [data, fields, innerWidth, innerHeight, colorScale]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Stream graph'}>
      {layers.map((l, i) => {
        const isActive = hovered === i;

        return (
          <path
            key={l.key}
            d={l.path}
            fill={l.color}
            opacity={hovered !== null && !isActive ? opacity * 0.2 : opacity}
            stroke={isActive ? '#fff' : l.color}
            strokeWidth={isActive ? 1.5 : 0.5}
            strokeOpacity={isActive ? 0.9 : 0.2}
            role="listitem"
            aria-label={l.key}
            tabIndex={0}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
            style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
          />
        );
      })}

      {/* Hover label */}
      {hovered !== null && layers[hovered] && (
        <text
          x={innerWidth / 2}
          y={14}
          textAnchor="middle"
          fill={layers[hovered]!.color}
          fontSize={12}
          fontWeight={700}
          style={{ pointerEvents: 'none' }}
        >
          {layers[hovered]!.key}
        </text>
      )}
    </g>
  );
}
