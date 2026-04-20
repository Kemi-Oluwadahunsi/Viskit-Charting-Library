import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { BulletSeries } from '@viskit/charts';
import { ChartWrapper } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { BulletSeries } from '@viskit/charts';
 * ```
 *
 * Renders a bullet chart (Stephen Few design) for comparing a primary measure
 * against a target within qualitative ranges. A compact alternative to gauges
 * and meters, ideal for KPI dashboards.
 *
 * ### Props
 * - `value` — current measure value
 * - `target` — target/goal marker position
 * - `ranges` — array of qualitative range thresholds (e.g. `[30, 60, 100]`)
 * - `barColor` — primary bar color
 * - `targetColor` — target marker color
 * - `barHeight` — bar thickness ratio (0–1)
 * - `orientation` — `horizontal` or `vertical`
 *
 * ### Usage
 * ```tsx
 * <Chart data={[]} height={100}>
 *   <BulletSeries value={72} target={85} ranges={[30, 60, 100]} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/BulletSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Current measure value' },
    target: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Target/goal marker' },
    barColor: { control: 'color', description: 'Primary bar color' },
    targetColor: { control: 'color', description: 'Target marker color' },
    barHeight: { control: { type: 'range', min: 0.1, max: 0.9, step: 0.05 }, description: 'Bar thickness ratio' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'], description: 'Layout direction' },
    height: { control: { type: 'range', min: 80, max: 400, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { value: number; target: number; barColor: string; targetColor: string; barHeight: number; orientation: string; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { value: 72, target: 85, barColor: '#6366f1', targetColor: '#f59e0b', barHeight: 0.4, orientation: 'horizontal', height: 100 },
  render: (args) => (
    <Chart data={[]} height={args.height}>
      <BulletSeries
        value={args.value}
        target={args.target}
        ranges={[30, 60, 100]}
        barColor={args.barColor}
        targetColor={args.targetColor}
        barHeight={args.barHeight}
        orientation={args.orientation as 'horizontal'}
      />
    </Chart>
  ),
};

export const Vertical: Story = {
  args: { value: 58, target: 75, barColor: '#6366f1', targetColor: '#f59e0b', barHeight: 0.4, orientation: 'vertical', height: 300 },
  render: (args) => (
    <Chart data={[]} height={args.height}>
      <BulletSeries value={args.value} target={args.target} ranges={[25, 50, 100]} orientation="vertical" barColor={args.barColor} targetColor={args.targetColor} barHeight={args.barHeight} />
    </Chart>
  ),
};
