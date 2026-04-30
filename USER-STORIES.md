# VisKit — User Stories

> Publishable user stories for every chart component delivered in the library.
> Each story follows the **Connextra format**: _As a [persona], I want [action], so that [outcome]._
> Acceptance criteria define the "done" bar for each story.

---

## Epic: Core Infrastructure

### US-001 — Responsive Chart Container

**As a** frontend developer,
**I want** charts that automatically fill their parent container and respond to window resizes,
**so that** I don't need to hard-code pixel dimensions or write custom resize handlers.

**Acceptance Criteria:**
- [ ] Chart fills 100% of its container width by default (no explicit `width` prop required)
- [ ] Height derives from a configurable aspect ratio (default 16:9) when not explicitly set
- [ ] Resize events are debounced (≤60ms) to prevent layout thrashing
- [ ] Min/max height constraints are respected when provided
- [ ] Fixed width/height overrides bypass the responsive system entirely
- [ ] No content reflow or flash during initial measurement

**Component:** `<Chart>`
**Priority:** P0 — Must Have
**Phase:** 1

---

### US-002 — Automatic Scale Detection

**As a** developer integrating VisKit for the first time,
**I want** charts to automatically detect appropriate x/y scales from my data shape,
**so that** I can render a working chart with minimal configuration.

**Acceptance Criteria:**
- [ ] String-valued fields are detected as categorical → band scale with 0.2 padding
- [ ] Numeric fields are detected → linear scale with 10% headroom and `.nice()` rounding
- [ ] Date/ISO-date fields are detected → time scale
- [ ] Y-axis domain spans all numeric fields in the dataset (multi-series safe)
- [ ] Auto-detection can be overridden with explicit `<XAxis>` / `<YAxis>` config
- [ ] Empty datasets render an empty chart without throwing errors

**Component:** `<Chart>` (auto-scale internals)
**Priority:** P0 — Must Have
**Phase:** 1

---

### US-003 — Auto-Margin Calculation

**As a** developer,
**I want** chart margins to automatically adjust based on axis labels, title, and legend placement,
**so that** chart content is never clipped or overlapping.

**Acceptance Criteria:**
- [ ] Margins reserve space for tick labels (40px default per axis)
- [ ] Additional space is reserved when axis label text is present (+24px)
- [ ] Chart title adds head-room at the top (+28px)
- [ ] Legend position (top/bottom/left/right) reserves corresponding space (+32px)
- [ ] Individual margin sides can be explicitly overridden while others remain auto-calculated
- [ ] Default base padding of 8px on all sides when no axes are present

**Component:** `useAutoMargin` hook
**Priority:** P1 — Should Have  
**Phase:** 1

---

### US-004 — Value Formatting

**As a** developer displaying financial or statistical data,
**I want** built-in locale-aware format shortcuts for numbers, currencies, percentages, dates, and durations,
**so that** axis labels and tooltips display human-readable values without custom formatters.

**Acceptance Criteria:**
- [ ] `'currency'` format renders `$42,000.00` (respects locale)
- [ ] `'compact'` format renders `42K`, `1.2M`, etc.
- [ ] `'percent'` format renders `42.0%`
- [ ] `'date'` format renders `Apr 14, 2026` (medium style)
- [ ] `'duration'` format renders `1h 23m 45s`
- [ ] Custom format functions `(value) => string` are supported alongside built-in shortcuts
- [ ] Locale parameter defaults to `'en-US'` but can be overridden

**Component:** `useFormat` hook
**Priority:** P1 — Should Have
**Phase:** 1

---

### US-005 — ARIA-First Accessibility

**As a** user who navigates with a screen reader or keyboard,
**I want** every chart to have semantic ARIA roles, a hidden data table, and keyboard navigation,
**so that** I can understand and interact with chart data without relying on visual rendering.

