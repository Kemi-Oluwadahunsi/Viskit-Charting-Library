// ─────────────────────────────────────────────────
// <Chart> — Root container component
// ─────────────────────────────────────────────────
// This is the entry point for every chart. It:
//
// 1. Measures its container (ResizeObserver)
// 2. Calculates margins (auto or explicit)
// 3. Sets up the ChartContext with data, dimensions,
//    color scale, and active state
// 4. Renders an SVG with proper ARIA attributes
// 5. Renders a hidden data table for screen readers
//
// Consumers never need to specify width/height —
// the chart fills its container by default.
//
// Usage:
//   <Chart data={salesData} height={300}>
//     <XAxis field="date" />
//     <YAxis field="revenue" format="currency" />
//     <LineSeries field="revenue" />
//     <Tooltip />
//   </Chart>
// ─────────────────────────────────────────────────

import {
  useState,
  useMemo,
  useId,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
} from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { useResponsiveSize } from '../responsive/use-responsive-size';
import { useAutoMargin } from '../layout/use-auto-margin';
import { ChartProvider } from '../context/chart-context';
import { CartesianProvider } from '../context/cartesian-context';
import type { Margin, ChartContextValue, CartesianContextValue, Dimensions, ScaleResult } from '../types';

// ── Default categorical colors ─────────────────
// Used when no theme provider is present.
// 8 colors that pass WCAG AA on both light/dark backgrounds.
const DEFAULT_CATEGORICAL = [
  '#6366F1', // indigo
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F59E0B', // amber
  '#8B5CF6', // violet
  '#EF4444', // red
  '#06B6D4', // cyan
  '#84CC16', // lime
] as const;

// ── Chart Handle (ref API) ─────────────────────

export interface ChartHandle {
  /** Get the underlying SVG element */
  getSvgElement: () => SVGSVGElement | null;
}

// ── Props ──────────────────────────────────────

export interface ChartProps<TDatum = Record<string, unknown>> {
  /** The data array to visualize */
  data: TDatum[];
  /** Chart children — series, axes, tooltip, etc. */
  children: ReactNode;

  // ── Sizing (all optional) ────────────
  /** Fixed width in px. Omit to auto-fill container */
  width?: number;
  /** Fixed height in px. Omit to derive from aspect ratio */
  height?: number;
  /** Width-to-height ratio (default: 16/9) */
  aspect?: number;
  /** Minimum height in px */
  minHeight?: number;
  /** Maximum height in px */
  maxHeight?: number;

  // ── Margins ──────────────────────────
  /** Explicit margins, or 'auto' (default) */
  margin?: Partial<Margin> | 'auto';

  // ── Overrides ────────────────────────
  /** Categorical color palette override */
  colors?: readonly string[];

  // ── Accessibility ────────────────────
  /** ARIA label for the chart SVG */
  'aria-label'?: string;
  /** Accessible chart title (rendered as <title>) */
  title?: string;
  /** Accessible chart description (rendered as <desc>) */
  description?: string;

  // ── Styling ──────────────────────────
  /** CSS class for the outer container div */
  className?: string;
}

/**
 * <Chart> — The root component for every VisKit chart.
 *
 * Wraps children in a responsive SVG with shared context.
 * All series and primitives read data, dimensions, and
 * scales from this context.
 */
