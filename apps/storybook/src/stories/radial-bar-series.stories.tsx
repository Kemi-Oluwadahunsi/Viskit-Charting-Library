import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { RadialBarSeries } from '@viskit/charts';
import { radialBarData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { RadialBarSeries } from '@viskit/charts';
 * ```
 *
 * Renders concentric arcs where each data point is a ring.
 * Arc angle is proportional to value. Great for ranking displays.
 *
 * ### Props
 * - `field` — numeric field for arc angle
 * - `nameField` — optional string field for labels
 * - `maxAngle` — full sweep in radians (default 2π)
 * - `innerRadius` — inner radius ratio (0–1)
 * - `color` — optional uniform color (otherwise categorical)
 * - `cornerRadius` — arc corner radius
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <RadialBarSeries field="stars" nameField="label" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/RadialBarSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    innerRadius: { control: { type: 'range', min: 0, max: 0.7, step: 0.05 }, description: 'Inner ring ratio' },
    maxAngle: { control: { type: 'range', min: Math.PI / 2, max: 2 * Math.PI, step: 0.1 }, description: 'Max sweep (radians)' },
    cornerRadius: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Arc corner radius' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    height: { control: { type: 'range', min: 250, max: 600, step: 10 } },
  },
};
export default meta;

interface RadialBarArgs {
  innerRadius: number;
  maxAngle: number;
  cornerRadius: number;
  opacity: number;
  height: number;
}

type Story = StoryObj<RadialBarArgs>;

export const Default: Story = {
  args: { innerRadius: 0.3, maxAngle: 2 * Math.PI, cornerRadius: 3, opacity: 0.85, height: 400 },
  render: (args) => (
    <Chart data={radialBarData} height={args.height} title="Framework Stars">
      <RadialBarSeries
        field="stars"
        nameField="label"
        innerRadius={args.innerRadius}
        maxAngle={args.maxAngle}
        cornerRadius={args.cornerRadius}
        opacity={args.opacity}
      />
    </Chart>
  ),
};

export const HalfCircle: Story = {
  render: () => (
    <Chart data={radialBarData} height={400} title="Half Circle">
      <RadialBarSeries field="stars" nameField="label" maxAngle={Math.PI} />
    </Chart>
  ),
};

export const ThreeQuarter: Story = {
  render: () => (
    <Chart data={radialBarData} height={400} title="Three Quarter">
      <RadialBarSeries field="stars" nameField="label" maxAngle={1.5 * Math.PI} innerRadius={0.2} />
    </Chart>
  ),
};

export const ThinRings: Story = {
  render: () => (
    <Chart data={radialBarData} height={400} title="Thin Rings">
      <RadialBarSeries field="stars" nameField="label" innerRadius={0.6} cornerRadius={6} />
    </Chart>
  ),
};

export const UniformColor: Story = {
  render: () => (
    <Chart data={radialBarData} height={400} title="Single Color">
      <RadialBarSeries field="stars" nameField="label" color={PALETTE.indigo} />
    </Chart>
  ),
};

export const RoundedCorners: Story = {
  args: { cornerRadius: 8 },
  render: (args) => (
    <Chart data={radialBarData} height={400} title="Rounded">
      <RadialBarSeries field="stars" nameField="label" cornerRadius={args.cornerRadius} />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[250, 400, 600].map((s) => (
        <div key={s} style={{ width: s, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{s}px</p>
          <Chart data={radialBarData} height={s} title={`${s}px`}>
            <RadialBarSeries field="stars" nameField="label" />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
