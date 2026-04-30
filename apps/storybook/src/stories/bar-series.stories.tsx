import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { BarSeries, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from '@kodemaven/viskit-charts';
import type { TooltipVariant } from '@kodemaven/viskit-charts';
import { monthlyMetrics, trafficSources, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { BarSeries, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders vertical bars for each data point. Supports gradient fills,
 * rounded corners, custom colors, and hover interactions with glow effects.
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={300}>
 *   <BarSeries field="revenue" color="#818CF8" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 1/BarSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    field: { control: 'select', options: ['revenue', 'cost', 'profit', 'users'], description: 'Numeric field to plot' },
    color: { control: 'color', description: 'Bar fill color' },
    radius: { control: { type: 'range', min: 0, max: 20, step: 1 }, description: 'Corner radius in px' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Bar opacity' },
    gradientFill: { control: 'boolean', description: 'Enable gradient fill' },
    height: { control: { type: 'range', min: 150, max: 600, step: 10 }, description: 'Chart height' },
    tooltipVariant: { control: 'select', options: ['default', 'minimal', 'compact', 'gradient', 'outline'] as TooltipVariant[], description: 'Tooltip style variant' },
  },
};
export default meta;

interface BarArgs {
  field: string;
  color: string;
  radius: number;
  opacity: number;
  gradientFill: boolean;
  height: number;
  tooltipVariant: TooltipVariant;
}

type Story = StoryObj<BarArgs>;

export const Default: Story = {
  args: { field: 'revenue', color: PALETTE.indigo, radius: 4, opacity: 1, gradientFill: true, height: 350, tooltipVariant: 'compact' },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="Revenue Bars">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BarSeries field={args.field} color={args.color} radius={args.radius} opacity={args.opacity} gradientFill={args.gradientFill} />
      <Tooltip variant={args.tooltipVariant} />
      <Legend items={[{ key: args.field, label: 'Revenue', color: args.color }]} />
    </Chart>
  ),
};

export const FlatFill: Story = {
  args: { field: 'profit', color: PALETTE.teal, radius: 2, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="Flat (No Gradient)">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BarSeries field={args.field} color={args.color} radius={args.radius} gradientFill={false} />
      <Tooltip />
    </Chart>
  ),
};

export const HighRadius: Story = {
  args: { field: 'revenue', color: PALETTE.violet, radius: 14, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="Rounded Bars">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BarSeries field={args.field} color={args.color} radius={args.radius} />
      <Tooltip />
    </Chart>
  ),
};

export const MultiBars: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={400} title="Cost vs Profit">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BarSeries field="cost" color={PALETTE.pink} />
      <BarSeries field="profit" color={PALETTE.teal} opacity={0.7} />
      <Legend />
      <Tooltip />
    </Chart>
  ),
};

export const TrafficSources: Story = {
  render: () => (
    <Chart data={trafficSources} height={350} title="Sessions by Source">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BarSeries field="sessions" color={PALETTE.blue} />
      <Tooltip />
    </Chart>
  ),
};

export const LowOpacity: Story = {
  args: { opacity: 0.4, color: PALETTE.amber, field: 'revenue', height: 300 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="Semi-transparent">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BarSeries field={args.field} color={args.color} opacity={args.opacity} />
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
            <BarSeries field="revenue" color={PALETTE.indigo} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