**Acceptance Criteria:**
- [ ] Every chart SVG has `role="img"`, a `<title>`, and a `<desc>` element
- [ ] Each data series renders as `role="list"` with individual points as `role="listitem"`
- [ ] Every data point has an `aria-label` describing its value (e.g., "January: $42,000")
- [ ] Data points are focusable via `tabIndex={0}`
- [ ] A visually hidden `<table>` mirrors all chart data for screen reader consumption
- [ ] Arrow keys navigate between data points within a series
- [ ] `Enter` triggers the click handler on a focused point; `Escape` dismisses tooltips
- [ ] All categorical color palettes pass WCAG AA contrast ratio (4.5:1) on their theme background

**Component:** All components (cross-cutting)
**Priority:** P0 — Must Have
**Phase:** 1

---

## Epic: Cartesian Chart Series

### US-010 — Line Chart

**As a** data analyst viewing trends over time,
**I want** a smooth, configurable line chart with optional data point markers,
**so that** I can visualize continuous data trends and identify individual values.

**Acceptance Criteria:**
- [ ] Renders a single `<path>` element per series using d3-shape's line generator
- [ ] Supports 7 curve interpolation types: `linear`, `monotone`, `step`, `basis`, `cardinal`, `catmull-rom`, `natural`
- [ ] `dots={true}` renders circle markers at each data point with focus ring on keyboard navigation
- [ ] Dot markers show a white stroke border for visibility against the line
- [ ] Stroke width, dash pattern (`strokeDasharray`), and opacity are configurable
- [ ] `connectNulls={true}` bridges gaps where data points are `null` or `undefined`
- [ ] Series color defaults to the next categorical color from the palette; `color` prop overrides
- [ ] Line renders with `strokeLinecap="round"` and `strokeLinejoin="round"` for polished appearance
- [ ] Handles 1,000+ data points without visible jank (memoized path computation)

**Component:** `<LineSeries>`
**Priority:** P0 — Must Have
**Phase:** 1

---

### US-011 — Bar Chart

**As a** business user comparing categorical data,
**I want** a vertical bar chart with rounded corners and automatic spacing,
**so that** I can compare discrete values across categories at a glance.

**Acceptance Criteria:**
- [ ] Renders one `<rect>` per datum positioned via the x-axis band scale
- [ ] Bars grow upward from a y=0 baseline
- [ ] `radius` prop controls top corner rounding (default: 4px)
- [ ] Bar width matches the band scale's computed bandwidth
- [ ] Series color defaults to categorical palette; overridable via `color` prop
- [ ] Each bar has `role="listitem"` and `aria-label` with its value
- [ ] Each bar is focusable via `tabIndex={0}`
- [ ] Bars handle negative values (extending downward from baseline)
- [ ] Zero-height bars render as a thin line rather than being invisible

**Component:** `<BarSeries>`
**Priority:** P0 — Must Have
**Phase:** 1

---

### US-012 — Area Chart

**As a** product manager visualizing volume or magnitude,
**I want** a filled area chart with gradient support and configurable curve interpolation,
**so that** I can show the magnitude of a metric over time with visual depth.

**Acceptance Criteria:**
- [ ] Renders a filled `<path>` from the data line down to the y=0 baseline
- [ ] `gradient={true}` renders a vertical `<linearGradient>` fading from 40% opacity → 0% opacity
- [ ] Gradient uses a unique `id` per series (safe for multiple area series on one chart)
- [ ] Supports all 7 curve interpolation types (same as LineSeries)
- [ ] Null/undefined data points are excluded via `.defined()` filtering
- [ ] Stroke width for the top edge line is configurable (default: 2px)
- [ ] Default fill opacity is 0.3 (without gradient), fully configurable
- [ ] Area path computation is memoized and only recalculates when data or scales change

**Component:** `<AreaSeries>`
**Priority:** P0 — Must Have
**Phase:** 1

---

### US-013 — Scatter Plot

**As a** data scientist exploring correlations,
**I want** a scatter plot that renders individual data points as positioned circles,
**so that** I can visualize distributions and identify clusters or outliers.

