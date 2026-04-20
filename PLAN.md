# VisKit — Master Project Plan

> A composable, tree-shakeable, TypeScript-first React data visualization library.
> Modern. Sophisticated. Clean. Highly configurable.

---

## 1. Vision & Design Philosophy

VisKit is an opinionated yet flexible chart library that prioritizes:

1. **Composability** — Charts are assembled from small, focused primitives (`<Chart>`, `<LineSeries>`, `<XAxis>`, `<Tooltip>`) rather than monolithic config objects. Consumers import only what they need.

2. **Type Safety** — Generic components carry the datum shape through the entire tree. `<LineSeries<SalesRecord> field="revenue">` is a compile-time guarantee, not a runtime string lookup.

3. **Accessibility First** — Every chart is navigable by keyboard, readable by screen readers, and responsive to `prefers-reduced-motion`. This is non-negotiable, not a Phase-4 afterthought.

4. **Theme-Driven Visuals** — No component hardcodes a color, font size, spacing, or animation duration. Every visual decision flows from a token system that can be swapped at runtime.

5. **Zero-Config Reasonable Defaults** — A chart should render beautifully with `<Chart data={data}><LineSeries field="value" /></Chart>`. Auto-scaling, auto-margins, auto-colors, responsive sizing — all out of the box.

6. **Performance at Scale** — Memoized computation pipeline: raw data → scales → positions → render. Resizing re-runs scales, not data parsing. Canvas renderer available for 10k+ point datasets.

### What VisKit Is Not

- Not a dashboard framework (no layout engine, no data fetching)
- Not a D3 wrapper (D3 is an implementation detail; consumers never import it)
- Not a server-side library (no Node.js rendering, no SSR chart images)

---

## 2. Technology Stack

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| UI Framework | React | 19.2.x | Concurrent features, `useId`, `forwardRef` improvements |
| Language | TypeScript | 6.0.x | Strict mode, `satisfies`, `const` type parameters |
| Monorepo | pnpm workspaces + Turborepo | 10.x / 2.9.x | Workspace protocol (`workspace:*`), parallel builds, caching |
| Bundler | tsup (esbuild) | 8.x | ESM + CJS + DTS in <2s per package |
| Dev Server | Vite | 8.x | Instant HMR for the demo app |
| Scales | d3-scale | 4.x | 15 scale types, battle-tested math |
| Shapes | d3-shape | 3.x | Line, area, arc, pie generators, curve factories |
| Arrays | d3-array | 3.x | extent, max, min, bisect, ticks |
| Hierarchies | d3-hierarchy | 3.x | Treemap, partition, tree layouts (Phase 3) |
| Force | d3-force | 3.x | Force-directed graph simulation (Phase 3) |
| Sankey | d3-sankey | 0.12.x | Flow diagram layout (Phase 3) |
| Animation | @react-spring/web | 9.7.x | Physics-based springs, `useSpring`, `useTransition` |
| Positioning | @floating-ui/react | 0.27.x | Tooltip/popover placement with collision detection |
| Unit Testing | Vitest | 3.2.x | Vite-native, fast, compatible with Testing Library |
| Component Testing | @testing-library/react | 16.x | DOM assertions, user-event simulation |
| Visual Regression | Chromatic | — | Snapshot per chart × theme × viewport × state |
| Lint | ESLint | 9.x | Flat config, `@typescript-eslint`, react-hooks rules |

### Rendering Pipeline

```
Phase 1: SVG (default)    — All chart types, crisp at any zoom
Phase 2: Canvas           — `<CanvasRenderer>` for 10k+ points, scatter/heatmap
Phase 3: WebGL            — `<GLRenderer>` for force graphs, 100k+ nodes
```

The renderer is abstracted behind series components. `<ScatterSeries>` renders SVG circles below 5k points and Canvas above, automatically. Consumer can override with `renderer="svg" | "canvas"`.

---

## 3. Monorepo Architecture

