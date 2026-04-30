import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { ChordDiagram, Legend } from '@kodemaven/viskit-charts';
import { chordLabels, chordMatrix, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { ChordDiagram } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders a chord diagram showing weighted bi-directional relationships
 * between groups arranged in a circle. Ribbons connect arcs to show flow
 * magnitude between each pair.
 *
 * ### Props
 * - `matrix` — square matrix of flow values between groups
 * - `labels` — array of group names matching matrix rows/columns
 * - `padAngle` — angular gap between outer arcs
 * - `ribbonOpacity` — opacity of inner ribbons
 *
 * ### Usage
 * ```tsx
 * <Chart data={[]} height={450}>
 *   <ChordDiagram matrix={matrix} labels={labels} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/ChordDiagram',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    padAngle: { control: { type: 'range', min: 0, max: 0.1, step: 0.005 }, description: 'Gap between outer arcs' },
    ribbonOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Inner ribbon opacity' },
    height: { control: { type: 'range', min: 300, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { padAngle: number; ribbonOpacity: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { padAngle: 0.04, ribbonOpacity: 0.6, height: 450 },
  render: (args) => (
    <Chart data={[]} height={args.height} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber, PALETTE.violet]}>
      <ChordDiagram matrix={chordMatrix} labels={chordLabels} padAngle={args.padAngle} ribbonOpacity={args.ribbonOpacity} />
      <Legend items={[
        { key: 'Eng', label: 'Engineering' },
        { key: 'Design', label: 'Design' },
        { key: 'PM', label: 'Product' },
        { key: 'QA', label: 'QA' },
        { key: 'DevOps', label: 'DevOps' },
      ]} />
    </Chart>
  ),
};

export const HighContrast: Story = {
  args: { padAngle: 0.06, ribbonOpacity: 0.85, height: 450 },
  render: (args) => (
    <Chart data={[]} height={args.height}>
      <ChordDiagram matrix={chordMatrix} labels={chordLabels} padAngle={args.padAngle} ribbonOpacity={args.ribbonOpacity} />
    </Chart>
  ),
};

export const Subtle: Story = {
  args: { padAngle: 0.02, ribbonOpacity: 0.3, height: 450 },
  render: (args) => (
    <Chart data={[]} height={args.height}>
      <ChordDiagram matrix={chordMatrix} labels={chordLabels} padAngle={args.padAngle} ribbonOpacity={args.ribbonOpacity} />
    </Chart>
  ),
};

export const Compact: Story = {
  args: { padAngle: 0.04, ribbonOpacity: 0.6, height: 320 },
  render: (args) => (
    <Chart data={[]} height={args.height}>
      <ChordDiagram matrix={chordMatrix} labels={chordLabels} padAngle={args.padAngle} ribbonOpacity={args.ribbonOpacity} />
    </Chart>
  ),
};
