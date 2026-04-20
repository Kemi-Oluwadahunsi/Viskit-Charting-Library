import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { BubbleSeries, CartesianGrid, XAxis, YAxis, Tooltip } from '@viskit/charts';
import type { TooltipVariant } from '@viskit/charts';
import { scatterData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { BubbleSeries, CartesianGrid, XAxis, YAxis, Tooltip } from '@viskit/charts';
 * ```
 *
 * Renders circles positioned by category (X) and value (Y) with a
 * third dimension mapped to bubble radius. The `field` prop sets
 * the Y-axis value, `sizeField` controls radius scaling.
 *
 * ### Props
 * - `field` — numeric field for Y position
 * - `sizeField` — numeric field for bubble size
 * - `minRadius` / `maxRadius` — radius range
 * - `color` — bubble fill color
 * - `opacity` — bubble opacity
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={350}>
 *   <BubbleSeries field="conversions" sizeField="cpc" maxRadius={20} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/BubbleSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    field: { control: 'select', options: ['conversions', 'spend'], description: 'Y-axis numeric field' },
    sizeField: { control: 'select', options: ['cpc', 'spend', 'conversions'], description: 'Field for bubble radius' },
    color: { control: 'color', description: 'Bubble color' },
    minRadius: { control: { type: 'range', min: 2, max: 10, step: 1 }, description: 'Minimum bubble radius' },
    maxRadius: { control: { type: 'range', min: 8, max: 40, step: 1 }, description: 'Maximum bubble radius' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 } },
    tooltipVariant: { control: 'select', options: ['default', 'minimal', 'compact', 'gradient', 'outline'] as TooltipVariant[], description: 'Tooltip style variant' },
  },
};
export default meta;

interface BubbleArgs {
  field: string;
  sizeField: string;
  color: string;
  minRadius: number;
  maxRadius: number;
  opacity: number;
  height: number;
  tooltipVariant: TooltipVariant;
}

type Story = StoryObj<BubbleArgs>;

export const Default: Story = {
  args: { field: 'conversions', sizeField: 'cpc', color: PALETTE.indigo, minRadius: 4, maxRadius: 18, opacity: 0.7, height: 350, tooltipVariant: 'minimal' },
  render: (args) => (
    <Chart data={scatterData} height={args.height} title="Conversions Bubble">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BubbleSeries
        field={args.field}
        sizeField={args.sizeField}
        color={args.color}
        minRadius={args.minRadius}
        maxRadius={args.maxRadius}
        opacity={args.opacity}
      />
      <Tooltip variant={args.tooltipVariant} />
    </Chart>
  ),
};

export const SmallBubbles: Story = {
  args: { maxRadius: 10, minRadius: 3, color: PALETTE.teal },
  render: (args) => (
    <Chart data={scatterData} height={350} title="Small Bubbles">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BubbleSeries field="conversions" sizeField="cpc" color={args.color} minRadius={args.minRadius} maxRadius={args.maxRadius} />
      <Tooltip />
    </Chart>
  ),
};

export const LargeBubbles: Story = {
  args: { maxRadius: 35, color: PALETTE.orange },
  render: (args) => (
    <Chart data={scatterData} height={400} title="Large Bubbles">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BubbleSeries field="conversions" sizeField="cpc" color={args.color} maxRadius={args.maxRadius} />
      <Tooltip />
    </Chart>
  ),
};

export const SpendSized: Story = {
  render: () => (
    <Chart data={scatterData} height={350} title="Sized by Spend">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BubbleSeries field="conversions" sizeField="spend" color={PALETTE.pink} maxRadius={22} />
      <Tooltip />
    </Chart>
  ),
};

export const LowOpacity: Story = {
  args: { opacity: 0.35, color: PALETTE.violet },
  render: (args) => (
    <Chart data={scatterData} height={350} title="Transparent">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <BubbleSeries field="conversions" sizeField="cpc" color={args.color} opacity={args.opacity} maxRadius={20} />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[{ w: 350, r: 10 }, { w: 600, r: 16 }, { w: 900, r: 22 }].map(({ w, r }) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px (maxRadius={r})</p>
          <Chart data={scatterData} height={220} title={`${w}px`}>
            <CartesianGrid />
            <XAxis />
            <YAxis format="compact" />
            <BubbleSeries field="conversions" sizeField="cpc" color={PALETTE.indigo} maxRadius={r} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