```
viskit/
├── packages/
│   ├── core/             @viskit/core          Heart of the library
│   │   ├── src/
│   │   │   ├── types.ts                        All shared cross-package types
│   │   │   ├── context/
│   │   │   │   ├── chart-context.tsx            ChartProvider + useChartContext
│   │   │   │   ├── cartesian-context.tsx        CartesianProvider + useCartesianContext
│   │   │   │   └── polar-context.tsx            PolarProvider + usePolarContext
│   │   │   ├── scales/
│   │   │   │   └── use-scale.ts                 D3 scale wrapper (15 types)
│   │   │   ├── responsive/
│   │   │   │   └── use-responsive-size.ts       ResizeObserver hook
│   │   │   ├── layout/
│   │   │   │   └── use-auto-margin.ts           Automatic margin calculation
│   │   │   ├── format/
│   │   │   │   └── use-format.ts                Intl-based value formatting
│   │   │   └── chart/
│   │   │       └── chart.tsx                    Root <Chart> component
│   │   └── index.ts                             Public API
│   │
│   ├── themes/           @viskit/themes         Design token system
│   │   ├── src/
│   │   │   ├── tokens.ts                        VisualizationTokens interface
│   │   │   ├── presets/
│   │   │   │   ├── midnight.ts                  Dark theme
│   │   │   │   ├── daylight.ts                  Light theme
│   │   │   │   ├── aurora.ts                    Vibrant dark (Phase 2)
│   │   │   │   └── corporate.ts                 Neutral light (Phase 2)
│   │   │   ├── create-theme.ts                  Deep-merge utility
│   │   │   └── css-bridge.ts                    Token → CSS variable injection
│   │   └── index.ts
│   │
│   ├── animations/       @viskit/animations     Motion system
│   │   ├── src/
│   │   │   ├── use-reduced-motion.ts            OS prefers-reduced-motion
│   │   │   └── spring-presets.ts                4 spring configs + resolver
│   │   └── index.ts
│   │
│   ├── charts/           @viskit/charts         All visual series (42 chart types)
│   │   ├── src/
│   │   │   ├── cartesian/
│   │   │   │   ├── line-series.tsx              Line + dots + curves (P1)
│   │   │   │   ├── bar-series.tsx               Vertical bars (P1)
│   │   │   │   ├── area-series.tsx              Filled area + gradient (P1)
│   │   │   │   ├── scatter-series.tsx           Circle markers (P1)
│   │   │   │   ├── stacked-bar-series.tsx       Stacked bars (P2)
│   │   │   │   ├── grouped-bar-series.tsx       Grouped bars (P2)
│   │   │   │   ├── horizontal-bar-series.tsx    Horizontal bars (P2)
│   │   │   │   ├── multi-line-series.tsx        Multiple overlaid lines (P2)
│   │   │   │   ├── stacked-area-series.tsx      Stacked areas (P2)
│   │   │   │   ├── bubble-series.tsx            Variable-size scatter (P2)
│   │   │   │   ├── lollipop-series.tsx          Stem + circle (P2)
│   │   │   │   ├── dumbbell-series.tsx          Two-point range (P2)
│   │   │   │   ├── histogram-series.tsx         Binned frequency (P2)
│   │   │   │   ├── candlestick-series.tsx       OHLC financial (P3)
│   │   │   │   ├── waterfall-series.tsx         Running totals (P3)
│   │   │   │   ├── box-plot-series.tsx          Quartile distribution (P3)
│   │   │   │   ├── violin-series.tsx            Kernel density shape (P3)
│   │   │   │   ├── bullet-series.tsx            Qualitative range (P3)
│   │   │   │   ├── slope-series.tsx             Before/after comparison (P3)
│   │   │   │   ├── parallel-coordinates.tsx     Multi-axis comparison (P4)
│   │   │   │   ├── ridgeline-series.tsx         Joy plot / density (P4)
│   │   │   │   ├── marimekko-series.tsx         Variable-width bars (P4)
│   │   │   │   └── gantt-series.tsx             Timeline bars (P4)
│   │   │   ├── radial/
│   │   │   │   ├── pie-series.tsx               Pie / donut (P1)
│   │   │   │   ├── radar-series.tsx             Spider chart (P2)
│   │   │   │   ├── radial-bar-series.tsx        Circular bars (P2)
│   │   │   │   ├── polar-area-series.tsx        Nightingale rose (P2)
│   │   │   │   ├── sunburst-series.tsx          Multi-level radial (P3)
│   │   │   │   └── chord-diagram.tsx            Relationship matrix (P3)
│   │   │   ├── hierarchical/
│   │   │   │   ├── treemap-series.tsx           Nested rectangles (P3)
│   │   │   │   ├── circle-packing-series.tsx    Nested circles (P3)
│   │   │   │   └── icicle-series.tsx            Horizontal partition (P3)
│   │   │   ├── flow/
│   │   │   │   ├── sankey-diagram.tsx           Flow diagram (P3)
│   │   │   │   ├── funnel-series.tsx            Conversion funnel (P3)
│   │   │   │   └── force-graph.tsx              Network graph (P3)
│   │   │   ├── specialized/
│   │   │   │   ├── gauge-series.tsx             Dashboard gauge (P3)
│   │   │   │   ├── stream-graph-series.tsx      Offset stacked area (P3)
│   │   │   │   ├── heatmap.tsx                  Color matrix (P2)
│   │   │   │   ├── calendar-heatmap.tsx         Day grid over months (P4)
│   │   │   │   ├── word-cloud.tsx               Weighted text layout (P4)
│   │   │   │   └── density-contour.tsx          2D kernel density (P4)
│   │   │   ├── primitives/
│   │   │   │   ├── x-axis.tsx                   X axis (P1)
│   │   │   │   ├── y-axis.tsx                   Y axis (P1)
│   │   │   │   ├── cartesian-grid.tsx           Grid lines (P1)
│   │   │   │   ├── legend.tsx                   Series legend (P1)
│   │   │   │   ├── tooltip.tsx                  Positioned tooltip (P1)
│   │   │   │   ├── tooltip-content.tsx          Default tooltip body (P1)
│   │   │   │   ├── reference-line.tsx           Annotation line (P4)
│   │   │   │   ├── reference-band.tsx           Annotation band (P4)
│   │   │   │   └── crosshair-overlay.tsx        Cursor tracker (P4)
│   │   │   ├── composition/
│   │   │   │   ├── chart-group.tsx              Synced multi-chart (P4)
│   │   │   │   ├── brush.tsx                    Zoom selection (P4)
│   │   │   │   └── sparkline.tsx                Inline mini-chart (P2)
│   │   │   └── canvas/
│   │   │       └── canvas-renderer.tsx          Canvas backend (P2)
│   │   └── index.ts
│   │
│   └── react/            @viskit/react          Consumer barrel package
│       ├── src/
│       │   └── index.ts                         Re-exports everything
│       └── package.json
│
├── apps/
│   ├── demo/             @viskit/demo           Dev playground (Vite)
│   └── docs/             @viskit/docs           API docs site (Next.js, Phase 5)
│
├── tooling/
│   ├── tsconfig/         @viskit/tsconfig       Shared TS configs
│   │   ├── library.json                         For library packages
│   │   └── app.json                             For Vite/Next.js apps
│   └── eslint-config/    @viskit/eslint-config  Shared ESLint flat config
│
├── PLAN.md               ← You are here
├── turbo.json            Turborepo pipeline
├── pnpm-workspace.yaml   Workspace definition
└── package.json          Root scripts
```

### Package Dependency Graph

```
@viskit/react (consumer barrel)
  ├── @viskit/charts
  │     ├── @viskit/core
  │     ├── @viskit/themes
  │     └── @viskit/animations
  ├── @viskit/core
  ├── @viskit/themes
  └── @viskit/animations
```

All downstream packages depend on `@viskit/core` for types and context. Turborepo builds them in topological order: `core` → `themes` + `animations` (parallel) → `charts` → `react`.

---

## 4. Context Architecture & Data Flow

### Three-Layer Context System

VisKit uses a three-tier React context hierarchy. Each layer carries specific responsibilities and is only present when relevant:

```
┌──────────────────────────────────────────────────────┐
│  ChartProvider (always present)                       │
│  Carries: data[], dimensions, colorScale, chartId,   │
│           activeKeys, setActiveKeys                   │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │  CartesianProvider (auto-detected)              │  │
│  │  Carries: xScale, yScale, innerWidth,           │  │
│  │           innerHeight, flipped                   │  │
│  │  Present when: data has string + numeric fields  │  │
│  │                                                  │  │
│  │  Children: LineSeries, BarSeries, AreaSeries,   │  │
│  │            ScatterSeries, XAxis, YAxis,          │  │
│  │            CartesianGrid, Tooltip, Legend         │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │  PolarProvider (when polar charts present)      │  │
│  │  Carries: cx, cy, innerRadius, outerRadius,     │  │
│  │           startAngle, endAngle                   │  │
│  │                                                  │  │
│  │  Children: PieSeries, RadarSeries,              │  │
│  │            RadialBarSeries                       │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Data Flow Pipeline

```
Consumer data[] ──→ <Chart data={…}>
                        │
                        ├─ useResponsiveSize()     → width, height
                        ├─ useAutoMargin()          → margin { top, right, bottom, left }
                        ├─ Compute dimensions       → innerWidth, innerHeight
                        ├─ Color scale factory      → colorScale(seriesKey) → hex color
                        │
                        ├─ Auto-scale detection (cartesian path):
                        │   ├─ First string field  → Band scale (xScale)
                        │   ├─ All numeric fields  → Linear scale (yScale, 10% headroom, .nice())
                        │   └─ Date fields         → Time scale
                        │
                        ├─ ChartProvider ──→ All children can read data + dimensions
                        └─ CartesianProvider ──→ Cartesian children can read xScale + yScale
                              │
                              └─ <LineSeries field="revenue">
                                    ├─ useChartContext()      → data, colorScale
                                    ├─ useCartesianContext()  → xScale, yScale
                                    ├─ d3.line() generator   → SVG path string
                                    └─ <path d={…} />        → Rendered SVG
```

### Auto-Scale Detection (Built into `<Chart>`)

When no explicit scale configuration is provided, `<Chart>` scans the first datum to auto-configure:

| Field Type | Detection | Scale Type | Configuration |
|-----------|-----------|-----------|--------------|
| `string` | `typeof val === 'string'` | `scaleBand()` | domain = all unique values, padding = 0.2 |
| `number` | `typeof val === 'number'` | `scaleLinear()` | domain = [0, max × 1.1], `.nice()`, inverted range |
| `Date` | `instanceof Date` | `scaleTime()` | domain = [min, max], `.nice()` |
| `string` (ISO date) | `Date.parse()` succeeds | `scaleTime()` | Parsed to Date objects |

The x-axis always takes the **first string field** found. The y-axis domain spans **all numeric fields** in the dataset so multiple series share the same scale by default.

### Auto-Margin Calculation (`useAutoMargin`)

Margins are computed from measurable content, not guessed:

| Content | Space Reserved |
|---------|---------------|
| Base padding (always) | 8px per side |
| X-axis tick labels | 40px |
| X-axis label text | +24px |
| Y-axis tick labels | 40px |
| Y-axis label text | +24px |
| Chart title | +28px top |
| Legend (any side) | +32px |

Consumer can override any side: `margin={{ left: 100 }}` overrides only left, auto-calculates the rest.

---

## 5. Type System

### Core Types (`@viskit/core/types.ts`)

All shared types live in one file. Component-specific types stay colocated.

```typescript
// ── Geometry ─────────────
Margin                      // { top, right, bottom, left }
Dimensions                  // { width, height, innerWidth, innerHeight, margin }
Point                       // { x, y }
BoundingBox                 // { x, y, width, height }

