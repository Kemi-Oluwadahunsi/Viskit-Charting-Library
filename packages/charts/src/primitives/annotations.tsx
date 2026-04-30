// ─────────────────────────────────────────────────
// <Annotations> — Text and shape annotations
// ─────────────────────────────────────────────────
// Renders annotations (text labels, arrows, circles)
// at specified pixel or data coordinates within a chart.
//
// Usage:
//   <Chart data={data} height={300}>
//     <LineSeries field="value" />
//     <Annotations items={[
//       { type: 'text', x: 100, y: 50, text: 'Peak' },
//       { type: 'arrow', x: 100, y: 50, dx: 0, dy: 30 },
//     ]} />
//   </Chart>
// ─────────────────────────────────────────────────

import { useChartContext } from '@kodemaven/viskit-core';

export type AnnotationItem =
  | {
      type: 'text';
      x: number;
      y: number;
      text: string;
      color?: string;
      fontSize?: number;
      fontWeight?: number;
      anchor?: 'start' | 'middle' | 'end';
    }
  | {
      type: 'circle';
      x: number;
      y: number;
      radius?: number;
      color?: string;
      fill?: string;
      strokeWidth?: number;
    }
  | {
      type: 'arrow';
      x: number;
      y: number;
      dx: number;
      dy: number;
      color?: string;
      strokeWidth?: number;
    }
  | {
      type: 'rect';
      x: number;
      y: number;
      width: number;
      height: number;
      color?: string;
      fill?: string;
      rx?: number;
    };

export interface AnnotationsProps {
  /** Array of annotation items to render */
  items: AnnotationItem[];
  /** Default color for all annotations (default: '#475569') */
  color?: string;
}

export function Annotations({ items, color: defaultColor = '#475569' }: AnnotationsProps) {
  useChartContext(); // Ensure we're inside a chart

  return (
    <g aria-label="Chart annotations" style={{ pointerEvents: 'none' }}>
      {/* Arrow marker definition */}
      <defs>
        <marker
          id="viskit-annotation-arrow"
          viewBox="0 0 10 10"
          refX={10}
          refY={5}
          markerWidth={6}
          markerHeight={6}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={defaultColor} />
        </marker>
      </defs>

      {items.map((item, i) => {
        switch (item.type) {
          case 'text':
            return (
              <text
                key={i}
                x={item.x}
                y={item.y}
                fill={item.color ?? defaultColor}
                fontSize={item.fontSize ?? 12}
                fontWeight={item.fontWeight ?? 500}
                textAnchor={item.anchor ?? 'start'}
                dominantBaseline="central"
              >
                {item.text}
              </text>
            );

          case 'circle':
            return (
              <circle
                key={i}
                cx={item.x}
                cy={item.y}
                r={item.radius ?? 4}
                fill={item.fill ?? 'none'}
                stroke={item.color ?? defaultColor}
                strokeWidth={item.strokeWidth ?? 1.5}
              />
            );

          case 'arrow':
            return (
              <line
                key={i}
                x1={item.x}
                y1={item.y}
                x2={item.x + item.dx}
                y2={item.y + item.dy}
                stroke={item.color ?? defaultColor}
                strokeWidth={item.strokeWidth ?? 1.5}
                markerEnd="url(#viskit-annotation-arrow)"
              />
            );

          case 'rect':
            return (
              <rect
                key={i}
                x={item.x}
                y={item.y}
                width={item.width}
                height={item.height}
                fill={item.fill ?? 'none'}
                stroke={item.color ?? defaultColor}
                strokeWidth={1.5}
                rx={item.rx ?? 0}
              />
            );

          default:
            return null;
        }
      })}
    </g>
  );
}
