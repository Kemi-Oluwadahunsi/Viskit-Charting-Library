import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { ParallelCoordinatesSeries, Legend } from '@kodemaven/viskit-charts';
import { parallelData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { ParallelCoordinatesSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Multi-axis comparison chart where each datum is a polyline
 * crossing parallel vertical axes. Great for comparing items
 * across many dimensions simultaneously.
 *
 * ### Props
 * - `fields` — array of numeric field keys to use as axes
 * - `colorField` — optional categorical field for line coloring
 * - `strokeWidth` — line thickness
 * - `opacity` — line opacity
 * - `tickCount` — number of ticks per axis
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <ParallelCoordinatesSeries
 *     fields={['speed', 'reliability', 'cost', 'latency']}
 *     colorField="name"
 *   />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 4/ParallelCoordinatesSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    strokeWidth: { control: { type: 'range', min: 1, max: 5, step: 0.5 }, description: 'Line thickness' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Line opacity' },
    tickCount: { control: { type: 'range', min: 3, max: 10, step: 1 }, description: 'Ticks per axis' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { strokeWidth: number; opacity: number; tickCount: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { strokeWidth: 1.5, opacity: 0.7, tickCount: 5, height: 400 },
  render: (args) => (
    <Chart data={parallelData} height={args.height} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber, PALETTE.violet, PALETTE.orange]}>
      <ParallelCoordinatesSeries
        fields={['speed', 'reliability', 'cost', 'latency', 'uptime']}
        colorField="name"
        strokeWidth={args.strokeWidth}
        opacity={args.opacity}
        tickCount={args.tickCount}
      />
      <Legend items={[
        { key: 'Alpha', label: 'Alpha', color: PALETTE.indigo },
        { key: 'Beta', label: 'Beta', color: PALETTE.pink },
        { key: 'Gamma', label: 'Gamma', color: PALETTE.teal },
        { key: 'Delta', label: 'Delta', color: PALETTE.amber },
        { key: 'Epsilon', label: 'Epsilon', color: PALETTE.violet },
        { key: 'Zeta', label: 'Zeta', color: PALETTE.orange },
      ]} />
    </Chart>
  ),
};

export const BoldLines: Story = {
  args: { strokeWidth: 3, opacity: 0.9, tickCount: 5, height: 400 },
  render: (args) => (
    <Chart data={parallelData} height={args.height} colors={[PALETTE.blue, PALETTE.red, PALETTE.green, PALETTE.rose, PALETTE.cyan, PALETTE.lime]}>
      <ParallelCoordinatesSeries
        fields={['speed', 'reliability', 'cost', 'latency', 'uptime']}
        colorField="name"
        strokeWidth={args.strokeWidth}
        opacity={args.opacity}
        tickCount={args.tickCount}
      />
      <Legend items={[
        { key: 'Alpha', label: 'Alpha', color: PALETTE.blue },
        { key: 'Beta', label: 'Beta', color: PALETTE.red },
        { key: 'Gamma', label: 'Gamma', color: PALETTE.green },
        { key: 'Delta', label: 'Delta', color: PALETTE.rose },
        { key: 'Epsilon', label: 'Epsilon', color: PALETTE.cyan },
        { key: 'Zeta', label: 'Zeta', color: PALETTE.lime },
      ]} />
    </Chart>
  ),
};

export const ThreeAxes: Story = {
  args: { strokeWidth: 2, opacity: 0.7, tickCount: 4, height: 350 },
  render: (args) => (
    <Chart data={parallelData} height={args.height} colors={[PALETTE.violet, PALETTE.orange, PALETTE.teal, PALETTE.pink, PALETTE.blue, PALETTE.amber]}>
      <ParallelCoordinatesSeries
        fields={['speed', 'cost', 'uptime']}
        colorField="name"
        strokeWidth={args.strokeWidth}
        opacity={args.opacity}
        tickCount={args.tickCount}
      />
      <Legend items={[
        { key: 'Alpha', label: 'Alpha', color: PALETTE.violet },
        { key: 'Beta', label: 'Beta', color: PALETTE.orange },
        { key: 'Gamma', label: 'Gamma', color: PALETTE.teal },
        { key: 'Delta', label: 'Delta', color: PALETTE.pink },
        { key: 'Epsilon', label: 'Epsilon', color: PALETTE.blue },
        { key: 'Zeta', label: 'Zeta', color: PALETTE.amber },
      ]} />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <Chart data={parallelData} height={w < 500 ? 280 : 400} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber, PALETTE.violet, PALETTE.orange]}>
            <ParallelCoordinatesSeries fields={['speed', 'reliability', 'cost', 'latency', 'uptime']} colorField="name" />
            <Legend items={[
              { key: 'Alpha', label: 'Alpha', color: PALETTE.indigo },
              { key: 'Beta', label: 'Beta', color: PALETTE.pink },
              { key: 'Gamma', label: 'Gamma', color: PALETTE.teal },
              { key: 'Delta', label: 'Delta', color: PALETTE.amber },
              { key: 'Epsilon', label: 'Epsilon', color: PALETTE.violet },
              { key: 'Zeta', label: 'Zeta', color: PALETTE.orange },
            ]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
