// ─────────────────────────────────────────────────
// <CanvasRenderer> — Canvas backend for heavy datasets
// ─────────────────────────────────────────────────
// Overlays an HTML Canvas on top of the SVG chart to
// render thousands of data points without SVG DOM
// overhead. Used for scatter plots, heatmaps, and
// any series where DOM node count becomes a bottleneck.
//
// The renderer reads data, scales, and dimensions from
// ChartContext and CartesianContext — same as SVG series.
// It draws to a <canvas> element that is absolutely
// positioned over the SVG plot area.
//
// Usage:
//   <Chart data={bigData}>
//     <XAxis />
//     <YAxis />
//     <CanvasRenderer
//       field="value"
//       mode="scatter"
//       threshold={5000}
//     />
//   </Chart>
//
// When data.length < threshold, it falls back to an SVG
// scatter series for better interactivity and accessibility.
// ─────────────────────────────────────────────────

import {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState,
  type CSSProperties,
} from 'react';
import { useChartContext, useCartesianContext } from '@kodemaven/viskit-core';
import { useReducedMotion } from '@kodemaven/viskit-animations';

// ── Types ──────────────────────────────────────

type RenderMode = 'scatter' | 'heatmap' | 'bubble' | 'custom';

export interface CanvasRendererProps<TDatum = Record<string, unknown>> {
  /** Primary numeric field for Y values (scatter/bubble) or cell values (heatmap) */
  field: keyof TDatum & string;
  /** Secondary field for bubble size */
  sizeField?: keyof TDatum & string;
  /** Rendering mode */
  mode?: RenderMode;
  /** Point count threshold to switch from SVG fallback to Canvas (default: 5000) */
  threshold?: number;
  /** Point radius in px (scatter/bubble default: 3) */
  radius?: number;
  /** Min radius for bubble mode */
  minRadius?: number;
  /** Max radius for bubble mode */
  maxRadius?: number;
  /** Fill color override (defaults to categorical color) */
  color?: string;
  /** Global opacity 0–1 (default: 0.7) */
  opacity?: number;
  /** Device pixel ratio override for crisp rendering (default: window.devicePixelRatio) */
  pixelRatio?: number;
  /** Custom draw function — receives the 2D context and computed points */
  renderCanvas?: (ctx: CanvasRenderingContext2D, points: CanvasPoint[]) => void;
  /** Heatmap color ramp — [low, high] */
  colors?: [string, string];
  /** ARIA label for fallback table */
  'aria-label'?: string;
}

/** Computed point ready for canvas drawing */
export interface CanvasPoint {
  x: number;
  y: number;
  r: number;
  color: string;
  value: number;
  datum: Record<string, unknown>;
}