// ── Scales ───────────────
ScaleType                   // Union of 15 scale type strings
ScaleConfig<TDomain, TRange>// Input config for useScale()
ScaleResult<TDomain, TRange>// Output: scale(), ticks(), domain, range, bandwidth?, invert?

// ── Contexts ─────────────
ChartContextValue<TDatum>   // data, dimensions, colorScale, chartId, activeKeys
CartesianContextValue       // xScale, yScale, innerWidth, innerHeight, flipped
PolarContextValue           // cx, cy, innerRadius, outerRadius, startAngle, endAngle

// ── Rendering ────────────
DatumRenderProps<TDatum>    // datum, index, x, y, width, height, color, isActive, isSelected
TooltipPayload<TDatum>      // key, label, value, formattedValue, color, datum

// ── Events ───────────────
ChartEventHandlers<TDatum>  // onDatumClick, onDatumHover, onDatumFocus, onSeriesClick,
                            // onSeriesToggle, onChartClick

// ── Formatting ───────────
BuiltinFormat               // 'number' | 'integer' | 'currency' | 'percent' | 'compact' | ...
FormatFunction              // BuiltinFormat | ((value: unknown) => string)

// ── Utility ──────────────
NumericKeys<T>              // Extract keys with number values from a type
FieldProps<TDatum>          // { field: keyof TDatum & string }
BaseSeriesProps<TDatum>     // field, color, opacity, animate, gradient, renderDatum,
                            // onDatumClick, onDatumHover, aria-label
```

### Generic Data Flow

Every series is generic over the datum shape. The `field` prop is `keyof TDatum & string`, giving autocomplete and compile-time safety:

```typescript
interface SalesRecord {
  month: string;
  revenue: number;
  cost: number;
}

// ✅ Type-safe: 'revenue' is keyof SalesRecord
<LineSeries<SalesRecord> field="revenue" />

// ❌ Compile error: 'nonexistent' is not keyof SalesRecord
<LineSeries<SalesRecord> field="nonexistent" />
```

---

## 6. Component Inventory — Full Catalog (42 Chart Types + Primitives)

### Phase 1 — Cartesian Foundations (5 chart types + 6 primitives)

| # | Component | Package | Description | Key Props |
|---|-----------|---------|-------------|-----------|
| — | `<Chart>` | core | Root container. Responsive SVG, ARIA, auto-scales, auto-margins | `data`, `height?`, `aspect?`, `margin?`, `colors?`, `title?` |
| 1 | `<LineSeries>` | charts | SVG path with d3-shape line generator | `field`, `curve?`, `dots?`, `strokeWidth?`, `strokeDasharray?`, `connectNulls?` |
| 2 | `<BarSeries>` | charts | Vertical bars via band scale | `field`, `radius?`, `gradientFill?` |
| 3 | `<AreaSeries>` | charts | Filled area with optional gradient | `field`, `curve?`, `gradient?`, `fillOpacity?`, `strokeWidth?` |
| 4 | `<ScatterSeries>` | charts | Circle markers at data positions | `field`, `radius?`, `symbol?` |
| 5 | `<PieSeries>` | charts | Pie/donut arcs via d3-pie layout | `field`, `nameField?`, `innerRadius?`, `padAngle?`, `cornerRadius?` |
| — | `<XAxis>` | charts | Bottom/top axis with tick formatting | `field?`, `position?`, `tickCount?`, `format?`, `label?` |
| — | `<YAxis>` | charts | Left/right axis with tick formatting | `field?`, `position?`, `tickCount?`, `format?`, `label?` |
| — | `<CartesianGrid>` | charts | Horizontal/vertical grid lines | `horizontal?`, `vertical?`, `strokeDasharray?` |
| — | `<Tooltip>` | charts | Floating tooltip via @floating-ui | `trigger?`, `placement?`, `offset?`, `renderContent?` |
| — | `<TooltipContent>` | charts | Default tooltip body layout | `payload`, `formatValue?` |
| — | `<Legend>` | charts | Clickable series legend | `position?`, `layout?`, `onToggle?` |

### Phase 2 — Advanced Cartesian & Radial (14 chart types)

| # | Component | Description | Key Props |
|---|-----------|-------------|-----------|
| 6 | `<StackedBarSeries>` | Stacked vertical bars | `fields`, `stackOrder?`, `stackOffset?` |
| 7 | `<GroupedBarSeries>` | Side-by-side grouped bars | `fields`, `groupPadding?` |
| 8 | `<HorizontalBarSeries>` | Flipped axis bars | `field`, `radius?` |
| 9 | `<MultiLineSeries>` | Multiple overlaid lines from one component | `fields`, `curve?`, `dots?` |
| 10 | `<StackedAreaSeries>` | Stacked filled areas | `fields`, `curve?`, `stackOrder?`, `stackOffset?` |
| 11 | `<BubbleSeries>` | Scatter with variable-size circles | `field`, `sizeField`, `minRadius?`, `maxRadius?` |
| 12 | `<LollipopSeries>` | Thin stem + circle endpoint | `field`, `stemWidth?`, `radius?` |
| 13 | `<DumbbellSeries>` | Two-point range comparison | `startField`, `endField`, `stemWidth?` |
| 14 | `<HistogramSeries>` | Binned frequency distribution | `field`, `bins?`, `binMethod?` |
| 15 | `<RadarSeries>` | Spider/radar polygon | `fields`, `fillOpacity?`, `levels?` |
| 16 | `<RadialBarSeries>` | Circular progress bars | `field`, `innerRadius?`, `cornerRadius?` |
| 17 | `<PolarAreaSeries>` | Nightingale/coxcomb rose chart | `field`, `nameField?`, `innerRadius?` |
| 18 | `<Heatmap>` | Color-coded matrix | `xField`, `yField`, `valueField`, `colorScale?` |
| 19 | `<Sparkline>` | Inline mini line chart | `field`, `height?`, `strokeWidth?`, `area?` |
| — | `<CanvasRenderer>` | Canvas backend for heavy datasets | `threshold?` (auto-switch point count) |

### Phase 3 — Specialized & Statistical (16 chart types)

| # | Component | D3 Module | Description | Key Props |
|---|-----------|-----------|-------------|-----------|
| 20 | `<TreemapSeries>` | d3-hierarchy | Nested rectangles for hierarchical data | `field`, `tile?`, `padding?` |
| 21 | `<SunburstSeries>` | d3-hierarchy | Multi-level radial partition | `field`, `nameField?`, `levels?` |
| 22 | `<CirclePackingSeries>` | d3-hierarchy | Nested circles for hierarchical data | `field`, `padding?` |
| 23 | `<IcicleSeries>` | d3-hierarchy | Horizontal partition layout | `field`, `padding?` |
| 24 | `<SankeyDiagram>` | d3-sankey | Flow/energy diagrams between nodes | `nodes`, `links`, `nodeWidth?`, `nodePadding?` |
| 25 | `<ChordDiagram>` | d3-chord | Relationship matrix in circular layout | `matrix`, `labels?`, `padAngle?` |
| 26 | `<ForceGraph>` | d3-force | Interactive node-link network graphs | `nodes`, `links`, `strength?`, `charge?` |
| 27 | `<CandlestickSeries>` | — | OHLC financial price charts | `openField`, `highField`, `lowField`, `closeField` |
| 28 | `<WaterfallSeries>` | — | Running total / cumulative effect | `field`, `positiveColor?`, `negativeColor?`, `totalColor?` |
| 29 | `<FunnelSeries>` | — | Sales/conversion funnel | `field`, `nameField?`, `neckWidth?`, `neckHeight?` |
| 30 | `<GaugeSeries>` | — | Semi-circle dashboard gauge with needle | `value`, `min?`, `max?`, `segments?` |
| 31 | `<BoxPlotSeries>` | — | Quartile distribution (box + whiskers) | `field`, `groupField?`, `whiskerType?` |
| 32 | `<ViolinSeries>` | — | Kernel density distribution shape | `field`, `groupField?`, `bandwidth?` |
| 33 | `<BulletSeries>` | — | Qualitative range indicator (Stephen Few) | `value`, `target`, `ranges` |
| 34 | `<SlopeSeries>` | — | Before/after comparison between two points | `startField`, `endField`, `nameField?` |
| 35 | `<StreamGraphSeries>` | d3-shape | Stacked area with baseline offset | `fields`, `curve?`, `offset?` |

### Phase 4 — Exotic, Composition & Interaction (7 chart types + utilities)

**Chart types:**

| # | Component | Description | Key Props |
|---|-----------|-------------|-----------|
| 36 | `<ParallelCoordinatesSeries>` | Multi-axis comparison plot | `fields`, `brushable?`, `curveType?` |
| 37 | `<CalendarHeatmap>` | GitHub-style day grid over months | `dateField`, `valueField`, `colorScale?` |
| 38 | `<RidgeLineSeries>` | Overlapping density distributions (joy plot) | `fields`, `overlap?`, `curve?` |
| 39 | `<MarimekksSeries>` | Variable-width stacked bars (mosaic) | `widthField`, `heightField`, `categoryField?` |
| 40 | `<WordCloud>` | Weighted text layout | `textField`, `valueField`, `spiral?`, `rotate?` |
| 41 | `<GanttSeries>` | Timeline/schedule horizontal bars | `startField`, `endField`, `nameField?`, `progressField?` |
| 42 | `<DensityContour>` | 2D kernel density estimation contour | `xField`, `yField`, `bandwidth?`, `thresholds?` |

**Composition & interaction primitives:**

| Component | Description |
|-----------|-------------|
| `<ChartGroup>` | Synchronized tooltips, crosshairs, and zoom across multiple `<Chart>` instances |
| `<Brush>` | Draggable selection region for zoom/pan with optional mini-map |
| `<ReferenceLine>` | Horizontal/vertical annotation line at a data value |
| `<ReferenceBand>` | Shaded region between two values (e.g., "target zone") |
| `<CrosshairOverlay>` | Vertical/horizontal line tracking cursor position |
| `<Annotations>` | Text, arrow, or custom SVG placed at data coordinates |
| Export utilities | `exportToPNG()`, `exportToSVG()` via `ChartHandle` ref |
| Streaming support | `useStreamingData()` hook for real-time append with ring buffer |

---

## 7. Theming — Token System & Nested Providers

### VisualizationTokens Interface

Every visual decision in VisKit flows from this token interface. No component reads CSS, no component has a hardcoded color.

```typescript
interface VisualizationTokens {
  name: string;                    // 'midnight', 'daylight', etc.
  colorMode: 'light' | 'dark';

