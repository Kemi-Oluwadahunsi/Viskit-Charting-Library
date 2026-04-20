// ─────────────────────────────────────────────────
// <GaugeSeries> — Semi-circle gauge / speedometer
// ─────────────────────────────────────────────────
// Renders a semi-circle gauge with segments and a
// needle pointing to the current value.
//
// Usage:
//   <Chart data={[]} height={300}>
//     <GaugeSeries value={72} min={0} max={100} segments={[30,60,100]} />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { arc as d3Arc } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { useChartContext } from '@viskit/core';

export interface GaugeSeriesProps {
  /** Current value */
  value: number;
  /** Minimum scale value (default: 0) */
  min?: number;
  /** Maximum scale value (default: 100) */
  max?: number;
  /** Segment thresholds (ascending, e.g. [30, 60, 100]) */
  segments?: number[];
  /** Colors per segment (default: red → yellow → green) */
  segmentColors?: string[];
  /** Gauge arc thickness (default: 0.3) */
  thickness?: number;
  /** Start angle in radians (default: -π/2) */
  startAngle?: number;
  /** End angle in radians (default: π/2) */
  endAngle?: number;
  /** Show numeric value label (default: true) */
  showValue?: boolean;
  /** ARIA label */
  'aria-label'?: string;
}

const DEFAULT_SEGMENT_COLORS = ['#ef4444', '#f59e0b', '#22c55e'];

export function GaugeSeries({
  value,
  min = 0,
  max = 100,
  segments,
  segmentColors = DEFAULT_SEGMENT_COLORS,
  thickness = 0.3,
  startAngle = -Math.PI / 2,
  endAngle = Math.PI / 2,
  showValue = true,
  'aria-label': ariaLabel,
}: GaugeSeriesProps) {
  const { dimensions } = useChartContext();
  const [isHovered, setIsHovered] = useState(false);

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);

  const { innerWidth, innerHeight } = dimensions;

  const layout = useMemo(() => {
    const cx = innerWidth / 2;
    const cy = innerHeight * 0.8; // bottom-biased for semi-circle
    const radius = Math.min(cx, innerHeight * 0.7);
    const inner = radius * (1 - thickness);

    const angleScale = scaleLinear()
      .domain([min, max])
      .range([startAngle, endAngle])
      .clamp(true);

    // Build segment arcs
    const segs = segments ?? [max];
    const segArcs = segs.map((threshold, i) => {
      const prev = i > 0 ? segs[i - 1]! : min;
      const arcGen = d3Arc()
        .innerRadius(inner)
        .outerRadius(radius)
        .startAngle(angleScale(prev)!)
        .endAngle(angleScale(threshold)!)
        .cornerRadius(3);
      return {
        path: arcGen(null as never) as string,
        color: segmentColors[i] ?? DEFAULT_SEGMENT_COLORS[i % DEFAULT_SEGMENT_COLORS.length]!,
      };
    });

    // Needle
    const needleAngle = angleScale(Math.max(min, Math.min(max, value)))!;
    const needleLength = radius * 0.85;
    const nx = cx + needleLength * Math.cos(needleAngle - Math.PI / 2);
    const ny = cy + needleLength * Math.sin(needleAngle - Math.PI / 2);

    return { cx, cy, radius, segArcs, needleAngle, nx, ny, needleLength };
  }, [value, min, max, segments, segmentColors, thickness, startAngle, endAngle, innerWidth, innerHeight]);

  // Determine which segment the value falls into for color
  const valueColor = useMemo(() => {
    const segs = segments ?? [max];
    for (let i = 0; i < segs.length; i++) {
      if (value <= segs[i]!) {
        return segmentColors[i] ?? DEFAULT_SEGMENT_COLORS[i % DEFAULT_SEGMENT_COLORS.length]!;
      }
    }
    return segmentColors[segmentColors.length - 1] ?? '#22c55e';
  }, [value, segments, max, segmentColors]);

  return (
    <g
      role="img"
      aria-label={ariaLabel ?? `Gauge: ${value} (${min}–${max})`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ cursor: 'pointer' }}
    >
      {/* Segment arcs */}
      <g transform={`translate(${layout.cx},${layout.cy}) rotate(90)`}>
        {layout.segArcs.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill={s.color}
            opacity={isHovered ? 1 : 0.75}
            style={{ transition: 'opacity 200ms ease' }}
          />
        ))}
      </g>

      {/* Needle */}
      <line
        x1={layout.cx}
        y1={layout.cy}
        x2={layout.nx}
        y2={layout.ny}
        stroke="#e2e8f0"
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle
        cx={layout.cx}
        cy={layout.cy}
        r={6}
        fill="#e2e8f0"
      />

      {/* Value label */}
      {showValue && (
        <text
          x={layout.cx}
          y={layout.cy + 28}
          textAnchor="middle"
          fill={valueColor}
          fontSize={24}
          fontWeight={700}
          style={{ pointerEvents: 'none' }}
        >
          {value}
        </text>
      )}

      {/* Min / Max labels */}
      <text
        x={layout.cx - layout.radius}
        y={layout.cy + 16}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        style={{ pointerEvents: 'none' }}
      >
        {min}
      </text>
      <text
        x={layout.cx + layout.radius}
        y={layout.cy + 16}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        style={{ pointerEvents: 'none' }}
      >
        {max}
      </text>
    </g>
  );
}
