import type { VisualizationTokens } from '../tokens';

export const aurora = {
  name: 'aurora',
  colorMode: 'dark',

  categorical: [
    '#67E8F9', // cyan-300
    '#C084FC', // purple-400
    '#86EFAC', // green-300
    '#FCA5A5', // red-300
    '#FDE68A', // amber-200
    '#F0ABFC', // fuchsia-300
    '#7DD3FC', // sky-300
    '#FCD34D', // amber-300
  ],

  sequential: {
    blue: {
      50: '#ECFEFF', 100: '#CFFAFE', 200: '#A5F3FC', 300: '#67E8F9', 400: '#22D3EE',
      500: '#06B6D4', 600: '#0891B2', 700: '#0E7490', 800: '#155E75', 900: '#164E63',
    },
    green: {
      50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7', 400: '#34D399',
      500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B',
    },
    purple: {
      50: '#FDF4FF', 100: '#FAE8FF', 200: '#F5D0FE', 300: '#F0ABFC', 400: '#E879F9',
      500: '#D946EF', 600: '#C026D3', 700: '#A21CAF', 800: '#86198F', 900: '#701A75',
    },
  },

  semantic: {
    positive: '#6EE7B7',
    negative: '#FCA5A5',
    neutral: '#A1A1AA',
    warning: '#FDE68A',
    info: '#67E8F9',
  },

  surface: {
    background: '#0A0A1A',
    card: 'rgba(139, 92, 246, 0.08)',
    cardBorder: 'rgba(139, 92, 246, 0.15)',
    grid: 'rgba(139, 92, 246, 0.06)',
    gridMinor: 'rgba(139, 92, 246, 0.03)',
    axis: 'rgba(167, 139, 250, 0.2)',
    tick: 'rgba(167, 139, 250, 0.2)',
    crosshair: 'rgba(192, 132, 252, 0.4)',
  },

  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Fira Code', monospace",
    axisLabel:  { fontSize: 11, fontWeight: 400, color: '#A1A1AA' },
    chartTitle: { fontSize: 14, fontWeight: 600, color: '#F4F4F5' },
    dataLabel:  { fontSize: 10, fontWeight: 500, color: '#D4D4D8' },
    tooltipBody: { fontSize: 12, fontWeight: 400, color: '#E4E4E7' },
    legendLabel: { fontSize: 12, fontWeight: 400, color: '#A1A1AA' },
  },

  spacing: {
    chartPadding: 8,
    legendGap: 16,
    tooltipPadding: 10,
    barGroupGap: 0.2,
    barGap: 0.05,
  },

  motion: {
    duration: { fast: 150, base: 350, slow: 700 },
    spring: {
      responsive: { tension: 280, friction: 22 },
      gentle: { tension: 160, friction: 28 },
    },
    stagger: 35,
  },

  geometry: {
    borderRadius: 6,
    dotRadius: 3,
    dotRadiusActive: 6,
    strokeWidth: 2,
    strokeWidthHover: 3,
    focusRingWidth: 2,
    focusRingColor: '#C084FC',
  },

  effects: {
    tooltipBlur: 16,
    tooltipShadow: '0 8px 40px rgba(139, 92, 246, 0.25)',
    dimmedOpacity: 0.15,
    gradientOpacity: [0.5, 0] as [number, number],
  },
} satisfies VisualizationTokens;
