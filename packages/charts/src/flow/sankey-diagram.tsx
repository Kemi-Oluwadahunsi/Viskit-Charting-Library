// ─────────────────────────────────────────────────
// <SankeyDiagram> — Flow/energy diagrams between nodes
// ─────────────────────────────────────────────────
// Renders a Sankey diagram using d3-sankey.
// Nodes are positioned in columns, links show flow
// magnitude between them.
//
// Usage:
//   <Chart data={[]} height={400}>
//     <SankeyDiagram
//       nodes={[{ name: 'A' }, { name: 'B' }]}
//       links={[{ source: 0, target: 1, value: 10 }]}
//     />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import {
  sankey as d3Sankey,
  sankeyLinkHorizontal,
  sankeyLeft,
  sankeyRight,
  sankeyCenter,
  sankeyJustify,
} from 'd3-sankey';
import type { SankeyNodeMinimal, SankeyLinkMinimal } from 'd3-sankey';
import { useChartContext } from '@viskit/core';

type SankeyAlign = 'left' | 'right' | 'center' | 'justify';

const ALIGN_METHODS = {
  left: sankeyLeft,
  right: sankeyRight,
  center: sankeyCenter,
  justify: sankeyJustify,
} as const;

// Recursive generics required by d3-sankey
interface SNode extends SankeyNodeMinimal<SNode, SLink> {
  name: string;
  color?: string;
}

interface SLink extends SankeyLinkMinimal<SNode, SLink> {
  value: number;
}

export interface SankeyNode {
  name: string;
  color?: string;
}

export interface SankeyLink {
  source: number | string;
  target: number | string;
  value: number;
}

export interface SankeyDiagramProps {
  /** Array of node objects */
  nodes: SankeyNode[];
  /** Array of link objects (source/target as indices) */
  links: SankeyLink[];
  /** Width of each node bar in px (default: 20) */
  nodeWidth?: number;
  /** Vertical padding between nodes in px (default: 10) */
  nodePadding?: number;
  /** Node alignment (default: 'justify') */
  align?: SankeyAlign;
  /** Link opacity 0–1 (default: 0.4) */
  linkOpacity?: number;
  /** Node opacity 0–1 (default: 1) */
  nodeOpacity?: number;
  /** Corner radius on node rects (default: 2) */
  radius?: number;
  /** ARIA label */
  'aria-label'?: string;
}

interface LayoutNode {
  name: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  value: number;
  index: number;
}

interface LayoutLink {
  path: string;
  color: string;
  width: number;
  sourceName: string;
  targetName: string;
  value: number;
}

export function SankeyDiagram({
  nodes,
  links,
  nodeWidth = 20,
  nodePadding = 10,
  align = 'justify',
  linkOpacity = 0.4,
  nodeOpacity = 1,
  radius = 2,
  'aria-label': ariaLabel,
}: SankeyDiagramProps) {
  const { dimensions, colorScale } = useChartContext();
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);

  const handleNodeEnter = useCallback((i: number) => setHoveredNode(i), []);
  const handleNodeLeave = useCallback(() => setHoveredNode(null), []);
  const handleLinkEnter = useCallback((i: number) => setHoveredLink(i), []);
  const handleLinkLeave = useCallback(() => setHoveredLink(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const layout = useMemo(() => {
    const sankeyGenerator = d3Sankey<SNode, SLink>()
      .nodeId((d) => d.name)
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .nodeAlign(ALIGN_METHODS[align])
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ]);

    const graph = sankeyGenerator({
      nodes: nodes.map((n) => ({ ...n })) as SNode[],
      links: links.map((l) => ({ ...l })) as SLink[],
    });

    const linkPathGen = sankeyLinkHorizontal<SNode, SLink>();

    const layoutNodes: LayoutNode[] = (graph.nodes as unknown as Array<Record<string, unknown>>).map(
      (n, i) => ({
        name: String(n['name'] ?? `Node ${i}`),
        x0: Number(n['x0'] ?? 0),
        y0: Number(n['y0'] ?? 0),
        x1: Number(n['x1'] ?? 0),
        y1: Number(n['y1'] ?? 0),
        color: (nodes[i]?.color ?? colorScale(String(n['name'] ?? `Node ${i}`))) as string,
        value: Number(n['value'] ?? 0),
        index: i,
      }),
    );

    const layoutLinks: LayoutLink[] = (graph.links as unknown as Array<Record<string, unknown>>).map(
      (l) => {
        const src = l['source'] as Record<string, unknown>;
        const tgt = l['target'] as Record<string, unknown>;
        return {
          path: linkPathGen(l as never) ?? '',
          color: layoutNodes[Number(src['index'] ?? 0)]?.color ?? '#888',
          width: Math.max(1, Number(l['width'] ?? 1)),
          sourceName: String(src['name'] ?? ''),
          targetName: String(tgt['name'] ?? ''),
          value: Number(l['value'] ?? 0),
        };
      },
    );

    return { nodes: layoutNodes, links: layoutLinks };
  }, [nodes, links, nodeWidth, nodePadding, align, innerWidth, innerHeight, colorScale]);

  return (
    <g role="img" aria-label={ariaLabel ?? 'Sankey diagram'}>
      {/* Links */}
      <g>
        {layout.links.map((l, i) => (
          <path
            key={`link-${i}`}
            d={l.path}
            fill="none"
            stroke={l.color}
            strokeWidth={l.width}
            strokeOpacity={hoveredLink === i ? linkOpacity + 0.3 : linkOpacity}
            aria-label={`${l.sourceName} → ${l.targetName}: ${l.value.toLocaleString()}`}
            onMouseEnter={() => handleLinkEnter(i)}
            onMouseLeave={handleLinkLeave}
            style={{ cursor: 'pointer', transition: 'stroke-opacity 200ms ease' }}
          />
        ))}
      </g>

      {/* Nodes */}
      <g>
        {layout.nodes.map((n) => {
          const isActive = hoveredNode === n.index;
          return (
            <g key={`node-${n.index}`}>
              <rect
                x={n.x0}
                y={n.y0}
                width={n.x1 - n.x0}
                height={n.y1 - n.y0}
                rx={radius}
                ry={radius}
                fill={n.color}
                opacity={hoveredNode !== null && !isActive ? nodeOpacity * 0.5 : nodeOpacity}
                stroke={isActive ? '#fff' : 'none'}
                strokeWidth={isActive ? 2 : 0}
                role="listitem"
                aria-label={`${n.name}: ${n.value.toLocaleString()}`}
                tabIndex={0}
                onMouseEnter={() => handleNodeEnter(n.index)}
                onMouseLeave={handleNodeLeave}
                style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
              />
              <text
                x={n.x0 < innerWidth / 2 ? n.x1 + 6 : n.x0 - 6}
                y={(n.y0 + n.y1) / 2}
                textAnchor={n.x0 < innerWidth / 2 ? 'start' : 'end'}
                dominantBaseline="central"
                fill="#cbd5e1"
                fontSize={11}
                fontWeight={500}
                style={{ pointerEvents: 'none' }}
              >
                {n.name}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}