**Acceptance Criteria:**
- [ ] Renders one `<circle>` per datum positioned at its x/y coordinates
- [ ] `radius` prop controls circle size (default: 4px)
- [ ] Points are positioned at the midpoint of the band scale's bandwidth (aligned with categories)
- [ ] Each point has `role="listitem"`, `aria-label`, and `tabIndex={0}`
- [ ] Opacity and color are independently configurable per series
- [ ] `NaN` or invalid positions are filtered out (no off-screen renders)
- [ ] Future: `shape` prop supports `'circle'`, `'square'`, `'diamond'` (currently circles only)

**Component:** `<ScatterSeries>`
**Priority:** P1 — Should Have
**Phase:** 1

---

## Epic: Radial Chart Series

### US-020 — Pie / Donut Chart

**As a** user presenting proportional data,
**I want** a pie chart that can also render as a donut with segment labels,
**so that** I can visualize part-to-whole relationships with clear segment identification.

**Acceptance Criteria:**
- [ ] Renders arc `<path>` elements via d3-shape's pie layout + arc generator
- [ ] `innerRadius={0}` (default) renders a full pie; values 0–1 render a donut
- [ ] `outerRadius` ratio (default: 0.8) controls how much of the available space the chart fills
- [ ] `padAngle` adds gap between segments (default: 0.02 radians)
- [ ] `cornerRadius` rounds the corners of each arc segment (default: 2px)
- [ ] `nameField` maps each datum to a display label used in ARIA and legends
- [ ] Each segment gets a unique color from the categorical palette based on its label
- [ ] Segments preserve data order (no automatic sorting by value)
- [ ] Center of the pie is positioned at the midpoint of the plot area
- [ ] Each arc has `role="listitem"`, `aria-label` with name and value, `tabIndex={0}`

**Component:** `<PieSeries>`
**Priority:** P0 — Must Have
**Phase:** 1

---

## Epic: Theming

### US-030 — Design Token System

**As a** design system owner integrating VisKit into a branded product,
**I want** every visual property (color, font, spacing, animation, geometry) controlled through a token system,
**so that** I can match charts to our brand design language without forking the library.

**Acceptance Criteria:**
- [ ] Token interface covers: categorical colors, sequential ramps, semantic colors, surface colors, typography (5 text styles), spacing, motion (durations + springs), geometry, and effects
- [ ] All tokens are fully typed via the `VisualizationTokens` TypeScript interface
- [ ] No chart component references a hardcoded color, spacing, or font size — all flow from tokens
- [ ] Token values are validated via TypeScript `satisfies` (preserves literal types)

**Component:** `VisualizationTokens` interface
**Priority:** P0 — Must Have
**Phase:** 1

---

### US-031 — Pre-built Theme Presets

**As a** developer who wants polished visuals without custom design work,
**I want** ready-to-use theme presets that look professional on dark and light backgrounds,
**so that** I can ship beautiful charts immediately and customize later if needed.

