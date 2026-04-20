// ─────────────────────────────────────────────────
// <IcicleSeries> — Horizontal partition layout
// ─────────────────────────────────────────────────
// Renders a horizontal icicle chart using d3-hierarchy
// partition layout. Each rectangle represents a node,
// positioned left-to-right by depth and sized by value.
//
// Usage:
//   <Chart data={hierarchyData} height={400}>
//     <IcicleSeries field="value" nameField="name" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import {
  hierarchy as d3Hierarchy,
  partition as d3Partition,
  type HierarchyRectangularNode,
} from 'd3-hierarchy';
import { useChartContext } from '@viskit/core';

export interface IcicleSeriesProps<TDatum = Record<string, unknown>> {
  /** Numeric field for rectangle size */
  field: keyof TDatum & string;
  /** Field for the display label */
  nameField?: keyof TDatum & string;
  /** Field that defines parent-child grouping */
  groupField?: keyof TDatum & string;
  /** Padding between nodes in px (default: 1) */
  padding?: number;
  /** Corner radius on rects (default: 2) */
  radius?: number;
  /** Opacity 0–1 (default: 1) */
  opacity?: number;
  /** ARIA label */
  'aria-label'?: string;
}

interface TreeNode {
  name: string;
  value?: number;
  children?: TreeNode[];
}

export function IcicleSeries<TDatum extends Record<string, unknown>>({
  field,
  nameField,
  groupField,
  padding = 1,
  radius = 2,
  opacity = 1,
  'aria-label': ariaLabel,
}: IcicleSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleEnter = useCallback((id: string) => setHovered(id), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const rects = useMemo(() => {
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

    const partitionLayout = d3Partition<TreeNode>()
      .size([innerHeight, innerWidth])
      .padding(padding);

    partitionLayout(h);

    return (h.descendants() as HierarchyRectangularNode<TreeNode>[])
      .filter((d) => d.depth > 0)
      .map((d) => {
        const id = `${d.depth}-${d.data.name}`;
        // Partition outputs y as horizontal (depth), x as vertical (breadth)
        return {
          x: d.y0,
          y: d.x0,
          width: d.y1 - d.y0,
          height: d.x1 - d.x0,
          name: d.data.name,
          value: d.value ?? 0,
          depth: d.depth,
          id,
          color: colorScale(d.depth === 1 ? d.data.name : (d.parent?.data.name ?? d.data.name)),
        };
      });
  }, [data, field, nameField, groupField, padding, innerWidth, innerHeight, colorScale]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Icicle chart'}>
      {rects.map((r) => {
        const isActive = hovered === r.id;
        const showLabel = r.width > 40 && r.height > 16;

        return (
          <g key={r.id}>
            <rect
              x={r.x}
              y={r.y}
              width={r.width}
              height={r.height}
              rx={radius}
              ry={radius}
              fill={r.color}
              opacity={hovered !== null && !isActive ? opacity * 0.4 : opacity}
              stroke={isActive ? '#fff' : 'rgba(0,0,0,0.15)'}
              strokeWidth={isActive ? 2 : 0.5}
              role="listitem"
              aria-label={`${r.name}: ${r.value.toLocaleString()}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(r.id)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
            />
            {showLabel && (
              <text
                x={r.x + 6}
                y={r.y + r.height / 2}
                dominantBaseline="central"
                fill="#fff"
                fontSize={11}
                fontWeight={600}
                style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {r.name}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
