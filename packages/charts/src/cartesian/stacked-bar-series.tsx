import { useMemo, useState, useCallback, useId } from 'react';
import { stack as d3Stack, stackOrderNone, stackOffsetNone } from 'd3-shape';
import { useChartContext, useCartesianContext } from '@viskit/core';

export interface StackedBarSeriesProps<TDatum = Record<string, unknown>> {
  fields: (keyof TDatum & string)[];
  colors?: string[];
  radius?: number;
  opacity?: number;
  'aria-label'?: string;
}

export function StackedBarSeries<TDatum extends Record<string, unknown>>({
  fields,
  colors: colorsProp,
  radius = 4,
  opacity = 1,
  'aria-label': ariaLabel,
}: StackedBarSeriesProps<TDatum>) {
  const { data, colorScale } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hovered, setHovered] = useState<{ layer: number; index: number } | null>(null);
  const gradIdBase = useId();

  const handleEnter = useCallback((layer: number, index: number) => setHovered({ layer, index }), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const layers = useMemo(() => {
    const stackGen = d3Stack<TDatum>()
      .keys(fields)
      .order(stackOrderNone)
      .offset(stackOffsetNone);

    return stackGen(data as TDatum[]);
  }, [data, fields]);

  const bandwidth = xScale.bandwidth ?? 20;

  return (
    <g role="list" aria-label={ariaLabel ?? 'Stacked bar chart'}>
      <defs>
        {fields.map((f, li) => {
          const c = colorsProp?.[li] ?? colorScale(f);
          return (
            <linearGradient key={f} id={`${gradIdBase}-${li}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity={1} />
              <stop offset="100%" stopColor={c} stopOpacity={0.65} />
            </linearGradient>
          );
        })}
      </defs>
      {layers.map((layer, li) => {
        const fieldColor = colorsProp?.[li] ?? colorScale(layer.key);
        return (
          <g key={layer.key}>
            {layer.map((segment, si) => {
              const domainValue = xScale.domain[si];
              const x = xScale.scale(domainValue) as number;
              const y0 = yScale.scale(segment[0] as unknown) as number;
              const y1 = yScale.scale(segment[1] as unknown) as number;
              const barY = Math.min(y0, y1);
              const barH = Math.abs(y0 - y1);
              const isActive = hovered?.layer === li && hovered?.index === si;
              const dimmed = hovered !== null && !isActive;
              const isTopLayer = li === layers.length - 1;

              return (
                <g key={si}>
                  {isActive && (
                    <rect
                      x={x - 2} y={barY - 2}
                      width={bandwidth + 4} height={Math.max(0, barH + 4)}
                      rx={radius + 2} ry={radius + 2}
                      fill={fieldColor} opacity={0.15}
                    />
                  )}
                  <rect
                    x={x} y={barY}
                    width={bandwidth}
                    height={Math.max(0, barH)}
                    rx={isTopLayer ? radius : 0}
                    ry={isTopLayer ? radius : 0}
                    fill={`url(#${gradIdBase}-${li})`}
                    opacity={dimmed ? opacity * 0.4 : opacity}
                    role="listitem"
                    aria-label={`${layer.key}: ${segment[1] - segment[0]}`}
                    tabIndex={0}
                    onMouseEnter={() => handleEnter(li, si)}
                    onMouseLeave={handleLeave}
                    style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
                  />
                  {isActive && (
                    <text
                      x={x + bandwidth / 2} y={barY - 8}
                      textAnchor="middle" fill={fieldColor}
                      fontSize={11} fontWeight={700}
                      style={{ pointerEvents: 'none' }}
                    >
                      {(segment[1] - segment[0]).toLocaleString()}
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
