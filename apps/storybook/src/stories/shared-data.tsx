import type { ReactNode } from 'react';

// ── Monthly metrics (6 rows, 5 numeric) ─────────
export const monthlyMetrics = [
  { month: 'Jan', revenue: 42000, cost: 28000, profit: 14000, target: 40000, users: 1120 },
  { month: 'Feb', revenue: 51000, cost: 31000, profit: 20000, target: 45000, users: 1340 },
  { month: 'Mar', revenue: 48000, cost: 29000, profit: 19000, target: 48000, users: 1280 },
  { month: 'Apr', revenue: 63000, cost: 34000, profit: 29000, target: 52000, users: 1560 },
  { month: 'May', revenue: 59000, cost: 32000, profit: 27000, target: 55000, users: 1480 },
  { month: 'Jun', revenue: 72000, cost: 38000, profit: 34000, target: 58000, users: 1820 },
];

// ── Traffic sources (6 rows) ────────────────────
export const trafficSources = [
  { source: 'Organic', sessions: 34200, bounceRate: 32 },
  { source: 'Direct', sessions: 21800, bounceRate: 28 },
  { source: 'Social', sessions: 18400, bounceRate: 45 },
  { source: 'Email', sessions: 12600, bounceRate: 22 },
  { source: 'Referral', sessions: 9800, bounceRate: 38 },
  { source: 'Paid', sessions: 15200, bounceRate: 35 },
];

// ── Pie / Donut data ────────────────────────────
export const pieData = [
  { label: 'Desktop', value: 42 },
  { label: 'Mobile', value: 34 },
  { label: 'Tablet', value: 14 },
  { label: 'Smart TV', value: 6 },
  { label: 'Wearable', value: 4 },
];

// ── Scatter / Bubble data (8 rows) ─────────────
export const scatterData = [
  { month: 'Jan', spend: 4200, conversions: 320, cpc: 2.8 },
  { month: 'Feb', spend: 5800, conversions: 410, cpc: 2.4 },
  { month: 'Mar', spend: 3900, conversions: 280, cpc: 3.1 },
  { month: 'Apr', spend: 7200, conversions: 520, cpc: 2.1 },
  { month: 'May', spend: 6100, conversions: 450, cpc: 2.5 },
  { month: 'Jun', spend: 8400, conversions: 680, cpc: 1.9 },
  { month: 'Jul', spend: 7800, conversions: 610, cpc: 2.0 },
  { month: 'Aug', spend: 9200, conversions: 740, cpc: 1.8 },
];

// ── Weekly data ─────────────────────────────────
export const weeklyData = [
  { week: 'W1', pageViews: 12400, sessions: 4800 },
  { week: 'W2', pageViews: 14200, sessions: 5200 },
  { week: 'W3', pageViews: 11800, sessions: 4500 },
  { week: 'W4', pageViews: 16800, sessions: 6200 },
  { week: 'W5', pageViews: 15400, sessions: 5800 },
  { week: 'W6', pageViews: 18200, sessions: 7100 },
];

// ── Dumbbell (before/after) ─────────────────────
export const dumbbellData = [
  { month: 'Jan', before: 42, after: 68 },
  { month: 'Feb', before: 38, after: 72 },
  { month: 'Mar', before: 45, after: 65 },
  { month: 'Apr', before: 50, after: 80 },
  { month: 'May', before: 41, after: 75 },
  { month: 'Jun', before: 48, after: 85 },
];

// ── Radar multi-series ──────────────────────────
export const radarMulti = [
  { dimension: 'Speed', team_a: 85, team_b: 68 },
  { dimension: 'Quality', team_a: 72, team_b: 82 },
  { dimension: 'Testing', team_a: 90, team_b: 75 },
  { dimension: 'Delivery', team_a: 65, team_b: 88 },
  { dimension: 'Docs', team_a: 78, team_b: 60 },
  { dimension: 'Collab', team_a: 82, team_b: 70 },
];

// ── Radial bar data ─────────────────────────────
export const radialBarData = [
  { label: 'React', stars: 210 },
  { label: 'Vue', stars: 195 },
  { label: 'Angular', stars: 140 },
  { label: 'Svelte', stars: 170 },
  { label: 'Solid', stars: 120 },
];

