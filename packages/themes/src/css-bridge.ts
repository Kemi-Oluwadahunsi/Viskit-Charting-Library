// ─────────────────────────────────────────────────
// CSS Variable Bridge
// ─────────────────────────────────────────────────
// Injects theme tokens as CSS custom properties
// onto an element (defaults to :root). Enables
// integration with Tailwind, shadcn/ui, or any
// CSS-based design system.
//
// Usage:
//   import { injectCSSVariables, midnight } from '@viskit/themes';
//   injectCSSVariables(midnight);
//
// Generates:
//   --vk-categorical-0: #818CF8;
//   --vk-surface-background: #0F172A;
//   --vk-font-family: 'Inter', ...;
//   etc.
// ─────────────────────────────────────────────────

import type { VisualizationTokens } from './tokens';

export function injectCSSVariables(
  tokens: VisualizationTokens,
  root?: HTMLElement,
): void {
  const el = root ?? document.documentElement;

  // Categorical colors
  tokens.categorical.forEach((color, i) => {
    el.style.setProperty(`--vk-categorical-${i}`, color);
  });

  // Semantic colors
  for (const [key, value] of Object.entries(tokens.semantic)) {
    el.style.setProperty(`--vk-semantic-${key}`, value);
  }

  // Surface colors
  for (const [key, value] of Object.entries(tokens.surface)) {
    el.style.setProperty(`--vk-surface-${camelToKebab(key)}`, value);
  }

  // Typography
  el.style.setProperty('--vk-font-family', tokens.typography.fontFamily);
  el.style.setProperty('--vk-font-family-mono', tokens.typography.fontFamilyMono);

  // Motion
  el.style.setProperty('--vk-motion-fast', `${tokens.motion.duration.fast}ms`);
  el.style.setProperty('--vk-motion-base', `${tokens.motion.duration.base}ms`);
  el.style.setProperty('--vk-motion-slow', `${tokens.motion.duration.slow}ms`);

  // Geometry
  el.style.setProperty('--vk-border-radius', `${tokens.geometry.borderRadius}px`);
  el.style.setProperty('--vk-stroke-width', `${tokens.geometry.strokeWidth}`);
  el.style.setProperty('--vk-dot-radius', `${tokens.geometry.dotRadius}`);

  // Effects
  el.style.setProperty('--vk-tooltip-blur', `${tokens.effects.tooltipBlur}px`);
  el.style.setProperty('--vk-tooltip-shadow', tokens.effects.tooltipShadow);
}

/** Convert camelCase to kebab-case: 'cardBorder' → 'card-border' */
function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}
