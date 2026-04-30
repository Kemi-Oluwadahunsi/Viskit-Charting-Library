// ─────────────────────────────────────────────────
// @kodemaven/viskit-core — Public API
// ─────────────────────────────────────────────────
// This is the main entry point for the core package.
// Every public type, hook, component, and utility
// is exported from here for consumers.
// ─────────────────────────────────────────────────

// ── Types ──────────────────────────────────────
export type {
  Margin,
  Dimensions,
  Point,
  BoundingBox,
  ChartContextValue,
  CartesianContextValue,
  PolarContextValue,
  ScaleType,
  ScaleConfig,
  ScaleResult,
  DatumRenderProps,
  TooltipPayload,
  ChartEventHandlers,
  BaseSeriesProps,
  FormatFunction,
  BuiltinFormat,
} from './types';

// ── Contexts & Providers ───────────────────────
export { ChartProvider, useChartContext } from './context/chart-context';
export { CartesianProvider, useCartesianContext } from './context/cartesian-context';
export { PolarProvider, usePolarContext } from './context/polar-context';

// ── Hooks ──────────────────────────────────────
export { useScale } from './scales/use-scale';
export { useResponsiveSize } from './responsive/use-responsive-size';
export { useAutoMargin } from './layout/use-auto-margin';
export { useFormat } from './format/use-format';

// ── Components (Primitives) ────────────────────
export { Chart } from './chart/chart';
export type { ChartProps, ChartHandle } from './chart/chart';

// ── Accessibility ──────────────────────────────
export { useKeyboardNav } from './a11y/use-keyboard-nav';
