import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { IcicleSeries, Legend } from '@kodemaven/viskit-charts';
import { hierarchyData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { IcicleSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders an icicle diagram — a horizontal partition layout where depth flows
 * left-to-right and each rectangle's width represents its value proportion.
 *
 * ### Props
 * - `field` — numeric field for rectangle width
 * - `nameField` — field for node labels
 * - `groupField` — field for grouping/coloring
 * - `padding` — spacing between rectangles
 * - `radius` — corner radius
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <IcicleSeries field="value" nameField="name" groupField="group" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/IcicleSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    padding: { control: { type: 'range', min: 0, max: 6, step: 1 }, description: 'Spacing between rectangles' },
    radius: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Corner radius' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { padding: number; radius: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { padding: 2, radius: 3, height: 400 },
  render: (args) => (
    <Chart data={hierarchyData} height={args.height} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber, PALETTE.violet, PALETTE.cyan, PALETTE.orange, PALETTE.green]}>
      <IcicleSeries field="value" nameField="name" groupField="group" padding={args.padding} radius={args.radius} />
      <Legend items={[
        { key: 'Frontend', label: 'Frontend' },
        { key: 'Backend', label: 'Backend' },
        { key: 'Data', label: 'Data' },
      ]} />
    </Chart>
  ),
};

export const NoPadding: Story = {
  args: { padding: 0, radius: 0, height: 400 },
  render: (args) => (
    <Chart data={hierarchyData} height={args.height}>
      <IcicleSeries field="value" nameField="name" groupField="group" padding={args.padding} radius={args.radius} />
    </Chart>
  ),
};

export const Rounded: Story = {
  args: { padding: 3, radius: 8, height: 400 },
  render: (args) => (
    <Chart data={hierarchyData} height={args.height}>
      <IcicleSeries field="value" nameField="name" groupField="group" padding={args.padding} radius={args.radius} />
    </Chart>
  ),
};

export const Tall: Story = {
  args: { padding: 2, radius: 4, height: 550 },
  render: (args) => (
    <Chart data={hierarchyData} height={args.height}>
      <IcicleSeries field="value" nameField="name" groupField="group" padding={args.padding} radius={args.radius} />
    </Chart>
  ),
};
