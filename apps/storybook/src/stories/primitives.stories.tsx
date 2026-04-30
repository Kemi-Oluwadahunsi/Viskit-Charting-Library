import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import {
  LineSeries,
  BarSeries,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from '@kodemaven/viskit-charts';
import { monthlyMetrics, trafficSources, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { CartesianGrid, XAxis, YAxis, Legend, Tooltip, TooltipContent } from '@kodemaven/viskit-charts';
 * ```
 *
 * These are the building-block components that support chart axes,
 * grids, legends, and tooltips. They are composed together inside
 * a `<Chart>` along with series components.
 *
 * ### Available primitives
 * | Component | Purpose |
 * |---|---|
 * | `<XAxis>` | Category or value axis (bottom/top) |
 * | `<YAxis>` | Value axis (left/right) with formatting |
 * | `<CartesianGrid>` | Background grid lines |
 * | `<Legend>` | Series color legend |
 * | `<Tooltip>` | Hover tooltip container |
 * | `<TooltipContent>` | Custom tooltip content |
 */
const meta: Meta = {
  title: 'Primitives',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const XAxisDefault: Story = {
  name: 'XAxis — Default',
  render: () => (
    <Chart data={monthlyMetrics} height={300} title="XAxis">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LineSeries field="revenue" color={PALETTE.indigo} />
    </Chart>
  ),
};

export const YAxisCompact: Story = {
  name: 'YAxis — Compact Format',
  render: () => (
    <Chart data={monthlyMetrics} height={300} title="YAxis compact">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BarSeries field="revenue" color={PALETTE.teal} />
    </Chart>
  ),
};

export const YAxisCurrency: Story = {
  name: 'YAxis — Currency Format',
  render: () => (
    <Chart data={monthlyMetrics} height={300} title="YAxis currency"
      margin={{ left: 80, top: 16, right: 16, bottom: 44 }}>
      <CartesianGrid />
      <XAxis />
      <YAxis format="currency" />
      <BarSeries field="revenue" color={PALETTE.amber} />
    </Chart>
  ),
};

export const YAxisRight: Story = {
  name: 'YAxis — Right Position',
  render: () => (
    <Chart data={monthlyMetrics} height={300} title="Right Y Axis"
      margin={{ right: 60, top: 16, left: 16, bottom: 44 }}>
      <CartesianGrid />
      <XAxis />
      <YAxis position="right" format="compact" />
      <LineSeries field="profit" color={PALETTE.violet} />
    </Chart>
  ),
};

export const CartesianGridDefault: Story = {
  name: 'CartesianGrid — Default',
  render: () => (
    <Chart data={monthlyMetrics} height={300} title="Grid">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LineSeries field="revenue" color={PALETTE.indigo} />
    </Chart>
  ),
};

export const LegendDefault: Story = {
  name: 'Legend — Multi-Series',
  render: () => (
    <Chart data={monthlyMetrics} height={320} title="With Legend">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LineSeries field="revenue" color={PALETTE.indigo} />
      <LineSeries field="cost" color={PALETTE.pink} />
      <LineSeries field="profit" color={PALETTE.teal} />
      <Legend />
    </Chart>
  ),
};

export const TooltipOnBars: Story = {
  name: 'Tooltip — Default',
  render: () => (
    <Chart data={trafficSources} height={300} title="Default Tooltip">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BarSeries field="sessions" color={PALETTE.blue} />
      <Tooltip />
    </Chart>
  ),
};

export const TooltipMinimal: Story = {
  name: 'Tooltip — Minimal',
  render: () => (
    <Chart data={monthlyMetrics} height={300} title="Minimal Tooltip">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LineSeries field="revenue" color={PALETTE.indigo} />
      <Tooltip variant="minimal" />
    </Chart>
  ),
};

export const TooltipCompact: Story = {
  name: 'Tooltip — Compact',
  render: () => (
    <Chart data={monthlyMetrics} height={300} title="Compact Tooltip">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LineSeries field="revenue" color={PALETTE.teal} />
      <LineSeries field="cost" color={PALETTE.pink} />
      <Tooltip variant="compact" />
    </Chart>
  ),
};

export const TooltipGradient: Story = {
  name: 'Tooltip — Gradient',
  render: () => (
    <Chart data={monthlyMetrics} height={300} title="Gradient Tooltip">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BarSeries field="revenue" color={PALETTE.violet} gradientFill />
      <Tooltip variant="gradient" />
    </Chart>
  ),
};

export const TooltipOutline: Story = {
  name: 'Tooltip — Outline',
  render: () => (
    <Chart data={monthlyMetrics} height={300} title="Outline Tooltip">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LineSeries field="revenue" color={PALETTE.indigo} />
      <LineSeries field="profit" color={PALETTE.teal} />
      <Tooltip variant="outline" />
    </Chart>
  ),
};

export const TooltipCustom: Story = {
  name: 'Tooltip — Custom Render',
  render: () => (
    <Chart data={monthlyMetrics} height={300} title="Custom Tooltip">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BarSeries field="revenue" color={PALETTE.indigo} />
      <Tooltip
        renderContent={(items, label) => (
          <div style={{ background: '#1E293B', padding: '8px 12px', borderRadius: 8, color: '#E2E8F0', fontSize: 12, fontFamily: 'system-ui' }}>
            <strong>{label}</strong>
            {items.map((item, i) => (
              <div key={i} style={{ marginTop: 4 }}>
                <span style={{ color: item.color }}>●</span> {item.label}: {item.formattedValue}
              </div>
            ))}
          </div>
        )}
      />
    </Chart>
  ),
};

export const FullComposition: Story = {
  name: 'Full Composition',
  render: () => (
    <Chart data={monthlyMetrics} height={400} title="All Primitives Together">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LineSeries field="revenue" color={PALETTE.indigo} strokeWidth={2.5} />
      <LineSeries field="cost" color={PALETTE.pink} strokeWidth={2} />
      <LineSeries field="target" color={PALETTE.amber} curve="step" strokeWidth={1.5} />
      <Legend />
      <Tooltip />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <Chart data={monthlyMetrics} height={200} title={`${w}px`}>
            <CartesianGrid />
            <XAxis />
            <YAxis format="compact" />
            <LineSeries field="revenue" color={PALETTE.indigo} />
            <LineSeries field="cost" color={PALETTE.pink} />
            <Legend />
            <Tooltip />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
