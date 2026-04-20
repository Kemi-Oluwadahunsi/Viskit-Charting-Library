import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { GroupedBarSeries, CartesianGrid, XAxis, YAxis, Tooltip } from '@viskit/charts';
import type { TooltipVariant } from '@viskit/charts';
import { monthlyMetrics, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { GroupedBarSeries, CartesianGrid, XAxis, YAxis, Tooltip } from '@viskit/charts';
 * ```
 *
 * Renders side-by-side bars for multiple fields within each category.
 * Uses `scaleBand` sub-scale to position grouped bars.
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={350}>
 *   <GroupedBarSeries fields={['cost', 'profit']} colors={['#F472B6', '#34D399']} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/GroupedBarSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    height: { control: { type: 'range', min: 200, max: 600, step: 10 } },
    radius: { control: { type: 'range', min: 0, max: 12, step: 1 }, description: 'Corner radius' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    tooltipVariant: { control: 'select', options: ['default', 'minimal', 'compact', 'gradient', 'outline'] as TooltipVariant[], description: 'Tooltip style variant' },
  },
};
export default meta;

interface GroupedBarArgs {
  height: number;
  radius: number;
  opacity: number;
  tooltipVariant: TooltipVariant;
}

type Story = StoryObj<GroupedBarArgs>;

export const Default: Story = {
  args: { height: 350, radius: 4, opacity: 1, tooltipVariant: 'outline' },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="Grouped Bars">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <GroupedBarSeries fields={['cost', 'profit']} colors={[PALETTE.rose, PALETTE.green]} radius={args.radius} opacity={args.opacity} />
      <Tooltip variant={args.tooltipVariant} />
    </Chart>
  ),
};

export const ThreeFields: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={400} title="Three Groups">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <GroupedBarSeries fields={['cost', 'profit', 'users']} colors={[PALETTE.rose, PALETTE.green, PALETTE.blue]} />
      <Tooltip />
    </Chart>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={350} title="Custom Palette">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <GroupedBarSeries fields={['revenue', 'target']} colors={[PALETTE.cyan, PALETTE.amber]} />
      <Tooltip />
    </Chart>
  ),
};

export const HighRadius: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={350} title="Rounded Groups">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <GroupedBarSeries fields={['cost', 'profit']} colors={[PALETTE.violet, PALETTE.lime]} radius={10} />
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
            <GroupedBarSeries fields={['cost', 'profit']} colors={[PALETTE.rose, PALETTE.green]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
