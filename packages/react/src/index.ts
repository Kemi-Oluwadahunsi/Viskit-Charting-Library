// ─────────────────────────────────────────────────
// @viskit/react — Consumer entry point
// ─────────────────────────────────────────────────
// This is the main package consumers install:
//
//   npm install @viskit/react
//
// It re-exports everything from the internal
// packages so consumers have a single import:
//
//   import { Chart, LineSeries, midnight } from '@viskit/react';
//
// For tree-shaking, consumers can also import
// directly from sub-packages if they prefer.
// ─────────────────────────────────────────────────

// ── Core ───────────────────────────────────────
export { Chart } from '@viskit/core';
export type {
  ChartProps,
  ChartHandle,
} from '@viskit/core';
export { useChartContext, useCartesianContext, usePolarContext } from '@viskit/core';
export { useScale } from '@viskit/core';
export { useFormat } from '@viskit/core';
export type {
  Margin,
  Dimensions,
  Point,
  ScaleType,
  ScaleConfig,
  BaseSeriesProps,
  TooltipPayload,
  FormatFunction,
  BuiltinFormat,
} from '@viskit/core';

// ── Charts — Phase 1 ──────────────────────────
export { LineSeries, BarSeries, AreaSeries, ScatterSeries } from '@viskit/charts';
export { PieSeries } from '@viskit/charts';

// ── Charts — Phase 2 Cartesian ────────────────
export {
  StackedBarSeries,
  GroupedBarSeries,
  HorizontalBarSeries,
  MultiLineSeries,
  StackedAreaSeries,
  BubbleSeries,
  LollipopSeries,
  DumbbellSeries,
} from '@viskit/charts';

// ── Charts — Phase 2 Radial ───────────────────
export { RadarSeries, RadialBarSeries, PolarAreaSeries } from '@viskit/charts';

// ── Charts — Phase 2 Specialized ──────────────
export { HistogramSeries, Heatmap, Sparkline } from '@viskit/charts';

// ── Charts — Phase 2 Canvas ───────────────────
export { CanvasRenderer } from '@viskit/charts';

// ── Charts — Phase 3 Hierarchical ─────────────
export { TreemapSeries, SunburstSeries, CirclePackingSeries, IcicleSeries } from '@viskit/charts';

// ── Charts — Phase 3 Flow ─────────────────────
export { SankeyDiagram, ChordDiagram, ForceGraph, FunnelSeries } from '@viskit/charts';

// ── Charts — Phase 3 Financial / Statistical ──
export {
  CandlestickSeries,
  WaterfallSeries,
  BoxPlotSeries,
  ViolinSeries,
  BulletSeries,
  SlopeSeries,
} from '@viskit/charts';

// ── Charts — Phase 3 Specialized ──────────────
export { GaugeSeries, StreamGraphSeries } from '@viskit/charts';

// ── Charts — Types ─────────────────────────────
export type {
  StackedBarSeriesProps,
  GroupedBarSeriesProps,
  HorizontalBarSeriesProps,
  MultiLineSeriesProps,
  StackedAreaSeriesProps,
  BubbleSeriesProps,
  LollipopSeriesProps,
  DumbbellSeriesProps,
  RadarSeriesProps,
  RadialBarSeriesProps,
  PolarAreaSeriesProps,
  HistogramSeriesProps,
  HeatmapProps,
  SparklineProps,
  CanvasRendererProps,
  CanvasPoint,
  // Phase 3 types
  TreemapSeriesProps,
  SunburstSeriesProps,
  CirclePackingSeriesProps,
  IcicleSeriesProps,
  SankeyDiagramProps,
  SankeyNode,
  SankeyLink,
  ChordDiagramProps,
  ForceGraphProps,
  ForceNode,
  ForceLink,
  FunnelSeriesProps,
  CandlestickSeriesProps,
  WaterfallSeriesProps,
  BoxPlotSeriesProps,
  ViolinSeriesProps,
  BulletSeriesProps,
  SlopeSeriesProps,
  GaugeSeriesProps,
  StreamGraphSeriesProps,
} from '@viskit/charts';

// ── Primitives ─────────────────────────────────
export { XAxis, YAxis, CartesianGrid, Legend, Tooltip, TooltipContent } from '@viskit/charts';
export type { XAxisProps, YAxisProps, CartesianGridProps, LegendProps, LegendItem, TooltipProps, TooltipContentProps } from '@viskit/charts';

// ── Themes ─────────────────────────────────────
export { midnight, daylight, aurora, corporate, createTheme, injectCSSVariables, ThemeProvider, useTheme } from '@viskit/themes';
export type { VisualizationTokens, PartialTokens, ThemeProviderProps } from '@viskit/themes';

// ── Animations ─────────────────────────────────
export { useReducedMotion, springPresets, resolveSpringConfig } from '@viskit/animations';
