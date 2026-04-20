import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { StreamGraphSeries } from '@viskit/charts';
import { streamData, ChartWrapper } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { StreamGraphSeries } from '@viskit/charts';
 * ```
 *
 * Renders a stream graph (stacked area with wiggle offset) showing how
 * multiple categories flow and change magnitude over time. The organic,
 * river-like shape emphasizes relative proportions rather than absolute values.
 *
 * ### Props
 * - `fields` — array of numeric field names to stack
 * - `opacity` — fill opacity for all layers
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <StreamGraphSeries fields={['audio', 'video', 'text']} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/StreamGraphSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Layer fill opacity' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { opacity: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { opacity: 0.8, height: 400 },
  render: (args) => (
    <Chart data={streamData} height={args.height}>
      <StreamGraphSeries fields={['audio', 'video', 'text', 'image']} opacity={args.opacity} />
    </Chart>
  ),
};

export const Subtle: Story = {
  args: { opacity: 0.5, height: 400 },
  render: (args) => (
    <Chart data={streamData} height={args.height}>
      <StreamGraphSeries fields={['audio', 'video', 'text', 'image']} opacity={args.opacity} />
    </Chart>
  ),
};

export const TwoFields: Story = {
  args: { opacity: 0.8, height: 350 },
  render: (args) => (
    <Chart data={streamData} height={args.height}>
      <StreamGraphSeries fields={['audio', 'video']} opacity={args.opacity} />
    </Chart>
  ),
};

export const Tall: Story = {
  args: { opacity: 0.85, height: 550 },
  render: (args) => (
    <Chart data={streamData} height={args.height}>
      <StreamGraphSeries fields={['audio', 'video', 'text', 'image']} opacity={args.opacity} />
    </Chart>
  ),
};
