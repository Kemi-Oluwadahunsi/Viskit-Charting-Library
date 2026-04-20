# VisKit — Copilot Instructions

You are working on **VisKit**, a modern React data visualization library. Read `PLAN.md` at the project root for full architecture, component inventory, and delivery phases.

---

## Project Overview

- **What:** A composable, tree-shakeable, TypeScript-first React chart library
- **Stack:** React 19, TypeScript (strict), Vite, D3 (scales/shapes/layouts), @react-spring/web, @floating-ui/react
- **Rendering:** SVG-first (Canvas for high-density charts)
- **No backend.** This is a client-side npm library. "API" means the exported TypeScript surface, not HTTP endpoints

---

## Code Style

### Naming

- **Components:** PascalCase, self-descriptive. `LineSeries`, `CartesianGrid`, `TooltipContent` — not `Line`, `Grid`, `Content`
- **Hooks:** `use` prefix + clear purpose. `useScale`, `useAutoMargin`, `useReducedMotion` — not `useData`, `useStuff`
- **Functions:** Verb-first, says what it does. `computeLinePath`, `formatCurrency`, `resolveThemeTokens` — not `process`, `handle`, `doStuff`
- **Variables:** Descriptive nouns. `tickPositions`, `activeSeriesKey`, `resolvedMargin` — not `arr`, `val`, `tmp`
- **Constants:** UPPER_SNAKE_CASE only for true global constants. `DEFAULT_ASPECT_RATIO`, `MIN_TOOLTIP_WIDTH`
- **Types/Interfaces:** PascalCase, no `I` prefix. `ScaleConfig`, `ChartContextValue`, `TooltipPayload` — not `IScaleConfig`
- **Props interfaces:** `ComponentNameProps`. `LineSeriesProps`, `XAxisProps`, `TooltipProps`
- **Files:** kebab-case. `line-series.tsx`, `use-scale.ts`, `cartesian-context.ts`

### Structure

- Keep files short. One component per file. One hook per file
- Colocate tests: `line-series.tsx` → `line-series.test.tsx` in the same directory
- Colocate types with their module. Don't create a central `types.ts` dumping ground — only shared cross-package types go in `@viskit/core/types`
- Group by feature, not by type. Put the hook, component, types, and tests for a feature together — not in separate `hooks/`, `components/`, `types/` folders

### Simplicity

- Write the straightforward solution first. Don't abstract until a pattern repeats three times
- No wrapper functions that just forward arguments. If a function does one thing and is called once, inline it
- No `utils.ts` junk drawers. If a helper exists, it belongs in a named module (`format.ts`, `color.ts`, `math.ts`)
- Avoid deep nesting. Extract early returns. Maximum 3 levels of indentation in any function
- Prefer `const` arrow functions for components and hooks. Use `function` declarations only for module-level exports that benefit from hoisting
- No barrel re-exports within a package except the root `index.ts`. Deep imports are fine: `import { useScale } from './scales/use-scale'`

---

## TypeScript

- Strict mode always. No `any` in the codebase — use `unknown` + type narrowing when the type is genuinely uncertain
- Generic components use the data shape: `<LineSeries<TDatum>>`. Field props must be `keyof TDatum`
- Prefer `interface` for object shapes, `type` for unions and computed types
- Export types alongside their runtime code. Don't put types in separate files unless they are shared across packages
- Use `satisfies` for theme objects and config literals to preserve literal types

---

## Component Patterns

### Every chart series component follows this shape:

```tsx
interface LineSeriesProps<TDatum extends Record<string, unknown>> {
  field: keyof TDatum;
  // ... series-specific props
}

function LineSeries<TDatum extends Record<string, unknown>>(
  props: LineSeriesProps<TDatum>
) {
  const { data, scales, colorScale } = useChartContext<TDatum>();
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  // ... render SVG elements
}
```

### Context usage:

- `useChartContext()` — data, dimensions, event bus
- `useCartesianContext()` — scales, coordinate transforms (only inside Cartesian charts)
- `usePolarContext()` — angle/radius scales (only inside Polar charts)
- `useTheme()` — resolved visualization tokens
- Never pass data as props to series. Data flows through the `<Chart>` context

### Render props:

- Every visual element exposes `renderDatum` for full custom rendering
- The default render is always a plain SVG element — no wrapping divs, no extra layers
- Render props receive typed props including position, datum, and interaction state

---

## Animation

- Use `@react-spring/web` — not Framer Motion, not CSS keyframes
- Every animation must respect `useReducedMotion()`. When true, duration = 0
- Default animations are on. Consumer disables with `animate={false}`
- Path morphing uses normalized SVG command interpolation — never dump/recreate paths

---

## Accessibility

- Every chart SVG has `role="img"`, `<title>`, and `<desc>`
- Render a visually hidden `<table>` with all data for screen readers
- Data points are focusable with `tabIndex={0}` and `aria-label`
- Arrow keys navigate between data points. Enter triggers click. Escape dismisses tooltip
- All categorical color palettes must pass WCAG AA contrast (4.5:1)

---

## Testing

- **Unit tests** (Vitest): Scales, pipeline, transforms, format functions, color utils
- **Component tests** (@testing-library/react): Renders correct SVG, responds to data changes, keyboard works, ARIA present
- **Visual regression** (Chromatic): Snapshot per chart × theme × state
- Test file lives next to source: `use-scale.ts` → `use-scale.test.ts`
- Use `describe` blocks named after the function/component. Use `it` with behavior descriptions: `it('renders one rect per datum')`

---

## Performance

- Memoize scale computation and data transforms with `useMemo` and stable deps
- Never re-parse raw data on resize — only re-run scale → render
- Mark all packages `"sideEffects": false`
- Peer deps (`react`, `react-dom`, `d3-*`) are always `external` — never bundled

---

## Things to Avoid

- Don't add comments that restate the code. Comment only *why*, never *what*
- Don't create abstractions for one-time use. No `createChartFactory`, no `withChartHOC`
- Don't add error handling for impossible states inside the library. Validate at the boundary (`<Chart>` props) only
- Don't use `index.ts` files in subdirectories just to re-export — import directly from the source file
- Don't use `default` exports. Always named exports
- Don't use `enum`. Use `const` objects or union string types
- Don't use `class` components. Only function components and hooks
- Don't introduce new dependencies without checking if D3 or existing deps already cover it
- Don't hardcode colors, sizes, or spacing. Everything comes from theme tokens
