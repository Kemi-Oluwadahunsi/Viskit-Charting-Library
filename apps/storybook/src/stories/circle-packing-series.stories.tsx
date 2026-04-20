import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { CirclePackingSeries } from '@viskit/charts';
import { hierarchyData, ChartWrapper } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { CirclePackingSeries } from '@viskit/charts';
 * ```
 *
 * Renders a circle-packing layout where nested circles represent hierarchical
 * data. Parent circles enclose children, sized proportionally by value.
 *
 * ### Props
 * - `field` — numeric field for circle area
 * - `nameField` — field for node labels
 * - `groupField` — field for grouping/coloring
 * - `padding` — spacing between sibling circles
 * - `opacity` — fill opacity
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={450}>
 *   <CirclePackingSeries field="value" nameField="name" groupField="group" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/CirclePackingSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    padding: { control: { type: 'range', min: 0, max: 20, step: 1 }, description: 'Spacing between circles' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Fill opacity' },
    height: { control: { type: 'range', min: 300, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { padding: number; opacity: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { padding: 4, opacity: 0.8, height: 450 },
  render: (args) => (
    <Chart data={hierarchyData} height={args.height}>
      <CirclePackingSeries field="value" nameField="name" groupField="group" padding={args.padding} opacity={args.opacity} />
    </Chart>
  ),
};

export const TightPacking: Story = {
  args: { padding: 1, opacity: 0.9, height: 450 },
  render: (args) => (
    <Chart data={hierarchyData} height={args.height}>
      <CirclePackingSeries field="value" nameField="name" groupField="group" padding={args.padding} opacity={args.opacity} />
    </Chart>
  ),
};

export const LoosePacking: Story = {
  args: { padding: 12, opacity: 0.65, height: 500 },
  render: (args) => (
    <Chart data={hierarchyData} height={args.height}>
      <CirclePackingSeries field="value" nameField="name" groupField="group" padding={args.padding} opacity={args.opacity} />
    </Chart>
  ),
};

export const Compact: Story = {
  args: { padding: 2, opacity: 1, height: 350 },
  render: (args) => (
    <Chart data={hierarchyData} height={args.height}>
      <CirclePackingSeries field="value" nameField="name" groupField="group" padding={args.padding} opacity={args.opacity} />
    </Chart>
  ),
};
