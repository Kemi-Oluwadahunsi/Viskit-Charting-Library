import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { HorizontalBarSeries, Tooltip, Legend } from '@kodemaven/viskit-charts';
import type { TooltipVariant } from '@kodemaven/viskit-charts';
import { trafficSources, radialBarData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { HorizontalBarSeries, Tooltip } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders horizontal bars with categories on the Y axis and values
 * extending along the X axis. Manages its own scales internally,
 * auto-detecting the label field from data.
 *
 * ### Props
 * - `field` — numeric field for bar length
 * - `labelField` — optional string field for Y-axis categories (auto-detected if omitted)
 * - `color` — bar fill color
 * - `radius` — corner radius
 * - `gradientFill` — enable gradient fill
 * - `barPadding` — padding between bars (0–1)
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={350}>
 *   <HorizontalBarSeries field="sessions" color="#818CF8" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/HorizontalBarSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    field: { control: 'select', options: ['sessions', 'bounceRate'], description: 'Numeric field for bar length' },
    color: { control: 'color', description: 'Bar color' },
    radius: { control: { type: 'range', min: 0, max: 16, step: 1 }, description: 'Corner radius' },
    gradientFill: { control: 'boolean', description: 'Gradient fill' },
    barPadding: { control: { type: 'range', min: 0, max: 0.6, step: 0.05 }, description: 'Padding between bars' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 } },
    tooltipVariant: { control: 'select', options: ['default', 'minimal', 'compact', 'gradient', 'outline'] as TooltipVariant[], description: 'Tooltip style variant' },
  },
};
export default meta;

interface HorizontalBarArgs {
  field: string;
  color: string;
  radius: number;
  gradientFill: boolean;
  barPadding: number;
  opacity: number;
  height: number;
  tooltipVariant: TooltipVariant;
}

type Story = StoryObj<HorizontalBarArgs>;

export const Default: Story = {
  args: { field: 'sessions', color: PALETTE.indigo, radius: 4, gradientFill: true, barPadding: 0.2, opacity: 1, height: 350, tooltipVariant: 'compact' },
  render: (args) => (
    <Chart data={trafficSources} height={args.height} title="Sessions by Source">
      <HorizontalBarSeries
        field={args.field}
        color={args.color}
        radius={args.radius}
        gradientFill={args.gradientFill}
        barPadding={args.barPadding}
        opacity={args.opacity}
      />
      <Tooltip variant={args.tooltipVariant} />
      <Legend items={[{ key: args.field, label: 'Sessions', color: args.color }]} />
    </Chart>
  ),
};

export const FlatFill: Story = {
  render: () => (
    <Chart data={trafficSources} height={350} title="No Gradient">
      <HorizontalBarSeries field="sessions" color={PALETTE.teal} gradientFill={false} />
      <Tooltip />
    </Chart>
  ),
};

export const BounceRate: Story = {
  render: () => (
    <Chart data={trafficSources} height={350} title="Bounce Rate">
      <HorizontalBarSeries field="bounceRate" color={PALETTE.pink} />
      <Tooltip />
    </Chart>
  ),
};

export const HighRadius: Story = {
  render: () => (
    <Chart data={trafficSources} height={350} title="Rounded Bars">
      <HorizontalBarSeries field="sessions" color={PALETTE.violet} radius={12} />
      <Tooltip />
    </Chart>
  ),
};

export const TightPadding: Story = {
  render: () => (
    <Chart data={trafficSources} height={350} title="Tight Bars">
      <HorizontalBarSeries field="sessions" color={PALETTE.amber} barPadding={0.05} />
    </Chart>
  ),
};

export const SmallDataset: Story = {
  render: () => (
    <Chart data={radialBarData} height={280} title="Framework Stars">
      <HorizontalBarSeries field="stars" color={PALETTE.blue} />
      <Tooltip />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <Chart data={trafficSources} height={220} title={`${w}px`}>
            <HorizontalBarSeries field="sessions" color={PALETTE.indigo} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
