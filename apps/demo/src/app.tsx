// ─────────────────────────────────────────────────
// Demo App — Showcase all VisKit chart series
// ─────────────────────────────────────────────────

import { Chart } from '@viskit/core';
import {
  // Phase 1
  LineSeries, BarSeries, AreaSeries, ScatterSeries, PieSeries,
  // Phase 2 — Cartesian
  StackedBarSeries, GroupedBarSeries, HorizontalBarSeries,
  MultiLineSeries, StackedAreaSeries,
  BubbleSeries, LollipopSeries, DumbbellSeries,
  // Phase 2 — Radial
  RadarSeries, RadialBarSeries, PolarAreaSeries,
  // Phase 2 — Specialized
  HistogramSeries, Heatmap, Sparkline,
  // Primitives
  XAxis, YAxis, CartesianGrid, Tooltip,
} from '@viskit/charts';

// ── Datasets ───────────────────────────────────

const monthlyMetrics = [
  { month: 'Jan', revenue: 42000, cost: 28000, profit: 14000, target: 40000, users: 1120 },
  { month: 'Feb', revenue: 51000, cost: 31000, profit: 20000, target: 45000, users: 1340 },
  { month: 'Mar', revenue: 48000, cost: 29000, profit: 19000, target: 48000, users: 1280 },
  { month: 'Apr', revenue: 63000, cost: 34000, profit: 29000, target: 52000, users: 1560 },
  { month: 'May', revenue: 59000, cost: 32000, profit: 27000, target: 55000, users: 1480 },
  { month: 'Jun', revenue: 72000, cost: 38000, profit: 34000, target: 58000, users: 1820 },
  { month: 'Jul', revenue: 68000, cost: 35000, profit: 33000, target: 62000, users: 1750 },
  { month: 'Aug', revenue: 81000, cost: 42000, profit: 39000, target: 65000, users: 2100 },
];

const trafficSources = [
  { source: 'Organic', sessions: 34200, bounceRate: 32 },
  { source: 'Direct', sessions: 21800, bounceRate: 28 },
  { source: 'Social', sessions: 18400, bounceRate: 45 },
  { source: 'Email', sessions: 12600, bounceRate: 22 },
  { source: 'Referral', sessions: 9800, bounceRate: 38 },
  { source: 'Paid', sessions: 15200, bounceRate: 35 },
];

const deviceShare = [
  { label: 'Desktop', value: 42 },
  { label: 'Mobile', value: 34 },
  { label: 'Tablet', value: 14 },
  { label: 'Smart TV', value: 6 },
  { label: 'Wearable', value: 4 },
];

const projectAllocation = [
  { label: 'Engineering', value: 38 },
  { label: 'Marketing', value: 22 },
  { label: 'Design', value: 15 },
  { label: 'Operations', value: 13 },
  { label: 'Sales', value: 12 },
];

const scatterData = [
  { month: 'Jan', spend: 4200, conversions: 320, cpc: 2.8 },
  { month: 'Feb', spend: 5800, conversions: 410, cpc: 2.4 },
  { month: 'Mar', spend: 3900, conversions: 280, cpc: 3.1 },
  { month: 'Apr', spend: 7200, conversions: 520, cpc: 2.1 },
  { month: 'May', spend: 6100, conversions: 450, cpc: 2.5 },
  { month: 'Jun', spend: 8400, conversions: 680, cpc: 1.9 },
  { month: 'Jul', spend: 7800, conversions: 610, cpc: 2.0 },
  { month: 'Aug', spend: 9200, conversions: 740, cpc: 1.8 },
];

const weeklyEngagement = [
  { week: 'W1', pageViews: 12400, sessions: 4800, avgDuration: 3.2 },
  { week: 'W2', pageViews: 14200, sessions: 5200, avgDuration: 3.5 },
  { week: 'W3', pageViews: 11800, sessions: 4500, avgDuration: 2.9 },
  { week: 'W4', pageViews: 16800, sessions: 6200, avgDuration: 3.8 },
  { week: 'W5', pageViews: 15400, sessions: 5800, avgDuration: 3.6 },
  { week: 'W6', pageViews: 18200, sessions: 7100, avgDuration: 4.0 },
  { week: 'W7', pageViews: 17600, sessions: 6800, avgDuration: 3.9 },
  { week: 'W8', pageViews: 20100, sessions: 7800, avgDuration: 4.2 },
];

