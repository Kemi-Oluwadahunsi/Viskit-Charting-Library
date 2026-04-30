import { useMemo, useState, useCallback, useId } from 'react';
import { scaleBand } from 'd3-scale';
import { useChartContext, useCartesianContext } from '@kodemaven/viskit-core';

export interface GroupedBarSeriesProps<TDatum = Record<string, unknown>> {
  fields: (keyof TDatum & string)[];
  colors?: string[];
  radius?: number;
  opacity?: number;
  'aria-label'?: string;
}

export function GroupedBarSeries<TDatum extends Record<string, unknown>>({
  fields,
  colors: colorsProp,
  radius = 4,
  opacity = 1,
  'aria-label': ariaLabel,
}: GroupedBarSeriesProps<TDatum>) {
  const { data, colorScale } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hovered, setHovered] = useState<{ field: number; index: number } | null>(null);
  const gradIdBase = useId();

  const handleEnter = useCallback((fi: number, di: number) => setHovered({ field: fi, index: di }), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const bandwidth = xScale.bandwidth ?? 20;

  const subScale = useMemo(() => {
    return scaleBand<string>()
      .domain(fields)
      .range([0, bandwidth])
      .padding(0.05);
  }, [fields, bandwidth]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Grouped bar chart'}>
      <defs>
        {fields.map((f, fi) => {
          const c = colorsProp?.[fi] ?? colorScale(f);
          return (
            <linearGradient key={f} id={`${gradIdBase}-${fi}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity={1} />
              <stop offset="100%" stopColor={c} stopOpacity={0.65} />
            </linearGradient>
          );
        })}
      </defs>
      {(data as TDatum[]).map((d, di) => {
        const domainValue = xScale.domain[di];
        const groupX = xScale.scale(domainValue) as number;

        return (
          <g key={di}>
            {fields.map((f, fi) => {
              const fieldColor = colorsProp?.[fi] ?? colorScale(f);
              const value = Number(d[f]) || 0;
              const y = yScale.scale(value as unknown) as number;
              const baseline = yScale.scale(0 as unknown) as number;
              const barY = Math.min(y, baseline);
              const barH = Math.abs(baseline - y);
              const subX = groupX + (subScale(f) ?? 0);
              const subW = subScale.bandwidth();
              const isActive = hovered?.field === fi && hovered?.index === di;
              const dimmed = hovered !== null && !isActive;

              return (
                <g key={f}>
                  {isActive && (
                    <rect
                      x={subX - 2} y={barY - 2}
                      width={subW + 4} height={Math.max(0, barH + 4)}
                      rx={radius + 2} ry={radius + 2}
                      fill={fieldColor} opacity={0.15}
                    />
                  )}
                  <rect
                    x={subX} y={isActive ? barY - 2 : barY}
                    width={subW}
                    height={Math.max(0, isActive ? barH + 2 : barH)}
                    rx={radius} ry={radius}
                    fill={`url(#${gradIdBase}-${fi})`}
                    opacity={dimmed ? opacity * 0.4 : opacity}
                    role="listitem"
                    aria-label={`${f}: ${value}`}
                    tabIndex={0}
                    onMouseEnter={() => handleEnter(fi, di)}
                    onMouseLeave={handleLeave}
                    style={{ cursor: 'pointer', transition: 'y 200ms ease, height 200ms ease, opacity 200ms ease' }}
                  />
                  {isActive && (
                    <text
                      x={subX + subW / 2} y={barY - 8}
                      textAnchor="middle" fill={fieldColor}
                      fontSize={10} fontWeight={700}
                      style={{ pointerEvents: 'none' }}
                    >
                      {value.toLocaleString()}
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
