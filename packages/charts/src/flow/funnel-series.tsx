// ─────────────────────────────────────────────────
// <FunnelSeries> — Sales/conversion funnel
// ─────────────────────────────────────────────────
// Renders a funnel chart with trapezoid segments
// that narrow from top to bottom based on values.
//
// Usage:
//   <Chart data={funnelData} height={400}>
//     <FunnelSeries field="count" nameField="stage" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { useChartContext } from '@kodemaven/viskit-core';

export interface FunnelSeriesProps<TDatum = Record<string, unknown>> {
  /** Numeric field for segment size */
  field: keyof TDatum & string;
  /** Field for the segment label */
  nameField?: keyof TDatum & string;
  /** Gap between segments in px (default: 4) */
  gap?: number;
  /** Minimum width ratio for the narrowest segment (0–1, default: 0.3) */
  neckWidth?: number;
  /** Opacity 0–1 (default: 1) */
  opacity?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function FunnelSeries<TDatum extends Record<string, unknown>>({
  field,
  nameField,
  gap = 4,
  neckWidth = 0.3,
  opacity = 1,
  'aria-label': ariaLabel,
}: FunnelSeriesProps<TDatum>) {
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
      const name = nameField ? String(d[nameField]) : `Stage ${i + 1}`;
      const ratio = maxVal > 0 ? value / maxVal : 0;

      // Width narrows linearly from full to neckWidth
      const widthRatio = 1 - (1 - neckWidth) * (i / Math.max(1, count - 1));
      const topW = innerWidth * (i === 0 ? 1 : (1 - (1 - neckWidth) * ((i - 1) / Math.max(1, count - 1))));
      const bottomW = innerWidth * widthRatio;

      const y = i * (segmentH + gap);
      const topLeft = cx - topW / 2;
      const topRight = cx + topW / 2;
      const bottomLeft = cx - bottomW / 2;
      const bottomRight = cx + bottomW / 2;

      // Trapezoid path
      const path = `M ${topLeft},${y} L ${topRight},${y} L ${bottomRight},${y + segmentH} L ${bottomLeft},${y + segmentH} Z`;

      return {
        path,
        name,
        value,
        ratio,
        color: colorScale(name),
        y: y + segmentH / 2,
        percent: maxVal > 0 ? ((value / maxVal) * 100).toFixed(0) : '0',
      };
    });
  }, [data, field, nameField, gap, neckWidth, innerWidth, innerHeight, colorScale]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Funnel chart'}>
      {segments.map((s, i) => {
        const isActive = hovered === i;

        return (
          <g key={i}>
            <path
              d={s.path}
              fill={s.color}
              opacity={hovered !== null && !isActive ? opacity * 0.35 : opacity}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 2 : 0}
              role="listitem"
              aria-label={`${s.name}: ${s.value.toLocaleString()} (${s.percent}%)`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
            />
            {/* Label */}
            <text
              x={innerWidth / 2}
              y={s.y - 6}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
              fontWeight={600}
              style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              {s.name}
            </text>
            <text
              x={innerWidth / 2}
              y={s.y + 10}
              textAnchor="middle"
              fill="rgba(255,255,255,0.75)"
              fontSize={11}
              fontWeight={400}
              style={{ pointerEvents: 'none' }}
            >
              {s.value.toLocaleString()} ({s.percent}%)
            </text>
          </g>
        );
      })}
    </g>
  );
}
