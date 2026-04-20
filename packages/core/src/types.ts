// ─────────────────────────────────────────────────
// Shared type definitions for @viskit/core
// ─────────────────────────────────────────────────
// These types are used across all VisKit packages.
// Only truly shared, cross-cutting types live here.
// Component-specific types stay colocated with
// their component files.
// ─────────────────────────────────────────────────

import type { ReactNode, MouseEvent, FocusEvent } from 'react';

// ── Geometry ───────────────────────────────────

/** Spacing around the chart plot area */
export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Resolved dimensions of the chart container */
export interface Dimensions {
  /** Total width including margins */
  width: number;
  /** Total height including margins */
  height: number;
  /** Plot area width (width - margin.left - margin.right) */
  innerWidth: number;
  /** Plot area height (height - margin.top - margin.bottom) */
  innerHeight: number;
  /** Resolved margin values */
  margin: Margin;
}

/** A 2D point in pixel space */
export interface Point {
  x: number;
  y: number;
}

/** Axis-aligned bounding box */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ── Scales ─────────────────────────────────────

/** All supported D3 scale types */
export type ScaleType =
  | 'linear'
  | 'log'
  | 'sqrt'
  | 'pow'
  | 'time'
  | 'utc'
  | 'ordinal'
  | 'band'
  | 'point'
  | 'sequential'
  | 'diverging'
  | 'threshold'
  | 'quantize'
  | 'quantile'
  | 'symlog';

/** Configuration for creating a scale */
export interface ScaleConfig<TDomain = unknown, TRange = unknown> {
  type: ScaleType;
  /** Explicit domain — auto-detected from data if omitted */
  domain?: TDomain[];
  /** Output range — defaults to [0, innerWidth] or [innerHeight, 0] */
  range?: TRange[];
  /** Round domain to human-friendly values */
  nice?: boolean | number;
  /** Clamp output values to the range */
  clamp?: boolean;
  /** Force domain to include zero */
  zero?: boolean;
  /** Padding for band/point scales (0–1) */
  padding?: number;
  paddingInner?: number;
  paddingOuter?: number;
  /** Round output to integers (pixel-perfect rendering) */
  round?: boolean;
  /** Exponent for pow scale */
  exponent?: number;
  /** Base for log scale */
  base?: number;
  /** Flip the range direction */
  reverse?: boolean;
}

/** The resolved scale object returned by useScale */
export interface ScaleResult<TDomain = unknown, TRange = unknown> {
  /** Map a domain value to a range value */
  scale: (value: TDomain) => TRange;
  /** Generate tick values for the axis */
  ticks: (count?: number) => TDomain[];
  /** Current domain */
  domain: TDomain[];
  /** Current range */
  range: TRange[];
  /** Width of each band (band scale only) */
  bandwidth?: number;
  /** Reverse-map a range value to domain value (continuous scales) */
  invert?: (value: TRange) => TDomain;
}

// ── Contexts ───────────────────────────────────

/** Data carried by the Chart context — available to all children */
export interface ChartContextValue<TDatum = Record<string, unknown>> {
  /** Raw data array passed to <Chart> */
  data: TDatum[];
  /** Resolved chart dimensions */
  dimensions: Dimensions;
  /** Map a series key to its categorical color */
  colorScale: (key: string) => string;
  /** Unique ID for this chart instance (used for ARIA linking) */
  chartId: string;
  /** Currently active (hovered/focused) series keys */
  activeKeys: Set<string>;
  /** Set active keys — used internally by series */
  setActiveKeys: (keys: Set<string>) => void;
}

/** Cartesian coordinate system context (line, bar, scatter, etc.) */
export interface CartesianContextValue {
  xScale: ScaleResult;
  yScale: ScaleResult;
  /** Plot area width */
  innerWidth: number;
  /** Plot area height */
  innerHeight: number;
  /** Whether axes are flipped (horizontal bars) */
  flipped: boolean;
}

/** Polar coordinate system context (pie, radar, radial bar, etc.) */
export interface PolarContextValue {
  /** Center X of the polar coordinate system */
  cx: number;
  /** Center Y */
  cy: number;
  /** Inner radius (0 = full pie, >0 = donut) */
  innerRadius: number;
  /** Outer radius */
  outerRadius: number;
  /** Start angle in radians */
  startAngle: number;
  /** End angle in radians */
  endAngle: number;
}

// ── Rendering ──────────────────────────────────

/** Props passed to every renderDatum callback */
export interface DatumRenderProps<TDatum = Record<string, unknown>> {
  /** The data point being rendered */
  datum: TDatum;
  /** Index in the data array */
  index: number;
  /** Pixel X position */
  x: number;
  /** Pixel Y position */
  y: number;
  /** Width (for bars and rects) */
  width: number;
  /** Height (for bars and rects) */
  height: number;
  /** Resolved fill color */
  color: string;
  /** Whether this datum is currently hovered/focused */
  isActive: boolean;
  /** Whether this datum is currently selected */
  isSelected: boolean;
}

// ── Tooltip ────────────────────────────────────

/** A single item in a tooltip payload */
export interface TooltipPayload<TDatum = Record<string, unknown>> {
  /** Series name/key */
  key: string;
  /** Display label for the series */
  label: string;
  /** Raw value */
  value: unknown;
  /** Formatted display value */
  formattedValue: string;
  /** Series color */
  color: string;
  /** The original datum */
  datum: TDatum;
}

// ── Events ─────────────────────────────────────

/** Unified event handlers available on every chart */
export interface ChartEventHandlers<TDatum = Record<string, unknown>> {
  onDatumClick?: (datum: TDatum, series: string, event: MouseEvent) => void;
  onDatumHover?: (datum: TDatum | null, series: string, event: MouseEvent) => void;
  onDatumFocus?: (datum: TDatum, series: string, event: FocusEvent) => void;
  onSeriesClick?: (seriesKey: string) => void;
  onSeriesToggle?: (seriesKey: string, visible: boolean) => void;
  onChartClick?: (coords: Point, event: MouseEvent) => void;
}

// ── Formatting ─────────────────────────────────

/** Built-in format shortcuts for axis/label formatting */
export type BuiltinFormat =
  | 'number'
  | 'integer'
  | 'currency'
  | 'percent'
  | 'compact'
  | 'date'
  | 'date:short'
  | 'time'
  | 'datetime'
  | 'duration';

/** A format can be a built-in shortcut or a custom function */
export type FormatFunction = BuiltinFormat | ((value: unknown) => string);

// ── Utility types ──────────────────────────────

/** Extract the keys from a datum type that map to number values */
export type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

/** Props interface for chart children that need a data field */
export interface FieldProps<TDatum> {
  /** Which data field this element visualizes */
  field: keyof TDatum & string;
}

/** Props shared across all series components */
export interface BaseSeriesProps<TDatum = Record<string, unknown>> extends FieldProps<TDatum> {
  /** Override the series color (defaults to next categorical color) */
  color?: string;
  /** Opacity (0–1) */
  opacity?: number;
  /** Enable/disable animation for this series */
  animate?: boolean;
  /** Enable gradient fill */
  gradient?: boolean | 'vertical' | 'horizontal';
  /** Custom render function for each datum */
  renderDatum?: (props: DatumRenderProps<TDatum>) => ReactNode;
  /** Click handler for individual data points */
  onDatumClick?: (datum: TDatum, event: MouseEvent<SVGElement>) => void;
  /** Hover handler for individual data points */
  onDatumHover?: (datum: TDatum | null, event: MouseEvent<SVGElement>) => void;
  /** ARIA label for the series */
  'aria-label'?: string;
}
