# Contributing to VisKit

Thank you for your interest in contributing to VisKit! This guide will help you get started.

## Development Setup

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10.11.0

### Getting Started

```bash
# Clone the repository
git clone https://github.com/Kemi-Oluwadahunsi/Viskit-Charting-Library.git
cd Viskit-Charting-Library

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run the demo app
pnpm dev --filter @viskit/demo

# Run Storybook
pnpm dev --filter @viskit/storybook
```

## Project Structure

```
packages/
  core/        — Types, contexts, hooks, <Chart> component
  themes/      — Token system, built-in themes, CSS bridge
  animations/  — Spring presets, reduced motion hook
  charts/      — All 48 chart series components + primitives
  react/       — Consumer barrel package (re-exports everything)
apps/
  demo/        — Development playground (Vite)
  storybook/   — Interactive component documentation
```

## Development Workflow

### Building

```bash
pnpm build              # Build all packages (topological order)
pnpm build --filter @kodemaven/viskit-charts  # Build a single package
```

### Testing

```bash
pnpm test               # Run all tests
pnpm test:watch         # Watch mode
```

### Linting & Type Checking

```bash
pnpm lint               # ESLint across all packages
pnpm typecheck          # TypeScript strict checking
```

## Adding a New Chart Component

1. Create the component file in the appropriate directory under `packages/charts/src/`
2. Follow the naming pattern: `kebab-case.tsx` (e.g., `my-chart-series.tsx`)
3. Export from `packages/charts/src/index.ts`
4. Re-export from `packages/react/src/index.ts`
5. Add a Storybook story in `apps/storybook/src/stories/`
6. Add shared test data to `shared-data.tsx` if needed

### Component Pattern

```tsx
export interface MyChartSeriesProps<TDatum = Record<string, unknown>> {
  field: keyof TDatum & string;
  // ... props
}

export function MyChartSeries<TDatum extends Record<string, unknown>>({
  field,
  ...props
}: MyChartSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  // ... render SVG elements
}
```

### Key Rules

- **No `any`** — use `unknown` + type narrowing
- **No `default` exports** — always named exports
- **No `enum`** — use union string types or const objects
- **No barrel re-exports** in subdirectories — import directly from source
- Theme tokens for all colors/sizes — never hardcode visual values
- `useReducedMotion()` for all animations
- SVG-first rendering with ARIA attributes

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(charts): add PyramidSeries component
fix(themes): guard injectCSSVariables against SSR
docs: update README with Phase 5 chart types
chore: configure changesets for publishing
```

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes with clear, focused commits
3. Ensure `pnpm build`, `pnpm test`, and `pnpm typecheck` all pass
4. Open a PR with a clear description of what changed and why

## Versioning

We use [Changesets](https://github.com/changesets/changesets) for version management. When making user-facing changes:

```bash
pnpm changeset          # Create a changeset describing your change
```

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
