import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { PieSeries, Tooltip, Legend } from '@kodemaven/viskit-charts';
import type { TooltipVariant } from '@kodemaven/viskit-charts';
import { pieData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { PieSeries, Tooltip } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders a pie or donut chart. Supports inner radius for donuts,
 * pad angle for segment spacing, corner radius, custom colors,
 * and interactive hover expansion.
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <PieSeries field="value" nameField="label" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 1/PieSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    innerRadius: { control: { type: 'range', min: 0, max: 0.85, step: 0.05 }, description: 'Donut hole size (0=full pie)' },
    padAngle: { control: { type: 'range', min: 0, max: 0.1, step: 0.005 }, description: 'Spacing between slices (radians)' },
    cornerRadius: { control: { type: 'range', min: 0, max: 12, step: 1 }, description: 'Slice corner radius' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Slice opacity' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 } },
    tooltipVariant: { control: 'select', options: ['default', 'minimal', 'compact', 'gradient', 'outline'] as TooltipVariant[], description: 'Tooltip style variant' },
  },
};
export default meta;

interface PieArgs {
  innerRadius: number;
  padAngle: number;
  cornerRadius: number;
  opacity: number;
  height: number;
  tooltipVariant: TooltipVariant;
}

type Story = StoryObj<PieArgs>;

export const Default: Story = {
  args: { innerRadius: 0, padAngle: 0.02, cornerRadius: 3, opacity: 0.9, height: 400, tooltipVariant: 'outline' },
  render: (args) => (
    <Chart data={pieData} height={args.height} title="Device Share" colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber, PALETTE.violet]}>
      <PieSeries
        field="value"
        nameField="label"
        innerRadius={args.innerRadius}
        padAngle={args.padAngle}
        cornerRadius={args.cornerRadius}
        opacity={args.opacity}
      />
      <Tooltip variant={args.tooltipVariant} />
      <Legend items={[
        { key: 'Desktop', label: 'Desktop' },
        { key: 'Mobile', label: 'Mobile' },
        { key: 'Tablet', label: 'Tablet' },
        { key: 'Smart TV', label: 'Smart TV' },
        { key: 'Wearable', label: 'Wearable' },
      ]} />
    </Chart>
  ),
};

export const Donut: Story = {
  args: { innerRadius: 0.55, padAngle: 0.03, cornerRadius: 4, height: 400 },
  render: (args) => (
    <Chart data={pieData} height={args.height} title="Donut Chart">
      <PieSeries
        field="value"
        nameField="label"
        innerRadius={args.innerRadius}
        padAngle={args.padAngle}
        cornerRadius={args.cornerRadius}
      />
      <Tooltip />
    </Chart>
  ),
};

export const ThinDonut: Story = {
  render: () => (
    <Chart data={pieData} height={400} title="Thin Ring">
      <PieSeries field="value" nameField="label" innerRadius={0.75} padAngle={0.04} cornerRadius={6} />
      <Tooltip />
    </Chart>
  ),
};

export const NoPadding: Story = {
  render: () => (
    <Chart data={pieData} height={400} title="Tight Slices">
      <PieSeries field="value" nameField="label" padAngle={0} cornerRadius={0} />
    </Chart>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <Chart data={pieData} height={400} title="Custom Palette" colors={[PALETTE.cyan, PALETTE.amber, PALETTE.lime, PALETTE.rose, PALETTE.violet]}>
      <PieSeries field="value" nameField="label" innerRadius={0.3} />
      <Tooltip />
    </Chart>
  ),
};

export const LargeCornerRadius: Story = {
  render: () => (
    <Chart data={pieData} height={400} title="Rounded Slices">
      <PieSeries field="value" nameField="label" innerRadius={0.4} cornerRadius={10} padAngle={0.05} />
      <Tooltip />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[250, 400, 600].map((s) => (
        <div key={s} style={{ width: s, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{s}px</p>
          <Chart data={pieData} height={s} title={`${s}px`}>
            <PieSeries field="value" nameField="label" innerRadius={0.45} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
