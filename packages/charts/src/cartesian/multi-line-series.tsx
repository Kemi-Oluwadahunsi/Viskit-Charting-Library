import { useMemo, useState, useCallback } from 'react';
import { line, curveBasis, curveCardinal, curveCatmullRom, curveLinear, curveMonotoneX, curveNatural, curveStep } from 'd3-shape';
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

export interface MultiLineSeriesProps<TDatum = Record<string, unknown>> {
  fields: (keyof TDatum & string)[];
  colors?: string[];
  curve?: CurveType;
  dots?: boolean;
  dotRadius?: number;
  strokeWidth?: number;
  opacity?: number;
  'aria-label'?: string;
}

export function MultiLineSeries<TDatum extends Record<string, unknown>>({
  fields,
  colors: colorsProp,
  curve = 'linear',
  dots = false,
  dotRadius = 3,
  strokeWidth = 2,
  opacity = 1,
  'aria-label': ariaLabel,
}: MultiLineSeriesProps<TDatum>) {
  const { data, colorScale } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [hoveredDot, setHoveredDot] = useState<{ line: number; index: number } | null>(null);

  const handleLineEnter = useCallback((li: number) => setHoveredLine(li), []);
  const handleLineLeave = useCallback(() => { setHoveredLine(null); setHoveredDot(null); }, []);
  const handleDotEnter = useCallback((li: number, di: number) => setHoveredDot({ line: li, index: di }), []);
  const handleDotLeave = useCallback(() => setHoveredDot(null), []);

  const lines = useMemo(() => {
    const curveFactory = CURVE_MAP[curve];

    return fields.map((f, fi) => {
      const fieldColor = colorsProp?.[fi] ?? colorScale(f);

      const lineGen = line<TDatum>()
        .x((_d, i) => {
          const domainValue = xScale.domain[i];
          return (xScale.scale(domainValue) as number) + (xScale.bandwidth ? xScale.bandwidth / 2 : 0);
        })
        .y((d) => yScale.scale(d[f] as unknown) as number)
        .defined((d) => d[f] != null && !Number.isNaN(Number(d[f])))
        .curve(curveFactory);

      const path = lineGen(data as TDatum[]) ?? '';

      const points = (data as TDatum[]).map((d, i) => {
        const domainValue = xScale.domain[i];
        return {
          x: (xScale.scale(domainValue) as number) + (xScale.bandwidth ? xScale.bandwidth / 2 : 0),
          y: yScale.scale(d[f] as unknown) as number,
          value: d[f],
        };
      }).filter((pt) => !Number.isNaN(pt.x) && !Number.isNaN(pt.y));

      return { key: f, path, points, color: fieldColor };
    });
  }, [data, fields, colorsProp, colorScale, curve, xScale, yScale]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Multi-line chart'}>
      {lines.map((ln, li) => {
        const isLineActive = hoveredLine === li;
        const dimmed = hoveredLine !== null && !isLineActive;

        return (
          <g
            key={ln.key}
            onMouseEnter={() => handleLineEnter(li)}
            onMouseLeave={handleLineLeave}
            style={{ cursor: 'pointer' }}
          >
            <path
              d={ln.path}
              fill="none"
              stroke={ln.color}
              strokeWidth={isLineActive ? strokeWidth + 1 : strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={dimmed ? opacity * 0.25 : opacity}
              style={{ transition: 'stroke-width 200ms ease, opacity 200ms ease' }}
            />
            {(dots || isLineActive) && ln.points.map((pt, di) => {
              const isDotActive = hoveredDot?.line === li && hoveredDot?.index === di;
              const r = isDotActive ? dotRadius + 3 : dotRadius;

              return (
                <g key={di}>
                  {isDotActive && (
                    <circle cx={pt.x} cy={pt.y} r={r + 4}
                      fill="none" stroke={ln.color} strokeWidth={1.5} opacity={0.3} />
                  )}
                  <circle
                    cx={pt.x} cy={pt.y} r={r}
                    fill={isDotActive ? '#fff' : ln.color}
                    stroke={isDotActive ? ln.color : '#fff'}
                    strokeWidth={isDotActive ? 2.5 : 1.5}
                    opacity={dimmed ? 0.3 : 1}
                    tabIndex={0}
                    aria-label={`${ln.key}: ${String(pt.value)}`}
                    onMouseEnter={() => handleDotEnter(li, di)}
                    onMouseLeave={handleDotLeave}
                    style={{ transition: 'r 150ms ease' }}
                  />
                  {isDotActive && (
                    <text x={pt.x} y={pt.y - r - 10}
                      textAnchor="middle" fill={ln.color}
                      fontSize={11} fontWeight={600}
                      style={{ pointerEvents: 'none' }}
                    >
                      {typeof pt.value === 'number' ? pt.value.toLocaleString() : String(pt.value)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
