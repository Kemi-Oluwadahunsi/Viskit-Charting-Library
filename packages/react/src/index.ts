// ─────────────────────────────────────────────────
// viskit-react — Consumer entry point
// ─────────────────────────────────────────────────
// This is the main package consumers install:
//
//   npm install viskit-react
//
// It re-exports everything from the internal
// packages so consumers have a single import:
//
//   import { Chart, LineSeries, midnight } from 'viskit-react';
//
// For tree-shaking, consumers can also import
// directly from sub-packages if they prefer.
// ─────────────────────────────────────────────────

// ── Core ───────────────────────────────────────
export { Chart } from '@kodemaven/viskit-core';
export type {
  ChartProps,
  ChartHandle,
} from '@kodemaven/viskit-core';
export { useChartContext, useCartesianContext, usePolarContext } from '@kodemaven/viskit-core';
export { useScale } from '@kodemaven/viskit-core';
export { useFormat } from '@kodemaven/viskit-core';
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
} from '@kodemaven/viskit-core';

// ── Charts — Phase 1 ──────────────────────────
export { LineSeries, BarSeries, AreaSeries, ScatterSeries } from '@kodemaven/viskit-charts';
export { PieSeries } from '@kodemaven/viskit-charts';

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
} from '@kodemaven/viskit-charts';

// ── Charts — Phase 2 Radial ───────────────────
export { RadarSeries, RadialBarSeries, PolarAreaSeries } from '@kodemaven/viskit-charts';

// ── Charts — Phase 2 Specialized ──────────────
export { HistogramSeries, Heatmap, Sparkline } from '@kodemaven/viskit-charts';

// ── Charts — Phase 2 Canvas ───────────────────
export { CanvasRenderer } from '@kodemaven/viskit-charts';

// ── Charts — Phase 3 Hierarchical ─────────────
export { TreemapSeries, SunburstSeries, CirclePackingSeries, IcicleSeries } from '@kodemaven/viskit-charts';

// ── Charts — Phase 3 Flow ─────────────────────
export { SankeyDiagram, ChordDiagram, ForceGraph, FunnelSeries } from '@kodemaven/viskit-charts';

// ── Charts — Phase 3 Financial / Statistical ──
export {
  CandlestickSeries,
  WaterfallSeries,
  BoxPlotSeries,
  ViolinSeries,
  BulletSeries,
  SlopeSeries,
} from '@kodemaven/viskit-charts';

// ── Charts — Phase 3 Specialized ──────────────
export { GaugeSeries, StreamGraphSeries } from '@kodemaven/viskit-charts';

// ── Charts — Phase 4 Exotic ───────────────────
export {
  ParallelCoordinatesSeries,
  RidgeLineSeries,
  MarimekkoSeries,
  GanttSeries,
  CalendarHeatmap,
  WordCloud,
  DensityContour,
} from '@kodemaven/viskit-charts';

// ── Charts — Phase 4 Composition ──────────────
export { ChartGroup, useChartGroup, Brush } from '@kodemaven/viskit-charts';

// ── Charts — Phase 4 Interaction ──────────────
export { ReferenceLine, ReferenceBand, CrosshairOverlay, Annotations } from '@kodemaven/viskit-charts';

// ── Charts — Phase 4 Utilities ────────────────
export { exportToPNG, exportToSVG, useStreamingData } from '@kodemaven/viskit-charts';

// ── Charts — Phase 5 ─────────────────────────
export { PyramidSeries, DivergingBarSeries, TimelineSeries, ComparisonSeries } from '@kodemaven/viskit-charts';
export { VennDiagram } from '@kodemaven/viskit-charts';
export { DonutSeries } from '@kodemaven/viskit-charts';

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
  // Phase 4 types
  ParallelCoordinatesSeriesProps,
  RidgeLineSeriesProps,
  MarimekkoSeriesProps,
  GanttSeriesProps,
  CalendarHeatmapProps,
  WordCloudProps,
  DensityContourProps,
  ChartGroupProps,
  BrushProps,
  ReferenceLineProps,
  ReferenceBandProps,
  CrosshairOverlayProps,
  AnnotationsProps,
  AnnotationItem,
  ExportOptions,
  UseStreamingDataOptions,
  UseStreamingDataResult,
  // Phase 5 types
  PyramidSeriesProps,
  DivergingBarSeriesProps,
  TimelineSeriesProps,
  ComparisonSeriesProps,
  VennDiagramProps,
  VennSet,
  VennIntersection,
  DonutSeriesProps,
} from '@kodemaven/viskit-charts';

// ── Primitives ─────────────────────────────────
export { XAxis, YAxis, CartesianGrid, Legend, Tooltip, TooltipContent } from '@kodemaven/viskit-charts';
export type { XAxisProps, YAxisProps, CartesianGridProps, LegendProps, LegendItem, TooltipProps, TooltipContentProps } from '@kodemaven/viskit-charts';

// ── Themes ─────────────────────────────────────
export { midnight, daylight, aurora, corporate, createTheme, injectCSSVariables, ThemeProvider, useTheme } from '@kodemaven/viskit-themes';
export type { VisualizationTokens, PartialTokens, ThemeProviderProps } from '@kodemaven/viskit-themes';

// ── Animations ─────────────────────────────────
export { useReducedMotion, springPresets, resolveSpringConfig } from '@kodemaven/viskit-animations';