// Phase 2 datasets
const dumbbellData = [
  { month: 'Jan', before: 42, after: 68 },
  { month: 'Feb', before: 38, after: 72 },
  { month: 'Mar', before: 45, after: 65 },
  { month: 'Apr', before: 50, after: 80 },
  { month: 'May', before: 41, after: 75 },
  { month: 'Jun', before: 48, after: 85 },
];

const radarMulti = [
  { dimension: 'Speed', team_a: 85, team_b: 68 },
  { dimension: 'Quality', team_a: 72, team_b: 82 },
  { dimension: 'Testing', team_a: 90, team_b: 75 },
  { dimension: 'Delivery', team_a: 65, team_b: 88 },
  { dimension: 'Docs', team_a: 78, team_b: 60 },
  { dimension: 'Collab', team_a: 82, team_b: 70 },
];

const heatmapData: { day: string; hour: string; activity: number }[] = [];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'];
for (const day of days) {
  for (const hour of hours) {
    heatmapData.push({ day, hour, activity: Math.round(Math.random() * 95 + 5) });
  }
}

const histogramRaw = Array.from({ length: 200 }, () => ({
  label: 'pt',
  score: Math.round((Math.random() * 60 + 40) * 10) / 10,
}));

const sparklineData = [12, 14, 11, 17, 15, 19, 16, 21, 18, 24, 22, 28];

const radialBarData = [
  { label: 'React', stars: 210 },
  { label: 'Vue', stars: 195 },
  { label: 'Angular', stars: 140 },
  { label: 'Svelte', stars: 170 },
  { label: 'Solid', stars: 120 },
];

const polarAreaData = [
  { label: 'CSS', hours: 42 },
  { label: 'TS', hours: 68 },
  { label: 'React', hours: 55 },
  { label: 'Node', hours: 38 },
  { label: 'SQL', hours: 25 },
  { label: 'Go', hours: 18 },
];

// ── Styles ─────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 12,
  padding: 24,
  backdropFilter: 'blur(12px)',
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#94A3B8',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  marginBottom: 6,
};

const titleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: '#F1F5F9',
  marginBottom: 16,
};

const sectionHeader: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: '#818CF8',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  marginBottom: 20,
  marginTop: 48,
  paddingBottom: 8,
  borderBottom: '1px solid rgba(129, 140, 248, 0.2)',
};

// ── App ────────────────────────────────────────

