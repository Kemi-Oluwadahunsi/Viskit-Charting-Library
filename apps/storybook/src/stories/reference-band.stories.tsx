import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { LineSeries, ReferenceBand, Legend } from '@kodemaven/viskit-charts';
import { monthlyMetrics, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { LineSeries, ReferenceBand } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders a shaded rectangular band between two values to highlight
 * target zones, acceptable ranges, or alert thresholds.
 *
 * ### Props
 * - `from` / `to` — numeric range boundaries
 * - `direction` — 'horizontal' or 'vertical'
 * - `label` — text label
 * - `color` — fill color
 * - `opacity` — fill opacity
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={300}>
 *   <LineSeries field="revenue" />
 *   <ReferenceBand from={50000} to={60000} label="Target Zone" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 4/ReferenceBand',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    opacity: { control: { type: 'range', min: 0.05, max: 0.5, step: 0.05 }, description: 'Band opacity' },
    color: { control: 'color', description: 'Band fill color' },
    strokeColor: { control: 'color', description: 'Band border color' },
    label: { control: 'text', description: 'Band label text' },
    fontSize: { control: { type: 'range', min: 8, max: 18, step: 1 }, description: 'Label font size' },
    height: { control: { type: 'range', min: 200, max: 500, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { opacity: number; color: string; strokeColor: string; label: string; fontSize: number; height: number }
type Story = StoryObj<Args>;

export const TargetZone: Story = {
  args: { opacity: 0.15, color: PALETTE.teal, strokeColor: '', label: 'Target Zone', fontSize: 10, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} colors={[PALETTE.indigo]}>
      <LineSeries field="revenue" />
      <ReferenceBand from={50000} to={65000} label={args.label} color={args.color} opacity={args.opacity} fontSize={args.fontSize} />
      <Legend items={[
        { key: 'revenue', label: 'Revenue', color: PALETTE.indigo },
        { key: 'zone', label: 'Target Zone', color: PALETTE.teal },
      ]} />
    </Chart>
  ),
};

export const DangerZone: Story = {
  args: { opacity: 0.12, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} colors={[PALETTE.indigo]}>
      <LineSeries field="revenue" />
      <ReferenceBand from={40000} to={48000} label="Below Target" color={PALETTE.red} opacity={args.opacity} />
      <ReferenceBand from={60000} to={75000} label="Above Target" color={PALETTE.green} opacity={args.opacity} />
      <Legend items={[
        { key: 'revenue', label: 'Revenue', color: PALETTE.indigo },
        { key: 'below', label: 'Below Target', color: PALETTE.red },
        { key: 'above', label: 'Above Target', color: PALETTE.green },
      ]} />
    </Chart>
  ),
};

export const WithBorder: Story = {
  args: { opacity: 0.1, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} colors={[PALETTE.pink]}>
      <LineSeries field="cost" />
      <ReferenceBand from={30000} to={35000} label="Budget" color={PALETTE.amber} opacity={args.opacity} strokeColor={PALETTE.amber} />
      <Legend items={[
        { key: 'cost', label: 'Cost', color: PALETTE.pink },
        { key: 'budget', label: 'Budget', color: PALETTE.amber },
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
            <ReferenceBand from={50000} to={65000} label="Target Zone" color={PALETTE.teal} opacity={0.15} />
            <Legend items={[
              { key: 'revenue', label: 'Revenue', color: PALETTE.indigo },
              { key: 'zone', label: 'Target Zone', color: PALETTE.teal },
            ]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
