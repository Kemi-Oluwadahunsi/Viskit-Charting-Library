// ─────────────────────────────────────────────────
// Theme Token Type Definitions
// ─────────────────────────────────────────────────
// These interfaces define every visual decision
// in VisKit. No component ever hardcodes a color,
// font size, or spacing — everything references
// these tokens through the theme.
// ─────────────────────────────────────────────────

/** A 10-stop color ramp for sequential palettes */
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

/** Complete set of visualization design tokens */
export interface VisualizationTokens {
  /** Theme name for identification */
  name: string;

  /** Color mode this theme targets */
  colorMode: 'light' | 'dark';

  /** Categorical colors — min 8, for series differentiation */
  categorical: readonly string[];

  /** Sequential color ramps — for heatmaps, density */
  sequential: {
    blue: ColorScale;
    green: ColorScale;
    purple: ColorScale;
  };

  /** Semantic meaning colors */
  semantic: {
    positive: string;
    negative: string;
    neutral: string;
    warning: string;
    info: string;
  };

  /** Surfaces, backgrounds, grid lines */
  surface: {
    background: string;
    card: string;
    cardBorder: string;
    grid: string;
    gridMinor: string;
    axis: string;
    tick: string;
    crosshair: string;
  };

  /** Typography tokens */
  typography: {
    fontFamily: string;
    fontFamilyMono: string;
    axisLabel: { fontSize: number; fontWeight: number; color: string };
    chartTitle: { fontSize: number; fontWeight: number; color: string };
    dataLabel: { fontSize: number; fontWeight: number; color: string };
    tooltipBody: { fontSize: number; fontWeight: number; color: string };
    legendLabel: { fontSize: number; fontWeight: number; color: string };
  };

  /** Spacing values in px */
  spacing: {
    chartPadding: number;
    legendGap: number;
    tooltipPadding: number;
    barGroupGap: number;
    barGap: number;
  };

  /** Animation tokens */
  motion: {
    duration: { fast: number; base: number; slow: number };
    spring: {
      responsive: { tension: number; friction: number };
      gentle: { tension: number; friction: number };
    };
    stagger: number;
  };

  /** Shape geometry tokens */
  geometry: {
    borderRadius: number;
    dotRadius: number;
    dotRadiusActive: number;
    strokeWidth: number;
    strokeWidthHover: number;
    focusRingWidth: number;
    focusRingColor: string;
  };

  /** Visual effect tokens */
  effects: {
    tooltipBlur: number;
    tooltipShadow: string;
    dimmedOpacity: number;
    gradientOpacity: [number, number];
  };
}

/** Deep partial type for theme overrides */
export type PartialTokens = {
  [K in keyof VisualizationTokens]?: VisualizationTokens[K] extends object
    ? Partial<VisualizationTokens[K]>
    : VisualizationTokens[K];
};
