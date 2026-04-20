import { useMemo, useState, useCallback } from 'react';
import { useChartContext, useCartesianContext } from '@viskit/core';

export interface DumbbellSeriesProps<TDatum = Record<string, unknown>> {
  fieldStart: keyof TDatum & string;
  fieldEnd: keyof TDatum & string;
  colorStart?: string;
  colorEnd?: string;
  dotRadius?: number;
  strokeWidth?: number;
  opacity?: number;
  'aria-label'?: string;
}

export function DumbbellSeries<TDatum extends Record<string, unknown>>({
  fieldStart,
  fieldEnd,
  colorStart,
  colorEnd,
  dotRadius = 5,
  strokeWidth = 2,
  opacity = 1,
  'aria-label': ariaLabel,
}: DumbbellSeriesProps<TDatum>) {
  const { data, colorScale } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  const resolvedColorStart = colorStart ?? colorScale(fieldStart);
  const resolvedColorEnd = colorEnd ?? colorScale(fieldEnd);

  const items = useMemo(() => {
    const bandwidth = xScale.bandwidth ?? 20;

    return (data as TDatum[]).map((d, i) => {
      const domainValue = xScale.domain[i];
      const x = (xScale.scale(domainValue) as number) + bandwidth / 2;
      const startVal = Number(d[fieldStart]) || 0;
      const endVal = Number(d[fieldEnd]) || 0;
      const yStart = yScale.scale(startVal as unknown) as number;
      const yEnd = yScale.scale(endVal as unknown) as number;

      return { x, yStart, yEnd, startVal, endVal, datum: d };
    });
  }, [data, fieldStart, fieldEnd, xScale, yScale]);

  return (
    <g role="list" aria-label={ariaLabel ?? `${fieldStart}–${fieldEnd} dumbbell`}>
      {items.map((item, i) => {
        const isActive = hoveredIndex === i;
        const dimmed = hoveredIndex !== null && !isActive;
        const itemOpacity = dimmed ? opacity * 0.3 : opacity;
        const activeR = isActive ? dotRadius + 3 : dotRadius;

        return (
          <g key={i}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
            style={{ cursor: 'pointer' }}
          >
            {/* Connecting bar */}
            <line
              x1={item.x} y1={item.yStart}
              x2={item.x} y2={item.yEnd}
              stroke={isActive ? '#fff' : '#94a3b8'}
              strokeWidth={isActive ? strokeWidth + 2 : strokeWidth}
              opacity={itemOpacity}
              strokeLinecap="round"
              style={{ transition: 'stroke-width 200ms ease, opacity 200ms ease' }}
            />
            {/* Start dot */}
            <circle
              cx={item.x} cy={item.yStart} r={activeR}
              fill={isActive ? '#fff' : resolvedColorStart}
              stroke={resolvedColorStart}
              strokeWidth={isActive ? 2.5 : 1.5}
              opacity={itemOpacity}
              role="listitem"
              aria-label={`${fieldStart}: ${item.startVal}`}
              tabIndex={0}
              style={{ transition: 'r 200ms ease' }}
            />
            {/* End dot */}
            <circle
              cx={item.x} cy={item.yEnd} r={activeR}
              fill={isActive ? '#fff' : resolvedColorEnd}
              stroke={resolvedColorEnd}
              strokeWidth={isActive ? 2.5 : 1.5}
              opacity={itemOpacity}
              role="listitem"
              aria-label={`${fieldEnd}: ${item.endVal}`}
              tabIndex={0}
              style={{ transition: 'r 200ms ease' }}
            />
            {/* Labels */}
            {isActive && (
              <>
                <text
                  x={item.x + activeR + 8} y={item.yStart}
                  dominantBaseline="central" fill={resolvedColorStart}
                  fontSize={10} fontWeight={700}
                  style={{ pointerEvents: 'none' }}
                >
                  {item.startVal.toLocaleString()}
                </text>
                <text
                  x={item.x + activeR + 8} y={item.yEnd}
                  dominantBaseline="central" fill={resolvedColorEnd}
                  fontSize={10} fontWeight={700}
                  style={{ pointerEvents: 'none' }}
                >
                  {item.endVal.toLocaleString()}
                </text>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}
