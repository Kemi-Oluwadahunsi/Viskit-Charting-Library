import type { Meta, StoryObj } from '@storybook/react';
import { Sparkline } from '@kodemaven/viskit-charts';
import { sparklineData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Sparkline } from '@kodemaven/viskit-charts';
 * ```
 *
 * A standalone inline SVG mini chart — no `<Chart>` wrapper needed.
 * Perfect for KPI dashboards, table cells, and inline metrics.
 *
 * ### Props
 * - `data` — array of numbers
 * - `width` / `height` — SVG dimensions
 * - `color` — line color
 * - `strokeWidth` — line thickness
 * - `showEndDot` — show last-value dot
 *
 * ### Usage
 * ```tsx
 * <Sparkline data={[12, 14, 18, 22, 20]} width={120} height={32} color="#818CF8" />
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/Sparkline',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color', description: 'Line color' },
    width: { control: { type: 'range', min: 60, max: 500, step: 10 }, description: 'SVG width' },
    height: { control: { type: 'range', min: 16, max: 80, step: 2 }, description: 'SVG height' },
    strokeWidth: { control: { type: 'range', min: 1, max: 4, step: 0.5 }, description: 'Line thickness' },
    showEndDot: { control: 'boolean', description: 'Show last-value dot' },
  },
};
export default meta;

interface SparklineArgs {
  color: string;
  width: number;
  height: number;
  strokeWidth: number;
  showEndDot: boolean;
}

type Story = StoryObj<SparklineArgs>;

export const Default: Story = {
  args: { color: PALETTE.indigo, width: 120, height: 32, strokeWidth: 1.5, showEndDot: false },
  render: (args) => (
    <Sparkline data={sparklineData} width={args.width} height={args.height} color={args.color} strokeWidth={args.strokeWidth} showEndDot={args.showEndDot} />
  ),
};

export const WithDot: Story = {
  args: { color: PALETTE.teal, width: 140, height: 36 },
  render: (args) => (
    <Sparkline data={sparklineData} width={args.width} height={args.height} color={args.color} showEndDot />
  ),
};

export const Large: Story = {
  args: { width: 300, height: 60, color: PALETTE.pink, strokeWidth: 2.5 },
  render: (args) => (
    <Sparkline data={sparklineData} width={args.width} height={args.height} color={args.color} strokeWidth={args.strokeWidth} />
  ),
};

export const InlineKPIs: Story = {
  name: 'Inline KPI Group',
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
      {[
        { label: 'Revenue', data: sparklineData, color: PALETTE.indigo },
        { label: 'Users', data: [5, 8, 12, 9, 15, 18, 14, 22, 19, 25], color: PALETTE.teal },
        { label: 'Errors', data: [20, 18, 22, 15, 12, 10, 8, 6, 9, 4], color: PALETTE.pink },
        { label: 'Latency', data: [45, 42, 48, 38, 35, 40, 32, 30, 28, 25], color: PALETTE.amber },
      ].map(({ label, data, color }) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>{label}</span>
          <Sparkline data={data} width={100} height={28} color={color} showEndDot />
        </div>
      ))}
    </div>
  ),
};

export const MultipleWidths: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[80, 150, 300, 500].map((w) => (
        <div key={w}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <Sparkline data={sparklineData} width={w} height={32} color={PALETTE.indigo} />
        </div>
      ))}
    </div>
  ),
};

export const ThickLine: Story = {
  args: { strokeWidth: 3.5, color: PALETTE.orange },
  render: (args) => (
    <Sparkline data={sparklineData} width={200} height={48} color={args.color} strokeWidth={args.strokeWidth} showEndDot />
  ),
};
