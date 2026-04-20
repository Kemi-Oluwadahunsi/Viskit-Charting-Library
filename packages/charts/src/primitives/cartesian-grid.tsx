import { useMemo } from 'react';
import { useCartesianContext } from '@viskit/core';

export interface CartesianGridProps {
  /** Show horizontal grid lines (default: true) */
  horizontal?: boolean;
  /** Show vertical grid lines (default: false) */
  vertical?: boolean;
  /** Number of horizontal ticks */
  horizontalTickCount?: number;
  /** Number of vertical ticks */
  verticalTickCount?: number;
  /** Stroke color */
  stroke?: string;
  /** Stroke dash pattern (e.g., '4 2') */
  strokeDasharray?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Opacity */
  opacity?: number;
}

export function CartesianGrid({
  horizontal = true,
  vertical = false,
  horizontalTickCount = 5,
  verticalTickCount,
  stroke = 'rgba(255,255,255,0.06)',
  strokeDasharray,
  strokeWidth = 1,
  opacity = 1,
}: CartesianGridProps) {
  const { xScale, yScale, innerWidth, innerHeight } = useCartesianContext();

  const hLines = useMemo(() => {
    if (!horizontal) return [];
    return yScale.ticks(horizontalTickCount).map(
      (tick) => yScale.scale(tick) as number,
    );
  }, [horizontal, yScale, horizontalTickCount]);

  const vLines = useMemo(() => {
    if (!vertical) return [];
    const ticks = xScale.ticks(verticalTickCount);
    const bandwidth = xScale.bandwidth ?? 0;
    return ticks.map(
      (tick) => (xScale.scale(tick) as number) + bandwidth / 2,
    );
  }, [vertical, xScale, verticalTickCount]);

  return (
    <g aria-hidden="true" opacity={opacity}>
      {hLines.map((y, i) => (
        <line
          key={`h-${i}`}
          x1={0}
          x2={innerWidth}
          y1={y}
          y2={y}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
      ))}
      {vLines.map((x, i) => (
        <line
          key={`v-${i}`}
          x1={x}
          x2={x}
          y1={0}
          y2={innerHeight}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
      ))}
    </g>
  );
}
