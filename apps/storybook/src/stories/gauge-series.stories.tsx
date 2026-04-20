import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { GaugeSeries } from '@viskit/charts';
import { ChartWrapper } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { GaugeSeries } from '@viskit/charts';
 * ```
 *
 * Renders a semi-circular gauge meter with colored segments, a needle, and
 * an optional value label. Ideal for KPIs, speedometers, and progress
 * indicators with qualitative thresholds.
 *
 * ### Props
 * - `value` — current reading
 * - `min` / `max` — scale range
 * - `segments` — threshold array defining colored zones
 * - `segmentColors` — optional custom colors per zone
 * - `thickness` — arc band thickness ratio (0–1)
 * - `showValue` — display numeric value label
 *
 * ### Usage
 * ```tsx
 * <Chart data={[]} height={300}>
 *   <GaugeSeries value={72} segments={[30, 60, 100]} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/GaugeSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Current reading' },
    min: { control: { type: 'range', min: 0, max: 50, step: 5 }, description: 'Scale minimum' },
    max: { control: { type: 'range', min: 50, max: 200, step: 5 }, description: 'Scale maximum' },
    thickness: { control: { type: 'range', min: 0.1, max: 0.6, step: 0.05 }, description: 'Arc band thickness ratio' },
    showValue: { control: 'boolean', description: 'Display numeric label' },
    height: { control: { type: 'range', min: 200, max: 500, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { value: number; min: number; max: number; thickness: number; showValue: boolean; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { value: 72, min: 0, max: 100, thickness: 0.3, showValue: true, height: 300 },
  render: (args) => (
    <Chart data={[]} height={args.height}>
      <GaugeSeries value={args.value} min={args.min} max={args.max} segments={[30, 60, 100]} thickness={args.thickness} showValue={args.showValue} />
    </Chart>
  ),
};

export const CustomSegments: Story = {
  args: { value: 145, min: 0, max: 200, thickness: 0.25, showValue: true, height: 300 },
  render: (args) => (
    <Chart data={[]} height={args.height}>
      <GaugeSeries
        value={args.value}
        min={args.min}
        max={args.max}
        segments={[50, 100, 150, 200]}
        segmentColors={['#ef4444', '#f59e0b', '#22c55e', '#6366f1']}
        thickness={args.thickness}
        showValue={args.showValue}
      />
    </Chart>
  ),
};