  // ── Color Palettes ──────────
  categorical: readonly string[];  // 8+ perceptually distinct, WCAG AA
  sequential: {                    // 10-stop ramps (50–900) for heatmaps, density
    blue: ColorScale;
    green: ColorScale;
    purple: ColorScale;
  };
  semantic: {                      // Meaning-carrying colors
    positive: string;              // Growth, success, profit
    negative: string;              // Loss, error, decline
    neutral: string;               // Baseline, unchanged
    warning: string;               // Caution, threshold
    info: string;                  // Informational, highlight
  };

  // ── Surfaces ────────────────
  surface: {
    background: string;            // Page/chart background
    card: string;                  // Tooltip card, legend card
    cardBorder: string;            // Card stroke
    grid: string;                  // Major grid lines
    gridMinor: string;             // Minor grid lines
    axis: string;                  // Axis baseline stroke
    tick: string;                  // Tick marks
    crosshair: string;             // Cursor tracking line
  };

  // ── Typography ──────────────
  typography: {
    fontFamily: string;            // Chart text
    fontFamilyMono: string;        // Code, numbers in tooltips
    axisLabel: { fontSize, fontWeight, color };
    chartTitle: { fontSize, fontWeight, color };
    dataLabel: { fontSize, fontWeight, color };
    tooltipBody: { fontSize, fontWeight, color };
    legendLabel: { fontSize, fontWeight, color };
  };

  // ── Spacing ─────────────────
  spacing: {
    chartPadding: number;          // Inner padding of chart container
    legendGap: number;             // Gap between legend items
    tooltipPadding: number;        // Tooltip inner padding
    barGroupGap: number;           // Gap between bar groups (0–1)
    barGap: number;                // Gap between bars in a group (0–1)
  };

  // ── Motion ──────────────────
  motion: {
    duration: { fast, base, slow };      // ms values for CSS fallbacks
    spring: {
      responsive: { tension, friction }; // Tooltip, hover
      gentle: { tension, friction };     // Enter/update animations
    };
    stagger: number;                     // ms delay between series items
  };

  // ── Geometry ────────────────
  geometry: {
    borderRadius: number;          // Bar corners, tooltip corners
    dotRadius: number;             // Data point markers (normal)
    dotRadiusActive: number;       // Data point markers (hovered)
    strokeWidth: number;           // Line thickness (normal)
    strokeWidthHover: number;      // Line thickness (hovered)
    focusRingWidth: number;        // Keyboard focus outline
    focusRingColor: string;        // Focus ring color
  };

  // ── Effects ─────────────────
  effects: {
    tooltipBlur: number;           // Backdrop blur for glassmorphism
    tooltipShadow: string;         // Box shadow for tooltip
    dimmedOpacity: number;         // Non-active series during hover
    gradientOpacity: [number, number]; // [top, bottom] for area gradient
  };
}
```

### Theme Presets — 4 Built-in Themes

| Theme | Mode | Aesthetic | Primary Use |
|-------|------|-----------|-------------|
| **Midnight** | Dark | Deep charcoal (#0F172A), vibrant pastel accents, glassmorphism tooltips | Dashboards, dark UIs, data-heavy apps |
| **Daylight** | Light | Pure white, deeper saturated accents, soft shadows | Documentation, reports, print |
| **Aurora** | Dark | Deep navy, neon gradients, electric accents, glow effects | Creative portfolios, presentations (Phase 2) |
| **Corporate** | Light | Warm gray, muted professional palette, minimal decoration | Enterprise dashboards, annual reports (Phase 2) |

### Nested Theme Providers

Themes can be nested. A dashboard can use Midnight globally, but embed a single chart with Daylight for contrast:

```tsx
<ThemeProvider theme={midnight}>
  <Chart data={data1}>
    <LineSeries field="revenue" />     {/* Uses midnight colors */}
  </Chart>

  <ThemeProvider theme={daylight}>
    <Chart data={data2}>
      <BarSeries field="sales" />      {/* Uses daylight colors */}
    </Chart>
  </ThemeProvider>
