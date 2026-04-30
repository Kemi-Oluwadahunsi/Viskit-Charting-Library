import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { MarimekkoSeries, Legend } from '@kodemaven/viskit-charts';
import { marimekkoData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { MarimekkoSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Variable-width stacked bar chart (Marimekko / Mekko). Column widths
 * are proportional to one field; stacked segments show composition.
 * Great for market share × segment breakdowns.
 *
 * ### Props
 * - `widthField` — numeric field controlling column width
 * - `heightFields` — array of numeric fields for stacked segments
 * - `nameField` — label field for columns
 * - `gap` — gap between columns (px)
 * - `radius` — corner radius
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <MarimekkoSeries widthField="width" heightFields={['desktop', 'mobile', 'tablet']} nameField="region" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 4/MarimekkoSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    gap: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Gap between columns (px)' },
    radius: { control: { type: 'range', min: 0, max: 8, step: 1 }, description: 'Corner radius' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { gap: number; radius: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { gap: 2, radius: 3, height: 400 },
  render: (args) => (
    <Chart data={marimekkoData} height={args.height} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal]}>
      <MarimekkoSeries widthField="width" heightFields={['desktop', 'mobile', 'tablet']} nameField="region" gap={args.gap} radius={args.radius} />
      <Legend items={[
        { key: 'desktop', label: 'Desktop', color: PALETTE.indigo },
        { key: 'mobile', label: 'Mobile', color: PALETTE.pink },
        { key: 'tablet', label: 'Tablet', color: PALETTE.teal },
      ]} />
    </Chart>
  ),
};

export const NoGap: Story = {
  args: { gap: 0, radius: 0, height: 400 },
  render: (args) => (
    <Chart data={marimekkoData} height={args.height} colors={[PALETTE.violet, PALETTE.orange, PALETTE.green]}>
      <MarimekkoSeries widthField="width" heightFields={['desktop', 'mobile', 'tablet']} nameField="region" gap={args.gap} radius={args.radius} />
      <Legend items={[
        { key: 'desktop', label: 'Desktop', color: PALETTE.violet },
        { key: 'mobile', label: 'Mobile', color: PALETTE.orange },
        { key: 'tablet', label: 'Tablet', color: PALETTE.green },
      ]} />
    </Chart>
  ),
};

export const Rounded: Story = {
  args: { gap: 4, radius: 8, height: 400 },
  render: (args) => (
    <Chart data={marimekkoData} height={args.height} colors={[PALETTE.blue, PALETTE.amber, PALETTE.rose]}>
      <MarimekkoSeries widthField="width" heightFields={['desktop', 'mobile', 'tablet']} nameField="region" gap={args.gap} radius={args.radius} />
      <Legend items={[
        { key: 'desktop', label: 'Desktop', color: PALETTE.blue },
        { key: 'mobile', label: 'Mobile', color: PALETTE.amber },
        { key: 'tablet', label: 'Tablet', color: PALETTE.rose },
      ]} />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <Chart data={marimekkoData} height={w < 500 ? 260 : 400} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal]}>
            <MarimekkoSeries widthField="width" heightFields={['desktop', 'mobile', 'tablet']} nameField="region" />
            <Legend items={[
              { key: 'desktop', label: 'Desktop', color: PALETTE.indigo },
              { key: 'mobile', label: 'Mobile', color: PALETTE.pink },
              { key: 'tablet', label: 'Tablet', color: PALETTE.teal },
            ]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
