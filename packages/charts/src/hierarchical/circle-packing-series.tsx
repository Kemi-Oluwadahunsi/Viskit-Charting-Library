// ─────────────────────────────────────────────────
// <CirclePackingSeries> — Nested circles for hierarchical data
// ─────────────────────────────────────────────────
// Renders a circle-packing layout using d3-hierarchy.
// Each circle represents a node, sized by its value.
//
// Usage:
//   <Chart data={hierarchyData} height={400}>
//     <CirclePackingSeries field="value" nameField="name" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import {
  hierarchy as d3Hierarchy,
  pack as d3Pack,
  type HierarchyCircularNode,
} from 'd3-hierarchy';
import { useChartContext } from '@kodemaven/viskit-core';

export interface CirclePackingSeriesProps<TDatum = Record<string, unknown>> {
  /** Numeric field for circle size */
  field: keyof TDatum & string;
  /** Field for the display label */
  nameField?: keyof TDatum & string;
  /** Field that defines parent-child grouping */
  groupField?: keyof TDatum & string;
  /** Padding between circles in px (default: 4) */
  padding?: number;
  /** Opacity 0–1 (default: 0.85) */
  opacity?: number;
  /** ARIA label */
  'aria-label'?: string;
}

interface TreeNode {
  name: string;
  value?: number;
  children?: TreeNode[];
}

export function CirclePackingSeries<TDatum extends Record<string, unknown>>({
  field,
  nameField,
  groupField,
  padding = 4,
  opacity = 0.85,
  'aria-label': ariaLabel,
}: CirclePackingSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;
  const size = Math.min(innerWidth, innerHeight);

  const circles = useMemo(() => {
    const typedData = data as TDatum[];

    // Build hierarchy
    let root: TreeNode;
    if (groupField) {
      const groups = new Map<string, TreeNode[]>();
      for (const d of typedData) {
        const group = String(d[groupField]);
        if (!groups.has(group)) groups.set(group, []);
        groups.get(group)!.push({
          name: nameField ? String(d[nameField]) : String(d[groupField]),
          value: Number(d[field]) || 0,
        });
      }
      root = {
        name: 'root',
        children: [...groups.entries()].map(([name, children]) => ({
          name,
          children,
        })),
      };
    } else {
      root = {
        name: 'root',
        children: typedData.map((d, i) => ({
          name: nameField ? String(d[nameField]) : `Item ${i + 1}`,
          value: Number(d[field]) || 0,
        })),
      };
    }

    const h = d3Hierarchy(root)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const packLayout = d3Pack<TreeNode>()
      .size([size, size])
      .padding(padding);

    packLayout(h);

    const offsetX = (innerWidth - size) / 2;
    const offsetY = (innerHeight - size) / 2;

    return (h.descendants() as HierarchyCircularNode<TreeNode>[])
      .filter((d) => d.depth > 0)
      .map((d) => ({
        cx: d.x + offsetX,
        cy: d.y + offsetY,
        r: d.r,
        name: d.data.name,
        value: d.value ?? 0,
        depth: d.depth,
        isLeaf: !d.children,
        color: colorScale(d.depth === 1 ? d.data.name : (d.parent?.data.name ?? d.data.name)),
      }));
  }, [data, field, nameField, groupField, padding, size, innerWidth, innerHeight, colorScale]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Circle packing'}>
      {circles.map((c, i) => {
        const isActive = hovered === i;
        const showLabel = c.r > 18;

        return (
          <g key={i}>
            <circle
              cx={c.cx}
              cy={c.cy}
              r={isActive ? c.r + 2 : c.r}
              fill={c.isLeaf ? c.color : 'none'}
              opacity={hovered !== null && !isActive ? opacity * 0.4 : opacity}
              stroke={c.isLeaf ? (isActive ? '#fff' : 'none') : c.color}
              strokeWidth={c.isLeaf ? (isActive ? 2 : 0) : 1.5}
              strokeOpacity={c.isLeaf ? 1 : 0.4}
              role="listitem"
              aria-label={`${c.name}: ${c.value.toLocaleString()}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer', transition: 'r 200ms ease, opacity 200ms ease' }}
            />
            {showLabel && c.isLeaf && (
              <text
                x={c.cx}
                y={c.cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize={Math.min(c.r / 3, 12)}
                fontWeight={600}
                style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {c.name}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
