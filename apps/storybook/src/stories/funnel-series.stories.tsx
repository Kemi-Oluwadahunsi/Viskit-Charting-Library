import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { FunnelSeries } from '@viskit/charts';
import { funnelData, ChartWrapper } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { FunnelSeries } from '@viskit/charts';
 * ```
 *
 * Renders a funnel chart showing progressive narrowing through pipeline
 * stages. Each trapezoid segment represents a stage, with width proportional
 * to its value — ideal for conversion funnels and sales pipelines.
 *
 * ### Props
 * - `field` — numeric field for stage value
 * - `nameField` — field for stage labels
 * - `gap` — vertical gap between segments in px
 * - `neckWidth` — minimum width ratio at the narrowest point (0–1)
 * - `opacity` — fill opacity
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={450}>
 *   <FunnelSeries field="count" nameField="stage" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/FunnelSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    gap: { control: { type: 'range', min: 0, max: 12, step: 1 }, description: 'Gap between segments (px)' },
    neckWidth: { control: { type: 'range', min: 0.1, max: 0.8, step: 0.05 }, description: 'Min width ratio at neck' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Fill opacity' },
    height: { control: { type: 'range', min: 300, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { gap: number; neckWidth: number; opacity: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { gap: 4, neckWidth: 0.3, opacity: 1, height: 450 },
  render: (args) => (
    <Chart data={funnelData} height={args.height}>
      <FunnelSeries field="count" nameField="stage" gap={args.gap} neckWidth={args.neckWidth} opacity={args.opacity} />
    </Chart>
  ),
};

export const Tight: Story = {
  args: { gap: 1, neckWidth: 0.15, opacity: 0.9, height: 450 },
  render: (args) => (
    <Chart data={funnelData} height={args.height}>
      <FunnelSeries field="count" nameField="stage" gap={args.gap} neckWidth={args.neckWidth} opacity={args.opacity} />
    </Chart>
  ),
};