</ThemeProvider>
```

`useTheme()` reads the nearest `ThemeProvider` ancestor. If none is found, components fall back to a built-in default palette.

### Custom Themes via `createTheme()`

Deep-merges a base theme with partial overrides. Type-safe — autocomplete for every token:

```typescript
const brandTheme = createTheme(midnight, {
  categorical: ['#FF6B35', '#004E89', '#1A936F', '#F7C59F'],
  surface: { background: '#1A1A2E' },
  geometry: { borderRadius: 8 },
});
```

### CSS Variable Bridge

`injectCSSVariables(tokens)` maps tokens to `--vk-*` CSS custom properties on `:root` (or a scoped element). Enables Tailwind integration:

```css
.chart-card {
  background: var(--vk-surface-card);
  border: 1px solid var(--vk-surface-card-border);
  border-radius: var(--vk-border-radius);
}
```

Generated variable names: `--vk-categorical-0`, `--vk-semantic-positive`, `--vk-surface-background`, `--vk-font-family`, `--vk-motion-fast`, `--vk-border-radius`, `--vk-tooltip-blur`, `--vk-tooltip-shadow`.

---

## 8. Scale System — 15 D3 Scale Types

### `useScale()` Hook

Wraps every D3 scale constructor behind a single typed React hook. Consumers describe what they want; the hook handles construction and memoization.

```typescript
const { scale, ticks, domain, range, bandwidth, invert } = useScale({
  type: 'band',
  domain: ['Jan', 'Feb', 'Mar', 'Apr'],
  range: [0, 400],
  padding: 0.2,
});
```

### Supported Scale Types

| Type | Category | Domain | Range | Use Case |
|------|----------|--------|-------|----------|
| `linear` | Continuous | number[] | number[] | Most numeric axes |
| `log` | Continuous | number[] | number[] | Exponential data (user counts, prices) |
| `pow` | Continuous | number[] | number[] | Polynomial relationships |
| `sqrt` | Continuous | number[] | number[] | Square root (area-proportional sizing) |
| `symlog` | Continuous | number[] | number[] | Data crossing zero with log-like spread |
| `time` | Continuous | Date[] | number[] | Time-series x-axes |
| `utc` | Continuous | Date[] | number[] | UTC time-series (server timestamps) |
| `band` | Discrete | string[] | number[] | Bar chart categories |
| `point` | Discrete | string[] | number[] | Scatter categories (no bandwidth) |
| `ordinal` | Discrete | string[] | string[] | Color mapping (category → hex) |
| `sequential` | Color | [min, max] | interpolator | Heatmap value → color |
| `diverging` | Color | [min, mid, max] | interpolator | Diverging heatmaps (positive/negative) |
| `threshold` | Bucketed | number[] | string[] | Choropleth breakpoints |
| `quantize` | Bucketed | [min, max] | string[] | Equal-interval color classes |
| `quantile` | Bucketed | number[] | string[] | Equal-count color classes |

### `detectScaleType()` Utility

Inspects sample values to auto-detect the best scale type:

- `Date` instances → `'time'`
- ISO date strings (all parseable) → `'time'`
- Numbers → `'linear'`
- Strings → `'band'`
- Fallback → `'linear'`

### ScaleConfig Options

```typescript
interface ScaleConfig {
  type: ScaleType;
  domain?: unknown[];           // Auto-detected if omitted
  range?: unknown[];            // Defaults to pixel dimensions
  nice?: boolean | number;      // Round domain to friendly values
  clamp?: boolean;              // Clamp output to range
  zero?: boolean;               // Force domain to include 0
  padding?: number;             // Band/point padding (0–1)
  paddingInner?: number;        // Band inner padding
  paddingOuter?: number;        // Band outer padding
  round?: boolean;              // Round to integers (pixel-perfect)
  exponent?: number;            // For pow scale
  base?: number;                // For log scale
  reverse?: boolean;            // Flip range direction
}
```

---

## 9. Animation System

### @react-spring/web Integration

Every animated transition in VisKit uses `@react-spring/web`:

| Animation | Spring Preset | Trigger |
|-----------|-------------|---------|
| Initial chart render | `gentle` | Mount |
| Data update transitions | `gentle` | Data prop change |
| Hover state (dots, bars) | `responsive` | Mouse enter/leave |
| Tooltip appear/dismiss | `responsive` | Focus/hover |
| Series enter/exit | `gentle` + stagger | Data length change |
| Active series emphasis | `responsive` | Legend interaction |
| Brush drag | `responsive` | Pointer events |

### Spring Presets

```typescript
const springPresets = {
  responsive: { tension: 300, friction: 24 },  // Fast, snappy
  gentle:     { tension: 170, friction: 26 },  // Smooth, relaxed
  bouncy:     { tension: 200, friction: 12 },  // Playful overshoot
  immediate:  { duration: 0 },                 // Instant (no animation)
};
```

### `resolveSpringConfig(preset, { animate, reducedMotion })`

Central resolver that returns `immediate` when:
- `animate={false}` is set on the series/chart
- `useReducedMotion()` returns `true` (OS setting)

### `useReducedMotion()` Hook

Reads `prefers-reduced-motion: reduce` via `matchMedia`. Listens for changes (user can toggle in system settings mid-session). SSR-safe — returns `false` on the server.

### Path Morphing

Line and area transitions use normalized SVG command interpolation, not dump-and-recreate. When data changes:

1. Old path and new path are normalized to the same number of segments
2. Each segment's coordinates are interpolated via spring physics
3. The path smoothly morphs between shapes

This avoids the ugly "path disappears and reappears" effect of naive re-rendering.

---

## 10. Accessibility — WCAG AA Compliance

### SVG Structure

Every chart renders:

```html
<svg role="img" aria-label="Monthly Revenue" aria-describedby="desc-123">
  <title id="title-123">Monthly Revenue</title>
  <desc id="desc-123">Line chart showing revenue from January to June</desc>
  <g><!-- chart content --></g>
</svg>
```

### Hidden Data Table

A visually hidden `<table>` below the SVG contains all chart data in tabular form. Screen readers see this as the primary content. Styled with `clip: rect(0 0 0 0)` and `position: absolute`.

```html
<table aria-label="Monthly Revenue data">
  <thead><tr><th>Month</th><th>Revenue</th></tr></thead>
  <tbody>
    <tr><td>Jan</td><td>$42,000</td></tr>
    <tr><td>Feb</td><td>$51,000</td></tr>
    ...
  </tbody>
</table>
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus to the chart, then to individual data points |
| `→` / `←` | Navigate between data points within a series |
| `↑` / `↓` | Navigate between series (multi-series charts) |
| `Enter` | Trigger click handler on focused point |
| `Escape` | Dismiss tooltip, deselect point |
| `Home` / `End` | Jump to first/last data point |

### Data Point Focus

Each data point is focusable:

```html
<circle
  tabIndex={0}
  role="listitem"
  aria-label="January: $42,000"
  cx={50} cy={200} r={4}
/>
```

### Color Contrast

All categorical color palettes are tested against both light and dark backgrounds for WCAG AA compliance (minimum 4.5:1 contrast ratio). Adjacent categories in the palette are tested for mutual distinguishability.

