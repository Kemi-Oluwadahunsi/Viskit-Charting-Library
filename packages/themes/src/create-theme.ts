// ─────────────────────────────────────────────────
// createTheme — Merge a base theme with overrides
// ─────────────────────────────────────────────────
// Deep-merges partial token overrides onto a base
// theme, preserving type safety. This is how
// consumers create brand-specific themes.
//
// Usage:
//   const brand = createTheme(midnight, {
//     categorical: ['#FF0000', '#00FF00', ...],
//     surface: { background: '#1A1A2E' },
//   });
// ─────────────────────────────────────────────────

import type { VisualizationTokens, PartialTokens } from './tokens';

export function createTheme(
  base: VisualizationTokens,
  overrides: PartialTokens,
): VisualizationTokens {
  const result = { ...base };

  for (const key of Object.keys(overrides) as (keyof PartialTokens)[]) {
    const overrideValue = overrides[key];
    if (overrideValue === undefined) continue;

    const baseValue = result[key];

    // Shallow value (string, number, array) — replace entirely
    if (typeof overrideValue !== 'object' || Array.isArray(overrideValue) || baseValue === null) {
      (result as Record<string, unknown>)[key] = overrideValue;
      continue;
    }

    // Object value — shallow merge one level deep
    if (typeof baseValue === 'object' && !Array.isArray(baseValue)) {
      (result as Record<string, unknown>)[key] = {
        ...(baseValue as Record<string, unknown>),
        ...(overrideValue as Record<string, unknown>),
      };
    }
  }

  return result;
}
