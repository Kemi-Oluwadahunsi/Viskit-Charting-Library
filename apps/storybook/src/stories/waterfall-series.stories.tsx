import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { WaterfallSeries } from '@viskit/charts';
import { waterfallData, ChartWrapper } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { WaterfallSeries } from '@viskit/charts';
 * ```
 *
 * Renders a waterfall chart showing how an initial value is affected by
 * sequential positive and negative changes. Floating bars connect with
 * optional connector lines to visualize running totals.
 *
 * ### Props
 * - `field` — numeric field for change amount
 * - `totalField` — boolean field marking summary bars
 * - `radius` — corner radius of bars
 * - `connectors` — show connector lines between bars
 * - `positiveColor` — color for increases
 * - `negativeColor` — color for decreases
 * - `totalColor` — color for summary/total bars
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <WaterfallSeries field="amount" totalField="total" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/WaterfallSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    radius: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Bar corner radius' },
    connectors: { control: 'boolean', description: 'Show connector lines' },
    positiveColor: { control: 'color', description: 'Color for increases' },
    negativeColor: { control: 'color', description: 'Color for decreases' },
    totalColor: { control: 'color', description: 'Color for total bars' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { radius: number; connectors: boolean; positiveColor: string; negativeColor: string; totalColor: string; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { radius: 3, connectors: true, positiveColor: '#22c55e', negativeColor: '#ef4444', totalColor: '#6366f1', height: 400 },
  render: (args) => (
    <Chart data={waterfallData} height={args.height}>
      <WaterfallSeries
        field="amount"
        totalField="total"
        radius={args.radius}
        connectors={args.connectors}
        positiveColor={args.positiveColor}
        negativeColor={args.negativeColor}
        totalColor={args.totalColor}
      />
    </Chart>
  ),
};

export const NoConnectors: Story = {
  args: { radius: 3, connectors: false, positiveColor: '#22c55e', negativeColor: '#ef4444', totalColor: '#6366f1', height: 400 },
  render: (args) => (
    <Chart data={waterfallData} height={args.height}>
      <WaterfallSeries field="amount" totalField="total" radius={args.radius} connectors={args.connectors} positiveColor={args.positiveColor} negativeColor={args.negativeColor} totalColor={args.totalColor} />
    </Chart>
  ),
};

export const SquareBars: Story = {
  args: { radius: 0, connectors: true, positiveColor: '#22c55e', negativeColor: '#ef4444', totalColor: '#6366f1', height: 400 },
  render: (args) => (
    <Chart data={waterfallData} height={args.height}>
      <WaterfallSeries field="amount" totalField="total" radius={args.radius} connectors={args.connectors} positiveColor={args.positiveColor} negativeColor={args.negativeColor} totalColor={args.totalColor} />
    </Chart>
  ),
};

export const CustomPalette: Story = {
  args: { radius: 6, connectors: true, positiveColor: '#818CF8', negativeColor: '#FB7185', totalColor: '#2DD4BF', height: 400 },
  render: (args) => (
    <Chart data={waterfallData} height={args.height}>
      <WaterfallSeries field="amount" totalField="total" radius={args.radius} connectors={args.connectors} positiveColor={args.positiveColor} negativeColor={args.negativeColor} totalColor={args.totalColor} />
    </Chart>
  ),
};
