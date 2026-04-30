import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { ComparisonSeries, Legend } from '@kodemaven/viskit-charts';
import { comparisonData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { ComparisonSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders a tornado/butterfly chart with side-by-side horizontal bars
 * mirrored around a center label column. Ideal for year-over-year
 * comparisons, A/B test results, or any paired metric analysis.
 *
 * ### Props
 * - `leftField` — field for left-side values
 * - `rightField` — field for right-side values
 * - `nameField` — field for row labels
 * - `leftColor` / `rightColor` — bar color overrides
 * - `barPadding` — padding between rows
 * - `radius` — corner rounding
 * - `opacity` — fill opacity
 * - `showValues` — toggle value labels on bars
 */
const meta: Meta = {
  title: 'Phase 5/ComparisonSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    barPadding: { control: { type: 'range', min: 0.05, max: 0.5, step: 0.05 }, description: 'Bar padding ratio' },
    radius: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Corner radius' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Fill opacity' },
    showValues: { control: 'boolean', description: 'Show value labels' },
    leftColor: { control: 'color', description: 'Left bar color' },
    rightColor: { control: 'color', description: 'Right bar color' },
    height: { control: { type: 'range', min: 300, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args {
  barPadding: number;
  radius: number;
  opacity: number;
  showValues: boolean;
  leftColor: string;
  rightColor: string;
  height: number;
}
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { barPadding: 0.25, radius: 3, opacity: 1, showValues: true, leftColor: PALETTE.amber, rightColor: PALETTE.teal, height: 400 },
  render: (args) => (
    <Chart data={comparisonData} height={args.height} margin={{ top: 24, bottom: 50 }}>
      <ComparisonSeries
        leftField="fy2023"
        rightField="fy2024"
        nameField="metric"
        leftColor={args.leftColor}
        rightColor={args.rightColor}
        barPadding={args.barPadding}
        radius={args.radius}
        opacity={args.opacity}
        showValues={args.showValues}
      />
      <Legend items={[
        { key: 'fy2023', label: 'FY 2023', color: args.leftColor },
        { key: 'fy2024', label: 'FY 2024', color: args.rightColor },
      ]} />
    </Chart>
  ),
};

export const NoValues: Story = {
  args: { barPadding: 0.3, radius: 6, opacity: 0.85, showValues: false, leftColor: PALETTE.indigo, rightColor: PALETTE.pink, height: 400 },
  render: (args) => (
    <Chart data={comparisonData} height={args.height} margin={{ top: 24, bottom: 50 }}>
      <ComparisonSeries
        leftField="fy2023"
        rightField="fy2024"
        nameField="metric"
        leftColor={args.leftColor}
        rightColor={args.rightColor}
        barPadding={args.barPadding}
        radius={args.radius}
        opacity={args.opacity}
        showValues={args.showValues}
      />
      <Legend items={[
        { key: 'fy2023', label: 'FY 2023', color: args.leftColor },
        { key: 'fy2024', label: 'FY 2024', color: args.rightColor },
      ]} />
    </Chart>
  ),
};

export const Responsive: Story = {
  args: { barPadding: 0.25, radius: 3, opacity: 1, showValues: true, leftColor: PALETTE.amber, rightColor: PALETTE.teal, height: 400 },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>{w}px</div>
          <Chart data={comparisonData} height={w < 500 ? 320 : args.height} margin={{ top: 24, bottom: 50 }}>
            <ComparisonSeries
              leftField="fy2023"
              rightField="fy2024"
              nameField="metric"
              leftColor={args.leftColor}
              rightColor={args.rightColor}
              barPadding={args.barPadding}
              radius={args.radius}
              opacity={args.opacity}
              showValues={w >= 500 && args.showValues}
            />
            <Legend items={[
              { key: 'fy2023', label: 'FY 2023', color: args.leftColor },
              { key: 'fy2024', label: 'FY 2024', color: args.rightColor },
            ]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
