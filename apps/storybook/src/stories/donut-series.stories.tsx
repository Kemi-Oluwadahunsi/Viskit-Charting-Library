import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { DonutSeries, Legend } from '@kodemaven/viskit-charts';
import { donutData, pieData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { DonutSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * A dedicated donut chart with configurable thickness, center label,
 * and all pie chart features. Shows a total or hovered segment info
 * in the center — ideal for budget breakdowns, market share, or
 * any part-of-whole visualization.
 *
 * ### Props
 * - `field` — numeric field for segment size
 * - `nameField` — field for segment labels
 * - `thickness` — donut ring width as ratio of radius (0–1)
 * - `centerLabel` — text above total in center
 * - `padAngle` — gap between segments (radians)
 * - `cornerRadius` — arc corner rounding
 * - `opacity` — fill opacity
 */
const meta: Meta = {
  title: 'Phase 5/DonutSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    thickness: { control: { type: 'range', min: 0.15, max: 0.6, step: 0.05 }, description: 'Donut ring thickness (ratio)' },
    padAngle: { control: { type: 'range', min: 0, max: 0.1, step: 0.005 }, description: 'Gap between segments (radians)' },
    cornerRadius: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Arc corner rounding' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Fill opacity' },
    centerLabel: { control: 'text', description: 'Center label text' },
    height: { control: { type: 'range', min: 300, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args {
  thickness: number;
  padAngle: number;
  cornerRadius: number;
  opacity: number;
  centerLabel: string;
  height: number;
}
type Story = StoryObj<Args>;

const budgetLegend = donutData.map((d, i) => ({
  key: d.category,
  label: `${d.category} ($${(d.budget / 1000).toFixed(0)}k)`,
  color: Object.values(PALETTE)[i % 12],
}));

export const Default: Story = {
  args: { thickness: 0.35, padAngle: 0.03, cornerRadius: 3, opacity: 1, centerLabel: 'Total Budget', height: 420 },
  render: (args) => (
    <Chart data={donutData} height={args.height} margin={{ bottom: 50 }}>
      <DonutSeries
        field="budget"
        nameField="category"
        thickness={args.thickness}
        padAngle={args.padAngle}
        cornerRadius={args.cornerRadius}
        opacity={args.opacity}
        centerLabel={args.centerLabel}
      />
      <Legend items={budgetLegend} />
    </Chart>
  ),
};

export const ThinRing: Story = {
  args: { thickness: 0.18, padAngle: 0.02, cornerRadius: 6, opacity: 1, centerLabel: 'Devices', height: 400 },
  render: (args) => (
    <Chart data={pieData} height={args.height} margin={{ bottom: 50 }}>
      <DonutSeries
        field="value"
        nameField="label"
        thickness={args.thickness}
        padAngle={args.padAngle}
        cornerRadius={args.cornerRadius}
        opacity={args.opacity}
        centerLabel={args.centerLabel}
      />
      <Legend items={pieData.map((d, i) => ({
        key: d.label,
        label: `${d.label} (${d.value}%)`,
        color: Object.values(PALETTE)[i % 12],
      }))} />
    </Chart>
  ),
};

export const ThickRing: Story = {
  args: { thickness: 0.55, padAngle: 0.01, cornerRadius: 1, opacity: 0.9, centerLabel: '', height: 400 },
  render: (args) => (
    <Chart data={donutData} height={args.height} margin={{ bottom: 50 }}>
      <DonutSeries
        field="budget"
        nameField="category"
        thickness={args.thickness}
        padAngle={args.padAngle}
        cornerRadius={args.cornerRadius}
        opacity={args.opacity}
        centerLabel={args.centerLabel}
      />
      <Legend items={budgetLegend} />
    </Chart>
  ),
};

export const Responsive: Story = {
  args: { thickness: 0.35, padAngle: 0.03, cornerRadius: 3, opacity: 1, centerLabel: 'Budget', height: 400 },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>{w}px</div>
          <Chart data={donutData} height={w < 500 ? 300 : args.height} margin={{ bottom: 50 }}>
            <DonutSeries
              field="budget"
              nameField="category"
              thickness={args.thickness}
              padAngle={args.padAngle}
              cornerRadius={args.cornerRadius}
              opacity={args.opacity}
              centerLabel={args.centerLabel}
            />
            <Legend items={budgetLegend} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
