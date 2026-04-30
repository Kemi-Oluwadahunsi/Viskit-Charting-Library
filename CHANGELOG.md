# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-04-28

### Added

#### Infrastructure
- Monorepo scaffold with pnpm workspaces + Turborepo pipeline
- Shared TypeScript configs (`@viskit/tsconfig`)
- Shared ESLint flat config (`@viskit/eslint-config`)
- tsup build pipeline for ESM + CJS + DTS output across all packages
- Storybook 8.6.18 with `@storybook/react-vite` for interactive documentation

#### @kodemaven/viskit-core
- `<Chart>` responsive container with auto-scale detection, ARIA attributes, and forwardRef
- 3 context providers: `ChartProvider`, `CartesianProvider`, `PolarProvider`
- `useScale` hook supporting 15 scale types with `detectScaleType`
- `useResponsiveSize` hook with ResizeObserver + debounce
- `useAutoMargin` for content-aware margins
- `useFormat` with 10 built-in formats via `Intl`
- `useKeyboardNav` for accessible data point navigation
- 25+ exported TypeScript types

#### @kodemaven/viskit-themes
- `VisualizationTokens` interface (60+ tokens)
- Built-in themes: `midnight` (dark), `daylight` (light), `aurora`, `corporate`
- `createTheme` deep-merge utility
- `injectCSSVariables` CSS bridge (SSR-safe)
- `ThemeProvider` + `useTheme` hook

#### @kodemaven/viskit-animations
- `useReducedMotion` hook
- 4 spring presets + `resolveSpringConfig`

#### @kodemaven/viskit-charts — Phase 1 (5 chart types + 6 primitives)
- `LineSeries`, `BarSeries`, `AreaSeries`, `ScatterSeries`, `PieSeries`
- `XAxis`, `YAxis`, `CartesianGrid`, `Legend`, `Tooltip`, `TooltipContent`

#### @kodemaven/viskit-charts — Phase 2 (14 chart types)
- `StackedBarSeries`, `GroupedBarSeries`, `HorizontalBarSeries`
- `MultiLineSeries`, `StackedAreaSeries`
- `BubbleSeries`, `LollipopSeries`, `DumbbellSeries`, `HistogramSeries`
- `RadarSeries`, `RadialBarSeries`, `PolarAreaSeries`
- `Heatmap`, `Sparkline`
- `CanvasRenderer` (Canvas2D backend for high-density datasets)

#### @kodemaven/viskit-charts — Phase 3 (16 chart types)
- `TreemapSeries`, `SunburstSeries`, `CirclePackingSeries`, `IcicleSeries`
- `SankeyDiagram`, `ChordDiagram`, `ForceGraph`, `FunnelSeries`
- `CandlestickSeries`, `WaterfallSeries`, `BoxPlotSeries`, `ViolinSeries`
- `BulletSeries`, `SlopeSeries`
- `GaugeSeries`, `StreamGraphSeries`

#### @kodemaven/viskit-charts — Phase 4 (7 chart types + utilities)
- `ParallelCoordinatesSeries`, `CalendarHeatmap`, `RidgeLineSeries`
- `MarimekkoSeries`, `WordCloud`, `GanttSeries`, `DensityContour`
- `ChartGroup` + `useChartGroup` for synchronized multi-chart layouts
- `Brush` for draggable selection/zoom
- `ReferenceLine`, `ReferenceBand`, `Annotations`, `CrosshairOverlay`
- `exportToPNG()`, `exportToSVG()` via ChartHandle ref
- `useStreamingData()` hook for real-time data with ring buffer

#### @kodemaven/viskit-charts — Phase 5 (6 chart types)
- `PyramidSeries`, `DivergingBarSeries`, `VennDiagram`
- `TimelineSeries`, `ComparisonSeries`, `DonutSeries`

#### viskit-react
- Consumer barrel package re-exporting all 48 chart types, primitives, themes, and utilities

#### Storybook
- 43 story files covering all 48 chart types
- All stories include Legend, responsive variants, and complete argTypes
- autodocs enabled for all stories

#### Hardening
- SSR-safe guards on all browser API usage (`window`, `document`)
- `sideEffects: false` on all library packages
- Bundle optimized with tree-shaking, code splitting, and externalized peer deps
- Changesets configured for semantic versioning
- GitHub Actions CI pipeline (build, test, typecheck, lint)
- Community files: LICENSE (MIT), CONTRIBUTING, CODE_OF_CONDUCT
