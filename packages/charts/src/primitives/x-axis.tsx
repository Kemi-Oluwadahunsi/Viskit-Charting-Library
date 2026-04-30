import { useMemo } from 'react';
import { useCartesianContext } from '@kodemaven/viskit-core';
import type { FormatFunction } from '@kodemaven/viskit-core';
import { useFormat } from '@kodemaven/viskit-core';

export interface XAxisProps {
  /** Position of the axis relative to the plot area */
  position?: 'bottom' | 'top';
  /** Number of ticks to generate (continuous scales only) */
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

export function XAxis({
  position = 'bottom',
  tickCount,
  tickSize = 6,
  format,
  label,
  color = '#94A3B8',
  strokeColor = 'rgba(255,255,255,0.15)',
  hideAxisLine = false,
  hideTicks = false,
  'aria-label': ariaLabel,
}: XAxisProps) {
  const { xScale, innerHeight } = useCartesianContext();
  const fmt = useFormat(format);

  const ticks = useMemo(
    () => xScale.ticks(tickCount),
    [xScale, tickCount],
  );

  const y = position === 'bottom' ? innerHeight : 0;
  const tickDirection = position === 'bottom' ? 1 : -1;
  const labelY = position === 'bottom' ? 40 : -40;
  const textAnchor = 'middle' as const;
  const dominantBaseline = position === 'bottom' ? 'hanging' : 'auto';
  const bandwidth = xScale.bandwidth ?? 0;

  return (
    <g
      aria-label={ariaLabel ?? 'X axis'}
      transform={`translate(0, ${y})`}
    >
      {/* Axis line */}
      {!hideAxisLine && (
        <line
          x1={0}
          x2={Number(xScale.range[1]) || 0}
          y1={0}
          y2={0}
          stroke={strokeColor}
          strokeWidth={1}
        />
      )}

      {/* Ticks + labels */}
      {ticks.map((tick, i) => {
        const x = (xScale.scale(tick) as number) + bandwidth / 2;

        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            {!hideTicks && (
              <line
                y1={0}
                y2={tickSize * tickDirection}
                stroke={strokeColor}
                strokeWidth={1}
              />
            )}
            <text
              y={tickSize * tickDirection + 4 * tickDirection}
              textAnchor={textAnchor}
              dominantBaseline={dominantBaseline}
              fill={color}
              fontSize={11}
              style={{ userSelect: 'none' }}
            >
              {fmt(tick)}
            </text>
          </g>
        );
      })}

      {/* Axis label */}
      {label && (
        <text
          x={(Number(xScale.range[1]) || 0) / 2}
          y={labelY}
          textAnchor="middle"
          fill={color}
          fontSize={12}
          fontWeight={600}
          style={{ userSelect: 'none' }}
        >
          {label}
        </text>
      )}
    </g>
  );
}
