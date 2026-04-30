import { useMemo, useState, useCallback } from 'react';
import { useChartContext, useCartesianContext } from '@kodemaven/viskit-core';
import type { BaseSeriesProps } from '@kodemaven/viskit-core';

export interface LollipopSeriesProps<TDatum = Record<string, unknown>>
  extends BaseSeriesProps<TDatum> {
  dotRadius?: number;
  strokeWidth?: number;
}

export function LollipopSeries<TDatum extends Record<string, unknown>>({
  field,
  color,
  opacity = 1,
  dotRadius = 5,
  strokeWidth = 2,
  'aria-label': ariaLabel,
}: LollipopSeriesProps<TDatum>) {
  const { data, colorScale } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  const resolvedColor = color ?? colorScale(field as string);

  const items = useMemo(() => {
    const bandwidth = xScale.bandwidth ?? 20;

    return (data as TDatum[]).map((d, i) => {
      const domainValue = xScale.domain[i];
      const x = (xScale.scale(domainValue) as number) + bandwidth / 2;
      const value = Number(d[field]) || 0;
      const y = yScale.scale(value as unknown) as number;
      const baseline = yScale.scale(0 as unknown) as number;

      return { x, y, baseline, value, datum: d };
    });
  }, [data, field, xScale, yScale]);

  return (
    <g role="list" aria-label={ariaLabel ?? `${field as string} lollipop`}>
      {items.map((item, i) => {
        const isActive = hoveredIndex === i;
        const dimmed = hoveredIndex !== null && !isActive;
        const activeR = isActive ? dotRadius + 3 : dotRadius;
        const itemOpacity = dimmed ? opacity * 0.35 : opacity;

        return (
          <g key={i}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
            style={{ cursor: 'pointer' }}
          >
            {/* Stick */}
            <line
              x1={item.x} y1={item.baseline}
              x2={item.x} y2={item.y}
              stroke={resolvedColor}
              strokeWidth={isActive ? strokeWidth + 1 : strokeWidth}
              opacity={itemOpacity}
              strokeLinecap="round"
              style={{ transition: 'stroke-width 200ms ease, opacity 200ms ease' }}
            />
            {/* Pulse ring on hover */}
            {isActive && (
              <circle cx={item.x} cy={item.y} r={activeR + 5}
                fill="none" stroke={resolvedColor} strokeWidth={1.5} opacity={0.3} />
            )}
            {/* Dot */}
            <circle
              cx={item.x} cy={item.y} r={activeR}
              fill={isActive ? '#fff' : resolvedColor}
              stroke={isActive ? resolvedColor : '#fff'}
              strokeWidth={isActive ? 2.5 : 1.5}
              opacity={itemOpacity}
              role="listitem"
              aria-label={`${field as string}: ${item.value}`}
              tabIndex={0}
              style={{ transition: 'r 200ms ease, fill 150ms ease' }}
            />
            {/* Value label */}
            {isActive && (
              <text
                x={item.x} y={item.y - activeR - 10}
                textAnchor="middle" fill={resolvedColor}
                fontSize={11} fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                {item.value.toLocaleString()}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
