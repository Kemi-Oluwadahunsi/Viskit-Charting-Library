// ─────────────────────────────────────────────────
// @viskit/charts — Public API
// ─────────────────────────────────────────────────
// All chart series components are exported from here.
// Each series is a lightweight SVG component that
// reads data from ChartContext and renders visuals.
// ─────────────────────────────────────────────────

// Phase 1 — Cartesian series
export { LineSeries } from './cartesian/line-series';
export { BarSeries } from './cartesian/bar-series';
export { AreaSeries } from './cartesian/area-series';
export { ScatterSeries } from './cartesian/scatter-series';

// Phase 1 — Radial series
export { PieSeries } from './radial/pie-series';

// Phase 2 — Cartesian variants
export { StackedBarSeries } from './cartesian/stacked-bar-series';
export { GroupedBarSeries } from './cartesian/grouped-bar-series';
export { HorizontalBarSeries } from './cartesian/horizontal-bar-series';
export { MultiLineSeries } from './cartesian/multi-line-series';
export { StackedAreaSeries } from './cartesian/stacked-area-series';
export { BubbleSeries } from './cartesian/bubble-series';
export { LollipopSeries } from './cartesian/lollipop-series';
export { DumbbellSeries } from './cartesian/dumbbell-series';

// Phase 2 — Radial
export { RadarSeries } from './radial/radar-series';
export { RadialBarSeries } from './radial/radial-bar-series';
export { PolarAreaSeries } from './radial/polar-area-series';

// Phase 2 — Specialized
export { HistogramSeries } from './specialized/histogram-series';
export { Heatmap } from './specialized/heatmap';
export { Sparkline } from './specialized/sparkline';

// Phase 2 — Canvas backend
export { CanvasRenderer } from './canvas/canvas-renderer';

// Phase 1 — Primitives
export { XAxis } from './primitives/x-axis';
export { YAxis } from './primitives/y-axis';
export { CartesianGrid } from './primitives/cartesian-grid';
export { Legend } from './primitives/legend';
export { Tooltip } from './primitives/tooltip';
export { TooltipContent } from './primitives/tooltip-content';

// Types — Phase 2 series
export type { StackedBarSeriesProps } from './cartesian/stacked-bar-series';
export type { GroupedBarSeriesProps } from './cartesian/grouped-bar-series';
export type { HorizontalBarSeriesProps } from './cartesian/horizontal-bar-series';
export type { MultiLineSeriesProps } from './cartesian/multi-line-series';
export type { StackedAreaSeriesProps } from './cartesian/stacked-area-series';
export type { BubbleSeriesProps } from './cartesian/bubble-series';
export type { LollipopSeriesProps } from './cartesian/lollipop-series';
export type { DumbbellSeriesProps } from './cartesian/dumbbell-series';
export type { RadarSeriesProps } from './radial/radar-series';
export type { RadialBarSeriesProps } from './radial/radial-bar-series';
export type { PolarAreaSeriesProps } from './radial/polar-area-series';
export type { HistogramSeriesProps } from './specialized/histogram-series';
export type { HeatmapProps } from './specialized/heatmap';
export type { SparklineProps } from './specialized/sparkline';
export type { CanvasRendererProps, CanvasPoint } from './canvas/canvas-renderer';

// Phase 3 — Hierarchical
export { TreemapSeries } from './hierarchical/treemap-series';
export { SunburstSeries } from './hierarchical/sunburst-series';
export { CirclePackingSeries } from './hierarchical/circle-packing-series';
export { IcicleSeries } from './hierarchical/icicle-series';

// Phase 3 — Flow
export { SankeyDiagram } from './flow/sankey-diagram';
export { ChordDiagram } from './flow/chord-diagram';
export { ForceGraph } from './flow/force-graph';
export { FunnelSeries } from './flow/funnel-series';

// Phase 3 — Financial / Statistical
export { CandlestickSeries } from './cartesian/candlestick-series';
export { WaterfallSeries } from './cartesian/waterfall-series';
export { BoxPlotSeries } from './cartesian/box-plot-series';
export { ViolinSeries } from './cartesian/violin-series';
export { BulletSeries } from './cartesian/bullet-series';
export { SlopeSeries } from './cartesian/slope-series';

// Phase 3 — Specialized
export { GaugeSeries } from './specialized/gauge-series';
export { StreamGraphSeries } from './cartesian/stream-graph-series';

// Types — Primitives
export type { XAxisProps } from './primitives/x-axis';
export type { YAxisProps } from './primitives/y-axis';
export type { CartesianGridProps } from './primitives/cartesian-grid';
export type { LegendProps, LegendItem } from './primitives/legend';
export type { TooltipProps } from './primitives/tooltip';
export type { TooltipContentProps, TooltipVariant } from './primitives/tooltip-content';

// Types — Phase 3 Hierarchical
export type { TreemapSeriesProps } from './hierarchical/treemap-series';
export type { SunburstSeriesProps } from './hierarchical/sunburst-series';
export type { CirclePackingSeriesProps } from './hierarchical/circle-packing-series';
export type { IcicleSeriesProps } from './hierarchical/icicle-series';

// Types — Phase 3 Flow
export type { SankeyDiagramProps, SankeyNode, SankeyLink } from './flow/sankey-diagram';
export type { ChordDiagramProps } from './flow/chord-diagram';
export type { ForceGraphProps, ForceNode, ForceLink } from './flow/force-graph';
export type { FunnelSeriesProps } from './flow/funnel-series';

// Types — Phase 3 Financial / Statistical
export type { CandlestickSeriesProps } from './cartesian/candlestick-series';
export type { WaterfallSeriesProps } from './cartesian/waterfall-series';
export type { BoxPlotSeriesProps } from './cartesian/box-plot-series';
export type { ViolinSeriesProps } from './cartesian/violin-series';
export type { BulletSeriesProps } from './cartesian/bullet-series';
export type { SlopeSeriesProps } from './cartesian/slope-series';

// Types — Phase 3 Specialized
export type { GaugeSeriesProps } from './specialized/gauge-series';
export type { StreamGraphSeriesProps } from './cartesian/stream-graph-series';
