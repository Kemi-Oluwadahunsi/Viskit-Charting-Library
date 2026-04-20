// ─────────────────────────────────────────────────
// Spring configuration presets
// ─────────────────────────────────────────────────
// Pre-tuned @react-spring/web configs for common
// animation scenarios in charts. Each preset feels
// physically natural because spring physics model
// real-world motion, unlike bezier easing curves.
//
// Usage:
//   import { springPresets } from '@viskit/animations';
//   useSpring({ to: { opacity: 1 }, config: springPresets.responsive });
// ─────────────────────────────────────────────────

import type { SpringConfig } from '@react-spring/web';

export const springPresets = {
  /** Snappy response — tooltips, hover states, small transitions */
  responsive: { tension: 300, friction: 24 } satisfies SpringConfig,

  /** Smooth and relaxed — chart enter animations, data updates */
  gentle: { tension: 170, friction: 26 } satisfies SpringConfig,

  /** Playful bounce — attention-drawing, onboarding moments */
  bouncy: { tension: 200, friction: 12 } satisfies SpringConfig,

  /** Instant — reduced motion, or when animation is disabled */
  immediate: { duration: 0 } satisfies SpringConfig,
} as const;

/**
 * Resolve the correct spring config based on animation state.
 * If animation is disabled or reduced motion is preferred,
 * returns the immediate (instant) config.
 */
export function resolveSpringConfig(
  preset: keyof typeof springPresets,
  options: { animate?: boolean; reducedMotion?: boolean } = {},
): SpringConfig {
  const { animate = true, reducedMotion = false } = options;

  if (!animate || reducedMotion) {
    return springPresets.immediate;
  }

  return springPresets[preset];
}
