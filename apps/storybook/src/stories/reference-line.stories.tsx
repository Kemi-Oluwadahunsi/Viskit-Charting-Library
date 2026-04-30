import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { LineSeries, ReferenceLine, Legend } from '@kodemaven/viskit-charts';
import { monthlyMetrics, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { LineSeries, ReferenceLine } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders a horizontal or vertical reference line at a specified
 * value with an optional label. Use for targets, thresholds,
 * averages, or benchmarks.
 *
 * ### Props
 * - `value` — data value for line position
 * - `direction` — 'horizontal' or 'vertical'
 * - `label` — text label
 * - `color` — line color
 * - `strokeDasharray` — dash pattern
 * - `strokeWidth` — line thickness
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={300}>
 *   <LineSeries field="revenue" />
 *   <ReferenceLine value={50000} label="Target" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 4/ReferenceLine',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color', description: 'Line color' },
    strokeWidth: { control: { type: 'range', min: 0.5, max: 4, step: 0.5 }, description: 'Line thickness' },
    strokeDasharray: { control: 'text', description: 'Stroke dash pattern (e.g. "6 4")' },
    label: { control: 'text', description: 'Label text' },
    fontSize: { control: { type: 'range', min: 8, max: 18, step: 1 }, description: 'Label font size' },
    height: { control: { type: 'range', min: 200, max: 500, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { color: string; strokeWidth: number; strokeDasharray: string; label: string; fontSize: number; height: number }
type Story = StoryObj<Args>;

export const HorizontalTarget: Story = {
  args: { color: PALETTE.red, strokeWidth: 1.5, strokeDasharray: '6 4', label: 'Target', fontSize: 11, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} colors={[PALETTE.indigo]}>
      <LineSeries field="revenue" />
      <ReferenceLine value={55000} label={args.label} color={args.color} strokeWidth={args.strokeWidth} strokeDasharray={args.strokeDasharray} fontSize={args.fontSize} />
      <Legend items={[
        { key: 'revenue', label: 'Revenue', color: PALETTE.indigo },
        { key: 'target', label: 'Target', color: PALETTE.red },
      ]} />
    </Chart>
  ),
};

export const VerticalMarker: Story = {
  args: { color: PALETTE.amber, strokeWidth: 2, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} colors={[PALETTE.teal]}>
      <LineSeries field="profit" />
      <ReferenceLine value="Mar" direction="vertical" label="Launch" color={args.color} strokeWidth={args.strokeWidth} />
      <Legend items={[
        { key: 'profit', label: 'Profit', color: PALETTE.teal },
        { key: 'launch', label: 'Launch', color: PALETTE.amber },
      ]} />
    </Chart>
  ),
};

export const MultipleLines: Story = {
  args: { color: '#94a3b8', strokeWidth: 1.5, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} colors={[PALETTE.indigo]}>
      <LineSeries field="revenue" />
      <ReferenceLine value={45000} label="Min" color={PALETTE.amber} strokeWidth={args.strokeWidth} />
      <ReferenceLine value={65000} label="Max" color={PALETTE.red} strokeWidth={args.strokeWidth} />
      <Legend items={[
        { key: 'revenue', label: 'Revenue', color: PALETTE.indigo },
        { key: 'min', label: 'Min', color: PALETTE.amber },
        { key: 'max', label: 'Max', color: PALETTE.red },
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
          <Chart data={monthlyMetrics} height={w < 500 ? 220 : 350} colors={[PALETTE.indigo]}>
            <LineSeries field="revenue" />
            <ReferenceLine value={55000} label="Target" color={PALETTE.red} />
            <Legend items={[
              { key: 'revenue', label: 'Revenue', color: PALETTE.indigo },
              { key: 'target', label: 'Target', color: PALETTE.red },
            ]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
