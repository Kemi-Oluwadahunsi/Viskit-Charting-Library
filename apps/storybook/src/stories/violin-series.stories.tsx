import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { ViolinSeries } from '@viskit/charts';
import { violinData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { ViolinSeries } from '@viskit/charts';
 * ```
 *
 * Renders violin plots — mirrored kernel density estimations showing the
 * full distribution shape for each category. Combines the statistical detail
 * of a density plot with the compactness of a box plot.
 *
 * ### Props
 * - `field` — numeric value field
 * - `densityField` — pre-computed density array field
 * - `violinWidth` — maximum width ratio (0–1)
 * - `color` — fill color
 * - `opacity` — fill opacity
 * - `showMedian` — display median line
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <ViolinSeries field="value" densityField="density" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/ViolinSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    violinWidth: { control: { type: 'range', min: 0.2, max: 1, step: 0.05 }, description: 'Max violin width ratio' },
    color: { control: 'color', description: 'Fill color' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Fill opacity' },
    showMedian: { control: 'boolean', description: 'Display median line' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { violinWidth: number; color: string; opacity: number; showMedian: boolean; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { violinWidth: 0.7, color: PALETTE.violet, opacity: 0.7, showMedian: true, height: 400 },
  render: (args) => (
    <Chart data={violinData} height={args.height}>
      <ViolinSeries
        field="value"
        densityField="density"
        violinWidth={args.violinWidth}
        color={args.color}
        opacity={args.opacity}
        showMedian={args.showMedian}
      />
    </Chart>
  ),
};

export const WideViolins: Story = {
  args: { violinWidth: 1, color: PALETTE.teal, opacity: 0.6, showMedian: true, height: 400 },
  render: (args) => (
    <Chart data={violinData} height={args.height}>
      <ViolinSeries field="value" densityField="density" violinWidth={args.violinWidth} color={args.color} opacity={args.opacity} showMedian={args.showMedian} />
    </Chart>
  ),
};

export const NoMedian: Story = {
  args: { violinWidth: 0.7, color: PALETTE.pink, opacity: 0.75, showMedian: false, height: 400 },
  render: (args) => (
    <Chart data={violinData} height={args.height}>
      <ViolinSeries field="value" densityField="density" violinWidth={args.violinWidth} color={args.color} opacity={args.opacity} showMedian={args.showMedian} />
    </Chart>
  ),
};

export const SlimViolins: Story = {
  args: { violinWidth: 0.35, color: PALETTE.indigo, opacity: 0.85, showMedian: true, height: 400 },
  render: (args) => (
    <Chart data={violinData} height={args.height}>
      <ViolinSeries field="value" densityField="density" violinWidth={args.violinWidth} color={args.color} opacity={args.opacity} showMedian={args.showMedian} />
    </Chart>
  ),
};
