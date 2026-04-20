// ─────────────────────────────────────────────────
// midnight — Default dark theme
// ─────────────────────────────────────────────────
// Vibrant accents on a deep charcoal background.
// Glass-morphism tooltips. Designed dark-first.
// ─────────────────────────────────────────────────

import type { VisualizationTokens } from '../tokens';

export const midnight = {
  name: 'midnight',
  colorMode: 'dark',

  categorical: [
    '#818CF8', // indigo-400
    '#F472B6', // pink-400
    '#2DD4BF', // teal-400
    '#FBBF24', // amber-400
    '#A78BFA', // violet-400
    '#FB7185', // rose-400
    '#22D3EE', // cyan-400
    '#A3E635', // lime-400
  ],

  sequential: {
    blue: {
      50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA',
      500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A',
    },
    green: {
      50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0', 300: '#86EFAC', 400: '#4ADE80',
      500: '#22C55E', 600: '#16A34A', 700: '#15803D', 800: '#166534', 900: '#14532D',
    },
    purple: {
      50: '#FAF5FF', 100: '#F3E8FF', 200: '#E9D5FF', 300: '#D8B4FE', 400: '#C084FC',
      500: '#A855F7', 600: '#9333EA', 700: '#7E22CE', 800: '#6B21A8', 900: '#581C87',
    },
  },

  semantic: {
    positive: '#4ADE80',
    negative: '#FB7185',
    neutral: '#94A3B8',
    warning: '#FBBF24',
    info: '#60A5FA',
  },

  surface: {
    background: '#0F172A',
    card: 'rgba(255, 255, 255, 0.06)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    grid: 'rgba(255, 255, 255, 0.06)',
    gridMinor: 'rgba(255, 255, 255, 0.03)',
    axis: 'rgba(255, 255, 255, 0.15)',
    tick: 'rgba(255, 255, 255, 0.15)',
    crosshair: 'rgba(255, 255, 255, 0.3)',
  },

  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Fira Code', monospace",
    axisLabel:  { fontSize: 11, fontWeight: 400, color: '#94A3B8' },
    chartTitle: { fontSize: 14, fontWeight: 600, color: '#F1F5F9' },
    dataLabel:  { fontSize: 10, fontWeight: 500, color: '#CBD5E1' },
    tooltipBody: { fontSize: 12, fontWeight: 400, color: '#E2E8F0' },
    legendLabel: { fontSize: 12, fontWeight: 400, color: '#94A3B8' },
  },

  spacing: {
    chartPadding: 8,
    legendGap: 16,
    tooltipPadding: 10,
    barGroupGap: 0.2,
    barGap: 0.05,
  },

  motion: {
    duration: { fast: 150, base: 300, slow: 600 },
    spring: {
      responsive: { tension: 300, friction: 24 },
      gentle: { tension: 170, friction: 26 },
    },
    stagger: 30,
  },

  geometry: {
    borderRadius: 4,
    dotRadius: 3,
    dotRadiusActive: 5,
    strokeWidth: 2,
    strokeWidthHover: 3,
    focusRingWidth: 2,
    focusRingColor: '#818CF8',
  },

  effects: {
    tooltipBlur: 12,
    tooltipShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    dimmedOpacity: 0.2,
    gradientOpacity: [0.4, 0] as [number, number],
  },
} satisfies VisualizationTokens;
