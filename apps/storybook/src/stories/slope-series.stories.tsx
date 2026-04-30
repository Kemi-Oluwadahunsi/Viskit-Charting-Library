import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { SlopeSeries, Legend } from '@kodemaven/viskit-charts';
import { slopeData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { SlopeSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders a slope chart comparing two values per item across a before/after
 * scenario. Lines connect left and right dot columns, making it easy to spot
 * which items increased, decreased, or stayed flat.
 *
 * ### Props
 * - `startField` — numeric field for the left (before) value
 * - `endField` — numeric field for the right (after) value
 * - `nameField` — label field for each item
 * - `gutterWidth` — horizontal space between dot columns (px)
 * - `dotRadius` — circle radius for endpoints
 * - `strokeWidth` — connecting line thickness
 * - `opacity` — line and dot opacity
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <SlopeSeries startField="q1" endField="q2" nameField="team" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/SlopeSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    gutterWidth: { control: { type: 'range', min: 30, max: 120, step: 5 }, description: 'Space between columns (px)' },
    dotRadius: { control: { type: 'range', min: 3, max: 12, step: 1 }, description: 'Endpoint circle radius' },
    strokeWidth: { control: { type: 'range', min: 1, max: 5, step: 0.5 }, description: 'Line thickness' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Line and dot opacity' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { gutterWidth: number; dotRadius: number; strokeWidth: number; opacity: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { gutterWidth: 60, dotRadius: 5, strokeWidth: 2, opacity: 0.8, height: 400 },
  render: (args) => (
    <Chart data={slopeData} height={args.height} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber, PALETTE.violet]}>
      <SlopeSeries startField="q1" endField="q2" nameField="team" gutterWidth={args.gutterWidth} dotRadius={args.dotRadius} strokeWidth={args.strokeWidth} opacity={args.opacity} />
      <Legend items={[
        { key: 'q1', label: 'Q1 (Before)' },
        { key: 'q2', label: 'Q2 (After)' },
      ]} />
    </Chart>
  ),
};

export const BoldLines: Story = {
  args: { gutterWidth: 80, dotRadius: 7, strokeWidth: 4, opacity: 0.9, height: 400 },
  render: (args) => (
    <Chart data={slopeData} height={args.height}>
      <SlopeSeries startField="q1" endField="q2" nameField="team" gutterWidth={args.gutterWidth} dotRadius={args.dotRadius} strokeWidth={args.strokeWidth} opacity={args.opacity} />
    </Chart>
  ),
};

export const WideGutter: Story = {
  args: { gutterWidth: 120, dotRadius: 5, strokeWidth: 2, opacity: 0.8, height: 400 },
  render: (args) => (
    <Chart data={slopeData} height={args.height}>
      <SlopeSeries startField="q1" endField="q2" nameField="team" gutterWidth={args.gutterWidth} dotRadius={args.dotRadius} strokeWidth={args.strokeWidth} opacity={args.opacity} />
    </Chart>
  ),
};

export const Compact: Story = {
  args: { gutterWidth: 40, dotRadius: 3, strokeWidth: 1.5, opacity: 0.7, height: 280 },
  render: (args) => (
    <Chart data={slopeData} height={args.height}>
      <SlopeSeries startField="q1" endField="q2" nameField="team" gutterWidth={args.gutterWidth} dotRadius={args.dotRadius} strokeWidth={args.strokeWidth} opacity={args.opacity} />
    </Chart>
  ),
};
