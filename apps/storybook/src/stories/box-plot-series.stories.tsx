import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { BoxPlotSeries, Legend } from '@kodemaven/viskit-charts';
import { boxPlotData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { BoxPlotSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders box-and-whisker plots showing statistical distribution. Each box
 * spans Q1–Q3 with a median line, and whiskers extend to min/max values.
 * Ideal for comparing distributions across categories.
 *
 * ### Props
 * - `field` — median field
 * - `minField` / `maxField` — whisker extent fields
 * - `q1Field` / `q3Field` — box extent fields
 * - `boxWidth` — box width ratio (0–1)
 * - `capWidth` — whisker cap width ratio
 * - `color` — box fill color
 * - `opacity` — fill opacity
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <BoxPlotSeries field="median" minField="min" q1Field="q1" q3Field="q3" maxField="max" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/BoxPlotSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    boxWidth: { control: { type: 'range', min: 0.2, max: 0.9, step: 0.05 }, description: 'Box width ratio' },
    capWidth: { control: { type: 'range', min: 0.1, max: 0.8, step: 0.05 }, description: 'Whisker cap width ratio' },
    color: { control: 'color', description: 'Box fill color' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Fill opacity' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { boxWidth: number; capWidth: number; color: string; opacity: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { boxWidth: 0.5, capWidth: 0.3, color: PALETTE.indigo, opacity: 0.85, height: 400 },
  render: (args) => (
    <Chart data={boxPlotData} height={args.height}>
      <BoxPlotSeries
        field="median"
        minField="min"
        q1Field="q1"
        q3Field="q3"
        maxField="max"
        boxWidth={args.boxWidth}
        capWidth={args.capWidth}
        color={args.color}
        opacity={args.opacity}
      />
      <Legend items={[{ key: 'median', label: 'Distribution', color: args.color }]} />
    </Chart>
  ),
};

export const WideBoxes: Story = {
  args: { boxWidth: 0.8, capWidth: 0.5, color: PALETTE.teal, opacity: 0.9, height: 400 },
  render: (args) => (
    <Chart data={boxPlotData} height={args.height}>
      <BoxPlotSeries field="median" minField="min" q1Field="q1" q3Field="q3" maxField="max" boxWidth={args.boxWidth} capWidth={args.capWidth} color={args.color} opacity={args.opacity} />
    </Chart>
  ),
};

export const NarrowBoxes: Story = {
  args: { boxWidth: 0.25, capWidth: 0.15, color: PALETTE.pink, opacity: 0.8, height: 400 },
  render: (args) => (
    <Chart data={boxPlotData} height={args.height}>
      <BoxPlotSeries field="median" minField="min" q1Field="q1" q3Field="q3" maxField="max" boxWidth={args.boxWidth} capWidth={args.capWidth} color={args.color} opacity={args.opacity} />
    </Chart>
  ),
};

export const Translucent: Story = {
  args: { boxWidth: 0.5, capWidth: 0.3, color: PALETTE.violet, opacity: 0.45, height: 400 },
  render: (args) => (
    <Chart data={boxPlotData} height={args.height}>
      <BoxPlotSeries field="median" minField="min" q1Field="q1" q3Field="q3" maxField="max" boxWidth={args.boxWidth} capWidth={args.capWidth} color={args.color} opacity={args.opacity} />
    </Chart>
  ),
};
