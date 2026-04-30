import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { ScatterSeries, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from '@kodemaven/viskit-charts';
import type { TooltipVariant } from '@kodemaven/viskit-charts';
import { scatterData, monthlyMetrics, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { ScatterSeries, CartesianGrid, XAxis, YAxis, Tooltip } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders individual circles at each data point. Ideal for showing
 * distribution, correlation, and outliers. Supports custom colors,
 * radius, and hover effects.
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={300}>
 *   <ScatterSeries field="conversions" color="#818CF8" radius={5} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 1/ScatterSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    field: { control: 'select', options: ['conversions', 'spend', 'cpc'], description: 'Numeric field to plot' },
    color: { control: 'color', description: 'Dot color' },
    radius: { control: { type: 'range', min: 2, max: 15, step: 1 }, description: 'Dot radius' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Dot opacity' },
    height: { control: { type: 'range', min: 150, max: 600, step: 10 } },
    tooltipVariant: { control: 'select', options: ['default', 'minimal', 'compact', 'gradient', 'outline'] as TooltipVariant[], description: 'Tooltip style variant' },
  },
};
export default meta;

interface ScatterArgs {
  field: string;
  color: string;
  radius: number;
  opacity: number;
  height: number;
  tooltipVariant: TooltipVariant;
}

type Story = StoryObj<ScatterArgs>;

export const Default: Story = {
  args: { field: 'conversions', color: PALETTE.indigo, radius: 5, opacity: 0.8, height: 350, tooltipVariant: 'minimal' },
  render: (args) => (
    <Chart data={scatterData} height={args.height} title="Conversions">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <ScatterSeries field={args.field} color={args.color} radius={args.radius} opacity={args.opacity} />
      <Tooltip variant={args.tooltipVariant} />
      <Legend items={[{ key: args.field, label: 'Conversions', color: args.color }]} />
    </Chart>
  ),
};

export const DoubleField: Story = {
  render: () => (
    <Chart data={scatterData} height={400} title="Spend vs Conversions">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <ScatterSeries field="conversions" color={PALETTE.indigo} radius={6} />
      <ScatterSeries field="spend" color={PALETTE.pink} radius={4} opacity={0.6} />
      <Tooltip />
    </Chart>
  ),
};

export const LargeRadius: Story = {
  args: { radius: 12, color: PALETTE.teal, field: 'conversions', height: 350 },
  render: (args) => (
    <Chart data={scatterData} height={args.height} title="Large Dots">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <ScatterSeries field={args.field} color={args.color} radius={args.radius} />
      <Tooltip />
    </Chart>
  ),
};

export const MonthlyUsers: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={350} title="Monthly Users">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <ScatterSeries field="users" color={PALETTE.amber} radius={7} />
      <Tooltip />
    </Chart>
  ),
};

export const LowOpacity: Story = {
  args: { opacity: 0.3, radius: 8, color: PALETTE.rose, field: 'conversions', height: 350 },
  render: (args) => (
    <Chart data={scatterData} height={args.height} title="Faded Dots">
      <CartesianGrid />
      <XAxis />
      <ScatterSeries field={args.field} color={args.color} radius={args.radius} opacity={args.opacity} />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <Chart data={scatterData} height={200} title={`${w}px`}>
            <CartesianGrid />
            <XAxis />
            <YAxis format="compact" />
            <ScatterSeries field="conversions" color={PALETTE.indigo} radius={5} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
