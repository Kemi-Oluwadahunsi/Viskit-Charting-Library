import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { TreemapSeries, Legend } from '@kodemaven/viskit-charts';
import { hierarchyData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { TreemapSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders a treemap layout where each node is a rectangle sized proportionally
 * to its value. Uses d3-hierarchy's treemap with configurable tiling algorithms.
 *
 * ### Props
 * - `field` — numeric field for rectangle area
 * - `nameField` — field for node labels
 * - `groupField` — field for grouping/coloring
 * - `tile` — tiling algorithm: `squarify`, `binary`, `slice`, `dice`
 * - `padding` — inner padding between cells
 * - `radius` — corner radius of rectangles
 * - `opacity` — fill opacity
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <TreemapSeries field="value" nameField="name" groupField="group" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/TreemapSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    tile: { control: 'select', options: ['squarify', 'binary', 'slice', 'dice'], description: 'Tiling algorithm' },
    padding: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Inner cell padding' },
    radius: { control: { type: 'range', min: 0, max: 12, step: 1 }, description: 'Corner radius' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Fill opacity' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { tile: string; padding: number; radius: number; opacity: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { tile: 'squarify', padding: 2, radius: 4, opacity: 0.9, height: 400 },
  render: (args) => (
    <Chart data={hierarchyData} height={args.height} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber, PALETTE.violet, PALETTE.cyan, PALETTE.orange, PALETTE.green]}>
      <TreemapSeries
        field="value"
        nameField="name"
        groupField="group"
        tile={args.tile as 'squarify'}
        padding={args.padding}
        radius={args.radius}
        opacity={args.opacity}
      />
      <Legend items={[
        { key: 'Frontend', label: 'Frontend' },
        { key: 'Backend', label: 'Backend' },
        { key: 'Data', label: 'Data' },
      ]} />
    </Chart>
  ),
};

export const BinaryTile: Story = {
  args: { tile: 'binary', padding: 3, radius: 2, opacity: 0.85, height: 400 },
  render: (args) => (
    <Chart data={hierarchyData} height={args.height}>
      <TreemapSeries field="value" nameField="name" groupField="group" tile="binary" padding={args.padding} radius={args.radius} opacity={args.opacity} />
    </Chart>
  ),
};