---

## 11. Responsive Design

### `useResponsiveSize()` Hook

Core mechanism for zero-config responsive charts:

```typescript
const { width, height, containerRef } = useResponsiveSize({
  width?: number,        // Fixed width (skips observation)
  height?: number,       // Fixed height (skips observation)
  aspect?: number,       // Width:height ratio (default: 16/9)
  debounce?: number,     // ResizeObserver debounce in ms (default: 60)
  minHeight?: number,    // Floor for derived height (default: 100)
  maxHeight?: number,    // Ceiling for derived height (default: Infinity)
});
```

### Behavior Matrix

| Width | Height | Result |
|-------|--------|--------|
| Omitted | Omitted | Fills container width, height from aspect ratio |
| Omitted | Fixed | Fills container width, fixed height |
| Fixed | Omitted | Fixed width, height from aspect ratio |
| Fixed | Fixed | Fixed dimensions, no observation |

### Resize Strategy

```
Container resize detected → ResizeObserver callback
  → Debounce 60ms (batches rapid resize events)
    → Calculate new dimensions
      → Skip if dimensions unchanged (referential check)
        → Trigger re-render
          → Scales recompute (memoized on dimensions)
            → Series re-render with new positions
```

Data is **never** re-parsed or re-processed on resize. Only scales and pixel positions recompute.

---

## 12. Format System

### `useFormat()` Hook

Returns a memoized formatting function from a built-in shortcut or custom function:

```typescript
const fmt = useFormat('currency');      // $42,000.00
const fmt = useFormat('compact');       // 42K
const fmt = useFormat('percent');       // 42.0%
const fmt = useFormat((v) => `${v}ms`); // Custom function
```

### Built-in Formats

| Format | Output Example | Intl API Used |
|--------|---------------|---------------|
| `'number'` | `42,000` | `Intl.NumberFormat` |
| `'integer'` | `42,000` | `Intl.NumberFormat` (maxFractionDigits: 0) |
| `'currency'` | `$42,000.00` | `Intl.NumberFormat` (style: 'currency') |
| `'percent'` | `42.0%` | `Intl.NumberFormat` (style: 'percent') |
| `'compact'` | `42K` | `Intl.NumberFormat` (notation: 'compact') |
| `'date'` | `Apr 14, 2026` | `Intl.DateTimeFormat` (dateStyle: 'medium') |
| `'date:short'` | `4/14/26` | `Intl.DateTimeFormat` (dateStyle: 'short') |
| `'time'` | `2:30 PM` | `Intl.DateTimeFormat` (timeStyle: 'short') |
| `'datetime'` | `Apr 14, 2026, 2:30 PM` | `Intl.DateTimeFormat` (both) |
| `'duration'` | `1h 23m 45s` | Custom parser |

All formats respect the `locale` parameter (default: `'en-US'`).

---

## 13. Event System & Interactions

### Unified Event Handlers

Every chart supports a consistent set of event handlers via `ChartEventHandlers<TDatum>`:

```typescript
<Chart
  data={salesData}
  onDatumClick={(datum, series, event) => { ... }}
  onDatumHover={(datum, series, event) => { ... }}
  onDatumFocus={(datum, series, event) => { ... }}
  onSeriesClick={(seriesKey) => { ... }}
  onSeriesToggle={(seriesKey, visible) => { ... }}
  onChartClick={(coords, event) => { ... }}
>
```

### Active State Management

`<Chart>` tracks which series keys are "active" (hovered or focused) via a `Set<string>` in context. Series read this to dim non-active siblings:

- Active series: full opacity
- Inactive series (when any is active): `dimmedOpacity` from theme (default: 0.2)
- No active series: all at full opacity

The Legend toggles series visibility via `onSeriesToggle`, which adds/removes keys from the active set.

### Cross-Chart Linking (Phase 4)

`<ChartGroup>` synchronizes interaction state across multiple `<Chart>` instances:

```tsx
<ChartGroup>
  <Chart data={revenueData}>
    <LineSeries field="revenue" />
  </Chart>
  <Chart data={costData}>
    <BarSeries field="cost" />
  </Chart>
</ChartGroup>
```

When the user hovers a datum in one chart:
- The crosshair position is broadcast to all children
- Tooltips in all charts snap to the corresponding datum
- Brush selections are synchronized

Implemented via a shared `ChartGroupContext` that merges cursor position and active state.

---

## 14. Consumer API — Developer Experience

### Minimal Example

```tsx
import { Chart, LineSeries } from '@viskit/react';

<Chart data={salesData} height={300}>
  <LineSeries field="revenue" />
</Chart>
```

This renders a responsive, accessible, animated line chart with auto-detected scales, auto-margins, default categorical colors, keyboard navigation, and screen reader support. No configuration required.

### Full-Featured Example

```tsx
import {
  Chart, LineSeries, BarSeries, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, midnight
} from '@viskit/react';

<ThemeProvider theme={midnight}>
  <Chart
    data={salesData}
    height={400}
    margin={{ left: 80 }}
    title="Revenue vs Cost"
    description="Monthly comparison of revenue and operating cost"
  >
    <CartesianGrid horizontal strokeDasharray="4 4" />
    <XAxis field="month" label="Month" />
    <YAxis format="currency" label="USD" />
    <BarSeries field="cost" color="#94A3B8" opacity={0.6} radius={4} />
    <LineSeries field="revenue" curve="monotoneX" dots strokeWidth={3} />
    <Tooltip placement="top" />
    <Legend position="bottom" />
  </Chart>
</ThemeProvider>
```

### Import Patterns

```typescript
// Option 1: Single package (recommended for most consumers)
import { Chart, LineSeries, midnight } from '@viskit/react';

// Option 2: Direct sub-packages (maximum tree-shaking)
import { Chart } from '@viskit/core';
import { LineSeries } from '@viskit/charts';
import { midnight } from '@viskit/themes';

// Option 3: Deep imports (smallest possible bundle)
import { Chart } from '@viskit/core/chart/chart';
import { LineSeries } from '@viskit/charts/cartesian/line-series';
```

### Ref API (`ChartHandle`)

```typescript
const chartRef = useRef<ChartHandle>(null);

<Chart ref={chartRef} data={data}>
  <LineSeries field="revenue" />
</Chart>

// Imperative access
const svg = chartRef.current?.getSvgElement();
await chartRef.current?.exportToPNG();  // Phase 4
await chartRef.current?.exportToSVG();  // Phase 4
```

---

## 15. Testing Strategy

### Test Pyramid

```
     ┌───────────────┐
     │ Visual (Chrom) │  Snapshot per chart × theme × viewport × state
     ├───────────────┤
     │ Component      │  Render, interact, assert DOM/SVG
     ├───────────────┤
     │ Unit           │  Pure functions, hooks, transforms
     └───────────────┘
```

### Unit Tests (Vitest)

| Subject | Examples |
|---------|----------|
| `useScale` | Each of 15 scale types produces correct domain/range/ticks |
| `detectScaleType` | Strings → band, numbers → linear, dates → time |
| `useFormat` | Currency formats \$42,000.00, duration formats 1h 23m |
| `createTheme` | Deep-merge preserves base, applies overrides |
| `resolveSpringConfig` | Returns immediate when animate=false or reducedMotion=true |
| `useAutoMargin` | Correct margins for axis combinations |
| Color utilities | WCAG contrast ratios pass AA for all categorical pairs |

### Component Tests (@testing-library/react)

