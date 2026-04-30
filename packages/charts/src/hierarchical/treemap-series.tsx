// ─────────────────────────────────────────────────
// <TreemapSeries> — Nested rectangles for hierarchical data
// ─────────────────────────────────────────────────
// Renders a treemap layout using d3-hierarchy.
// Each rectangle represents a leaf node sized by its value.
//
// Usage:
//   <Chart data={hierarchyData} height={400}>
//     <TreemapSeries field="value" nameField="name" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import {
  hierarchy as d3Hierarchy,
  treemap as d3Treemap,
  treemapSquarify,
  treemapBinary,
  treemapSlice,
  treemapDice,
  type HierarchyRectangularNode,
} from 'd3-hierarchy';
import { useChartContext } from '@kodemaven/viskit-core';

type TileMethod = 'squarify' | 'binary' | 'slice' | 'dice';

const TILE_METHODS = {
  squarify: treemapSquarify,
  binary: treemapBinary,
  slice: treemapSlice,
  dice: treemapDice,
} as const;

export interface TreemapSeriesProps<TDatum = Record<string, unknown>> {
  /** Numeric field for rectangle size */
  field: keyof TDatum & string;
  /** Field for the display label */
  nameField?: keyof TDatum & string;
  /** Field that defines parent-child grouping */
  groupField?: keyof TDatum & string;
  /** Tiling algorithm (default: 'squarify') */
  tile?: TileMethod;
  /** Inner padding between groups in px (default: 2) */
  padding?: number;
  /** Outer padding in px (default: 4) */
  outerPadding?: number;
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

export function TreemapSeries<TDatum extends Record<string, unknown>>({
  field,
  nameField,
  groupField,
  tile = 'squarify',
  padding = 2,
  outerPadding = 4,
  radius = 2,
  opacity = 1,
  'aria-label': ariaLabel,
}: TreemapSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const leaves = useMemo(() => {
    const typedData = data as TDatum[];

    // Build hierarchy tree from flat data
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

    const treemap = d3Treemap<TreeNode>()
      .size([innerWidth, innerHeight])
      .tile(TILE_METHODS[tile])
      .padding(padding)
      .paddingOuter(outerPadding)
      .round(true);

    treemap(h);

    return (h.leaves() as HierarchyRectangularNode<TreeNode>[]).map((leaf) => ({
      x: leaf.x0,
      y: leaf.y0,
      width: leaf.x1 - leaf.x0,
      height: leaf.y1 - leaf.y0,
      name: leaf.data.name,
      value: leaf.value ?? 0,
      color: colorScale(leaf.parent?.data.name ?? leaf.data.name),
    }));
  }, [data, field, nameField, groupField, tile, padding, outerPadding, innerWidth, innerHeight, colorScale]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Treemap'}>
      {leaves.map((leaf, i) => {
        const isActive = hovered === i;
        const minDim = Math.min(leaf.width, leaf.height);
        const showLabel = minDim > 28;

        return (
          <g key={i}>
            <rect
              x={leaf.x}
              y={leaf.y}
              width={leaf.width}
              height={leaf.height}
              rx={radius}
              ry={radius}
              fill={leaf.color}
              opacity={hovered !== null && !isActive ? opacity * 0.5 : opacity}
              stroke={isActive ? '#fff' : 'rgba(255,255,255,0.15)'}
              strokeWidth={isActive ? 2 : 0.5}
              role="listitem"
              aria-label={`${leaf.name}: ${leaf.value.toLocaleString()}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
            />
            {showLabel && (
              <>
                <text
                  x={leaf.x + 6}
                  y={leaf.y + 16}
                  fill="#fff"
                  fontSize={11}
                  fontWeight={600}
                  style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {leaf.name}
                </text>
                <text
                  x={leaf.x + 6}
                  y={leaf.y + 30}
                  fill="rgba(255,255,255,0.7)"
                  fontSize={10}
                  fontWeight={400}
                  style={{ pointerEvents: 'none' }}
                >
                  {leaf.value.toLocaleString()}
                </text>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}