**Acceptance Criteria:**
- [ ] **Midnight** dark theme: charcoal background (#0F172A), vibrant pastel accents, glassmorphism tooltip effects
- [ ] **Daylight** light theme: white background, deeper saturated accents, soft shadow tooltips
- [ ] Both themes include all token categories (categorical 8-color palette, 3 sequential ramps, 5 semantic colors, 8 surface tokens, full typography, motion, geometry, effects)
- [ ] Both themes' categorical palettes pass WCAG AA contrast (4.5:1) against their background
- [ ] Themes are exported as named constants: `midnight`, `daylight`
- [ ] Future: **Aurora** (vibrant dark) and **Corporate** (neutral light) presets (Phase 2)

**Component:** `midnight`, `daylight` theme presets
**Priority:** P0 — Must Have
**Phase:** 1

---

### US-032 — Custom Theme Creation

**As a** developer with specific brand guidelines,
**I want** to create a custom theme by overriding select tokens on a base preset,
**so that** I only specify what differs from the preset without redefining all 60+ tokens.

**Acceptance Criteria:**
- [ ] `createTheme(base, overrides)` deep-merges partial overrides onto a full theme
- [ ] Array tokens (like `categorical`) are replaced entirely, not merged element-by-element
- [ ] Object tokens (like `surface`, `typography`) are shallow-merged one level deep
- [ ] Return type is always `VisualizationTokens` (complete, validated)
- [ ] `undefined` override values are skipped (base values preserved)

**Component:** `createTheme()` utility
**Priority:** P1 — Should Have
**Phase:** 1

---

### US-033 — CSS Variable Bridge

**As a** developer using Tailwind CSS or a CSS-based design system alongside VisKit,
**I want** chart tokens injected as CSS custom properties,
**so that** I can reference chart colors and spacing in my CSS/Tailwind classes.

**Acceptance Criteria:**
- [ ] `injectCSSVariables(tokens)` sets `--vk-*` properties on `:root` (or a scoped element)
- [ ] Categorical colors: `--vk-categorical-0` through `--vk-categorical-7`
- [ ] Semantic colors: `--vk-semantic-positive`, `--vk-semantic-negative`, etc.
- [ ] Surface colors: `--vk-surface-background`, `--vk-surface-card`, `--vk-surface-card-border`, etc.
- [ ] Typography: `--vk-font-family`, `--vk-font-family-mono`
- [ ] Motion: `--vk-motion-fast`, `--vk-motion-base`, `--vk-motion-slow`
- [ ] Geometry: `--vk-border-radius`, `--vk-stroke-width`, `--vk-dot-radius`
- [ ] Effects: `--vk-tooltip-blur`, `--vk-tooltip-shadow`
- [ ] Optional `root` parameter targets a specific DOM element instead of `document.documentElement`

**Component:** `injectCSSVariables()` utility
**Priority:** P2 — Nice to Have
**Phase:** 1

---

## Epic: Animation

### US-040 — Reduced Motion Respect

**As a** user with a vestibular disorder or motion sensitivity,
**I want** all chart animations to immediately resolve when my OS has `prefers-reduced-motion` enabled,
**so that** I can use the charts comfortably without disabling animations per-chart.

**Acceptance Criteria:**
- [ ] `useReducedMotion()` hook reads the OS `prefers-reduced-motion: reduce` media query
- [ ] Hook listens for runtime changes (user toggles setting mid-session)
- [ ] When reduced motion is active, `resolveSpringConfig()` returns `{ duration: 0 }` (instant)
- [ ] SSR-safe: returns `false` when `window` is undefined
- [ ] Every animated component consults this hook — it's automatic, not opt-in

**Component:** `useReducedMotion` hook + `resolveSpringConfig`
**Priority:** P0 — Must Have
**Phase:** 1

---

### US-041 — Spring Animation Presets

**As a** developer tuning chart transitions,
**I want** pre-tuned spring physics presets for common animation scenarios,
**so that** animations feel natural without me understanding spring tension/friction math.

**Acceptance Criteria:**
- [ ] **Responsive** preset (tension: 300, friction: 24): tooltips, hover states, fast transitions
- [ ] **Gentle** preset (tension: 170, friction: 26): chart enter, data updates, section transitions
- [ ] **Bouncy** preset (tension: 200, friction: 12): attention-drawing, onboarding, celebrations
- [ ] **Immediate** preset (duration: 0): disabled animation, reduced motion, server render
- [ ] `resolveSpringConfig(preset, { animate, reducedMotion })` resolves to `immediate` when animation is disabled
- [ ] All presets are `@react-spring/web` `SpringConfig` compatible

**Component:** `springPresets`, `resolveSpringConfig()`
**Priority:** P1 — Should Have
**Phase:** 1

---

## Epic: Scale System

### US-050 — Universal Scale Hook

**As a** component author building custom chart elements,
**I want** a single React hook that wraps all 15 D3 scale types behind a unified interface,
**so that** I never need to import D3 directly or understand which scale constructor to call.

**Acceptance Criteria:**
- [ ] `useScale(config)` supports all 15 scale types: linear, log, pow, sqrt, symlog, time, utc, band, point, ordinal, sequential, diverging, threshold, quantize, quantile
- [ ] Returns a `ScaleResult` with: `scale()` function, `ticks()`, `domain`, `range`, optional `bandwidth`, optional `invert`
- [ ] Scale is memoized — only reconstructs when config properties change
- [ ] Band/point scales support `padding`, `paddingInner`, `paddingOuter`, `round`
- [ ] Continuous scales support `nice`, `clamp`, `reverse`
- [ ] Log scale supports custom `base`; pow scale supports custom `exponent`
- [ ] `detectScaleType(sampleValues)` auto-detects band, linear, or time from field values

**Component:** `useScale` hook, `detectScaleType` utility
**Priority:** P0 — Must Have
**Phase:** 1

---

## Epic: Consumer Package

### US-060 — Single-Import Consumer Package

**As a** consumer installing VisKit,
**I want** a single `viskit-react` package that re-exports every component, hook, theme, and type,
**so that** I have one install command and one import source for everything.

**Acceptance Criteria:**
- [ ] `npm install viskit-react` installs the library with all chart types
- [ ] `import { Chart, LineSeries, BarSeries, midnight } from 'viskit-react'` works
- [ ] Full TypeScript autocomplete and type checking for all re-exported items
- [ ] Tree-shaking is preserved — unused chart types are not bundled
- [ ] Direct sub-package imports (`import { Chart } from '@kodemaven/viskit-core'`) remain available as an advanced option
- [ ] All type exports are re-exported via `export type` for `verbatimModuleSyntax` compatibility

**Component:** `viskit-react` package
**Priority:** P0 — Must Have
**Phase:** 1

---

## Story Map — Delivery Phases

### Phase 1 — Foundation (Week 1)
| ID | Story | Priority |
|----|-------|----------|
| US-001 | Responsive Chart Container | P0 |
| US-002 | Automatic Scale Detection | P0 |
| US-003 | Auto-Margin Calculation | P1 |
| US-004 | Value Formatting | P1 |
| US-005 | ARIA-First Accessibility | P0 |
| US-010 | Line Chart | P0 |
| US-011 | Bar Chart | P0 |
| US-012 | Area Chart | P0 |
| US-013 | Scatter Plot | P1 |
| US-020 | Pie / Donut Chart | P0 |
| US-030 | Design Token System | P0 |
| US-031 | Pre-built Theme Presets | P0 |
| US-032 | Custom Theme Creation | P1 |
| US-033 | CSS Variable Bridge | P2 |
| US-040 | Reduced Motion Respect | P0 |
| US-041 | Spring Animation Presets | P1 |
| US-050 | Universal Scale Hook | P0 |
| US-060 | Single-Import Consumer Package | P0 |

### Phase 2 — Advanced Charts (Week 2)
| ID | Story | Priority |
|----|-------|----------|
| US-070 | Stacked Bar Chart | P0 |
| US-071 | Grouped Bar Chart | P0 |
| US-072 | Horizontal Bar Chart | P1 |
| US-073 | Multi-Line Chart | P0 |
| US-074 | Radar / Spider Chart | P1 |
| US-075 | Radial Bar Chart | P2 |
| US-076 | Heatmap | P1 |
| US-077 | Sparkline | P2 |
| US-078 | Canvas Renderer for High-Density | P1 |
| US-079 | Nested Theme Providers | P0 |
| US-080 | Aurora Theme | P2 |
| US-081 | Corporate Theme | P2 |

### Phase 3 — Specialized Charts (Week 3)
| ID | Story | Priority |
|----|-------|----------|
| US-090 | Treemap | P1 |
| US-091 | Sankey Diagram | P1 |
| US-092 | Force-Directed Graph | P2 |
| US-093 | Candlestick (OHLC) Chart | P1 |
| US-094 | Waterfall Chart | P2 |
| US-095 | Funnel Chart | P2 |
| US-096 | Gauge Chart | P2 |

### Phase 4 — Composition & Polish (Week 4)
| ID | Story | Priority |
|----|-------|----------|
| US-100 | Synchronized Chart Group | P1 |
| US-101 | Brush & Zoom Selection | P1 |
| US-102 | Reference Lines & Bands | P1 |
| US-103 | Crosshair Overlay | P2 |
| US-104 | PNG / SVG Export | P2 |
| US-105 | Real-Time Streaming Data | P2 |
