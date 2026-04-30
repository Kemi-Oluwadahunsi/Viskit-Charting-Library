import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { LollipopSeries, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from '@kodemaven/viskit-charts';
import type { TooltipVariant } from '@kodemaven/viskit-charts';
import { trafficSources, monthlyMetrics, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { LollipopSeries, CartesianGrid, XAxis, YAxis, Tooltip } from '@kodemaven/viskit-charts';
 * ```
 *
 * A hybrid of bar and scatter — renders a thin stick from baseline
 * to value with a dot at the tip. Clean and minimal.
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={350}>
 *   <LollipopSeries field="sessions" color="#A78BFA" dotRadius={5} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/LollipopSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    field: { control: 'select', options: ['sessions', 'bounceRate'], description: 'Numeric field' },
    color: { control: 'color', description: 'Stick and dot color' },
    dotRadius: { control: { type: 'range', min: 2, max: 12, step: 1 }, description: 'Dot radius' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 } },
    tooltipVariant: { control: 'select', options: ['default', 'minimal', 'compact', 'gradient', 'outline'] as TooltipVariant[], description: 'Tooltip style variant' },
  },
};
export default meta;

interface LollipopArgs {
  field: string;
  color: string;
  dotRadius: number;
  height: number;
  tooltipVariant: TooltipVariant;
}

type Story = StoryObj<LollipopArgs>;

export const Default: Story = {
  args: { field: 'sessions', color: PALETTE.violet, dotRadius: 5, height: 350, tooltipVariant: 'compact' },
  render: (args) => (
    <Chart data={trafficSources} height={args.height} title="Traffic Lollipop">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LollipopSeries field={args.field} color={args.color} dotRadius={args.dotRadius} />
      <Tooltip variant={args.tooltipVariant} />
      <Legend items={[{ key: args.field, label: 'Sessions', color: args.color }]} />
    </Chart>
  ),
};

export const LargeDots: Story = {
  args: { dotRadius: 10, color: PALETTE.orange },
  render: (args) => (
    <Chart data={trafficSources} height={350} title="Big Dots">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LollipopSeries field="sessions" color={args.color} dotRadius={args.dotRadius} />
      <Tooltip />
    </Chart>
  ),
};

export const RevenueData: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={350} title="Revenue Lollipop">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LollipopSeries field="revenue" color={PALETTE.indigo} dotRadius={6} />
      <Tooltip />
    </Chart>
  ),
};

export const BounceRate: Story = {
  render: () => (
    <Chart data={trafficSources} height={350} title="Bounce Rate">
      <CartesianGrid />
      <XAxis />
      <YAxis />
      <LollipopSeries field="bounceRate" color={PALETTE.pink} dotRadius={5} />
      <Tooltip />
    </Chart>
  ),
};

export const SmallDots: Story = {
  render: () => (
    <Chart data={trafficSources} height={350} title="Minimal Dots">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LollipopSeries field="sessions" color={PALETTE.teal} dotRadius={3} />
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
          <Chart data={trafficSources} height={200} title={`${w}px`}>
            <CartesianGrid />
            <XAxis />
            <LollipopSeries field="sessions" color={PALETTE.violet} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
