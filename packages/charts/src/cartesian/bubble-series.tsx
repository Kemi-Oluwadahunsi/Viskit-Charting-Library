import { useMemo, useState, useCallback } from 'react';
import { useChartContext, useCartesianContext } from '@viskit/core';
import type { BaseSeriesProps } from '@viskit/core';

export interface BubbleSeriesProps<TDatum = Record<string, unknown>>
  extends BaseSeriesProps<TDatum> {
  sizeField: keyof TDatum & string;
  minRadius?: number;
  maxRadius?: number;
}

export function BubbleSeries<TDatum extends Record<string, unknown>>({
  field,
  sizeField,
  color,
  opacity = 0.7,
  minRadius = 4,
  maxRadius = 30,
  'aria-label': ariaLabel,
}: BubbleSeriesProps<TDatum>) {
  const { data, colorScale } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  const resolvedColor = color ?? colorScale(field as string);

  const bubbles = useMemo(() => {
    const sizeValues = (data as TDatum[]).map((d) => Number(d[sizeField]) || 0);
    const sizeMin = Math.min(...sizeValues);
    const sizeMax = Math.max(...sizeValues);
    const sizeRange = sizeMax - sizeMin || 1;

    return (data as TDatum[]).map((d, i) => {
      const domainValue = xScale.domain[i];
      const x = (xScale.scale(domainValue) as number) + (xScale.bandwidth ? xScale.bandwidth / 2 : 0);
      const y = yScale.scale(d[field] as unknown) as number;
      const sizeVal = Number(d[sizeField]) || 0;
      const r = minRadius + ((sizeVal - sizeMin) / sizeRange) * (maxRadius - minRadius);

      return { x, y, r, value: Number(d[field]) || 0, size: sizeVal, datum: d };
    }).filter((pt) => !Number.isNaN(pt.x) && !Number.isNaN(pt.y));
  }, [data, field, sizeField, xScale, yScale, minRadius, maxRadius]);

  return (
    <g role="list" aria-label={ariaLabel ?? `${field as string} bubbles`}>
      {bubbles.map((b, i) => {
        const isActive = hoveredIndex === i;
        const dimmed = hoveredIndex !== null && !isActive;
        const activeR = isActive ? b.r + 4 : b.r;

        return (
          <g key={i}>
            {isActive && (
              <circle cx={b.x} cy={b.y} r={activeR + 6}
                fill={resolvedColor} opacity={0.1} />
            )}
            <circle
              cx={b.x} cy={b.y} r={activeR}
              fill={resolvedColor}
              opacity={dimmed ? opacity * 0.3 : opacity}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 2 : 0}
              role="listitem"
              aria-label={`${field as string}: ${b.value}, size: ${b.size}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer', transition: 'r 200ms ease, opacity 200ms ease' }}
            />
            {isActive && (
              <text
                x={b.x} y={b.y - activeR - 8}
                textAnchor="middle" fill={resolvedColor}
                fontSize={11} fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                {b.value.toLocaleString()}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