| Subject | Assertions |
|---------|-----------|
| `<Chart>` | Renders SVG with role="img", title, desc |
| `<LineSeries>` | Renders one `<path>` element with correct `d` attribute |
| `<BarSeries>` | Renders N `<rect>` elements (one per datum) |
| `<PieSeries>` | Renders N `<path>` arcs matching pie data |
| Keyboard nav | Arrow keys move focus between data points |
| Tooltip | Appears on hover, positions correctly, dismisses on Escape |
| Legend | Clicking toggles series visibility |
| Accessibility | All ARIA attributes present and correctly linked |
| Data updates | Adding/removing data points re-renders correctly |
| Responsive | Changing container size triggers scale recalculation |

### Visual Regression (Chromatic)

Matrix of snapshots:

| Dimension | Values |
|-----------|--------|
| Chart type | Line, Bar, Area, Scatter, Pie, Donut, Heatmap, Radar, ... |
| Theme | Midnight, Daylight, Aurora, Corporate |
| State | Default, hover on datum, series dimmed, tooltip visible, empty data |
| Viewport | 375px (mobile), 768px (tablet), 1440px (desktop) |

### Test Conventions

- Test file lives next to source: `line-series.tsx` → `line-series.test.tsx`
- `describe('LineSeries')` blocks named after the component
- `it('renders one path element per series')` with behavior descriptions
- No snapshot tests for SVG paths (too brittle) — assert structure, not exact coordinates
- Mock `ResizeObserver` in component tests with fixed dimensions

---

## 16. Performance Requirements & Benchmarks

### Target Metrics

| Metric | Target | How Measured |
|--------|--------|-------------|
| Initial render (6 series, 100 points) | < 16ms (60fps) | React Profiler |
| Data update (100 points change) | < 16ms | React Profiler |
| Resize recomputation | < 8ms | Performance.now() in useScale |
| Bundle size (@viskit/react, all charts) | < 45 KB gzipped | bundlephobia |
| Bundle size (single chart import) | < 12 KB gzipped | bundlephobia |
| Time to Interactive (demo page) | < 1.5s | Lighthouse |
| 10k scatter points (Canvas) | 60fps pan/zoom | requestAnimationFrame counter |

### Memoization Strategy

```
Data layer:      useMemo on data reference (never cloned internally)
Scale layer:     useMemo on [data, dimensions] — recomputes on resize/data change
Position layer:  useMemo on [data, scales] — pixel positions for each datum
Render layer:    SVG elements with stable keys — React reconciles efficiently
Color layer:     useMemo on [colors] — Map<string, string> factory with closure
```

### Rules

1. **Never clone data**. The consumer's array reference is used as-is. If the reference is stable, nothing recomputes.
2. **Never re-parse on resize**. Resize triggers scale recomputation → re-render. The data→positions pipeline only runs when data actually changes.
3. **Stable deps in useMemo**. Arrays in dep lists are JSON.stringify'd for stability. Object configs are memoized upstream.
4. **Mark all packages `"sideEffects": false`** for aggressive tree-shaking.
5. **Externalize all peer deps**. React, react-dom, and all d3-* modules are `external` in tsup — never bundled into the library.

---

## 17. Build, Packaging & Distribution

### tsup Configuration

Every library package uses the same tsup config:

```typescript
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  target: 'es2022',
  treeshake: true,
  splitting: false,
});
```

Output per package:
- `dist/index.js` — ESM (tree-shakeable)
- `dist/index.cjs` — CJS (Node.js compat)
- `dist/index.d.ts` — TypeScript declarations
- `dist/index.d.cts` — CJS declarations
- `dist/index.js.map` — Source maps

### Package.json Exports Map

```json
{
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  },
  "sideEffects": false,
  "files": ["dist"]
}
```

`types` conditions come **first** in the exports map — this is critical for TypeScript resolution.

