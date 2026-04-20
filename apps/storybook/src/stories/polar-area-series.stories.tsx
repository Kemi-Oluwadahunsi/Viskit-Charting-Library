import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { PolarAreaSeries } from '@viskit/charts';
import { polarAreaData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { PolarAreaSeries } from '@viskit/charts';
 * ```
 *
 * Renders equal-angle sectors where the radius is proportional to
 * the value. Combines pie-chart angles with bar-chart magnitude.
 *
 * ### Props
 * - `field` — numeric field controlling sector radius
 * - `nameField` — optional string field for labels
 * - `innerRadius` — inner radius ratio (0 = full, >0 = donut-like)
 * - `cornerRadius` — sector corner radius
 * - `opacity` — fill opacity
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <PolarAreaSeries field="hours" nameField="label" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/PolarAreaSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    innerRadius: { control: { type: 'range', min: 0, max: 0.5, step: 0.05 }, description: 'Inner radius ratio' },
    cornerRadius: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Sector corner radius' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    height: { control: { type: 'range', min: 250, max: 600, step: 10 } },
  },
};
export default meta;

interface PolarAreaArgs {
  innerRadius: number;
  cornerRadius: number;
  opacity: number;
  height: number;
}

type Story = StoryObj<PolarAreaArgs>;

export const Default: Story = {
  args: { innerRadius: 0, cornerRadius: 2, opacity: 0.85, height: 400 },
  render: (args) => (
    <Chart data={polarAreaData} height={args.height} title="Hours by Skill">
      <PolarAreaSeries
        field="hours"
        nameField="label"
        innerRadius={args.innerRadius}
        cornerRadius={args.cornerRadius}
        opacity={args.opacity}
      />
    </Chart>
  ),
};

export const WithInnerRadius: Story = {
  render: () => (
    <Chart data={polarAreaData} height={400} title="Donut-style Polar">
      <PolarAreaSeries field="hours" nameField="label" innerRadius={0.3} />
    </Chart>
  ),
};

export const HighCornerRadius: Story = {
  render: () => (
    <Chart data={polarAreaData} height={400} title="Rounded Sectors">
      <PolarAreaSeries field="hours" nameField="label" cornerRadius={8} />
    </Chart>
  ),
};

export const LowOpacity: Story = {
  args: { opacity: 0.4 },
  render: (args) => (
    <Chart data={polarAreaData} height={400} title="Transparent">
      <PolarAreaSeries field="hours" nameField="label" opacity={args.opacity} />
    </Chart>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <Chart data={polarAreaData} height={400} title="Custom Palette"
      colors={[PALETTE.cyan, PALETTE.amber, PALETTE.lime, PALETTE.rose, PALETTE.violet, PALETTE.orange]}>
      <PolarAreaSeries field="hours" nameField="label" />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[250, 400, 600].map((s) => (
        <div key={s} style={{ width: s, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{s}px</p>
          <Chart data={polarAreaData} height={s} title={`${s}px`}>
            <PolarAreaSeries field="hours" nameField="label" />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
