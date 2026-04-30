import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { LineSeries, ChartGroup, Legend } from '@kodemaven/viskit-charts';
import { monthlyMetrics, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { LineSeries, ChartGroup } from '@kodemaven/viskit-charts';
 * ```
 *
 * Container for synchronizing multiple charts. Shares crosshair
 * position, active datum index, and toggled series keys across
 * all child `<Chart>` instances.
 *
 * ### Props
 * - `layout` — direction ('vertical' | 'horizontal')
 * - `gap` — spacing between charts (px)
 *
 * ### Usage
 * ```tsx
 * <ChartGroup layout="vertical" gap={16}>
 *   <Chart data={data} height={200}><LineSeries field="a" /></Chart>
 *   <Chart data={data} height={200}><LineSeries field="b" /></Chart>
 * </ChartGroup>
 * ```
 */
const meta: Meta = {
  title: 'Phase 4/ChartGroup',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'select', options: ['vertical', 'horizontal'], description: 'Layout direction' },
    gap: { control: { type: 'range', min: 0, max: 40, step: 4 }, description: 'Gap between charts (px)' },
  },
};
export default meta;

interface Args { layout: 'vertical' | 'horizontal'; gap: number }
type Story = StoryObj<Args>;

export const Vertical: Story = {
  args: { layout: 'vertical', gap: 16 },
  render: (args) => (
    <ChartGroup layout={args.layout} gap={args.gap}>
      <Chart data={monthlyMetrics} height={200} colors={[PALETTE.indigo]}>
        <LineSeries field="revenue" />
        <Legend items={[{ key: 'revenue', label: 'Revenue', color: PALETTE.indigo }]} />
      </Chart>
      <Chart data={monthlyMetrics} height={200} colors={[PALETTE.pink]}>
        <LineSeries field="cost" />
        <Legend items={[{ key: 'cost', label: 'Cost', color: PALETTE.pink }]} />
      </Chart>
    </ChartGroup>
  ),
};

export const Horizontal: Story = {
  args: { layout: 'horizontal', gap: 16 },
  render: (args) => (
    <ChartGroup layout={args.layout} gap={args.gap}>
      <Chart data={monthlyMetrics} height={300} colors={[PALETTE.teal]}>
        <LineSeries field="profit" />
        <Legend items={[{ key: 'profit', label: 'Profit', color: PALETTE.teal }]} />
      </Chart>
      <Chart data={monthlyMetrics} height={300} colors={[PALETTE.amber]}>
        <LineSeries field="users" />
        <Legend items={[{ key: 'users', label: 'Users', color: PALETTE.amber }]} />
      </Chart>
    </ChartGroup>
  ),
};

export const ThreeCharts: Story = {
  args: { layout: 'vertical', gap: 12 },
  render: (args) => (
    <ChartGroup layout={args.layout} gap={args.gap}>
      <Chart data={monthlyMetrics} height={180} colors={[PALETTE.indigo]}>
        <LineSeries field="revenue" />
        <Legend items={[{ key: 'revenue', label: 'Revenue', color: PALETTE.indigo }]} />
      </Chart>
      <Chart data={monthlyMetrics} height={180} colors={[PALETTE.pink]}>
        <LineSeries field="cost" />
        <Legend items={[{ key: 'cost', label: 'Cost', color: PALETTE.pink }]} />
      </Chart>
      <Chart data={monthlyMetrics} height={180} colors={[PALETTE.teal]}>
        <LineSeries field="profit" />
        <Legend items={[{ key: 'profit', label: 'Profit', color: PALETTE.teal }]} />
      </Chart>
    </ChartGroup>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <ChartGroup layout="vertical" gap={w < 500 ? 8 : 16}>
            <Chart data={monthlyMetrics} height={w < 500 ? 140 : 200} colors={[PALETTE.indigo]}>
              <LineSeries field="revenue" />
              <Legend items={[{ key: 'revenue', label: 'Revenue', color: PALETTE.indigo }]} />
            </Chart>
            <Chart data={monthlyMetrics} height={w < 500 ? 140 : 200} colors={[PALETTE.pink]}>
              <LineSeries field="cost" />
              <Legend items={[{ key: 'cost', label: 'Cost', color: PALETTE.pink }]} />
            </Chart>
          </ChartGroup>
        </div>
      ))}
    </div>
  ),
};
