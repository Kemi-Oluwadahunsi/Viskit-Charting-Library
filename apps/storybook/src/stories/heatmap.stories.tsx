import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { Heatmap } from '@viskit/charts';
import { heatmapData, ChartWrapper } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { Heatmap } from '@viskit/charts';
 * ```
 *
 * Renders a grid of colored cells where color intensity represents
 * magnitude. Uses `scaleBand` for both axes and a sequential color
 * scale for values.
 *
 * ### Props
 * - `xField` — string field for columns
 * - `yField` — string field for rows
 * - `valueField` — numeric field for color intensity
 * - `colors` — `[lowColor, highColor]` pair for the scale
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={350}>
 *   <Heatmap xField="hour" yField="day" valueField="activity" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/Heatmap',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    colorLow: { control: 'color', description: 'Low-end color' },
    colorHigh: { control: 'color', description: 'High-end color' },
    radius: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Cell corner radius' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Cell opacity' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 } },
  },
};
export default meta;

interface HeatmapArgs {
  colorLow: string;
  colorHigh: string;
  radius: number;
  opacity: number;
  height: number;
}

type Story = StoryObj<HeatmapArgs>;

export const Default: Story = {
  args: { height: 380 },
  render: (args) => (
    <Chart data={heatmapData} height={args.height} title="Activity Heatmap">
      <Heatmap xField="hour" yField="day" valueField="activity" />
    </Chart>
  ),
};

export const InfernoPalette: Story = {
  name: 'Inferno (Yellow→Red→Black)',
  args: { colorLow: '#FCFFA4', colorHigh: '#000004', height: 380 },
  render: (args) => (
    <Chart data={heatmapData} height={args.height} title="Inferno">
      <Heatmap xField="hour" yField="day" valueField="activity" colors={[args.colorLow, args.colorHigh]} />
    </Chart>
  ),
};

export const ViridisLike: Story = {
  name: 'Viridis (Teal→Yellow)',
  args: { colorLow: '#440154', colorHigh: '#FDE725', height: 380 },
  render: (args) => (
    <Chart data={heatmapData} height={args.height} title="Viridis-like">
      <Heatmap xField="hour" yField="day" valueField="activity" colors={[args.colorLow, args.colorHigh]} />
    </Chart>
  ),
};

export const WarmTones: Story = {
  name: 'Warm (Peach→Red)',
  args: { colorLow: '#FFF7ED', colorHigh: '#DC2626', height: 380 },
  render: (args) => (
    <Chart data={heatmapData} height={args.height} title="Warm Tones">
      <Heatmap xField="hour" yField="day" valueField="activity" colors={[args.colorLow, args.colorHigh]} />
    </Chart>
  ),
};

export const CoolTones: Story = {
  name: 'Cool (Light Blue→Purple)',
  args: { colorLow: '#E0F2FE', colorHigh: '#7C3AED', height: 380 },
  render: (args) => (
    <Chart data={heatmapData} height={args.height} title="Cool Tones">
      <Heatmap xField="hour" yField="day" valueField="activity" colors={[args.colorLow, args.colorHigh]} />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <Chart data={heatmapData} height={260} title={`${w}px`}>
            <Heatmap xField="hour" yField="day" valueField="activity" />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
