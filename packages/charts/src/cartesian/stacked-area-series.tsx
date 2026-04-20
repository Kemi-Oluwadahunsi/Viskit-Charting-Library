import { useMemo, useState, useCallback, useId } from 'react';
import { area, stack as d3Stack, stackOrderNone, stackOffsetNone, curveBasis, curveCardinal, curveCatmullRom, curveLinear, curveMonotoneX, curveNatural, curveStep } from 'd3-shape';
import { useChartContext, useCartesianContext } from '@viskit/core';

type CurveType = 'linear' | 'monotone' | 'step' | 'basis' | 'cardinal' | 'catmull-rom' | 'natural';

const CURVE_MAP = {
  linear: curveLinear,
  monotone: curveMonotoneX,
  step: curveStep,
  basis: curveBasis,
  cardinal: curveCardinal,
  'catmull-rom': curveCatmullRom,
  natural: curveNatural,
} as const;

export interface StackedAreaSeriesProps<TDatum = Record<string, unknown>> {
  fields: (keyof TDatum & string)[];
  colors?: string[];
  curve?: CurveType;
  opacity?: number;
  strokeWidth?: number;
  'aria-label'?: string;
}

export function StackedAreaSeries<TDatum extends Record<string, unknown>>({
  fields,
  colors: colorsProp,
  curve = 'monotone',
  opacity = 0.6,
  strokeWidth = 1.5,
  'aria-label': ariaLabel,
}: StackedAreaSeriesProps<TDatum>) {
  const { data, colorScale } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);
  const gradIdBase = useId();

  const handleEnter = useCallback((li: number) => setHoveredLayer(li), []);
  const handleLeave = useCallback(() => setHoveredLayer(null), []);

  const layers = useMemo(() => {
    const stackGen = d3Stack<TDatum>()
      .keys(fields)
      .order(stackOrderNone)
      .offset(stackOffsetNone);

    const stacked = stackGen(data as TDatum[]);
    const curveFactory = CURVE_MAP[curve];

    return stacked.map((layer, li) => {
      const fieldColor = colorsProp?.[li] ?? colorScale(layer.key);

      const areaGen = area<[number, number]>()
        .x((_d, i) => {
          const domainValue = xScale.domain[i];
          return (xScale.scale(domainValue) as number) + (xScale.bandwidth ? xScale.bandwidth / 2 : 0);
        })
        .y0((d) => yScale.scale(d[0] as unknown) as number)
        .y1((d) => yScale.scale(d[1] as unknown) as number)
        .curve(curveFactory);

      const path = areaGen(layer as unknown as [number, number][]) ?? '';

      return { key: layer.key, path, color: fieldColor };
    });
  }, [data, fields, colorsProp, colorScale, curve, xScale, yScale]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Stacked area chart'}>
      <defs>
        {layers.map((layer, li) => (
          <linearGradient key={layer.key} id={`${gradIdBase}-${li}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={layer.color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={layer.color} stopOpacity={0.05} />
          </linearGradient>
        ))}
      </defs>
      {layers.map((layer, li) => {
        const isActive = hoveredLayer === li;
        const dimmed = hoveredLayer !== null && !isActive;

        return (
          <g
            key={layer.key}
            onMouseEnter={() => handleEnter(li)}
            onMouseLeave={handleLeave}
            style={{ cursor: 'pointer' }}
          >
            <path
              d={layer.path}
              fill={`url(#${gradIdBase}-${li})`}
              opacity={dimmed ? 0.15 : isActive ? 0.85 : opacity}
              style={{ transition: 'opacity 200ms ease' }}
            />
            <path
              d={layer.path}
              fill="none"
              stroke={layer.color}
              strokeWidth={isActive ? strokeWidth + 1 : strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={dimmed ? 0.3 : 1}
              style={{ transition: 'stroke-width 200ms ease, opacity 200ms ease' }}
            />
          </g>
        );
      })}
    </g>
  );
}
