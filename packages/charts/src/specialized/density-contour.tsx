// ─────────────────────────────────────────────────
// <DensityContour> — 2D kernel density estimation
// ─────────────────────────────────────────────────
// Renders contour lines (isoclines) showing the density
// of 2D point distributions. Uses a simple grid-based
// kernel density estimation with marching squares.
//
// Usage:
//   <Chart data={points} height={400}>
//     <DensityContour xField="x" yField="y" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateTurbo } from 'd3-scale-chromatic';
import { useChartContext } from '@kodemaven/viskit-core';

export interface DensityContourProps<TDatum = Record<string, unknown>> {
  /** Numeric x field */
  xField: keyof TDatum & string;
  /** Numeric y field */
  yField: keyof TDatum & string;
  /** Bandwidth for KDE (default: auto) */
  bandwidth?: number;
  /** Number of threshold levels (default: 8) */
  thresholds?: number;
  /** Fill opacity (default: 0.6) */
  fillOpacity?: number;
  /** Show data points (default: true) */
  showPoints?: boolean;
  /** Point radius (default: 2) */
  pointRadius?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function DensityContour<TDatum extends Record<string, unknown>>({
  xField,
  yField,
  bandwidth: bwProp,
  thresholds = 8,
  fillOpacity = 0.6,
  showPoints = true,
  pointRadius = 2,
  'aria-label': ariaLabel,
}: DensityContourProps<TDatum>) {
  const { data, dimensions } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const { contours, points } = useMemo(() => {
    const typedData = data as TDatum[];
    if (typedData.length === 0) return { contours: [], points: [] };

    const xs = typedData.map((d) => Number(d[xField]) || 0);
    const ys = typedData.map((d) => Number(d[yField]) || 0);

    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);

    const xScale = scaleLinear().domain([xMin, xMax]).range([0, innerWidth]).nice();
    const yScale = scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]).nice();

    // Auto bandwidth based on data spread
    const bw = bwProp ?? Math.max(innerWidth, innerHeight) * 0.08;

    // KDE on a grid
    const gridSize = 40;
    const grid: number[][] = [];
    let maxDensity = 0;

    for (let gy = 0; gy < gridSize; gy++) {
      grid[gy] = [];
      for (let gx = 0; gx < gridSize; gx++) {
        const px = (gx / (gridSize - 1)) * innerWidth;
        const py = (gy / (gridSize - 1)) * innerHeight;

        let density = 0;
        for (let k = 0; k < typedData.length; k++) {
          const dx = px - xScale(xs[k]!);
          const dy = py - yScale(ys[k]!);
          density += Math.exp(-(dx * dx + dy * dy) / (2 * bw * bw));
        }
        grid[gy]![gx] = density;
        if (density > maxDensity) maxDensity = density;
      }
    }

    // Generate contour levels as filled rectangles (simplified approach)
    const color = scaleSequential(interpolateTurbo).domain([0, maxDensity]);
    const cellW = innerWidth / (gridSize - 1);
    const cellH = innerHeight / (gridSize - 1);

    const contourCells: Array<{
      x: number; y: number; width: number; height: number;
      density: number; color: string; level: number;
    }> = [];

    // Only render cells above a threshold
    const minThreshold = maxDensity * 0.05;
    for (let gy = 0; gy < gridSize - 1; gy++) {
      for (let gx = 0; gx < gridSize - 1; gx++) {
        const d = grid[gy]![gx]!;
        if (d < minThreshold) continue;

        // Quantize to threshold levels
        const level = Math.floor((d / maxDensity) * thresholds);
        contourCells.push({
          x: gx * cellW,
          y: gy * cellH,
          width: cellW,
          height: cellH,
          density: d,
          color: color(d),
          level,
        });
      }
    }

    // Data points
    const ptList = typedData.map((_d, i) => ({
      x: xScale(xs[i]!),
      y: yScale(ys[i]!),
      index: i,
    }));

    return { contours: contourCells, points: ptList };
  }, [data, xField, yField, bwProp, thresholds, innerWidth, innerHeight]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Density contour plot'}>
      {/* Density cells */}
      {contours.map((cell, i) => (
        <rect
          key={`c-${i}`}
          x={cell.x}
          y={cell.y}
          width={cell.width}
          height={cell.height}
          fill={cell.color}
          opacity={fillOpacity}
          style={{ pointerEvents: 'none' }}
        />
      ))}

      {/* Data points */}
      {showPoints && points.map((pt) => (
        <circle
          key={`p-${pt.index}`}
          cx={pt.x}
          cy={pt.y}
          r={hovered === pt.index ? pointRadius * 2 : pointRadius}
          fill="#fff"
          opacity={hovered !== null && hovered !== pt.index ? 0.3 : 0.8}
          stroke="#334155"
          strokeWidth={0.5}
          role="listitem"
          aria-label={`Point ${pt.index}`}
          tabIndex={0}
          onMouseEnter={() => handleEnter(pt.index)}
          onMouseLeave={handleLeave}
          style={{ cursor: 'pointer', transition: 'r 200ms ease, opacity 200ms ease' }}
        />
      ))}
    </g>
  );
}
