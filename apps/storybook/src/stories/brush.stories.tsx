import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { LineSeries, Brush, Legend } from '@kodemaven/viskit-charts';
import { monthlyMetrics, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { LineSeries, Brush } from '@kodemaven/viskit-charts';
 * ```
 *
 * Draggable selection overlay for zooming/filtering chart data by range.
 * Supports horizontal and vertical brushing. Double-click to clear.
 *
 * ### Props
 * - `direction` — brush axis ('horizontal' | 'vertical' | 'both')
 * - `onBrush` — callback with normalized [start, end] range
 * - `fillColor` — selection fill
 * - `strokeColor` — selection border
 * - `handleWidth` — drag handle size (px)
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={300}>
 *   <LineSeries field="value" />
 *   <Brush direction="horizontal" onBrush={console.log} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 4/Brush',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['horizontal', 'vertical', 'both'], description: 'Brush direction' },
    handleWidth: { control: { type: 'range', min: 2, max: 12, step: 1 }, description: 'Handle width (px)' },
    fillColor: { control: 'color', description: 'Selection fill color' },
    strokeColor: { control: 'color', description: 'Selection border color' },
    height: { control: { type: 'range', min: 200, max: 500, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { direction: 'horizontal' | 'vertical' | 'both'; handleWidth: number; fillColor: string; strokeColor: string; height: number }
type Story = StoryObj<Args>;

export const Horizontal: Story = {
  args: { direction: 'horizontal', handleWidth: 6, fillColor: 'rgba(99, 102, 241, 0.15)', strokeColor: '#6366f1', height: 300 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} colors={[PALETTE.indigo]}>
      <LineSeries field="revenue" />
      <Brush direction={args.direction} handleWidth={args.handleWidth} fillColor={args.fillColor} strokeColor={args.strokeColor} onBrush={(range) => console.log('Brush:', range)} />
      <Legend items={[
        { key: 'revenue', label: 'Revenue', color: PALETTE.indigo },
      ]} />
    </Chart>
  ),
};

export const Vertical: Story = {
  args: { direction: 'vertical', handleWidth: 6, fillColor: 'rgba(99, 102, 241, 0.15)', strokeColor: '#6366f1', height: 400 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} colors={[PALETTE.pink]}>
      <LineSeries field="cost" />
      <Brush direction="vertical" handleWidth={args.handleWidth} fillColor={args.fillColor} strokeColor={args.strokeColor} onBrush={(range) => console.log('Brush:', range)} />
      <Legend items={[
        { key: 'cost', label: 'Cost', color: PALETTE.pink },
      ]} />
    </Chart>
  ),
};

export const CustomColors: Story = {
  args: { direction: 'horizontal', handleWidth: 8, height: 300 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} colors={[PALETTE.teal]}>
      <LineSeries field="profit" />
      <Brush direction={args.direction} handleWidth={args.handleWidth} fillColor="rgba(251, 113, 133, 0.15)" strokeColor={PALETTE.pink} />
      <Legend items={[
        { key: 'profit', label: 'Profit', color: PALETTE.teal },
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
          <Chart data={monthlyMetrics} height={w < 500 ? 200 : 300} colors={[PALETTE.indigo]}>
            <LineSeries field="revenue" />
            <Brush direction="horizontal" />
            <Legend items={[
              { key: 'revenue', label: 'Revenue', color: PALETTE.indigo },
            ]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
