import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { StackedBarSeries, CartesianGrid, XAxis, YAxis, Tooltip } from '@viskit/charts';
import type { TooltipVariant } from '@viskit/charts';
import { monthlyMetrics, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { StackedBarSeries, CartesianGrid, XAxis, YAxis, Tooltip } from '@viskit/charts';
 * ```
 *
 * Renders bars stacked vertically for multiple numeric fields.
 * Each field becomes a layer in the stack. Uses D3 stack layout
 * with gradient fills and hover interactions.
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={350}>
 *   <StackedBarSeries fields={['cost', 'profit']} colors={['#FB7185', '#2DD4BF']} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/StackedBarSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    height: { control: { type: 'range', min: 200, max: 600, step: 10 } },
    radius: { control: { type: 'range', min: 0, max: 12, step: 1 }, description: 'Bar corner radius' },
    tooltipVariant: { control: 'select', options: ['default', 'minimal', 'compact', 'gradient', 'outline'] as TooltipVariant[], description: 'Tooltip style variant' },
  },
};
export default meta;

interface StackedBarArgs {
  height: number;
  radius: number;
  tooltipVariant: TooltipVariant;
}

type Story = StoryObj<StackedBarArgs>;

export const Default: Story = {
  args: { height: 350, radius: 4, tooltipVariant: 'compact' },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="Cost + Profit Stack">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <StackedBarSeries fields={['cost', 'profit']} colors={[PALETTE.pink, PALETTE.teal]} />
      <Tooltip variant={args.tooltipVariant} />
    </Chart>
  ),
};

export const ThreeFields: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={400} title="Three-Layer Stack">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <StackedBarSeries fields={['cost', 'profit', 'users']} colors={[PALETTE.pink, PALETTE.teal, PALETTE.amber]} />
      <Tooltip />
    </Chart>
  ),
};

export const CustomPalette: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={350} title="Custom Colors">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <StackedBarSeries fields={['cost', 'profit']} colors={[PALETTE.cyan, PALETTE.violet]} />
      <Tooltip />
    </Chart>
  ),
};

export const AllNumericFields: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={450} title="All Fields Stacked">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <StackedBarSeries
        fields={['cost', 'profit', 'users', 'target']}
        colors={[PALETTE.pink, PALETTE.teal, PALETTE.amber, PALETTE.blue]}
      />
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
          <Chart data={monthlyMetrics} height={220} title={`${w}px`}>
            <CartesianGrid />
            <XAxis />
            <YAxis format="compact" />
            <StackedBarSeries fields={['cost', 'profit']} colors={[PALETTE.pink, PALETTE.teal]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
