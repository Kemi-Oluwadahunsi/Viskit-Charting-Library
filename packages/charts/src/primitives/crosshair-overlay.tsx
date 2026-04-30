// ─────────────────────────────────────────────────
// <CrosshairOverlay> — Cursor-tracking crosshair
// ─────────────────────────────────────────────────
// Renders vertical and/or horizontal lines that follow
// the cursor position within the chart area.
//
// Usage:
//   <Chart data={data} height={300}>
//     <LineSeries field="value" />
//     <CrosshairOverlay />
//   </Chart>
// ─────────────────────────────────────────────────

import { useState, useCallback, useRef } from 'react';
import { useChartContext } from '@kodemaven/viskit-core';

export interface CrosshairOverlayProps {
  /** Show vertical line (default: true) */
  vertical?: boolean;
  /** Show horizontal line (default: true) */
  horizontal?: boolean;
  /** Line color (default: '#94a3b8') */
  color?: string;
  /** Stroke dash array (default: '4 3') */
  strokeDasharray?: string;
  /** Line width (default: 1) */
  strokeWidth?: number;
  /** Show coordinate labels (default: false) */
  showLabels?: boolean;
}

export function CrosshairOverlay({
  vertical = true,
  horizontal = true,
  color = '#94a3b8',
  strokeDasharray = '4 3',
  strokeWidth = 1,
  showLabels = false,
}: CrosshairOverlayProps) {
  const { dimensions } = useChartContext();
  const { innerWidth, innerHeight, margin } = dimensions;
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const overlayRef = useRef<SVGRectElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGRectElement>) => {
      const svg = overlayRef.current?.closest('svg');
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = Math.max(0, Math.min(innerWidth, e.clientX - rect.left - margin.left));
      const y = Math.max(0, Math.min(innerHeight, e.clientY - rect.top - margin.top));
      setPosition({ x, y });
    },
    [innerWidth, innerHeight, margin],
  );

  const handleMouseLeave = useCallback(() => setPosition(null), []);

  return (
    <g>
      {/* Invisible overlay for capturing mouse events */}
      <rect
        ref={overlayRef}
        x={0}
        y={0}
        width={innerWidth}
        height={innerHeight}
        fill="transparent"
        style={{ cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {position && (
        <g style={{ pointerEvents: 'none' }}>
          {vertical && (
            <line
              x1={position.x} y1={0}
              x2={position.x} y2={innerHeight}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              opacity={0.6}
            />
          )}
          {horizontal && (
            <line
              x1={0} y1={position.y}
              x2={innerWidth} y2={position.y}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              opacity={0.6}
            />
          )}
          {/* Intersection dot */}
          <circle
            cx={position.x}
            cy={position.y}
            r={3}
            fill={color}
            opacity={0.8}
          />
          {showLabels && (
            <>
              <text
                x={position.x}
                y={innerHeight + 14}
                textAnchor="middle"
                fill={color}
                fontSize={9}
              >
                {Math.round(position.x)}
              </text>
              <text
                x={-6}
                y={position.y}
                textAnchor="end"
                dominantBaseline="central"
                fill={color}
                fontSize={9}
              >
                {Math.round(position.y)}
              </text>
            </>
          )}
        </g>
      )}
    </g>
  );
}
