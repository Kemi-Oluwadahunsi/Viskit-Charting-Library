import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { MultiLineSeries, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from '@kodemaven/viskit-charts';
import type { TooltipVariant } from '@kodemaven/viskit-charts';
import { monthlyMetrics, weeklyData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { MultiLineSeries, CartesianGrid, XAxis, YAxis, Tooltip } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders multiple lines from different numeric fields on the same
 * axes. Each field gets its own color and line. Supports hover-dim
 * effect where non-hovered lines fade to draw attention.
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={350}>
 *   <MultiLineSeries fields={['revenue', 'cost']} colors={['#818CF8', '#FB7185']} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/MultiLineSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    strokeWidth: { control: { type: 'range', min: 1, max: 5, step: 0.5 }, description: 'Line thickness' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 } },
    tooltipVariant: { control: 'select', options: ['default', 'minimal', 'compact', 'gradient', 'outline'] as TooltipVariant[], description: 'Tooltip style variant' },
  },
};
export default meta;

interface MultiLineArgs {
  strokeWidth: number;
  height: number;
  tooltipVariant: TooltipVariant;
}

type Story = StoryObj<MultiLineArgs>;

export const Default: Story = {
  args: { strokeWidth: 2, height: 350, tooltipVariant: 'gradient' },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="Revenue vs Cost vs Profit">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <MultiLineSeries fields={['revenue', 'cost', 'profit']} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal]} />
      <Tooltip variant={args.tooltipVariant} />
      <Legend items={[
        { key: 'revenue', label: 'Revenue', color: PALETTE.indigo },
        { key: 'cost', label: 'Cost', color: PALETTE.pink },
        { key: 'profit', label: 'Profit', color: PALETTE.teal },
      ]} />
    </Chart>
  ),
};

export const TwoLines: Story = {
  render: () => (
    <Chart data={weeklyData} height={350} title="Views vs Sessions">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <MultiLineSeries fields={['pageViews', 'sessions']} colors={[PALETTE.blue, PALETTE.amber]} />
      <Tooltip />
    </Chart>
  ),
};

export const RevenueVsTarget: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={350} title="Revenue vs Target">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <MultiLineSeries fields={['revenue', 'target']} colors={[PALETTE.indigo, PALETTE.orange]} />
      <Tooltip />
    </Chart>
  ),
};

export const FourLines: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={400} title="All Metrics">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <MultiLineSeries fields={['revenue', 'cost', 'profit', 'target']} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber]} />
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
            <MultiLineSeries fields={['revenue', 'cost']} colors={[PALETTE.indigo, PALETTE.pink]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
