import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { DivergingBarSeries, Legend } from '@kodemaven/viskit-charts';
import { divergingData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { DivergingBarSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders horizontal bars extending left and right from a center axis,
 * perfect for comparing two opposing measures like male/female populations,
 * positive/negative sentiment, or before/after metrics.
 *
 * ### Props
 * - `positiveField` — field for right-side (positive) bars
 * - `negativeField` — field for left-side (negative) bars
 * - `nameField` — field for row labels
 * - `positiveColor` / `negativeColor` — bar color overrides
 * - `barPadding` — padding between rows
 * - `radius` — corner rounding
 * - `opacity` — fill opacity
 */
const meta: Meta = {
  title: 'Phase 5/DivergingBarSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    barPadding: { control: { type: 'range', min: 0.05, max: 0.5, step: 0.05 }, description: 'Bar padding ratio' },
    radius: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Corner radius' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Fill opacity' },
    positiveColor: { control: 'color', description: 'Positive bar color' },
    negativeColor: { control: 'color', description: 'Negative bar color' },
    height: { control: { type: 'range', min: 300, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args {
  barPadding: number;
  radius: number;
  opacity: number;
  positiveColor: string;
  negativeColor: string;
  height: number;
}
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { barPadding: 0.2, radius: 3, opacity: 1, positiveColor: PALETTE.blue, negativeColor: PALETTE.pink, height: 420 },
  render: (args) => (
    <Chart data={divergingData} height={args.height} margin={{ left: 10, right: 10, bottom: 50 }}>
      <DivergingBarSeries
        positiveField="male"
        negativeField="female"
        nameField="ageGroup"
        positiveColor={args.positiveColor}
        negativeColor={args.negativeColor}
        barPadding={args.barPadding}
        radius={args.radius}
        opacity={args.opacity}
      />
      <Legend items={[
        { key: 'male', label: 'Male', color: args.positiveColor },
        { key: 'female', label: 'Female', color: args.negativeColor },
      ]} />
    </Chart>
  ),
};

export const CustomColors: Story = {
  args: { barPadding: 0.2, radius: 6, opacity: 0.9, positiveColor: PALETTE.teal, negativeColor: PALETTE.violet, height: 420 },
  render: (args) => (
    <Chart data={divergingData} height={args.height} margin={{ left: 10, right: 10, bottom: 50 }}>
      <DivergingBarSeries
        positiveField="male"
        negativeField="female"
        nameField="ageGroup"
        positiveColor={args.positiveColor}
        negativeColor={args.negativeColor}
        barPadding={args.barPadding}
        radius={args.radius}
        opacity={args.opacity}
      />
      <Legend items={[
        { key: 'male', label: 'Male', color: args.positiveColor },
        { key: 'female', label: 'Female', color: args.negativeColor },
      ]} />
    </Chart>
  ),
};

export const Responsive: Story = {
  args: { barPadding: 0.2, radius: 3, opacity: 1, positiveColor: PALETTE.blue, negativeColor: PALETTE.pink, height: 420 },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>{w}px</div>
          <Chart data={divergingData} height={w < 500 ? 320 : args.height} margin={{ left: 10, right: 10, bottom: 50 }}>
            <DivergingBarSeries
              positiveField="male"
              negativeField="female"
              nameField="ageGroup"
              positiveColor={args.positiveColor}
              negativeColor={args.negativeColor}
              barPadding={args.barPadding}
              radius={args.radius}
              opacity={args.opacity}
            />
            <Legend items={[
              { key: 'male', label: 'Male', color: args.positiveColor },
              { key: 'female', label: 'Female', color: args.negativeColor },
            ]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