// ── Helpers ────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lerpColor(a: string, b: string, t: number): string {
  const parseHex = (h: string): [number, number, number] => {
    const c = h.replace('#', '');
    return [
      parseInt(c.slice(0, 2), 16),
      parseInt(c.slice(2, 4), 16),
      parseInt(c.slice(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parseHex(a);
  const [r2, g2, b2] = parseHex(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ── Component ──────────────────────────────────

export function CanvasRenderer<TDatum extends Record<string, unknown>>({
  field,
  sizeField,
  mode = 'scatter',
  threshold = 5000,
  radius = 3,
  minRadius = 2,
  maxRadius = 20,
  color,
  opacity = 0.7,
  pixelRatio,
  renderCanvas,
  colors,
  'aria-label': ariaLabel,
}: CanvasRendererProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const cartesian = useCartesianContext();
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const [hoveredPoint, setHoveredPoint] = useState<CanvasPoint | null>(null);

  const resolvedColor = color ?? colorScale(field as string);
  const dpr = pixelRatio ?? (typeof window !== 'undefined' ? window.devicePixelRatio : 1);

  const { innerWidth, innerHeight } = dimensions;
  const { margin } = dimensions;

  // Decide if we should use canvas or fall back to SVG
  const useCanvas = data.length >= threshold;

  // ── Compute points ────────────────────
  const points: CanvasPoint[] = useMemo(() => {
    if (!useCanvas) return [];

    const { xScale, yScale } = cartesian;
    const typedData = data as TDatum[];

    // For bubble mode: compute size scale
    let sizeScale: ((v: number) => number) | null = null;
    if (mode === 'bubble' && sizeField) {
      const sizeValues = typedData.map((d) => Number(d[sizeField]) || 0);
      const sMin = Math.min(...sizeValues);
      const sMax = Math.max(...sizeValues);
      const sRange = sMax - sMin || 1;
      sizeScale = (v: number) =>
        minRadius + ((v - sMin) / sRange) * (maxRadius - minRadius);
    }

    // For heatmap mode: compute color scale
    let heatColorFn: ((v: number) => string) | null = null;
    if (mode === 'heatmap') {
      const values = typedData.map((d) => Number(d[field]) || 0);
      const vMin = Math.min(...values);
      const vMax = Math.max(...values);
      const vRange = vMax - vMin || 1;
      const [lo, hi] = colors ?? ['#f0f9ff', '#1e40af'];
      heatColorFn = (v: number) => lerpColor(lo, hi, (v - vMin) / vRange);
    }

    return typedData.map((d) => {
      const domainIdx = xScale.domain.indexOf(
        xScale.domain.find((_dv, i) => i === typedData.indexOf(d)) as unknown,
      );
      const xVal = xScale.domain[domainIdx];
      const x =
        (xScale.scale(xVal) as number) +
        (xScale.bandwidth ? xScale.bandwidth / 2 : 0);
      const yRaw = Number(d[field]) || 0;
      const y = yScale.scale(yRaw as unknown) as number;

      const ptRadius =
        mode === 'bubble' && sizeScale && sizeField
          ? sizeScale(Number(d[sizeField]) || 0)
          : radius;

      const ptColor =
        mode === 'heatmap' && heatColorFn
          ? heatColorFn(yRaw)
          : resolvedColor;

      return {
        x,
        y,
        r: ptRadius,
        color: ptColor,
        value: yRaw,
        datum: d as Record<string, unknown>,
      };
    }).filter((pt) => !Number.isNaN(pt.x) && !Number.isNaN(pt.y));
  }, [
    data,
    useCanvas,
    cartesian,
    field,
    sizeField,
    mode,
    radius,
    minRadius,
    maxRadius,
    resolvedColor,
    colors,
  ]);

  // ── Draw to canvas ────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale for retina
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Custom render function takes over completely
    if (renderCanvas) {
      renderCanvas(ctx, points);
      return;
    }

    // Draw all points
    for (const pt of points) {
      const isHovered =
        hoveredPoint &&
        Math.abs(pt.x - hoveredPoint.x) < 0.5 &&
        Math.abs(pt.y - hoveredPoint.y) < 0.5;

      if (mode === 'heatmap') {
        // Heatmap: draw filled rectangles
        const cellW = cartesian.xScale.bandwidth ?? innerWidth / 20;
        const cellH = innerHeight / 20;
        ctx.fillStyle = hexToRgba(pt.color, isHovered ? 1 : opacity);
        ctx.fillRect(pt.x - cellW / 2, pt.y - cellH / 2, cellW, cellH);

        if (isHovered) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.strokeRect(pt.x - cellW / 2, pt.y - cellH / 2, cellW, cellH);
        }
      } else {
        // Scatter / bubble: draw circles
        const drawR = isHovered ? pt.r + 2 : pt.r;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, drawR, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(pt.color, isHovered ? 1 : opacity);
        ctx.fill();

        if (isHovered) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [points, hoveredPoint, dpr, opacity, mode, renderCanvas, cartesian, innerWidth, innerHeight]);

  // ── Animation loop for initial draw ───
  useEffect(() => {
    if (!useCanvas) return;

    if (reducedMotion) {
      draw();
      return;
    }

    // Animated fade-in: draw with increasing opacity
    let progress = 0;
    const startTime = performance.now();
    const duration = 400; // ms

    const animate = (now: number) => {
      progress = clamp((now - startTime) / duration, 0, 1);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = progress;

      if (renderCanvas) {
        renderCanvas(ctx, points);
      } else {
        for (const pt of points) {
          if (mode === 'heatmap') {
            const cellW = cartesian.xScale.bandwidth ?? innerWidth / 20;
            const cellH = innerHeight / 20;
            ctx.fillStyle = hexToRgba(pt.color, opacity);
            ctx.fillRect(pt.x - cellW / 2, pt.y - cellH / 2, cellW, cellH);
          } else {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
            ctx.fillStyle = hexToRgba(pt.color, opacity);
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [useCanvas, points, dpr, opacity, mode, renderCanvas, reducedMotion, draw, cartesian, innerWidth, innerHeight]);

  // ── Redraw on hover change ────────────
  useEffect(() => {
    if (!useCanvas) return;
    draw();
  }, [hoveredPoint, useCanvas, draw]);

  // ── Hit detection for hover ───────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width / dpr);
      const my = (e.clientY - rect.top) * (canvas.height / rect.height / dpr);

      // Find the closest point within a hit radius
      const hitRadius = 8;
      let closest: CanvasPoint | null = null;
      let closestDist = Infinity;

      for (const pt of points) {
        const dx = pt.x - mx;
        const dy = pt.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < hitRadius + pt.r && dist < closestDist) {
          closest = pt;
          closestDist = dist;
        }
      }

      setHoveredPoint(closest);
    },
    [points, dpr],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredPoint(null);
  }, []);

  // ── Canvas element style ──────────────
  const canvasStyle: CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      left: margin.left,
      top: margin.top,
      width: innerWidth,
      height: innerHeight,
      pointerEvents: 'auto',
    }),
    [margin.left, margin.top, innerWidth, innerHeight],
  );

  // ── SVG fallback for small datasets ───
  if (!useCanvas) {
    return (
      <g
        role="list"
        aria-label={ariaLabel ?? `${field as string} points (SVG)`}
      >
        {(data as TDatum[]).map((d, i) => {
          const { xScale, yScale } = cartesian;
          const domainValue = xScale.domain[i];
          const x =
            (xScale.scale(domainValue) as number) +
            (xScale.bandwidth ? xScale.bandwidth / 2 : 0);
          const y = yScale.scale(d[field] as unknown) as number;

          if (Number.isNaN(x) || Number.isNaN(y)) return null;

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={radius}
              fill={resolvedColor}
              opacity={opacity}
              role="listitem"
              aria-label={`${field as string}: ${String(d[field])}`}
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            />
          );
        })}
      </g>
    );
  }

  // ── Canvas rendering ──────────────────
  return (
    <>
      {/* Invisible SVG group for ARIA — screen readers read this */}
      <g role="img" aria-label={ariaLabel ?? `${field as string} (${data.length.toLocaleString()} points, canvas rendered)`}>
        <title>{ariaLabel ?? `${field as string} — ${data.length.toLocaleString()} data points`}</title>
        <desc>
          Large dataset rendered with HTML Canvas for performance.
          Values range from {Math.min(...points.map((p) => p.value)).toLocaleString()} to{' '}
          {Math.max(...points.map((p) => p.value)).toLocaleString()}.
        </desc>
      </g>

      {/* foreignObject to embed canvas inside SVG */}
      <foreignObject
        x={0}
        y={0}
        width={innerWidth}
        height={innerHeight}
        style={{ overflow: 'visible' }}
      >
        <canvas
          ref={canvasRef}
          width={Math.round(innerWidth * dpr)}
          height={Math.round(innerHeight * dpr)}
          style={canvasStyle}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          aria-hidden="true"
        />
      </foreignObject>

      {/* Hover tooltip label */}
      {hoveredPoint && (
        <g style={{ pointerEvents: 'none' }}>
          {/* Background pill */}
          <rect
            x={hoveredPoint.x - 30}
            y={hoveredPoint.y - hoveredPoint.r - 28}
            width={60}
            height={20}
            rx={4}
            fill="rgba(0, 0, 0, 0.75)"
          />
          <text
            x={hoveredPoint.x}
            y={hoveredPoint.y - hoveredPoint.r - 14}
            textAnchor="middle"
            fill="#fff"
            fontSize={11}
            fontWeight={600}
            style={{ pointerEvents: 'none' }}
          >
            {hoveredPoint.value.toLocaleString()}
          </text>
        </g>
      )}
    </>
  );
}
