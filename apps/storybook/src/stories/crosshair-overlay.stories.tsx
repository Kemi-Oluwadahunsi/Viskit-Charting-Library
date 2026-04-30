import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { LineSeries, CrosshairOverlay, Legend } from '@kodemaven/viskit-charts';
import { monthlyMetrics, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { LineSeries, CrosshairOverlay } from '@kodemaven/viskit-charts';
 * ```
 *
 * Cursor-tracking crosshair lines that follow mouse position
 * inside the chart area. Shows vertical, horizontal, or both
 * lines with an intersection dot.
 *
 * ### Props
 * - `vertical` — show vertical line (default: true)
 * - `horizontal` — show horizontal line (default: true)
 * - `color` — line color
 * - `strokeDasharray` — dash pattern
 * - `showLabels` — show coordinate labels
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={300}>
 *   <LineSeries field="value" />
 *   <CrosshairOverlay />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 4/CrosshairOverlay',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    vertical: { control: 'boolean', description: 'Show vertical line' },
    horizontal: { control: 'boolean', description: 'Show horizontal line' },
    showLabels: { control: 'boolean', description: 'Show coordinate labels' },
    color: { control: 'color', description: 'Line color' },
    strokeDasharray: { control: 'text', description: 'Stroke dash pattern (e.g. "4 3")' },
    strokeWidth: { control: { type: 'range', min: 0.5, max: 4, step: 0.5 }, description: 'Line thickness' },
    height: { control: { type: 'range', min: 200, max: 500, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { vertical: boolean; horizontal: boolean; showLabels: boolean; color: string; strokeDasharray: string; strokeWidth: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { vertical: true, horizontal: true, showLabels: false, color: '#94a3b8', strokeDasharray: '4 3', strokeWidth: 1, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} colors={[PALETTE.indigo]}>
      <LineSeries field="revenue" />
      <CrosshairOverlay vertical={args.vertical} horizontal={args.horizontal} color={args.color} showLabels={args.showLabels} strokeDasharray={args.strokeDasharray} strokeWidth={args.strokeWidth} />
      <Legend items={[
        { key: 'revenue', label: 'Revenue', color: PALETTE.indigo },
      ]} />
    </Chart>
  ),
};

export const VerticalOnly: Story = {
  args: { vertical: true, horizontal: false, showLabels: false, color: PALETTE.indigo, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} colors={[PALETTE.teal]}>
      <LineSeries field="profit" />
      <CrosshairOverlay vertical horizontal={false} color={args.color} />
      <Legend items={[
        { key: 'profit', label: 'Profit', color: PALETTE.teal },
      ]} />
    </Chart>
  ),
};

export const WithLabels: Story = {
  args: { vertical: true, horizontal: true, showLabels: true, color: PALETTE.pink, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} colors={[PALETTE.amber]}>
      <LineSeries field="users" />
      <CrosshairOverlay showLabels color={args.color} />
      <Legend items={[
        { key: 'users', label: 'Users', color: PALETTE.amber },
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
            <CrosshairOverlay />
            <Legend items={[
              { key: 'revenue', label: 'Revenue', color: PALETTE.indigo },
            ]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
