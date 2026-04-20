import type { VisualizationTokens } from '../tokens';

export const corporate = {
  name: 'corporate',
  colorMode: 'light',

  categorical: [
    '#2563EB', // blue-600
    '#DC2626', // red-600
    '#059669', // emerald-600
    '#D97706', // amber-600
    '#7C3AED', // violet-600
    '#DB2777', // pink-600
    '#0891B2', // cyan-600
    '#65A30D', // lime-600
  ],

  sequential: {
    blue: {
      50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA',
      500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A',
    },
    green: {
      50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7', 400: '#34D399',
      500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B',
    },
    purple: {
      50: '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE', 300: '#C4B5FD', 400: '#A78BFA',
      500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9', 800: '#5B21B6', 900: '#4C1D95',
    },
  },

  semantic: {
    positive: '#059669',
    negative: '#DC2626',
    neutral: '#6B7280',
    warning: '#D97706',
    info: '#2563EB',
  },

  surface: {
    background: '#FFFFFF',
    card: '#F9FAFB',
    cardBorder: '#E5E7EB',
    grid: '#E5E7EB',
    gridMinor: '#F3F4F6',
    axis: '#9CA3AF',
    tick: '#9CA3AF',
    crosshair: '#6B7280',
  },

  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Fira Code', monospace",
    axisLabel:  { fontSize: 11, fontWeight: 400, color: '#6B7280' },
    chartTitle: { fontSize: 14, fontWeight: 600, color: '#111827' },
    dataLabel:  { fontSize: 10, fontWeight: 500, color: '#374151' },
    tooltipBody: { fontSize: 12, fontWeight: 400, color: '#1F2937' },
    legendLabel: { fontSize: 12, fontWeight: 400, color: '#6B7280' },
  },

  spacing: {
    chartPadding: 8,
    legendGap: 16,
    tooltipPadding: 10,
    barGroupGap: 0.2,
    barGap: 0.05,
  },

  motion: {
    duration: { fast: 120, base: 250, slow: 500 },
    spring: {
      responsive: { tension: 320, friction: 26 },
      gentle: { tension: 180, friction: 28 },
    },
    stagger: 25,
  },

  geometry: {
    borderRadius: 3,
    dotRadius: 3,
    dotRadiusActive: 5,
    strokeWidth: 2,
    strokeWidthHover: 3,
    focusRingWidth: 2,
    focusRingColor: '#2563EB',
  },

  effects: {
    tooltipBlur: 8,
    tooltipShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
    dimmedOpacity: 0.25,
    gradientOpacity: [0.3, 0] as [number, number],
  },
} satisfies VisualizationTokens;