export function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0F172A 0%, #1E1B4B 40%, #0F172A 100%)',
        color: '#E2E8F0',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #818CF8, #F472B6, #2DD4BF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 8,
            }}
          >
            VisKit
          </h1>
          <p style={{ fontSize: 16, color: '#94A3B8', maxWidth: 600 }}>
            A composable React data visualization library — 19 chart series across cartesian, radial,
            and specialized categories. Hover over any element to explore.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#64748B' }}>Sparkline preview:</span>
            <Sparkline data={sparklineData} color="#818CF8" width={140} height={28} />
            <Sparkline data={sparklineData.map((v) => v * 1.3 + 5)} color="#2DD4BF" width={140} height={28} />
            <Sparkline data={sparklineData.slice().reverse()} color="#F472B6" width={140} height={28} />
          </div>
        </header>

        {/* ═══════════════════════════════════════ */}
        {/* PHASE 1 — CORE SERIES                  */}
        {/* ═══════════════════════════════════════ */}
        <p style={sectionHeader}>Phase 1 — Core Series</p>

        {/* Row 1: Line + Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <section style={cardStyle}>
            <p style={labelStyle}>Revenue Trends</p>
            <p style={titleStyle}>Multi-Series Line Chart</p>
            <Chart data={monthlyMetrics} height={300} title="Revenue vs Cost vs Profit">
              <CartesianGrid />
              <XAxis format="compact" />
              <YAxis format="compact" />
              <LineSeries field="revenue" curve="monotone" color="#818CF8" dots dotRadius={3} />
              <LineSeries field="cost" curve="monotone" color="#FB7185" strokeDasharray="6 3" />
              <LineSeries field="target" curve="step" color="rgba(250, 204, 21, 0.4)" strokeWidth={1} />
              <Tooltip />
            </Chart>
          </section>

          <section style={cardStyle}>
            <p style={labelStyle}>Traffic Sources</p>
            <p style={titleStyle}>Gradient Bar Chart</p>
            <Chart data={trafficSources} height={300} title="Sessions by Source">
              <CartesianGrid />
              <XAxis />
              <YAxis format="compact" />
              <BarSeries field="sessions" color="#2DD4BF" />
              <Tooltip />
            </Chart>
          </section>
        </div>

        {/* Row 2: Area + Scatter */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <section style={cardStyle}>
            <p style={labelStyle}>Growth Curve</p>
            <p style={titleStyle}>Area Chart — Revenue &amp; Profit</p>
            <Chart data={monthlyMetrics} height={300} title="Revenue & Profit Area">
              <CartesianGrid />
              <XAxis />
              <YAxis format="compact" />
              <AreaSeries field="revenue" curve="monotone" color="#818CF8" gradient opacity={0.25} />
              <AreaSeries field="profit" curve="monotone" color="#2DD4BF" gradient opacity={0.3} />
              <Tooltip />
            </Chart>
          </section>

          <section style={cardStyle}>
            <p style={labelStyle}>Ad Performance</p>
            <p style={titleStyle}>Scatter Plot</p>
            <Chart data={scatterData} height={300} title="Ad Spend vs Conversions">
              <ScatterSeries field="conversions" color="#FBBF24" radius={7} />
              <ScatterSeries field="spend" color="#A78BFA" radius={5} opacity={0.6} />
            </Chart>
          </section>
        </div>

        {/* Row 3: Pie + Donut */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <section style={cardStyle}>
            <p style={labelStyle}>Device Analytics</p>
            <p style={titleStyle}>Pie Chart</p>
            <Chart data={deviceShare} height={300} title="Device Distribution">
              <PieSeries field="value" nameField="label" outerRadius={0.75} cornerRadius={3} />
            </Chart>
          </section>

          <section style={cardStyle}>
            <p style={labelStyle}>Budget Breakdown</p>
            <p style={titleStyle}>Donut Chart</p>
            <Chart data={projectAllocation} height={300} title="Budget Allocation">
              <PieSeries field="value" nameField="label" innerRadius={0.55} outerRadius={0.8} padAngle={0.03} cornerRadius={4} />
            </Chart>
          </section>
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* PHASE 2 — BAR VARIANTS                 */}
        {/* ═══════════════════════════════════════ */}
        <p style={sectionHeader}>Phase 2 — Bar Variants</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <section style={cardStyle}>
            <p style={labelStyle}>Departmental Costs</p>
            <p style={titleStyle}>Stacked Bar Chart</p>
            <Chart data={monthlyMetrics} height={300} title="Revenue + Cost Stacked">
              <CartesianGrid />
              <XAxis />
              <YAxis format="compact" />
              <StackedBarSeries fields={['cost', 'profit']} colors={['#FB7185', '#2DD4BF']} />
              <Tooltip />
            </Chart>
          </section>

          <section style={cardStyle}>
            <p style={labelStyle}>Revenue vs Cost</p>
            <p style={titleStyle}>Grouped Bar Chart</p>
            <Chart data={monthlyMetrics} height={300} title="Revenue & Cost Side by Side">
              <CartesianGrid />
              <XAxis />
              <YAxis format="compact" />
              <GroupedBarSeries fields={['revenue', 'cost']} colors={['#818CF8', '#FB7185']} />
              <Tooltip />
            </Chart>
          </section>
        </div>

        <section style={{ ...cardStyle, marginBottom: 24 }}>
          <p style={labelStyle}>Sessions by Source</p>
          <p style={titleStyle}>Horizontal Bar Chart</p>
          <Chart data={trafficSources} height={280} title="Horizontal Sessions">
            <HorizontalBarSeries field="sessions" color="#A78BFA" />
          </Chart>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* PHASE 2 — LINE / AREA VARIANTS         */}
        {/* ═══════════════════════════════════════ */}
        <p style={sectionHeader}>Phase 2 — Line &amp; Area Variants</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <section style={cardStyle}>
            <p style={labelStyle}>Weekly Engagement</p>
            <p style={titleStyle}>Multi-Line Chart</p>
            <Chart data={weeklyEngagement} height={300} title="Multi-Line Engagement">
              <CartesianGrid />
              <XAxis />
              <YAxis format="compact" />
              <MultiLineSeries
                fields={['pageViews', 'sessions']}
                colors={['#818CF8', '#F472B6']}
                curve="monotone"
                dots
              />
              <Tooltip />
            </Chart>
          </section>

          <section style={cardStyle}>
            <p style={labelStyle}>Revenue Breakdown</p>
            <p style={titleStyle}>Stacked Area Chart</p>
            <Chart data={monthlyMetrics} height={300} title="Cost & Profit Stacked Area">
              <CartesianGrid />
              <XAxis />
              <YAxis format="compact" />
              <StackedAreaSeries
                fields={['cost', 'profit']}
                colors={['#FB7185', '#2DD4BF']}
                curve="monotone"
              />
              <Tooltip />
            </Chart>
          </section>
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* PHASE 2 — SPECIALTY CARTESIAN          */}
        {/* ═══════════════════════════════════════ */}
        <p style={sectionHeader}>Phase 2 — Specialty Cartesian</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <section style={cardStyle}>
            <p style={labelStyle}>Ad Spend</p>
            <p style={titleStyle}>Bubble Chart</p>
            <Chart data={scatterData} height={300} title="Spend vs Conversions (size=CPC)">
              <BubbleSeries field="conversions" sizeField="spend" color="#FBBF24" minRadius={6} maxRadius={24} />
            </Chart>
          </section>

          <section style={cardStyle}>
            <p style={labelStyle}>Bounce Rate</p>
            <p style={titleStyle}>Lollipop Chart</p>
            <Chart data={trafficSources} height={300} title="Bounce Rate by Source">
              <CartesianGrid />
              <XAxis />
              <YAxis />
              <LollipopSeries field="bounceRate" color="#22D3EE" dotRadius={6} />
              <Tooltip />
            </Chart>
          </section>
        </div>

        <section style={{ ...cardStyle, marginBottom: 24 }}>
          <p style={labelStyle}>Before vs After</p>
          <p style={titleStyle}>Dumbbell Chart — Score Comparison</p>
          <Chart data={dumbbellData} height={280} title="Before/After Score">
            <CartesianGrid />
            <XAxis />
            <YAxis />
            <DumbbellSeries
              fieldStart="before"
              fieldEnd="after"
              colorStart="#FB7185"
              colorEnd="#2DD4BF"
              dotRadius={6}
            />
            <Tooltip />
          </Chart>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* PHASE 2 — RADIAL CHARTS                */}
        {/* ═══════════════════════════════════════ */}
        <p style={sectionHeader}>Phase 2 — Radial Charts</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <section style={cardStyle}>
            <p style={labelStyle}>Team Comparison</p>
            <p style={titleStyle}>Radar Chart</p>
            <Chart data={radarMulti} height={340} title="Team A vs Team B">
              <RadarSeries
                dimensionField="dimension"
                valueFields={['team_a', 'team_b']}
                colors={['#818CF8', '#F472B6']}
                fillOpacity={0.15}
              />
            </Chart>
          </section>

          <section style={cardStyle}>
            <p style={labelStyle}>Framework Stars</p>
            <p style={titleStyle}>Radial Bar Chart</p>
            <Chart data={radialBarData} height={340} title="GitHub Stars">
              <RadialBarSeries field="stars" nameField="label" />
            </Chart>
          </section>
        </div>

        <section style={{ ...cardStyle, marginBottom: 24 }}>
          <p style={labelStyle}>Time Invested</p>
          <p style={titleStyle}>Polar Area Chart — Hours by Technology</p>
          <Chart data={polarAreaData} height={360} title="Hours by Tech">
            <PolarAreaSeries field="hours" nameField="label" />
          </Chart>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* PHASE 2 — SPECIALIZED                  */}
        {/* ═══════════════════════════════════════ */}
        <p style={sectionHeader}>Phase 2 — Specialized</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <section style={cardStyle}>
            <p style={labelStyle}>Score Distribution</p>
            <p style={titleStyle}>Histogram</p>
            <Chart data={histogramRaw} height={300} title="Score Distribution">
              <HistogramSeries field="score" bins={15} color="#A78BFA" />
            </Chart>
          </section>

          <section style={cardStyle}>
            <p style={labelStyle}>Activity Pattern</p>
            <p style={titleStyle}>Heatmap</p>
            <Chart data={heatmapData} height={300} title="Weekly Activity">
              <Heatmap xField="hour" yField="day" valueField="activity" />
            </Chart>
          </section>
        </div>

        {/* Footer */}
        <footer
          style={{
            textAlign: 'center',
            color: '#475569',
            fontSize: 13,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 24,
            marginTop: 48,
          }}
        >
          VisKit — 19 Chart Series &middot; Phase 1 &amp; 2 Demo
        </footer>
      </div>
    </div>
  );
}
