import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { SunburstSeries } from '@viskit/charts';
import { hierarchyData, ChartWrapper } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { SunburstSeries } from '@viskit/charts';
 * ```
 *
 * Renders a sunburst (radial treemap) where hierarchical data fans outward
 * from the center. Each ring represents a depth level with arc segments
 * sized by value.
 *
 * ### Props
 * - `field` — numeric field for arc angle
 * - `nameField` — field for segment labels
 * - `groupField` — field for grouping/coloring
 * - `innerRadius` — ratio for center hole (0 = filled, 0.5 = half)
 * - `padAngle` — angular gap between arcs
 * - `cornerRadius` — rounded corners on arcs
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={450}>
 *   <SunburstSeries field="value" nameField="name" groupField="group" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/SunburstSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    innerRadius: { control: { type: 'range', min: 0, max: 0.5, step: 0.05 }, description: 'Center hole ratio' },
    padAngle: { control: { type: 'range', min: 0, max: 0.05, step: 0.005 }, description: 'Gap between arcs' },
    cornerRadius: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Rounded arc corners' },
    height: { control: { type: 'range', min: 300, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { innerRadius: number; padAngle: number; cornerRadius: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { innerRadius: 0.15, padAngle: 0.01, cornerRadius: 3, height: 450 },
  render: (args) => (
    <Chart data={hierarchyData} height={args.height}>
      <SunburstSeries field="value" nameField="name" groupField="group" innerRadius={args.innerRadius} padAngle={args.padAngle} cornerRadius={args.cornerRadius} />
    </Chart>
  ),
};

export const Donut: Story = {
  args: { innerRadius: 0.35, padAngle: 0.02, cornerRadius: 5, height: 450 },
  render: (args) => (
    <Chart data={hierarchyData} height={args.height}>
      <SunburstSeries field="value" nameField="name" groupField="group" innerRadius={args.innerRadius} padAngle={args.padAngle} cornerRadius={args.cornerRadius} />
    </Chart>
  ),
};
