import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { StackedAreaSeries, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from '@kodemaven/viskit-charts';
import type { TooltipVariant } from '@kodemaven/viskit-charts';
import { monthlyMetrics, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { StackedAreaSeries, CartesianGrid, XAxis, YAxis, Tooltip } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders stacked filled areas using D3 stack layout. Each field
 * becomes a layer with its own color and gradient fill.
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={350}>
 *   <StackedAreaSeries fields={['cost', 'profit']} colors={['#FB7185', '#2DD4BF']} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/StackedAreaSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    height: { control: { type: 'range', min: 200, max: 600, step: 10 } },
    tooltipVariant: { control: 'select', options: ['default', 'minimal', 'compact', 'gradient', 'outline'] as TooltipVariant[], description: 'Tooltip style variant' },
  },
};
export default meta;

interface StackedAreaArgs {
  height: number;
  tooltipVariant: TooltipVariant;
}

type Story = StoryObj<StackedAreaArgs>;

export const Default: Story = {
  args: { height: 350, tooltipVariant: 'gradient' },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="Cost + Profit Stacked">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <StackedAreaSeries fields={['cost', 'profit']} colors={[PALETTE.pink, PALETTE.teal]} />
      <Tooltip variant={args.tooltipVariant} />
      <Legend items={[
        { key: 'cost', label: 'Cost', color: PALETTE.pink },
        { key: 'profit', label: 'Profit', color: PALETTE.teal },
      ]} />
    </Chart>
  ),
};

export const ThreeFields: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={400} title="Three Layers">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <StackedAreaSeries fields={['cost', 'profit', 'users']} colors={[PALETTE.pink, PALETTE.teal, PALETTE.amber]} />
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
      <StackedAreaSeries fields={['revenue', 'target']} colors={[PALETTE.violet, PALETTE.cyan]} />
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
            <StackedAreaSeries fields={['cost', 'profit']} colors={[PALETTE.pink, PALETTE.teal]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
