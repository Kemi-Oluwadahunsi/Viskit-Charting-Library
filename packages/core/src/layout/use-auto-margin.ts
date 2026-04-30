// ─────────────────────────────────────────────────
// useAutoMargin — Automatic margin calculation
// ─────────────────────────────────────────────────
// Computes sensible chart margins based on which
// axes and labels are present. No more manual
// margin={{ top: 20, right: 30, bottom: 60, left: 80 }}.
//
// Returns a Margin object that reserves enough space
// for axis labels, tick labels, and chart title.
// ─────────────────────────────────────────────────

import { useMemo } from 'react';
import type { Margin } from '../types';

interface AutoMarginConfig {
  /** Whether an X axis is shown, and where */
  xAxis?: { position: 'top' | 'bottom'; hasLabel?: boolean };
  /** Whether a Y axis is shown, and where */
  yAxis?: { position: 'left' | 'right'; hasLabel?: boolean };
  /** Whether the chart has a title above it */
  hasTitle?: boolean;
  /** Whether a legend is shown, and where */
  legend?: { position: 'top' | 'bottom' | 'left' | 'right' };
  /** Explicit overrides — these values take priority */
  overrides?: Partial<Margin>;
}

// Sensible defaults based on typical label sizes
const TICK_LABEL_SPACE = 40;
const AXIS_LABEL_SPACE = 24;
const TITLE_SPACE = 28;
const LEGEND_SPACE = 32;

// Symmetric defaults — works for both cartesian and radial charts.
// Cartesian charts add extra space via xAxis/yAxis config.
// SVG overflow is visible, so labels won't clip even on tight margins.
const DEFAULT_TOP = 16;
const DEFAULT_RIGHT = 16;
const DEFAULT_BOTTOM = 40;
const DEFAULT_LEFT = 20;

export function useAutoMargin(config: AutoMarginConfig = {}): Margin {
  const { xAxis, yAxis, hasTitle, legend, overrides } = config;

  return useMemo(() => {
    let top = DEFAULT_TOP;
    let right = DEFAULT_RIGHT;
    let bottom = DEFAULT_BOTTOM;
    let left = DEFAULT_LEFT;

    // Reserve space for axes and their labels
    if (xAxis) {
      const space = TICK_LABEL_SPACE + (xAxis.hasLabel ? AXIS_LABEL_SPACE : 0);
      if (xAxis.position === 'bottom') bottom += space;
      else top += space;
    }

    if (yAxis) {
      const space = TICK_LABEL_SPACE + (yAxis.hasLabel ? AXIS_LABEL_SPACE : 0);
      if (yAxis.position === 'left') left += space;
      else right += space;
    }

    // Title reserves space at the top
    if (hasTitle) top += TITLE_SPACE;

    // Legend reserves space on its side
    if (legend) {
      switch (legend.position) {
        case 'top': top += LEGEND_SPACE; break;
        case 'bottom': bottom += LEGEND_SPACE; break;
        case 'left': left += LEGEND_SPACE; break;
        case 'right': right += LEGEND_SPACE; break;
      }
    }

    // Apply explicit overrides last
    return {
      top: overrides?.top ?? top,
      right: overrides?.right ?? right,
      bottom: overrides?.bottom ?? bottom,
      left: overrides?.left ?? left,
    };
  }, [
    xAxis?.position,
    xAxis?.hasLabel,
    yAxis?.position,
    yAxis?.hasLabel,
    hasTitle,
    legend?.position,
    overrides?.top,
    overrides?.right,
    overrides?.bottom,
    overrides?.left,
  ]);
}
