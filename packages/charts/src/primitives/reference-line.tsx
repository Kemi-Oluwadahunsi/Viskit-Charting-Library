// ─────────────────────────────────────────────────
// <ReferenceLine> — Annotation line at a data value
// ─────────────────────────────────────────────────
// Renders a horizontal or vertical reference line
// at a specified value, with optional label.
//
// Usage:
//   <Chart data={data} height={300}>
//     <LineSeries field="value" />
//     <ReferenceLine value={75} label="Target" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo } from 'react';
import { useChartContext, useCartesianContext } from '@kodemaven/viskit-core';

export interface ReferenceLineProps {
  /** The data value where the line should appear */
  value: number | string;
  /** Direction (default: 'horizontal' for numbers, 'vertical' for strings) */
  direction?: 'horizontal' | 'vertical';
  /** Label text */
  label?: string;
  /** Line color (default: '#94a3b8') */
  color?: string;
  /** Stroke dash array (default: '6 4') */
  strokeDasharray?: string;
  /** Line width (default: 1.5) */
  strokeWidth?: number;
  /** Label font size (default: 11) */
  fontSize?: number;
}

export function ReferenceLine({
  value,
  direction: dirProp,
  label,
  color = '#94a3b8',
  strokeDasharray = '6 4',
  strokeWidth = 1.5,
  fontSize = 11,
}: ReferenceLineProps) {
  const { dimensions } = useChartContext();
  const cartesian = useCartesianContext();
  const { innerWidth, innerHeight } = dimensions;

  const line = useMemo(() => {
    const dir = dirProp ?? (typeof value === 'number' ? 'horizontal' : 'vertical');

    if (dir === 'horizontal') {
      const y = cartesian?.yScale
        ? cartesian.yScale.scale(value as number) as number
        : ((value as number) / 100) * innerHeight;

      return {
        x1: 0, y1: y, x2: innerWidth, y2: y,
        labelX: innerWidth + 6, labelY: y,
        labelAnchor: 'start' as const,
      };
    }

    // Vertical
    let x: number;
    if (cartesian?.xScale) {
      const pos = cartesian.xScale.scale(String(value)) as number;
      const bw = cartesian.xScale.bandwidth ?? 0;
      x = (pos ?? 0) + bw / 2;
    } else {
      x = ((value as number) / 100) * innerWidth;
    }

    return {
      x1: x, y1: 0, x2: x, y2: innerHeight,
      labelX: x, labelY: -8,
      labelAnchor: 'middle' as const,
    };
  }, [value, dirProp, cartesian, innerWidth, innerHeight]);

  return (
    <g>
      <line
        x1={line.x1} y1={line.y1}
        x2={line.x2} y2={line.y2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        opacity={0.8}
      />
      {label && (
        <text
          x={line.labelX} y={line.labelY}
          textAnchor={line.labelAnchor}
          dominantBaseline="central"
          fill={color}
          fontSize={fontSize}
          fontWeight={600}
        >
          {label}
        </text>
      )}
    </g>
  );
}
