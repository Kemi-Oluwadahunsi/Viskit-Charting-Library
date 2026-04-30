// ─────────────────────────────────────────────────
// <ReferenceBand> — Shaded region between two values
// ─────────────────────────────────────────────────
// Renders a filled rectangle between two data values,
// useful for highlighting target zones or ranges.
//
// Usage:
//   <Chart data={data} height={300}>
//     <LineSeries field="value" />
//     <ReferenceBand from={60} to={80} label="Target" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo } from 'react';
import { useChartContext, useCartesianContext } from '@kodemaven/viskit-core';

export interface ReferenceBandProps {
  /** Start value of the band */
  from: number;
  /** End value of the band */
  to: number;
  /** Direction (default: 'horizontal') */
  direction?: 'horizontal' | 'vertical';
  /** Label text */
  label?: string;
  /** Fill color (default: 'rgba(99, 102, 241, 0.1)') */
  color?: string;
  /** Border color (default: none) */
  strokeColor?: string;
  /** Fill opacity (default: 0.15) */
  opacity?: number;
  /** Label font size (default: 10) */
  fontSize?: number;
}

export function ReferenceBand({
  from,
  to,
  direction = 'horizontal',
  label,
  color = 'rgba(99, 102, 241, 0.1)',
  strokeColor,
  opacity = 0.15,
  fontSize = 10,
}: ReferenceBandProps) {
  const { dimensions } = useChartContext();
  const cartesian = useCartesianContext();
  const { innerWidth, innerHeight } = dimensions;

  const band = useMemo(() => {
    if (direction === 'horizontal') {
      const yScale = cartesian?.yScale;
      const y1 = yScale ? yScale.scale(Math.max(from, to)) as number : (Math.max(from, to) / 100) * innerHeight;
      const y2 = yScale ? yScale.scale(Math.min(from, to)) as number : (Math.min(from, to) / 100) * innerHeight;

      return {
        x: 0,
        y: Math.min(y1, y2),
        width: innerWidth,
        height: Math.abs(y2 - y1),
        labelX: innerWidth - 6,
        labelY: (y1 + y2) / 2,
      };
    }

    // Vertical
    const xScale = cartesian?.xScale;
    const x1 = xScale ? xScale.scale(Math.min(from, to)) as number : (Math.min(from, to) / 100) * innerWidth;
    const x2 = xScale ? xScale.scale(Math.max(from, to)) as number : (Math.max(from, to) / 100) * innerWidth;

    return {
      x: Math.min(x1, x2),
      y: 0,
      width: Math.abs(x2 - x1),
      height: innerHeight,
      labelX: (x1 + x2) / 2,
      labelY: -8,
    };
  }, [from, to, direction, cartesian, innerWidth, innerHeight]);

  return (
    <g>
      <rect
        x={band.x}
        y={band.y}
        width={band.width}
        height={band.height}
        fill={color}
        opacity={opacity}
        stroke={strokeColor ?? 'none'}
        strokeWidth={strokeColor ? 1 : 0}
        style={{ pointerEvents: 'none' }}
      />
      {label && (
        <text
          x={band.labelX}
          y={band.labelY}
          textAnchor={direction === 'horizontal' ? 'end' : 'middle'}
          dominantBaseline="central"
          fill="#94a3b8"
          fontSize={fontSize}
          fontWeight={500}
          style={{ pointerEvents: 'none' }}
        >
          {label}
        </text>
      )}
    </g>
  );
}
