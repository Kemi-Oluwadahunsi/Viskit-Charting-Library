// ─────────────────────────────────────────────────
// @kodemaven/viskit-themes — Public API
// ─────────────────────────────────────────────────

// ── Types ──────────────────────────────────────
export type { VisualizationTokens, ColorScale, PartialTokens } from './tokens';

// ── Theme presets ──────────────────────────────
export { midnight } from './presets/midnight';
export { daylight } from './presets/daylight';
export { aurora } from './presets/aurora';
export { corporate } from './presets/corporate';

// ── Provider ───────────────────────────────────
export { ThemeProvider, useTheme } from './theme-provider';
export type { ThemeProviderProps } from './theme-provider';

// ── Utilities ──────────────────────────────────
export { createTheme } from './create-theme';
export { injectCSSVariables } from './css-bridge';
