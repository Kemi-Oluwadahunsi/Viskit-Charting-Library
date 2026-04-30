import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { DumbbellSeries, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from '@kodemaven/viskit-charts';
import type { TooltipVariant } from '@kodemaven/viskit-charts';
import { dumbbellData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { DumbbellSeries, CartesianGrid, XAxis, YAxis, Tooltip } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders paired dots connected by a line — perfect for before/after,
 * min/max, or range comparisons across categories.
 *
 * ### Props
 * - `fieldStart` / `fieldEnd` — the two numeric fields to compare
 * - `colorStart` / `colorEnd` — colors for each endpoint
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={350}>
 *   <DumbbellSeries fieldStart="before" fieldEnd="after"
 *     colorStart="#FB7185" colorEnd="#34D399" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/DumbbellSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    colorStart: { control: 'color', description: 'First endpoint color' },
    colorEnd: { control: 'color', description: 'Second endpoint color' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 } },
    tooltipVariant: { control: 'select', options: ['default', 'minimal', 'compact', 'gradient', 'outline'] as TooltipVariant[], description: 'Tooltip style variant' },
  },
};
export default meta;

interface DumbbellArgs {
  colorStart: string;
  colorEnd: string;
  height: number;
  tooltipVariant: TooltipVariant;
}

type Story = StoryObj<DumbbellArgs>;

export const Default: Story = {
  args: { colorStart: PALETTE.pink, colorEnd: PALETTE.green, height: 350, tooltipVariant: 'outline' },
  render: (args) => (
    <Chart data={dumbbellData} height={args.height} title="Before vs After">
      <CartesianGrid />
      <XAxis />
      <YAxis />
      <DumbbellSeries fieldStart="before" fieldEnd="after" colorStart={args.colorStart} colorEnd={args.colorEnd} />
      <Tooltip variant={args.tooltipVariant} />
      <Legend items={[
        { key: 'before', label: 'Before', color: args.colorStart },
        { key: 'after', label: 'After', color: args.colorEnd },
      ]} />
    </Chart>
  ),
};

export const CustomColors: Story = {
  args: { colorStart: PALETTE.amber, colorEnd: PALETTE.indigo },
  render: (args) => (
    <Chart data={dumbbellData} height={350} title="Custom Pair Colors">
      <CartesianGrid />
      <XAxis />
      <YAxis />
      <DumbbellSeries fieldStart="before" fieldEnd="after" colorStart={args.colorStart} colorEnd={args.colorEnd} />
      <Tooltip />
    </Chart>
  ),
};

export const WarmTones: Story = {
  render: () => (
    <Chart data={dumbbellData} height={350} title="Warm Palette">
      <CartesianGrid />
      <XAxis />
      <YAxis />
      <DumbbellSeries fieldStart="before" fieldEnd="after" colorStart={PALETTE.orange} colorEnd={PALETTE.red} />
      <Tooltip />
    </Chart>
  ),
};

export const CoolTones: Story = {
  render: () => (
    <Chart data={dumbbellData} height={350} title="Cool Palette">
      <CartesianGrid />
      <XAxis />
      <YAxis />
      <DumbbellSeries fieldStart="before" fieldEnd="after" colorStart={PALETTE.cyan} colorEnd={PALETTE.violet} />
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
          <Chart data={dumbbellData} height={200} title={`${w}px`}>
            <CartesianGrid />
            <XAxis />
            <DumbbellSeries fieldStart="before" fieldEnd="after" colorStart={PALETTE.pink} colorEnd={PALETTE.green} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
