// ─────────────────────────────────────────────────
// <ChordDiagram> — Relationship matrix in circular layout
// ─────────────────────────────────────────────────
// Renders a chord diagram using d3-chord.
// The matrix defines flow between groups, arcs
// represent totals, and ribbons represent connections.
//
// Usage:
//   <Chart data={[]} height={400}>
//     <ChordDiagram
//       matrix={[[0, 10, 5], [10, 0, 8], [5, 8, 0]]}
//       labels={['A', 'B', 'C']}
//     />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { chord as d3Chord, ribbon as d3Ribbon } from 'd3-chord';
import { arc as d3Arc } from 'd3-shape';
import { useChartContext } from '@kodemaven/viskit-core';

export interface ChordDiagramProps {
  /** Square matrix of flow values between groups */
  matrix: number[][];
  /** Labels for each group */
  labels?: string[];
  /** Gap between groups in radians (default: 0.05) */
  padAngle?: number;
  /** Ribbon opacity 0–1 (default: 0.6) */
  ribbonOpacity?: number;
  /** Arc opacity 0–1 (default: 1) */
  arcOpacity?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function ChordDiagram({
  matrix,
  labels,
  padAngle = 0.05,
  ribbonOpacity = 0.6,
  arcOpacity = 1,
  'aria-label': ariaLabel,
}: ChordDiagramProps) {
  const { dimensions, colorScale } = useChartContext();
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHoveredGroup(i), []);
  const handleLeave = useCallback(() => setHoveredGroup(null), []);

  const cx = dimensions.innerWidth / 2;
  const cy = dimensions.innerHeight / 2;
  const outerRadius = Math.min(cx, cy) * 0.85;
  const innerRadius = outerRadius - 20;

  const layout = useMemo(() => {
    const chordGen = d3Chord().padAngle(padAngle).sortSubgroups((a, b) => b - a);
    const chords = chordGen(matrix);

    const arcGen = d3Arc<unknown, { startAngle: number; endAngle: number }>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbonGen = d3Ribbon().radius(innerRadius);

    const groups = chords.groups.map((g) => {
      const label = labels?.[g.index] ?? `Group ${g.index + 1}`;
      return {
        index: g.index,
        label,
        path: arcGen(g) ?? '',
        color: colorScale(label),
        startAngle: g.startAngle,
        endAngle: g.endAngle,
        value: g.value,
      };
    });

    const ribbons = chords.map((c) => {
      const srcLabel = labels?.[c.source.index] ?? `Group ${c.source.index + 1}`;
      const tgtLabel = labels?.[c.target.index] ?? `Group ${c.target.index + 1}`;
      return {
        path: (ribbonGen as (d: unknown) => string)(c) ?? '',
        sourceIndex: c.source.index,
        targetIndex: c.target.index,
        color: colorScale(srcLabel),
        sourceLabel: srcLabel,
        targetLabel: tgtLabel,
        value: c.source.value,
      };
    });

    return { groups, ribbons };
  }, [matrix, labels, padAngle, innerRadius, outerRadius, colorScale]);

  return (
    <g
      transform={`translate(${cx}, ${cy})`}
      role="img"
      aria-label={ariaLabel ?? 'Chord diagram'}
    >
      {/* Ribbons */}
      <g>
        {layout.ribbons.map((r, i) => {
          const isActive =
            hoveredGroup === r.sourceIndex || hoveredGroup === r.targetIndex;
          const dimmed = hoveredGroup !== null && !isActive;

          return (
            <path
              key={`ribbon-${i}`}
              d={r.path}
              fill={r.color}
              opacity={dimmed ? ribbonOpacity * 0.15 : ribbonOpacity}
              aria-label={`${r.sourceLabel} ↔ ${r.targetLabel}: ${r.value.toLocaleString()}`}
              style={{ transition: 'opacity 200ms ease' }}
            />
          );
        })}
      </g>

      {/* Group arcs */}
      <g>
        {layout.groups.map((g) => {
          const isActive = hoveredGroup === g.index;
          const midAngle = (g.startAngle + g.endAngle) / 2;
          const labelR = outerRadius + 14;
          const flip = midAngle > Math.PI;

          return (
            <g key={`group-${g.index}`}>
              <path
                d={g.path}
                fill={g.color}
                opacity={hoveredGroup !== null && !isActive ? arcOpacity * 0.4 : arcOpacity}
                stroke={isActive ? '#fff' : 'none'}
                strokeWidth={isActive ? 2 : 0}
                tabIndex={0}
                onMouseEnter={() => handleEnter(g.index)}
                onMouseLeave={handleLeave}
                style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
              />
              <text
                x={Math.sin(midAngle) * labelR}
                y={-Math.cos(midAngle) * labelR}
                textAnchor={flip ? 'end' : 'start'}
                dominantBaseline="central"
                fill="#cbd5e1"
                fontSize={11}
                fontWeight={500}
                transform={`rotate(${(midAngle * 180) / Math.PI - 90}, ${Math.sin(midAngle) * labelR}, ${-Math.cos(midAngle) * labelR})`}
                style={{ pointerEvents: 'none' }}
              >
                {g.label}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}
