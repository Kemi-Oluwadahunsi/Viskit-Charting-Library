import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { LineSeries, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from '@kodemaven/viskit-charts';
import type { TooltipVariant } from '@kodemaven/viskit-charts';
import { monthlyMetrics, weeklyData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { LineSeries, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders a single continuous line connecting data points. Supports multiple
 * curve types (monotone, linear, natural, basis, cardinal, step),
 * optional data dots, custom colors, and stroke widths.
 *
 * **Data flow:** Data is supplied via the parent `<Chart>` context.
 * The `field` prop specifies which numeric key to plot on the Y axis.
 * The X axis is automatically derived from the first string field.
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={300}>
 *   <CartesianGrid />
 *   <XAxis />
 *   <YAxis format="compact" />
 *   <LineSeries field="revenue" color="#818CF8" />
 *   <Tooltip />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 1/LineSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    field: {
      control: 'select',
      options: ['revenue', 'cost', 'profit', 'target', 'users'],
      description: 'Which numeric field to plot',
    },
    color: { control: 'color', description: 'Line stroke color' },
    strokeWidth: { control: { type: 'range', min: 1, max: 6, step: 0.5 }, description: 'Line thickness in px' },
    curve: {
      control: 'select',
      options: ['monotone', 'linear', 'natural', 'basis', 'cardinal', 'step'],
      description: 'Interpolation curve type',
    },
    dots: { control: 'boolean', description: 'Show data point dots' },
    dotRadius: { control: { type: 'range', min: 2, max: 10, step: 1 }, description: 'Radius of data dots' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Line opacity' },
    height: { control: { type: 'range', min: 150, max: 600, step: 10 }, description: 'Chart height' },
    tooltipVariant: {
      control: 'select',
      options: ['default', 'minimal', 'compact', 'gradient', 'outline'] as TooltipVariant[],
      description: 'Tooltip style variant',
    },
  },
};
export default meta;

interface LineArgs {
  field: string;
  color: string;
  strokeWidth: number;
  curve: 'linear' | 'monotone' | 'step' | 'basis' | 'cardinal' | 'natural';
  dots: boolean;
  dotRadius: number;
  opacity: number;
  height: number;
  tooltipVariant: TooltipVariant;
}

type Story = StoryObj<LineArgs>;

export const Default: Story = {
  args: {
    field: 'revenue',
    color: PALETTE.indigo,
    strokeWidth: 2.5,
    curve: 'monotone',
    dots: false,
    dotRadius: 4,
    opacity: 1,
    height: 350,
    tooltipVariant: 'default',
  },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="Revenue Trend">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LineSeries
        field={args.field}
        color={args.color}
        strokeWidth={args.strokeWidth}
        curve={args.curve}
        dots={args.dots}
        dotRadius={args.dotRadius}
        opacity={args.opacity}
      />
      <Tooltip variant={args.tooltipVariant} />
      <Legend items={[{ key: args.field, label: 'Revenue', color: args.color }]} />
    </Chart>
  ),
};

export const WithDots: Story = {
  args: { field: 'profit', color: PALETTE.teal, strokeWidth: 2, dotRadius: 5, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="Profit with Dots">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LineSeries field={args.field} color={args.color} dots dotRadius={args.dotRadius} strokeWidth={args.strokeWidth} />
      <Tooltip variant="minimal" />
    </Chart>
  ),
};

export const MultiSeries: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={400} title="Multi-Line Comparison">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LineSeries field="revenue" color={PALETTE.indigo} strokeWidth={2.5} />
      <LineSeries field="cost" color={PALETTE.pink} strokeWidth={2} />
      <LineSeries field="target" color={PALETTE.amber} strokeWidth={1.5} curve="step" />
      <Legend />
      <Tooltip variant="gradient" />
    </Chart>
  ),
};

export const AllCurveTypes: Story = {
  name: 'All Curve Types',
  render: () => {
    const curves = ['monotone', 'linear', 'natural', 'basis', 'cardinal', 'step'] as const;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {curves.map((c) => (
          <div key={c}>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 4px', textTransform: 'capitalize' }}>{c}</p>
            <Chart data={monthlyMetrics} height={180} title={c}>
              <CartesianGrid />
              <XAxis />
              <YAxis format="compact" />
              <LineSeries field="revenue" color={PALETTE.indigo} curve={c} strokeWidth={2} />
            </Chart>
          </div>
        ))}
      </div>
    );
  },
};

export const CustomStrokeWidth: Story = {
  args: { strokeWidth: 4, color: PALETTE.violet, field: 'revenue', height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="Thick line">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LineSeries field={args.field} color={args.color} strokeWidth={args.strokeWidth} />
      <Tooltip variant="compact" />
    </Chart>
  ),
};

export const SteppedLine: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={350} title="Step Curve">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LineSeries field="target" color={PALETTE.amber} curve="step" strokeWidth={2} dots dotRadius={4} />
      <Tooltip variant="outline" />
    </Chart>
  ),
};

export const WeeklyData: Story = {
  render: () => (
    <Chart data={weeklyData} height={300} title="Weekly Page Views">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <LineSeries field="pageViews" color={PALETTE.blue} dots dotRadius={4} />
      <Tooltip variant="minimal" />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[400, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <Chart data={monthlyMetrics} height={200} title={`${w}px wide`}>
            <CartesianGrid />
            <XAxis />
            <YAxis format="compact" />
            <LineSeries field="revenue" color={PALETTE.indigo} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
