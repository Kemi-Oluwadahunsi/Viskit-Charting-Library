// ─────────────────────────────────────────────────
// <PyramidSeries> — Population pyramid / triangular funnel
// ─────────────────────────────────────────────────
// Renders a symmetric pyramid chart where each row's
// width is proportional to its value. Supports both
// upward (default) and downward orientations.
//
// Usage:
//   <Chart data={data} height={400}>
//     <PyramidSeries field="population" nameField="ageGroup" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { useChartContext } from '@kodemaven/viskit-core';

export interface PyramidSeriesProps<TDatum = Record<string, unknown>> {
  /** Numeric field for segment value */
  field: keyof TDatum & string;
  /** Field for the segment label */
  nameField?: keyof TDatum & string;
  /** Direction of the pyramid ('up' widens at bottom, 'down' widens at top) */
  direction?: 'up' | 'down';
  /** Gap between segments in px (default: 3) */
  gap?: number;
  /** Opacity 0–1 (default: 1) */
  opacity?: number;
  /** Corner radius for segments (default: 2) */
  radius?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function PyramidSeries<TDatum extends Record<string, unknown>>({
  field,
  nameField,
  direction = 'up',
  gap = 3,
  opacity = 1,
  radius = 2,
  'aria-label': ariaLabel,
}: PyramidSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const segments = useMemo(() => {
    const typedData = data as TDatum[];
    const count = typedData.length;
    if (count === 0) return [];

    const values = typedData.map((d) => Number(d[field]) || 0);
    const maxVal = Math.max(...values);
    const totalGap = gap * (count - 1);
    const segmentH = (innerHeight - totalGap) / count;
    const cx = innerWidth / 2;

    return typedData.map((d, i) => {
      const value = values[i]!;
      const name = nameField ? String(d[nameField]) : `Level ${i + 1}`;
      const widthRatio = maxVal > 0 ? value / maxVal : 0;
      const halfW = (innerWidth * widthRatio) / 2;

      const y = i * (segmentH + gap);

      return {
        x: cx - halfW,
        y: direction === 'up' ? innerHeight - y - segmentH : y,
        width: halfW * 2,
        height: segmentH,
        name,
        value,
        color: colorScale(name),
        datum: d,
      };
    });
  }, [data, field, nameField, direction, gap, innerWidth, innerHeight, colorScale]);

  return (
    <g
      role="list"
      aria-label={ariaLabel ?? 'Pyramid chart'}
    >
      {segments.map((seg, i) => (
        <g
          key={seg.name}
          role="listitem"
          aria-label={`${seg.name}: ${seg.value}`}
          onMouseEnter={() => handleEnter(i)}
          onMouseLeave={handleLeave}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x={seg.x}
            y={seg.y}
            width={seg.width}
            height={seg.height}
            rx={radius}
            ry={radius}
            fill={seg.color}
            opacity={hovered === null || hovered === i ? opacity : opacity * 0.4}
            stroke={hovered === i ? '#fff' : 'none'}
            strokeWidth={hovered === i ? 2 : 0}
          />
          {seg.width > 60 && (
            <text
              x={seg.x + seg.width / 2}
              y={seg.y + seg.height / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              fontWeight={500}
              fill="#fff"
              pointerEvents="none"
            >
              {seg.name}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}
