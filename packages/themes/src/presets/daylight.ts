// ─────────────────────────────────────────────────
// daylight — Clean light theme
// ─────────────────────────────────────────────────
// Soft shadows, muted palette, white background.
// Ideal for documentation, presentations, print.
// ─────────────────────────────────────────────────

import type { VisualizationTokens } from '../tokens';

export const daylight = {
  name: 'daylight',
  colorMode: 'light',

  categorical: [
    '#4F46E5', // indigo-600
    '#DB2777', // pink-600
    '#0D9488', // teal-600
    '#D97706', // amber-600
    '#7C3AED', // violet-600
    '#E11D48', // rose-600
    '#0891B2', // cyan-600
    '#65A30D', // lime-600
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
    positive: '#16A34A',
    negative: '#E11D48',
    neutral: '#64748B',
    warning: '#D97706',
    info: '#2563EB',
  },

  surface: {
    background: '#FFFFFF',
    card: 'rgba(255, 255, 255, 0.95)',
    cardBorder: 'rgba(0, 0, 0, 0.08)',
    grid: 'rgba(0, 0, 0, 0.06)',
    gridMinor: 'rgba(0, 0, 0, 0.03)',
    axis: 'rgba(0, 0, 0, 0.15)',
    tick: 'rgba(0, 0, 0, 0.15)',
    crosshair: 'rgba(0, 0, 0, 0.25)',
  },

  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Fira Code', monospace",
    axisLabel:  { fontSize: 11, fontWeight: 400, color: '#64748B' },
    chartTitle: { fontSize: 14, fontWeight: 600, color: '#0F172A' },
    dataLabel:  { fontSize: 10, fontWeight: 500, color: '#475569' },
    tooltipBody: { fontSize: 12, fontWeight: 400, color: '#1E293B' },
    legendLabel: { fontSize: 12, fontWeight: 400, color: '#64748B' },
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
    focusRingColor: '#4F46E5',
  },

  effects: {
    tooltipBlur: 8,
    tooltipShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
    dimmedOpacity: 0.2,
    gradientOpacity: [0.3, 0] as [number, number],
  },
} satisfies VisualizationTokens;