// ── Polar area data ─────────────────────────────
export const polarAreaData = [
  { label: 'CSS', hours: 42 },
  { label: 'TS', hours: 68 },
  { label: 'React', hours: 55 },
  { label: 'Node', hours: 38 },
  { label: 'SQL', hours: 25 },
  { label: 'Go', hours: 18 },
];

// ── Heatmap data (day × hour) ───────────────────
export const heatmapData: { day: string; hour: string; activity: number }[] = (() => {
  const result: { day: string; hour: string; activity: number }[] = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'];
  let seed = 42;
  for (const day of days) {
    for (const hour of hours) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      result.push({ day, hour, activity: (seed % 91) + 10 });
    }
  }
  return result;
})();

// ── Histogram raw values (50 points with bins) ──
export const histogramRaw = Array.from({ length: 50 }, (_, i) => ({
  id: `pt${i}`,
  score: 40 + ((i * 1103515245 + 12345) & 0x7fffffff) % 60 + ((i * 7) % 10) / 10,
}));

// ── Sparkline data ──────────────────────────────
export const sparklineData = [12, 14, 11, 17, 15, 19, 16, 21, 18, 24, 22, 28];

// ── Chart wrapper for stories ───────────────────
export function ChartWrapper({ children, maxWidth = '100%' }: { children: ReactNode; maxWidth?: string | number }) {
  return (
    <div style={{ width: '100%', maxWidth, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {children}
    </div>
  );
}

// ── Color palettes ──────────────────────────────
export const PALETTE = {
  indigo: '#818CF8',
  pink: '#FB7185',
  teal: '#2DD4BF',
  amber: '#FBBF24',
  violet: '#A78BFA',
  orange: '#FB923C',
  blue: '#60A5FA',
  red: '#F87171',
  green: '#34D399',
  rose: '#F472B6',
  cyan: '#22D3EE',
  lime: '#84CC16',
};

// ─────────────────────────────────────────────────
// Phase 3 — Shared data
// ─────────────────────────────────────────────────

// ── Treemap / Sunburst / Icicle / CirclePacking ──
export const hierarchyData = [
  { name: 'React', group: 'Frontend', value: 210 },
  { name: 'Vue', group: 'Frontend', value: 168 },
  { name: 'Angular', group: 'Frontend', value: 140 },
  { name: 'Svelte', group: 'Frontend', value: 90 },
  { name: 'Express', group: 'Backend', value: 180 },
  { name: 'Fastify', group: 'Backend', value: 95 },
  { name: 'NestJS', group: 'Backend', value: 120 },
  { name: 'PostgreSQL', group: 'Data', value: 160 },
  { name: 'MongoDB', group: 'Data', value: 130 },
  { name: 'Redis', group: 'Data', value: 75 },
];

// ── Sankey nodes & links ────────────────────────
export const sankeyNodes = [
  { name: 'Budget' },
  { name: 'Engineering' },
  { name: 'Marketing' },
  { name: 'Operations' },
  { name: 'Salaries' },
  { name: 'Tools' },
  { name: 'Ads' },
  { name: 'Events' },
  { name: 'Cloud' },
  { name: 'Office' },
];
export const sankeyLinks = [
  { source: 'Budget', target: 'Engineering', value: 40 },
  { source: 'Budget', target: 'Marketing', value: 30 },
  { source: 'Budget', target: 'Operations', value: 30 },
  { source: 'Engineering', target: 'Salaries', value: 28 },
  { source: 'Engineering', target: 'Tools', value: 12 },
  { source: 'Marketing', target: 'Ads', value: 18 },
  { source: 'Marketing', target: 'Events', value: 12 },
  { source: 'Operations', target: 'Cloud', value: 20 },
  { source: 'Operations', target: 'Office', value: 10 },
];

// ── Chord matrix ────────────────────────────────
export const chordLabels = ['Eng', 'Design', 'PM', 'QA', 'DevOps'];
export const chordMatrix = [
  [0, 25, 18, 12, 8],
  [25, 0, 22, 10, 5],
  [18, 22, 0, 15, 6],
  [12, 10, 15, 0, 14],
  [8, 5, 6, 14, 0],
];

// ── Force graph ─────────────────────────────────
export const forceNodes = [
  { id: 'React', group: 0 },
  { id: 'Redux', group: 0 },
  { id: 'Router', group: 0 },
  { id: 'Next.js', group: 1 },
  { id: 'Vercel', group: 1 },
  { id: 'Node', group: 2 },
  { id: 'Express', group: 2 },
  { id: 'Postgres', group: 3 },
  { id: 'Prisma', group: 3 },
];
export const forceLinks = [
  { source: 'React', target: 'Redux' },
  { source: 'React', target: 'Router' },
  { source: 'React', target: 'Next.js' },
  { source: 'Next.js', target: 'Vercel' },
  { source: 'Next.js', target: 'Node' },
  { source: 'Node', target: 'Express' },
  { source: 'Express', target: 'Postgres' },
  { source: 'Postgres', target: 'Prisma' },
  { source: 'Prisma', target: 'Node' },
];

// ── Candlestick (OHLC) ─────────────────────────
export const ohlcData = [
  { day: 'Mon', open: 100, high: 115, low: 95, close: 110 },
  { day: 'Tue', open: 110, high: 120, low: 105, close: 108 },
  { day: 'Wed', open: 108, high: 125, low: 102, close: 122 },
  { day: 'Thu', open: 122, high: 130, low: 118, close: 126 },
  { day: 'Fri', open: 126, high: 135, low: 120, close: 118 },
  { day: 'Sat', open: 118, high: 128, low: 112, close: 125 },
];

// ── Waterfall ───────────────────────────────────
export const waterfallData = [
  { label: 'Revenue', amount: 120000, total: 'start' },
  { label: 'COGS', amount: -42000, total: '' },
  { label: 'Salaries', amount: -35000, total: '' },
  { label: 'Marketing', amount: -18000, total: '' },
  { label: 'R&D', amount: -12000, total: '' },
  { label: 'Other', amount: -5000, total: '' },
  { label: 'Net Profit', amount: 8000, total: 'end' },
];

// ── Box plot ────────────────────────────────────
export const boxPlotData = [
  { group: 'A', min: 10, q1: 25, median: 35, q3: 50, max: 68 },
  { group: 'B', min: 18, q1: 30, median: 42, q3: 55, max: 72 },
  { group: 'C', min: 5, q1: 20, median: 28, q3: 40, max: 58 },
  { group: 'D', min: 22, q1: 35, median: 48, q3: 62, max: 80 },
  { group: 'E', min: 12, q1: 28, median: 38, q3: 52, max: 70 },
];

// ── Violin density ──────────────────────────────
export const violinData = (() => {
  const result: Array<{ group: string; value: number; density: number }> = [];
  for (const g of ['A', 'B', 'C']) {
    const center = g === 'A' ? 50 : g === 'B' ? 40 : 60;
    for (let v = 10; v <= 90; v += 5) {
      const dist = Math.abs(v - center);
      result.push({ group: g, value: v, density: Math.exp(-dist * dist / 400) });
    }
  }
  return result;
})();

// ── Slope (before/after) ────────────────────────
export const slopeData = [
  { team: 'Alpha', q1: 72, q2: 85 },
  { team: 'Beta', q1: 68, q2: 61 },
  { team: 'Gamma', q1: 55, q2: 78 },
  { team: 'Delta', q1: 80, q2: 82 },
  { team: 'Epsilon', q1: 45, q2: 70 },
];

// ── Funnel ──────────────────────────────────────
export const funnelData = [
  { stage: 'Visitors', count: 12000 },
  { stage: 'Signups', count: 5200 },
  { stage: 'Activated', count: 3100 },
  { stage: 'Subscribed', count: 1800 },
  { stage: 'Retained', count: 1200 },
];

// ── Stream graph (time-series multi-field) ──────
export const streamData = [
  { t: 0, audio: 12, video: 18, text: 8, image: 5 },
  { t: 1, audio: 14, video: 22, text: 10, image: 7 },
  { t: 2, audio: 18, video: 25, text: 6, image: 9 },
  { t: 3, audio: 22, video: 20, text: 12, image: 11 },
  { t: 4, audio: 16, video: 28, text: 14, image: 8 },
  { t: 5, audio: 20, video: 32, text: 10, image: 12 },
  { t: 6, audio: 25, video: 26, text: 16, image: 10 },
  { t: 7, audio: 28, video: 30, text: 12, image: 14 },
  { t: 8, audio: 22, video: 35, text: 18, image: 11 },
  { t: 9, audio: 30, video: 28, text: 14, image: 16 },
];

// ─────────────────────────────────────────────────
// Phase 4 — Shared data
// ─────────────────────────────────────────────────

// ── Parallel coordinates (multi-axis) ───────────
export const parallelData = [
  { name: 'Alpha', speed: 82, reliability: 90, cost: 45, latency: 12, uptime: 99 },
  { name: 'Beta', speed: 68, reliability: 75, cost: 32, latency: 25, uptime: 95 },
  { name: 'Gamma', speed: 95, reliability: 60, cost: 72, latency: 8, uptime: 88 },
  { name: 'Delta', speed: 55, reliability: 85, cost: 28, latency: 35, uptime: 97 },
  { name: 'Epsilon', speed: 78, reliability: 70, cost: 55, latency: 18, uptime: 92 },
  { name: 'Zeta', speed: 90, reliability: 80, cost: 60, latency: 10, uptime: 96 },
];

// ── Calendar heatmap (365 days) ─────────────────
export const calendarData = (() => {
  const result: { date: string; commits: number }[] = [];
  const start = new Date('2024-01-01');
  let seed = 7;
  for (let d = 0; d < 365; d++) {
    const dt = new Date(start);
    dt.setDate(start.getDate() + d);
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const isWeekend = dt.getDay() === 0 || dt.getDay() === 6;
    const commits = isWeekend ? (seed % 4) : (seed % 12);
    result.push({ date: dt.toISOString().slice(0, 10), commits });
  }
  return result;
})();

// ── Ridgeline (multi-distribution) ──────────────
export const ridgelineData = Array.from({ length: 60 }, (_, i) => {
  const x = i;
  return {
    x,
    desktop: Math.sin(i / 5) * 20 + 40 + (i % 7),
    mobile: Math.cos(i / 4) * 15 + 35 + (i % 5),
    tablet: Math.sin(i / 3) * 10 + 25 + (i % 3),
  };
});

// ── Marimekko (variable-width stacked) ──────────
export const marimekkoData = [
  { region: 'NA', width: 35, desktop: 55, mobile: 35, tablet: 10 },
  { region: 'EU', width: 30, desktop: 48, mobile: 40, tablet: 12 },
  { region: 'APAC', width: 25, desktop: 30, mobile: 60, tablet: 10 },
  { region: 'LATAM', width: 10, desktop: 25, mobile: 65, tablet: 10 },
];

// ── Word cloud ──────────────────────────────────
export const wordCloudData = [
  { word: 'React', frequency: 120 },
  { word: 'TypeScript', frequency: 95 },
  { word: 'JavaScript', frequency: 88 },
  { word: 'Node', frequency: 72 },
  { word: 'CSS', frequency: 65 },
  { word: 'GraphQL', frequency: 58 },
  { word: 'Docker', frequency: 52 },
  { word: 'Kubernetes', frequency: 48 },
  { word: 'Rust', frequency: 45 },
  { word: 'Python', frequency: 85 },
  { word: 'Go', frequency: 55 },
  { word: 'Svelte', frequency: 42 },
  { word: 'Tailwind', frequency: 68 },
  { word: 'Vite', frequency: 60 },
  { word: 'Next.js', frequency: 75 },
  { word: 'PostgreSQL', frequency: 50 },
  { word: 'Redis', frequency: 40 },
  { word: 'AWS', frequency: 70 },
  { word: 'Azure', frequency: 38 },
  { word: 'Linux', frequency: 62 },
];

// ── Gantt (project timeline) ────────────────────
export const ganttData = [
  { task: 'Research', start: 0, end: 15, progress: 100 },
  { task: 'Design', start: 10, end: 30, progress: 85 },
  { task: 'Frontend', start: 25, end: 55, progress: 60 },
  { task: 'Backend', start: 20, end: 50, progress: 70 },
  { task: 'Testing', start: 45, end: 65, progress: 30 },
  { task: 'Deploy', start: 60, end: 70, progress: 0 },
];

// ── Density contour (2D scatter + density) ──────
export const densityData = (() => {
  const result: { x: number; y: number }[] = [];
  let seed = 42;
  for (let i = 0; i < 200; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const cx = i < 100 ? 40 : 70;
    const cy = i < 100 ? 60 : 35;
    result.push({
      x: cx + ((seed % 40) - 20),
      y: cy + (((seed >> 8) % 30) - 15),
    });
  }
  return result;
})();

// ─────────────────────────────────────────────────
// Phase 5 — Shared data
// ─────────────────────────────────────────────────

// ── Pyramid (population by age group) ───────────
export const pyramidData = [
  { ageGroup: '0–14', population: 26000 },
  { ageGroup: '15–24', population: 18000 },
  { ageGroup: '25–34', population: 22000 },
  { ageGroup: '35–44', population: 28000 },
  { ageGroup: '45–54', population: 32000 },
  { ageGroup: '55–64', population: 24000 },
  { ageGroup: '65–74', population: 16000 },
  { ageGroup: '75+', population: 9000 },
];

// ── Diverging bar (male vs female by age) ───────
export const divergingData = [
  { ageGroup: '0–14', male: 13200, female: 12800 },
  { ageGroup: '15–24', male: 9400, female: 8600 },
  { ageGroup: '25–34', male: 11500, female: 10500 },
  { ageGroup: '35–44', male: 14200, female: 13800 },
  { ageGroup: '45–54', male: 16800, female: 15200 },
  { ageGroup: '55–64', male: 11600, female: 12400 },
  { ageGroup: '65–74', male: 7200, female: 8800 },
  { ageGroup: '75+', male: 3600, female: 5400 },
];

// ── Venn sets ───────────────────────────────────
export const vennSets = [
  { key: 'JS', label: 'JavaScript', size: 180 },
  { key: 'TS', label: 'TypeScript', size: 140 },
  { key: 'React', label: 'React', size: 120 },
];
export const vennIntersections = [
  { sets: ['JS', 'TS'], size: 90, label: '90' },
  { sets: ['JS', 'React'], size: 70, label: '70' },
  { sets: ['TS', 'React'], size: 85, label: '85' },
  { sets: ['JS', 'TS', 'React'], size: 55, label: '55' },
];

// ── Timeline events ─────────────────────────────
export const timelineEvents = [
  { event: 'Kickoff', date: 0, endDate: 5, category: 'Planning' },
  { event: 'Research', date: 3, endDate: 15, category: 'Planning' },
  { event: 'Design', date: 12, endDate: 28, category: 'Design' },
  { event: 'Prototype', date: 22, endDate: 35, category: 'Design' },
  { event: 'Frontend', date: 30, endDate: 55, category: 'Dev' },
  { event: 'Backend', date: 32, endDate: 52, category: 'Dev' },
  { event: 'QA', date: 48, endDate: 62, category: 'Testing' },
  { event: 'Launch', date: 60, endDate: 65, category: 'Release' },
];

// ── Comparison (year-over-year) ─────────────────
export const comparisonData = [
  { metric: 'Revenue', fy2023: 120, fy2024: 145 },
  { metric: 'Users', fy2023: 85, fy2024: 112 },
  { metric: 'Orders', fy2023: 95, fy2024: 108 },
  { metric: 'ARPU', fy2023: 68, fy2024: 82 },
  { metric: 'Retention', fy2023: 72, fy2024: 78 },
  { metric: 'NPS', fy2023: 55, fy2024: 71 },
];

// ── Donut data ──────────────────────────────────
export const donutData = [
  { category: 'Engineering', budget: 45000 },
  { category: 'Marketing', budget: 28000 },
  { category: 'Sales', budget: 32000 },
  { category: 'Operations', budget: 18000 },
  { category: 'HR', budget: 12000 },
  { category: 'R&D', budget: 22000 },
];