export const Chart = forwardRef<ChartHandle, ChartProps>(function Chart(
  {
    data,
    children,
    width: fixedWidth,
    height: fixedHeight,
    aspect,
    minHeight,
    maxHeight,
    margin: marginProp = 'auto',
    colors = DEFAULT_CATEGORICAL,
    'aria-label': ariaLabel,
    title,
    description,
    className,
  },
  ref,
) {
  // ── Unique IDs for ARIA linking ───────
  const chartId = useId();
  const titleId = `${chartId}-title`;
  const descId = `${chartId}-desc`;

  // ── Active state (hovered/focused series) ───
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  // ── Responsive sizing ─────────────────
  const { width, height, containerRef } = useResponsiveSize({
    width: fixedWidth,
    height: fixedHeight,
    aspect,
    minHeight,
    maxHeight,
  });

  // ── Margin calculation ────────────────
  const autoMargin = useAutoMargin();
  const resolvedMargin: Margin = useMemo(() => {
    if (marginProp === 'auto') return autoMargin;
    return {
      top: marginProp.top ?? autoMargin.top,
      right: marginProp.right ?? autoMargin.right,
      bottom: marginProp.bottom ?? autoMargin.bottom,
      left: marginProp.left ?? autoMargin.left,
    };
  }, [marginProp, autoMargin]);

  // ── Dimensions ────────────────────────
  const dimensions: Dimensions = useMemo(() => ({
    width,
    height,
    innerWidth: Math.max(0, width - resolvedMargin.left - resolvedMargin.right),
    innerHeight: Math.max(0, height - resolvedMargin.top - resolvedMargin.bottom),
    margin: resolvedMargin,
  }), [width, height, resolvedMargin]);

  // ── Color scale ───────────────────────
  // Maps series keys to categorical colors in order
  const colorScale = useMemo(() => {
    const map = new Map<string, string>();
    let nextIndex = 0;

    return (key: string): string => {
      if (!map.has(key)) {
        map.set(key, colors[nextIndex % colors.length]!);
        nextIndex++;
      }
      return map.get(key)!;
    };
  }, [colors]);

  // ── Context value ─────────────────────
  const contextValue: ChartContextValue = useMemo(() => ({
    data,
    dimensions,
    colorScale,
    chartId,
    activeKeys,
    setActiveKeys,
  }), [data, dimensions, colorScale, chartId, activeKeys]);

  // ── Auto-detect cartesian scales ──────
  // Scans data to build x (band) and y (linear) scales
  // so cartesian series work without explicit axis config.
  const cartesianValue: CartesianContextValue | null = useMemo(() => {
    if (data.length === 0) return null;

    const firstDatum = data[0] as Record<string, unknown>;
    const keys = Object.keys(firstDatum);

    // X axis: first string-valued field → band scale
    const categoryField = keys.find(
      (k) => typeof firstDatum[k] === 'string',
    );
    if (!categoryField) return null;

    const xDomain = (data as Record<string, unknown>[]).map(
      (d) => d[categoryField] as string,
    );

    const xBand = scaleBand<string>()
      .domain(xDomain)
      .range([0, dimensions.innerWidth])
      .padding(0.2);

    const xScaleResult: ScaleResult = {
      scale: (v: unknown) => xBand(v as string) ?? 0,
      ticks: () => xDomain,
      domain: xDomain,
      range: [0, dimensions.innerWidth],
      bandwidth: xBand.bandwidth(),
    };

    // Y axis: span all numeric fields
    const numericFields = keys.filter(
      (k) => typeof firstDatum[k] === 'number',
    );
    if (numericFields.length === 0) return null;

    const yMax = max(
      (data as Record<string, unknown>[]),
      (d) => Math.max(...numericFields.map((f) => Number(d[f]) || 0)),
    ) ?? 0;

    const yLinear = scaleLinear()
      .domain([0, yMax * 1.1]) // 10% headroom
      .range([dimensions.innerHeight, 0])
      .nice();

    const yScaleResult: ScaleResult = {
      scale: (v: unknown) => yLinear(v as number) ?? 0,
      ticks: (count?: number) => yLinear.ticks(count) as unknown[],
      domain: yLinear.domain() as unknown[],
      range: [dimensions.innerHeight, 0],
      invert: (px: unknown) => yLinear.invert(px as number),
    };

    return {
      xScale: xScaleResult,
      yScale: yScaleResult,
      innerWidth: dimensions.innerWidth,
      innerHeight: dimensions.innerHeight,
      flipped: false,
    };
  }, [data, dimensions]);

  // ── Imperative handle ─────────────────
  useImperativeHandle(ref, () => ({
    getSvgElement: () => containerRef.current?.querySelector('svg') ?? null,
  }));

  // ── Don't render until we have dimensions ───
  const hasSize = width > 0 && height > 0;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: fixedWidth ?? '100%',
        height: fixedHeight ?? 'auto',
        position: 'relative',
      }}
    >
      {hasSize && (
        <ChartProvider value={contextValue}>
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={ariaLabel ?? title ?? 'Chart'}
            aria-describedby={description ? descId : undefined}
            style={{ display: 'block', overflow: 'visible' }}
          >
            {/* Accessible title and description */}
            {title && <title id={titleId}>{title}</title>}
            {description && <desc id={descId}>{description}</desc>}

            {/* Plot area — offset by margins */}
            <g transform={`translate(${resolvedMargin.left}, ${resolvedMargin.top})`}>
              {cartesianValue ? (
                <CartesianProvider value={cartesianValue}>
                  {children}
                </CartesianProvider>
              ) : (
                children
              )}
            </g>
          </svg>

          {/* Hidden data table for screen readers */}
          <HiddenDataTable data={data} title={title} />
        </ChartProvider>
      )}
    </div>
  );
}) as <TDatum = Record<string, unknown>>(
  props: ChartProps<TDatum> & { ref?: React.Ref<ChartHandle> },
) => React.JSX.Element;

// ── Hidden data table for screen readers ────────

const VISUALLY_HIDDEN: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

function HiddenDataTable({ data, title }: { data: unknown[]; title?: string }) {
  if (data.length === 0) return null;

  const firstDatum = data[0] as Record<string, unknown>;
  const columns = Object.keys(firstDatum);

  return (
    <table style={VISUALLY_HIDDEN} role="table" aria-label={title ? `${title} data` : 'Chart data'}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} scope="col">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(data as Record<string, unknown>[]).map((datum, rowIdx) => (
          <tr key={rowIdx}>
            {columns.map((col) => (
              <td key={col}>{String(datum[col] ?? '')}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
