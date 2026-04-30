import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { PyramidSeries, Legend } from '@kodemaven/viskit-charts';
import { pyramidData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { PyramidSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders a pyramid chart where each row's width is proportional
 * to its value — ideal for population demographics, funnel stages,
 * or any hierarchical data where size matters.
 *
 * ### Props
 * - `field` — numeric field for segment value
 * - `nameField` — field for row labels
 * - `direction` — `'up'` (widens at bottom) or `'down'` (widens at top)
 * - `gap` — vertical gap between segments in px
 * - `radius` — corner rounding on segments
 * - `opacity` — fill opacity
 */
const meta: Meta = {
  title: 'Phase 5/PyramidSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['up', 'down'], description: 'Pyramid orientation' },
    gap: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Gap between segments (px)' },
    radius: { control: { type: 'range', min: 0, max: 12, step: 1 }, description: 'Corner radius' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Fill opacity' },
    height: { control: { type: 'range', min: 300, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { direction: 'up' | 'down'; gap: number; radius: number; opacity: number; height: number }
type Story = StoryObj<Args>;

const legendItems = pyramidData.map((d, i) => ({
  key: d.ageGroup,
  label: `${d.ageGroup} (${d.population.toLocaleString()})`,
  color: Object.values(PALETTE)[i % 12],
}));

export const Default: Story = {
  args: { direction: 'up', gap: 3, radius: 2, opacity: 1, height: 450 },
  render: (args) => (
    <Chart data={pyramidData} height={args.height} margin={{ bottom: 50 }}>
      <PyramidSeries
        field="population"
        nameField="ageGroup"
        direction={args.direction}
        gap={args.gap}
        radius={args.radius}
        opacity={args.opacity}
      />
      <Legend items={legendItems} />
    </Chart>
  ),
};

export const Inverted: Story = {
  args: { direction: 'down', gap: 3, radius: 4, opacity: 0.9, height: 450 },
  render: (args) => (
    <Chart data={pyramidData} height={args.height} margin={{ bottom: 50 }}>
      <PyramidSeries
        field="population"
        nameField="ageGroup"
        direction={args.direction}
        gap={args.gap}
        radius={args.radius}
        opacity={args.opacity}
      />
      <Legend items={legendItems} />
    </Chart>
  ),
};

export const Responsive: Story = {
  args: { direction: 'up', gap: 3, radius: 2, opacity: 1, height: 400 },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>{w}px</div>
          <Chart data={pyramidData} height={w < 500 ? 300 : args.height} margin={{ bottom: 50 }}>
            <PyramidSeries
              field="population"
              nameField="ageGroup"
              direction={args.direction}
              gap={args.gap}
              radius={args.radius}
              opacity={args.opacity}
            />
            <Legend items={legendItems} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
