// ─────────────────────────────────────────────────
// <ForceGraph> — Interactive node-link network graph
// ─────────────────────────────────────────────────
// Renders a force-directed graph using d3-force.
// The simulation runs on mount and nodes settle
// into a stable layout based on force parameters.
//
// Usage:
//   <Chart data={[]} height={400}>
//     <ForceGraph
//       nodes={[{ id: 'A' }, { id: 'B' }]}
//       links={[{ source: 'A', target: 'B' }]}
//     />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
} from 'd3-force';
import { useChartContext } from '@kodemaven/viskit-core';
import { useReducedMotion } from '@kodemaven/viskit-animations';

export interface ForceNode {
  id: string;
  group?: string;
  radius?: number;
}

export interface ForceLink {
  source: string;
  target: string;
  value?: number;
}

export interface ForceGraphProps {
  /** Array of node objects with unique ids */
  nodes: ForceNode[];
  /** Array of link objects connecting node ids */
  links: ForceLink[];
  /** Node radius in px (default: 6) */
  radius?: number;
  /** Repulsive force strength (default: -200) */
  charge?: number;
  /** Link distance in px (default: 60) */
  linkDistance?: number;
  /** Collision radius padding (default: 2) */
  collisionPadding?: number;
  /** Link opacity 0–1 (default: 0.3) */
  linkOpacity?: number;
  /** Node opacity 0–1 (default: 1) */
  nodeOpacity?: number;
  /** ARIA label */
  'aria-label'?: string;
}

interface SimNode extends SimulationNodeDatum {
  id: string;
  group?: string;
  nodeRadius: number;
}

interface RenderedNode {
  id: string;
  x: number;
  y: number;
  r: number;
  color: string;
  group?: string;
}

interface RenderedLink {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  sourceId: string;
  targetId: string;
}

export function ForceGraph({
  nodes,
  links,
  radius = 6,
  charge = -200,
  linkDistance = 60,
  collisionPadding = 2,
  linkOpacity = 0.3,
  nodeOpacity = 1,
  'aria-label': ariaLabel,
}: ForceGraphProps) {
  const { dimensions, colorScale } = useChartContext();
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleEnter = useCallback((id: string) => setHovered(id), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;
  const cx = innerWidth / 2;
  const cy = innerHeight / 2;

  const [rendered, setRendered] = useState<{
    nodes: RenderedNode[];
    links: RenderedLink[];
  }>({ nodes: [], links: [] });

  const simRef = useRef<ReturnType<typeof forceSimulation<SimNode>> | null>(null);

  // Build and run simulation
  const stableNodes = useMemo(
    () => JSON.stringify(nodes.map((n) => n.id)),
    [nodes],
  );
  const stableLinks = useMemo(
    () => JSON.stringify(links.map((l) => `${l.source}-${l.target}`)),
    [links],
  );

  useEffect(() => {
    const simNodes: SimNode[] = nodes.map((n) => ({
      id: n.id,
      group: n.group,
      nodeRadius: n.radius ?? radius,
    }));

    const simLinks = links.map((l) => ({
      source: l.source,
      target: l.target,
      value: l.value ?? 1,
    }));

    const sim = forceSimulation(simNodes)
      .force(
        'link',
        forceLink(simLinks)
          .id((d: SimulationNodeDatum) => (d as SimNode).id)
          .distance(linkDistance),
      )
      .force('charge', forceManyBody().strength(charge))
      .force('center', forceCenter(cx, cy))
      .force('collide', forceCollide<SimNode>().radius((d) => d.nodeRadius + collisionPadding));

    simRef.current = sim;

    if (reducedMotion) {
      // Run simulation to completion immediately
      sim.stop();
      for (let i = 0; i < 300; i++) sim.tick();
      updateRendered(simNodes, simLinks);
    } else {
      sim.on('tick', () => {
        updateRendered(simNodes, simLinks);
      });
    }

    function updateRendered(
      sn: SimNode[],
      sl: Array<{ source: string | SimNode; target: string | SimNode; value: number }>,
    ) {
      setRendered({
        nodes: sn.map((n) => ({
          id: n.id,
          x: n.x ?? cx,
          y: n.y ?? cy,
          r: n.nodeRadius,
          color: colorScale(n.group ?? n.id),
          group: n.group,
        })),
        links: sl.map((l) => {
          const src = l.source as SimNode;
          const tgt = l.target as SimNode;
          return {
            x1: src.x ?? cx,
            y1: src.y ?? cy,
            x2: tgt.x ?? cx,
            y2: tgt.y ?? cy,
            sourceId: src.id,
            targetId: tgt.id,
          };
        }),
      });
    }

    return () => {
      sim.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableNodes, stableLinks, charge, linkDistance, collisionPadding, cx, cy, radius, reducedMotion, colorScale]);

  // Find connected node ids for highlight
  const connectedIds = useMemo(() => {
    if (!hovered) return new Set<string>();
    const ids = new Set<string>([hovered]);
    for (const l of rendered.links) {
      if (l.sourceId === hovered) ids.add(l.targetId);
      if (l.targetId === hovered) ids.add(l.sourceId);
    }
    return ids;
  }, [hovered, rendered.links]);

  return (
    <g role="img" aria-label={ariaLabel ?? 'Force-directed graph'}>
      {/* Links */}
      <g>
        {rendered.links.map((l, i) => {
          const highlight =
            hovered !== null &&
            (connectedIds.has(l.sourceId) && connectedIds.has(l.targetId));
          return (
            <line
              key={`link-${i}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="#94a3b8"
              strokeWidth={highlight ? 2 : 1}
              strokeOpacity={hovered && !highlight ? linkOpacity * 0.2 : linkOpacity}
              style={{ transition: 'stroke-opacity 200ms ease' }}
            />
          );
        })}
      </g>

      {/* Nodes */}
      <g>
        {rendered.nodes.map((n) => {
          const isActive = hovered === n.id;
          const dimmed = hovered !== null && !connectedIds.has(n.id);

          return (
            <g key={n.id}>
              {isActive && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r + 6}
                  fill={n.color}
                  opacity={0.15}
                />
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={isActive ? n.r + 2 : n.r}
                fill={n.color}
                opacity={dimmed ? nodeOpacity * 0.25 : nodeOpacity}
                stroke={isActive ? '#fff' : 'none'}
                strokeWidth={isActive ? 2 : 0}
                tabIndex={0}
                aria-label={`Node: ${n.id}${n.group ? ` (${n.group})` : ''}`}
                onMouseEnter={() => handleEnter(n.id)}
                onMouseLeave={handleLeave}
                style={{ cursor: 'pointer', transition: 'r 200ms ease, opacity 200ms ease' }}
              />
              {isActive && (
                <text
                  x={n.x}
                  y={n.y - n.r - 8}
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize={11}
                  fontWeight={600}
                  style={{ pointerEvents: 'none' }}
                >
                  {n.id}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </g>
  );
}