### Turborepo Pipeline

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev":   { "persistent": true, "cache": false },
    "test":  { "dependsOn": ["build"] },
    "lint":  { "dependsOn": ["^build"] }
  }
}
```

Build order: `tsconfig` → `eslint-config` → `core` → `themes` + `animations` (parallel) → `charts` → `react` → `demo`.

### TypeScript Configuration

Shared base config `tooling/tsconfig/library.json`:
- Target: `es2022` — modern browsers, no polyfills needed
- Module: `esnext` with `moduleResolution: "bundler"`
- Strict: `true` + `noUncheckedIndexedAccess` + `noUnusedLocals` + `noUnusedParameters`
- JSX: `react-jsx` (automatic runtime)
- `verbatimModuleSyntax: true` — enforces `import type` for type-only imports
- `ignoreDeprecations: "6.0"` — required for tsup DTS plugin compatibility with TS 6.0

Consumer packages (charts, react) add `paths` mappings for cross-package source resolution during development.

---

## Phase Delivery Schedule

### Phase 1 — Foundation (Week 1)

| Day | Deliverable | Status |
|-----|------------|--------|
| 1 | Monorepo scaffold: all packages, shared configs, build pipeline, demo app | ✅ Complete |
| 1 | @viskit/core: types, 3 contexts, useScale (15 types), useResponsiveSize, useAutoMargin, useFormat, `<Chart>` with auto-scale detection | ✅ Complete |
| 1 | @viskit/themes: token interface, midnight theme, daylight theme, createTheme, CSS bridge | ✅ Complete |
| 1 | @viskit/animations: useReducedMotion, spring presets, resolveSpringConfig | ✅ Complete |
| 1 | @viskit/charts: LineSeries, BarSeries, AreaSeries, ScatterSeries, PieSeries | ✅ Complete |
| 1 | @viskit/react: consumer barrel | ✅ Complete |
| 1 | Demo app: all 6 chart types rendering | ✅ Complete |
| 2 | `<XAxis>`, `<YAxis>` — tick generation, label positioning, format integration | |
| 3 | `<CartesianGrid>` — horizontal/vertical lines from scale ticks | |
| 3 | `<Legend>` — clickable series list with toggle visibility | |
| 4 | `<Tooltip>` — @floating-ui positioning, `<TooltipContent>` default body | |
| 5 | Accessibility: hidden data table, keyboard navigation, focus management | |
| 6–7 | Unit tests + component tests for all Phase 1 deliverables | |

### Phase 2 — Advanced Cartesian & Radial (Week 2) — 14 chart types

| Day | Deliverable |
|-----|------------|
| 1 | `<StackedBarSeries>`, `<GroupedBarSeries>` — d3-stack, group layout |
| 2 | `<HorizontalBarSeries>` — flipped CartesianContext, `<MultiLineSeries>` |
| 2 | `<StackedAreaSeries>` — d3-stack baseline offset |
| 3 | `<BubbleSeries>` — variable-size scatter, `<LollipopSeries>` — stem + dot |
| 3 | `<DumbbellSeries>` — range comparison, `<HistogramSeries>` — d3-bin |
| 4 | `<RadarSeries>` — polar polygon, `<RadialBarSeries>` — circular bars |
| 4 | `<PolarAreaSeries>` — Nightingale/coxcomb rose chart |
| 5 | `<Heatmap>` — sequential color scale matrix, `<Sparkline>` — inline mini |
| 5 | Aurora theme, Corporate theme |
| 6 | `<CanvasRenderer>` — Canvas2D backend for high-density scatter/heatmap |
| 6 | `<ThemeProvider>` — nested theme contexts with `useTheme()` hook |
| 7 | Tests, Chromatic visual regression baseline setup |

### Phase 3 — Specialized & Statistical (Week 3) — 16 chart types

| Day | Deliverable |
|-----|------------|
| 1 | `<TreemapSeries>` — d3-hierarchy squarified layout, `<SunburstSeries>` — radial partition |
| 1 | `<CirclePackingSeries>` — nested circles, `<IcicleSeries>` — horizontal partition |
| 2 | `<SankeyDiagram>` — d3-sankey node positioning + flow links |
| 2 | `<ChordDiagram>` — d3-chord relationship matrix |
| 3 | `<ForceGraph>` — d3-force simulation, interactive dragging, Canvas rendering |
| 4 | `<CandlestickSeries>` — OHLC bodies + wicks, `<WaterfallSeries>` — running totals |
| 4 | `<BoxPlotSeries>` — quartile box + whiskers, `<ViolinSeries>` — kernel density |
| 5 | `<BulletSeries>` — qualitative range (Stephen Few), `<SlopeSeries>` — before/after |
| 5 | `<StreamGraphSeries>` — d3-shape wiggle offset stacked area |
| 6 | `<FunnelSeries>` — trapezoid segments, `<GaugeSeries>` — semi-circle with needle |
| 7 | Tests + component documentation for all specialized charts |

### Phase 4 — Exotic Charts, Composition & Polish (Week 4) — 7 chart types + utilities

| Day | Deliverable |
|-----|------------|
| 1 | `<ParallelCoordinatesSeries>` — multi-axis comparison with brushable axes |
| 1 | `<CalendarHeatmap>` — GitHub-style day grid over months |
| 2 | `<RidgeLineSeries>` — overlapping density plots (joy plot) |
| 2 | `<MarimekksSeries>` — variable-width stacked bars (mosaic chart) |
| 3 | `<WordCloud>` — d3-cloud weighted text layout, `<DensityContour>` — 2D KDE |
| 3 | `<GanttSeries>` — timeline/schedule horizontal bars |
| 4 | `<ChartGroup>` — synchronized crosshairs, tooltips, and active state |
| 4 | `<Brush>` — draggable selection, zoom integration, mini-map |
| 5 | `<ReferenceLine>`, `<ReferenceBand>`, `<Annotations>` |
| 5 | `<CrosshairOverlay>`, `exportToPNG()`, `exportToSVG()` |
| 6 | `useStreamingData()` hook — real-time append with ring buffer, smooth transitions |
| 7 | Integration tests, performance profiling, benchmark suite |

### Weeks 5–6 — Hardening Sprint

| Area | Tasks |
|------|-------|
| Cross-browser | Chrome, Firefox, Safari, Edge — test all chart types |
| Bundle audit | Per-package size analysis, dead code elimination, import cost badges |
| SSR compatibility | Verify all hooks are SSR-safe (no `window` on mount) |
| Documentation site | Next.js app with live examples, API reference, theme playground |
| npm publishing | Automated publish pipeline, semantic versioning, changesets |
| Community files | README (with badges), CHANGELOG, CONTRIBUTING, CODE_OF_CONDUCT, LICENSE |
| Final snapshots | Complete Chromatic baseline: every chart × theme × viewport × state |
| Performance | Lighthouse audit, React Profiler analysis, 10k-point Canvas benchmark |

---

## Current Status

### Completed ✅

- [x] Monorepo structure — pnpm workspaces + Turborepo pipeline
- [x] Shared tooling — TypeScript configs, ESLint flat config
- [x] **@viskit/core** — types.ts (25+ exported types), 3 context providers, useScale (15 scale types + detectScaleType), useResponsiveSize (ResizeObserver + debounce), useAutoMargin (content-aware margins), useFormat (10 built-in formats via Intl), `<Chart>` (responsive container, auto-scale detection, auto-CartesianProvider, ARIA attributes, forwardRef)
- [x] **@viskit/themes** — VisualizationTokens interface (60+ tokens), ColorScale type, midnight dark theme, daylight light theme, createTheme deep-merge, injectCSSVariables CSS bridge
- [x] **@viskit/animations** — useReducedMotion hook, 4 spring presets, resolveSpringConfig
- [x] **@viskit/charts** — LineSeries (7 curve types, dots, dash, connectNulls), BarSeries (rounded corners), AreaSeries (gradient fills), ScatterSeries (sized circles), PieSeries (donut, padAngle, cornerRadius)
- [x] **@viskit/react** — Consumer barrel re-exporting all packages
- [x] **Demo app** — Vite app showing Line, Bar, Area, Scatter, Pie, Donut
- [x] **Build pipeline** — All 6 packages building clean (ESM + CJS + DTS)

### In Progress 🔄

- [ ] Phase 1 Day 2: XAxis, YAxis primitives
- [ ] Phase 1 Day 3: CartesianGrid, Legend
- [ ] Phase 1 Day 4: Tooltip
- [ ] Phase 1 Day 5: Accessibility baseline
- [ ] Phase 1 Days 6–7: Tests

---

## Appendix A — Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| Components | PascalCase, self-descriptive | `LineSeries`, `CartesianGrid`, `TooltipContent` |
| Hooks | `use` + clear purpose | `useScale`, `useAutoMargin`, `useReducedMotion` |
| Functions | Verb-first | `computeLinePath`, `formatCurrency`, `resolveThemeTokens` |
| Variables | Descriptive nouns | `tickPositions`, `activeSeriesKey`, `resolvedMargin` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_ASPECT_RATIO`, `MIN_TOOLTIP_WIDTH` |
| Types | PascalCase, no `I` prefix | `ScaleConfig`, `ChartContextValue`, `TooltipPayload` |
| Props | `ComponentNameProps` | `LineSeriesProps`, `XAxisProps`, `TooltipProps` |
| Files | kebab-case | `line-series.tsx`, `use-scale.ts`, `cartesian-context.ts` |
| Test files | Colocated | `line-series.tsx` → `line-series.test.tsx` |

## Appendix B — Key Dependencies

| Package | Version | Purpose | Bundle Impact |
|---------|---------|---------|--------------|
| react | ^19.2.4 | UI framework | Peer dep (external) |
| react-dom | ^19.2.4 | DOM rendering | Peer dep (external) |
| typescript | ~6.0.2 | Type system | Dev only |
| d3-scale | ^4.0.2 | 15 scale constructors | ~5 KB gzipped |
| d3-shape | ^3.2.0 | Line/area/arc/pie generators | ~4 KB gzipped |
| d3-array | ^3.2.4 | max, extent, bisect, ticks | ~3 KB gzipped |
| d3-hierarchy | ^3.1.2 | Treemap, partition layouts | ~3 KB (Phase 3) |
| d3-force | ^3.0.0 | Force simulation | ~4 KB (Phase 3) |
| d3-sankey | ^0.12.3 | Sankey layout | ~2 KB (Phase 3) |
| @react-spring/web | ^9.7.5 | Physics-based animations | ~12 KB gzipped |
| @floating-ui/react | ^0.27.0 | Tooltip/popover positioning | ~8 KB gzipped |
| tsup | ^8.4.0 | ESM/CJS/DTS bundler | Dev only |
| vitest | ^3.2.1 | Test runner | Dev only |
| @testing-library/react | ^16.x | Component testing | Dev only |
| turborepo | ^2.9.6 | Monorepo orchestration | Dev only |
| pnpm | ^10.11.0 | Package manager | Dev only |

## Appendix C — Exports Map Convention

Every `@viskit/*` package uses the same `exports` structure with **types-first** conditions for correct TypeScript resolution:

```json
{
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  },
  "sideEffects": false,
  "files": ["dist"]
}
```
