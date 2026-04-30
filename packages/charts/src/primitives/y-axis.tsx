import { useMemo } from 'react';
import { useCartesianContext } from '@kodemaven/viskit-core';
import type { FormatFunction } from '@kodemaven/viskit-core';
import { useFormat } from '@kodemaven/viskit-core';

export interface YAxisProps {
  /** Position of the axis relative to the plot area */
  position?: 'left' | 'right';
  /** Number of ticks to generate */
  tickCount?: number;
  /** Tick length in px */
  tickSize?: number;
  /** Format for tick labels */
  format?: FormatFunction;
  /** Axis label text */
  label?: string;
  /** Tick label color */
  color?: string;
  /** Axis line and tick stroke color */
  strokeColor?: string;
  /** Hide the axis line */
  hideAxisLine?: boolean;
  /** Hide tick marks */
  hideTicks?: boolean;
  /** ARIA label */
  'aria-label'?: string;
}

export function YAxis({
  position = 'left',
  tickCount = 5,
  tickSize = 6,
  format,
  label,
  color = '#94A3B8',
  strokeColor = 'rgba(255,255,255,0.15)',
  hideAxisLine = false,
  hideTicks = false,
  'aria-label': ariaLabel,
}: YAxisProps) {
  const { yScale, innerWidth } = useCartesianContext();
  const fmt = useFormat(format);

  const ticks = useMemo(
    () => yScale.ticks(tickCount),
    [yScale, tickCount],
  );

  const x = position === 'left' ? 0 : innerWidth;
  const tickDirection = position === 'left' ? -1 : 1;
  const textAnchor = position === 'left' ? 'end' : 'start';
  const labelX = position === 'left' ? -45 : innerWidth + 45;

  return (
    <g
      aria-label={ariaLabel ?? 'Y axis'}
      transform={`translate(${x}, 0)`}
    >
      {/* Axis line */}
      {!hideAxisLine && (
        <line
          x1={0}
          x2={0}
          y1={0}
          y2={Number(yScale.range[0]) || 0}
          stroke={strokeColor}
          strokeWidth={1}
        />
      )}

      {/* Ticks + labels */}
      {ticks.map((tick, i) => {
        const y = yScale.scale(tick) as number;

        return (
          <g key={i} transform={`translate(0, ${y})`}>
            {!hideTicks && (
              <line
                x1={0}
                x2={tickSize * tickDirection}
                stroke={strokeColor}
                strokeWidth={1}
              />
            )}
            <text
              x={tickSize * tickDirection + 4 * tickDirection}
              textAnchor={textAnchor}
              dominantBaseline="central"
              fill={color}
              fontSize={11}
              style={{ userSelect: 'none' }}
            >
              {fmt(tick)}
            </text>
          </g>
        );
      })}

      {/* Axis label (rotated) */}
      {label && (
        <text
          x={labelX}
          y={(Number(yScale.range[0]) || 0) / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          fontSize={12}
          fontWeight={600}
          transform={`rotate(-90, ${labelX}, ${(Number(yScale.range[0]) || 0) / 2})`}
          style={{ userSelect: 'none' }}
        >
          {label}
        </text>
      )}
    </g>
  );
}
