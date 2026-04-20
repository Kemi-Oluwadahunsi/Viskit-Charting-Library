// ─────────────────────────────────────────────────
// <SunburstSeries> — Multi-level radial partition
// ─────────────────────────────────────────────────
// Renders a hierarchical sunburst chart using
// d3-hierarchy's partition layout with d3-shape arcs.
//
// Usage:
//   <Chart data={hierarchyData} height={400}>
//     <SunburstSeries field="value" nameField="name" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import {
  hierarchy as d3Hierarchy,
  partition as d3Partition,
  type HierarchyRectangularNode,
} from 'd3-hierarchy';
import { arc as d3Arc } from 'd3-shape';
import { useChartContext } from '@viskit/core';

export interface SunburstSeriesProps<TDatum = Record<string, unknown>> {
  /** Numeric field for arc size */
  field: keyof TDatum & string;
  /** Field for the display label */
  nameField?: keyof TDatum & string;
  /** Field that defines parent-child grouping */
  groupField?: keyof TDatum & string;
  /** Inner radius ratio for the center hole (default: 0.1) */
  innerRadius?: number;
  /** Maximum depth levels to render (default: all) */
  levels?: number;
  /** Gap between arcs in radians (default: 0.01) */
  padAngle?: number;
  /** Corner rounding (default: 2) */
  cornerRadius?: number;
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

export function SunburstSeries<TDatum extends Record<string, unknown>>({
  field,
  nameField,
  groupField,
  innerRadius = 0.1,
  levels,
  padAngle = 0.01,
  cornerRadius = 2,
  opacity = 1,
  'aria-label': ariaLabel,
}: SunburstSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleEnter = useCallback((id: string) => setHovered(id), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const cx = dimensions.innerWidth / 2;
  const cy = dimensions.innerHeight / 2;
  const maxRadius = Math.min(cx, cy);

  const arcs = useMemo(() => {
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

    const partitionLayout = d3Partition<TreeNode>().size([2 * Math.PI, maxRadius]);
    partitionLayout(h);

    const innerR = maxRadius * innerRadius;

    return (h.descendants() as HierarchyRectangularNode<TreeNode>[])
      .filter((d) => d.depth > 0) // skip root
      .filter((d) => (levels ? d.depth <= levels : true))
      .map((d) => {
        const arcGen = d3Arc<unknown, HierarchyRectangularNode<TreeNode>>()
          .startAngle((n) => n.x0)
          .endAngle((n) => n.x1)
          .padAngle(padAngle)
          .innerRadius((n) => Math.max(innerR, n.y0))
          .outerRadius((n) => n.y1 - 1)
          .cornerRadius(cornerRadius);

        const id = `${d.depth}-${d.data.name}`;

        return {
          path: arcGen(d) ?? '',
          name: d.data.name,
          value: d.value ?? 0,
          depth: d.depth,
          id,
          color: colorScale(d.depth === 1 ? d.data.name : (d.parent?.data.name ?? d.data.name)),
        };
      });
  }, [data, field, nameField, groupField, innerRadius, levels, padAngle, cornerRadius, maxRadius, colorScale]);

  return (
    <g
      transform={`translate(${cx}, ${cy})`}
      role="list"
      aria-label={ariaLabel ?? 'Sunburst chart'}
    >
      {arcs.map((a) => {
        const isActive = hovered === a.id;
        const depthOpacity = 1 - (a.depth - 1) * 0.15;

        return (
          <path
            key={a.id}
            d={a.path}
            fill={a.color}
            opacity={
              hovered !== null && !isActive
                ? opacity * depthOpacity * 0.4
                : opacity * depthOpacity
            }
            stroke={isActive ? '#fff' : 'rgba(0,0,0,0.2)'}
            strokeWidth={isActive ? 2 : 0.5}
            role="listitem"
            aria-label={`${a.name}: ${a.value.toLocaleString()}`}
            tabIndex={0}
            onMouseEnter={() => handleEnter(a.id)}
            onMouseLeave={handleLeave}
            style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
          />
        );
      })}
    </g>
  );
}
