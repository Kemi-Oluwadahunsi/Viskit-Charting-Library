// ─────────────────────────────────────────────────
// <VennDiagram> — Overlapping circles for set intersection
// ─────────────────────────────────────────────────
// Renders 2 or 3 overlapping circles with intersection
// regions. Each set is sized proportionally to its value.
//
// Usage:
//   <Chart data={[]} height={400}>
//     <VennDiagram
//       sets={[
//         { key: 'A', label: 'Set A', size: 100 },
//         { key: 'B', label: 'Set B', size: 80 },
//       ]}
//       intersections={[
//         { sets: ['A', 'B'], size: 30 },
//       ]}
//     />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { useChartContext } from '@kodemaven/viskit-core';

export interface VennSet {
  key: string;
  label: string;
  size: number;
  color?: string;
}

export interface VennIntersection {
  sets: string[];
  size: number;
  label?: string;
}

export interface VennDiagramProps {
  /** Array of sets to display */
  sets: VennSet[];
  /** Intersections between sets */
  intersections?: VennIntersection[];
  /** Labels visibility (default: true) */
  showLabels?: boolean;
  /** Opacity for circles (default: 0.35) */
  opacity?: number;
  /** Stroke width for circle borders (default: 2) */
  strokeWidth?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function VennDiagram({
  sets,
  intersections = [],
  showLabels = true,
  opacity = 0.35,
  strokeWidth = 2,
  'aria-label': ariaLabel,
}: VennDiagramProps) {
  const { dimensions, colorScale } = useChartContext();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleEnter = useCallback((key: string) => setHovered(key), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const layout = useMemo(() => {
    const count = sets.length;
    if (count === 0) return [];

    const cx = innerWidth / 2;
    const cy = innerHeight / 2;
    const maxSize = Math.max(...sets.map((s) => s.size));
    const baseRadius = Math.min(cx, cy) * 0.42;

    if (count === 1) {
      const r = baseRadius * Math.sqrt(sets[0]!.size / maxSize);
      return [{ ...sets[0]!, cx, cy, radius: r }];
    }

    if (count === 2) {
      const r0 = baseRadius * Math.sqrt(sets[0]!.size / maxSize);
      const r1 = baseRadius * Math.sqrt(sets[1]!.size / maxSize);
      const overlap = (r0 + r1) * 0.45;
      return [
        { ...sets[0]!, cx: cx - overlap * 0.55, cy, radius: r0 },
        { ...sets[1]!, cx: cx + overlap * 0.55, cy, radius: r1 },
      ];
    }

    // 3 sets: arrange in equilateral triangle pointing up
    const spread = baseRadius * 0.65;
    const angles = [-Math.PI / 2, -Math.PI / 2 + (2 * Math.PI) / 3, -Math.PI / 2 + (4 * Math.PI) / 3];
    return sets.map((s, i) => {
      const angle = angles[i]!;
      const r = baseRadius * Math.sqrt(s.size / maxSize);
      return {
        ...s,
        cx: cx + Math.cos(angle) * spread,
        cy: cy + Math.sin(angle) * spread,
        radius: r,
      };
    });
  }, [sets, innerWidth, innerHeight]);

  // Find intersection label positions
  const intersectionLabels = useMemo(() => {
    const chartCx = innerWidth / 2;
    const chartCy = innerHeight / 2;

    return intersections.map((int) => {
      const circles = int.sets
        .map((key) => layout.find((c) => c.key === key))
        .filter(Boolean) as (typeof layout)[number][];
      if (circles.length < 2) return null;

      const midX = circles.reduce((sum, c) => sum + c.cx, 0) / circles.length;
      const midY = circles.reduce((sum, c) => sum + c.cy, 0) / circles.length;

      // For pair intersections (2 sets), push the label outward from the chart center
      // so it sits in the overlap region between the two circles, not at dead center
      if (circles.length === 2) {
        const dx = midX - chartCx;
        const dy = midY - chartCy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1) {
          const push = 0.55;
          return {
            x: midX + (dx / dist) * circles[0]!.radius * push,
            y: midY + (dy / dist) * circles[0]!.radius * push,
            label: int.label ?? String(int.size),
            sets: int.sets,
          };
        }
      }

      // Triple intersection or fallback → center
      return {
        x: midX,
        y: midY,
        label: int.label ?? String(int.size),
        sets: int.sets,
      };
    }).filter(Boolean);
  }, [intersections, layout, innerWidth, innerHeight]);

  return (
    <g
      role="img"
      aria-label={ariaLabel ?? 'Venn diagram'}
    >
      {/* Circles */}
      {layout.map((circle) => {
        const fillColor = circle.color ?? colorScale(circle.key);
        const isHovered = hovered === circle.key;
        // Place label on the far side of the circle, away from chart center
        const chartCx = innerWidth / 2;
        const chartCy = innerHeight / 2;
        const dx = circle.cx - chartCx;
        const dy = circle.cy - chartCy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const labelOffset = circle.radius * 0.55;
        const labelX = circle.cx + (dx / dist) * labelOffset;
        const labelY = circle.cy + (dy / dist) * labelOffset;

        return (
          <g
            key={circle.key}
            onMouseEnter={() => handleEnter(circle.key)}
            onMouseLeave={handleLeave}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={circle.cx}
              cy={circle.cy}
              r={circle.radius}
              fill={fillColor}
              opacity={isHovered ? Math.min(opacity + 0.15, 0.7) : opacity}
              stroke={fillColor}
              strokeWidth={strokeWidth}
              strokeOpacity={isHovered ? 1 : 0.8}
            />
            {showLabels && (
              <>
                <text
                  x={labelX}
                  y={labelY - 8}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={13}
                  fontWeight={600}
                  fill={isHovered ? '#fff' : '#E2E8F0'}
                  pointerEvents="none"
                >
                  {circle.label}
                </text>
                <text
                  x={labelX}
                  y={labelY + 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fill={isHovered ? '#fff' : '#94A3B8'}
                  pointerEvents="none"
                >
                  {circle.size}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* Intersection labels */}
      {showLabels && intersectionLabels.map((intLabel, i) => intLabel && (
        <text
          key={`int-${i}`}
          x={intLabel.x}
          y={intLabel.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
          fontWeight={700}
          fill="#fff"
          pointerEvents="none"
        >
          {intLabel.label}
        </text>
      ))}
    </g>
  );
}
