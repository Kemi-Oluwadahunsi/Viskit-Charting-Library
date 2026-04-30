import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { CalendarHeatmap, Legend } from '@kodemaven/viskit-charts';
import { calendarData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { CalendarHeatmap } from '@kodemaven/viskit-charts';
 * ```
 *
 * GitHub-style calendar grid showing daily values across an entire year.
 * Each cell represents a day; color intensity maps to value magnitude.
 *
 * ### Props
 * - `dateField` — ISO date string field
 * - `valueField` — numeric field for color intensity
 * - `colors` — color range (default: green sequential)
 * - `radius` — cell corner radius
 * - `cellGap` — gap between cells
 * - `emptyColor` — color for zero/missing days
 *
 * ### Usage
 * ```tsx
 * <Chart data={dailyData} height={180}>
 *   <CalendarHeatmap dateField="date" valueField="commits" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 4/CalendarHeatmap',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    radius: { control: { type: 'range', min: 0, max: 6, step: 0.5 }, description: 'Cell corner radius' },
    cellGap: { control: { type: 'range', min: 1, max: 6, step: 0.5 }, description: 'Gap between cells' },
    emptyColor: { control: 'color', description: 'Empty day fill color' },
    height: { control: { type: 'range', min: 100, max: 300, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { radius: number; cellGap: number; emptyColor: string; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { radius: 2, cellGap: 2, emptyColor: '#1e293b', height: 180 },
  render: (args) => (
    <Chart data={calendarData} height={args.height}>
      <CalendarHeatmap dateField="date" valueField="commits" radius={args.radius} cellGap={args.cellGap} emptyColor={args.emptyColor} />
      <Legend items={[
        { key: 'low', label: '0–3 commits', color: '#bbf7d0' },
        { key: 'mid', label: '4–7 commits', color: '#22c55e' },
        { key: 'high', label: '8+ commits', color: '#15803d' },
      ]} />
    </Chart>
  ),
};

export const RoundedCells: Story = {
  args: { radius: 5, cellGap: 3, emptyColor: '#1e293b', height: 180 },
  render: (args) => (
    <Chart data={calendarData} height={args.height}>
      <CalendarHeatmap dateField="date" valueField="commits" radius={args.radius} cellGap={args.cellGap} emptyColor={args.emptyColor} />
    </Chart>
  ),
};

export const TightGrid: Story = {
  args: { radius: 1, cellGap: 1, height: 160 },
  render: (args) => (
    <Chart data={calendarData} height={args.height}>
      <CalendarHeatmap dateField="date" valueField="commits" radius={args.radius} cellGap={args.cellGap} />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <Chart data={calendarData} height={w < 500 ? 140 : 180}>
            <CalendarHeatmap dateField="date" valueField="commits" />
            <Legend items={[
              { key: 'low', label: '0–3', color: '#bbf7d0' },
              { key: 'mid', label: '4–7', color: '#22c55e' },
              { key: 'high', label: '8+', color: '#15803d' },
            ]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
