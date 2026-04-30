import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { HistogramSeries, Legend } from '@kodemaven/viskit-charts';
import { histogramRaw, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { HistogramSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders a frequency distribution chart. Automatically bins numeric
 * values using D3's `bin()` and renders bars for each bin.
 * Manages its own internal X/Y scales — no XAxis or YAxis primitives
 * needed (but can be added for decoration).
 *
 * ### Props
 * - `field` — numeric field to bin
 * - `bins` — number of bins (default 10)
 * - `color` — bar fill color
 * - `radius` — bar corner radius
 * - `gradientFill` — enable gradient
 *
 * **Note:** Do NOT add a standard `<XAxis>` inside a histogram
 * — the component builds its own scale from binned ranges.
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={350}>
 *   <HistogramSeries field="score" bins={12} color="#818CF8" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/HistogramSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    bins: { control: { type: 'range', min: 3, max: 25, step: 1 }, description: 'Number of bins' },
    color: { control: 'color', description: 'Bar color' },
    radius: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Corner radius' },
    gradientFill: { control: 'boolean', description: 'Gradient fill' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 } },
  },
};
export default meta;

interface HistogramArgs {
  bins: number;
  color: string;
  radius: number;
  gradientFill: boolean;
  opacity: number;
  height: number;
}

type Story = StoryObj<HistogramArgs>;

export const Default: Story = {
  args: { bins: 10, color: PALETTE.indigo, radius: 2, gradientFill: true, opacity: 1, height: 350 },
  render: (args) => (
    <Chart data={histogramRaw} height={args.height} title="Score Distribution">
      <HistogramSeries
        field="score"
        bins={args.bins}
        color={args.color}
        radius={args.radius}
        gradientFill={args.gradientFill}
        opacity={args.opacity}
      />
      <Legend items={[{ key: 'score', label: 'Score Distribution', color: args.color }]} />
    </Chart>
  ),
};

export const FewBins: Story = {
  args: { bins: 5, color: PALETTE.orange },
  render: (args) => (
    <Chart data={histogramRaw} height={350} title="5 Bins">
      <HistogramSeries field="score" bins={args.bins} color={args.color} />
    </Chart>
  ),
};

export const ManyBins: Story = {
  args: { bins: 20, color: PALETTE.teal },
  render: (args) => (
    <Chart data={histogramRaw} height={350} title="20 Bins">
      <HistogramSeries field="score" bins={args.bins} color={args.color} />
    </Chart>
  ),
};

export const FlatFill: Story = {
  render: () => (
    <Chart data={histogramRaw} height={350} title="No Gradient">
      <HistogramSeries field="score" bins={12} color={PALETTE.pink} gradientFill={false} />
    </Chart>
  ),
};

export const HighRadius: Story = {
  render: () => (
    <Chart data={histogramRaw} height={350} title="Rounded Bars">
      <HistogramSeries field="score" bins={8} color={PALETTE.violet} radius={6} />
    </Chart>
  ),
};

export const LowOpacity: Story = {
  args: { opacity: 0.4, color: PALETTE.amber },
  render: (args) => (
    <Chart data={histogramRaw} height={350} title="Transparent">
      <HistogramSeries field="score" bins={12} color={args.color} opacity={args.opacity} />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <Chart data={histogramRaw} height={200} title={`${w}px`}>
            <HistogramSeries field="score" bins={10} color={PALETTE.indigo} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
