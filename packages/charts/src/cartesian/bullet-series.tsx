// ─────────────────────────────────────────────────
// <BulletSeries> — Qualitative range indicator (Stephen Few)
// ─────────────────────────────────────────────────
// Renders a bullet chart showing a primary measure
// against a target with qualitative background ranges
// (e.g. poor / satisfactory / good).
//
// Usage:
//   <Chart data={bulletData} height={200}>
//     <BulletSeries
//       value={72} target={85}
//       ranges={[30, 60, 100]}
//     />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { useChartContext } from '@viskit/core';

export interface BulletSeriesProps {
  /** Current measure value */
  value: number;
  /** Target / comparator value */
  target: number;
  /** Qualitative ranges (ascending thresholds, e.g. [30, 60, 100]) */
  ranges: number[];
  /** Labels for each range zone */
  rangeLabels?: string[];
  /** Range zone colors (dark to light, default: grays) */
  rangeColors?: string[];
  /** Color of the value bar (default: '#6366f1') */
  barColor?: string;
  /** Color of the target marker (default: '#f59e0b') */
  targetColor?: string;
  /** Height of the value bar relative to range (0–1, default: 0.4) */
  barHeight?: number;
  /** Orientation (default: 'horizontal') */
  orientation?: 'horizontal' | 'vertical';
  /** ARIA label */
  'aria-label'?: string;
}

const DEFAULT_RANGE_COLORS = ['#334155', '#475569', '#64748b'];

export function BulletSeries({
  value,
  target,
  ranges,
  rangeLabels,
  rangeColors = DEFAULT_RANGE_COLORS,
  barColor = '#6366f1',
  targetColor = '#f59e0b',
  barHeight = 0.4,
  orientation = 'horizontal',
  'aria-label': ariaLabel,
}: BulletSeriesProps) {
  const { dimensions } = useChartContext();
  const [isHovered, setIsHovered] = useState(false);

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);

  const { innerWidth, innerHeight } = dimensions;
  const isHorizontal = orientation === 'horizontal';
  const totalLength = isHorizontal ? innerWidth : innerHeight;
  const totalThickness = isHorizontal ? innerHeight : innerWidth;

  const maxRange = Math.max(...ranges, target, value);

  const layout = useMemo(() => {
    const scale = (v: number) => (v / maxRange) * totalLength;

    // Qualitative range rects (from 0 to each threshold)
    const sortedRanges = [...ranges].sort((a, b) => a - b);
    const rangeRects = sortedRanges.map((r, i) => {
      const prev = i > 0 ? sortedRanges[i - 1]! : 0;
      return {
        start: scale(prev),
        length: scale(r) - scale(prev),
        color: rangeColors[i] ?? DEFAULT_RANGE_COLORS[i % DEFAULT_RANGE_COLORS.length]!,
        label: rangeLabels?.[i],
      };
    });

    const barThickness = totalThickness * barHeight;
    const barOffset = (totalThickness - barThickness) / 2;

    return {
      rangeRects,
      barLength: scale(value),
      barThickness,
      barOffset,
      targetPos: scale(target),
      totalThickness,
    };
  }, [ranges, value, target, maxRange, totalLength, totalThickness, barHeight, rangeColors, rangeLabels]);

  return (
    <g
      role="img"
      aria-label={ariaLabel ?? `Bullet chart: ${value} of ${target} target`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ cursor: 'pointer' }}
    >
      {/* Qualitative ranges (background) */}
      {layout.rangeRects.map((r, i) =>
        isHorizontal ? (
          <rect
            key={`range-${i}`}
            x={r.start}
            y={0}
            width={r.length}
            height={layout.totalThickness}
            fill={r.color}
            rx={i === layout.rangeRects.length - 1 ? 3 : 0}
          />
        ) : (
          <rect
            key={`range-${i}`}
            x={0}
            y={totalLength - r.start - r.length}
            width={layout.totalThickness}
            height={r.length}
            fill={r.color}
            ry={i === layout.rangeRects.length - 1 ? 3 : 0}
          />
        ),
      )}

      {/* Value bar */}
      {isHorizontal ? (
        <rect
          x={0}
          y={layout.barOffset}
          width={layout.barLength}
          height={layout.barThickness}
          fill={barColor}
          rx={2}
          opacity={isHovered ? 1 : 0.9}
        />
      ) : (
        <rect
          x={layout.barOffset}
          y={totalLength - layout.barLength}
          width={layout.barThickness}
          height={layout.barLength}
          fill={barColor}
          ry={2}
          opacity={isHovered ? 1 : 0.9}
        />
      )}

      {/* Target marker */}
      {isHorizontal ? (
        <line
          x1={layout.targetPos}
          y1={layout.barOffset - 4}
          x2={layout.targetPos}
          y2={layout.barOffset + layout.barThickness + 4}
          stroke={targetColor}
          strokeWidth={3}
        />
      ) : (
        <line
          x1={layout.barOffset - 4}
          y1={totalLength - layout.targetPos}
          x2={layout.barOffset + layout.barThickness + 4}
          y2={totalLength - layout.targetPos}
          stroke={targetColor}
          strokeWidth={3}
        />
      )}

      {/* Hover label */}
      {isHovered && (
        <text
          x={isHorizontal ? layout.barLength + 8 : layout.totalThickness / 2}
          y={isHorizontal ? layout.totalThickness / 2 : totalLength - layout.barLength - 8}
          textAnchor={isHorizontal ? 'start' : 'middle'}
          dominantBaseline="central"
          fill="#e2e8f0"
          fontSize={12}
          fontWeight={700}
          style={{ pointerEvents: 'none' }}
        >
          {value} / {target}
        </text>
      )}
    </g>
  );
}
