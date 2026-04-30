import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { DensityContour, Legend } from '@kodemaven/viskit-charts';
import { densityData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { DensityContour } from '@kodemaven/viskit-charts';
 * ```
 *
 * 2D density estimation with kernel density estimation on a grid.
 * Renders filled contour bands showing where data points cluster.
 * Optionally overlays the raw scatter points.
 *
 * ### Props
 * - `xField` — numeric field for x position
 * - `yField` — numeric field for y position
 * - `bandwidth` — KDE bandwidth
 * - `thresholds` — number of contour levels
 * - `fillOpacity` — contour fill opacity
 * - `showPoints` — overlay raw data points
 * - `pointRadius` — radius for scatter dots
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <DensityContour xField="x" yField="y" showPoints />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 4/DensityContour',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    bandwidth: { control: { type: 'range', min: 5, max: 40, step: 1 }, description: 'KDE bandwidth' },
    thresholds: { control: { type: 'range', min: 3, max: 15, step: 1 }, description: 'Contour levels' },
    fillOpacity: { control: { type: 'range', min: 0.1, max: 1, step: 0.05 }, description: 'Fill opacity' },
    showPoints: { control: 'boolean', description: 'Show scatter points' },
    pointRadius: { control: { type: 'range', min: 1, max: 6, step: 0.5 }, description: 'Point radius' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { bandwidth: number; thresholds: number; fillOpacity: number; showPoints: boolean; pointRadius: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { bandwidth: 15, thresholds: 8, fillOpacity: 0.6, showPoints: true, pointRadius: 2, height: 400 },
  render: (args) => (
    <Chart data={densityData} height={args.height}>
      <DensityContour xField="x" yField="y" bandwidth={args.bandwidth} thresholds={args.thresholds} fillOpacity={args.fillOpacity} showPoints={args.showPoints} pointRadius={args.pointRadius} />
      <Legend items={[
        { key: 'low', label: 'Low density', color: '#4c1d95' },
        { key: 'mid', label: 'Medium density', color: '#f59e0b' },
        { key: 'high', label: 'High density', color: '#ef4444' },
        { key: 'points', label: 'Data points', color: '#fff' },
      ]} />
    </Chart>
  ),
};

export const ContoursOnly: Story = {
  args: { bandwidth: 20, thresholds: 10, fillOpacity: 0.7, showPoints: false, pointRadius: 2, height: 400 },
  render: (args) => (
    <Chart data={densityData} height={args.height}>
      <DensityContour xField="x" yField="y" bandwidth={args.bandwidth} thresholds={args.thresholds} fillOpacity={args.fillOpacity} showPoints={false} />
    </Chart>
  ),
};

export const FineBandwidth: Story = {
  args: { bandwidth: 8, thresholds: 12, fillOpacity: 0.5, showPoints: true, pointRadius: 1.5, height: 400 },
  render: (args) => (
    <Chart data={densityData} height={args.height}>
      <DensityContour xField="x" yField="y" bandwidth={args.bandwidth} thresholds={args.thresholds} fillOpacity={args.fillOpacity} showPoints={args.showPoints} pointRadius={args.pointRadius} />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <Chart data={densityData} height={w < 500 ? 260 : 400}>
            <DensityContour xField="x" yField="y" showPoints pointRadius={w < 500 ? 1.5 : 2} />
            <Legend items={[
              { key: 'low', label: 'Low density', color: '#4c1d95' },
              { key: 'high', label: 'High density', color: '#ef4444' },
              { key: 'points', label: 'Data points', color: '#fff' },
            ]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
