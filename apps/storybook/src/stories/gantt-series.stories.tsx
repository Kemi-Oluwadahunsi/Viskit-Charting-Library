import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { GanttSeries, Legend } from '@kodemaven/viskit-charts';
import { ganttData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { GanttSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Horizontal timeline bar chart for project management. Each row
 * represents a task with start/end positions. Optionally shows
 * a progress overlay.
 *
 * ### Props
 * - `startField` — numeric field for bar start
 * - `endField` — numeric field for bar end
 * - `nameField` — label field for rows
 * - `progressField` — optional numeric (0–100) for progress overlay
 * - `barHeight` — height of each bar in px
 * - `radius` — corner radius
 * - `progressColor` — color for progress overlay
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={300}>
 *   <GanttSeries startField="start" endField="end" nameField="task" progressField="progress" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 4/GanttSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    barHeight: { control: { type: 'range', min: 10, max: 40, step: 2 }, description: 'Bar height (px)' },
    radius: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Corner radius' },
    progressColor: { control: 'color', description: 'Progress bar color override' },
    height: { control: { type: 'range', min: 200, max: 500, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { barHeight: number; radius: number; progressColor: string; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { barHeight: 24, radius: 4, progressColor: 'rgba(99, 102, 241, 0.4)', height: 350 },
  render: (args) => (
    <Chart data={ganttData} height={args.height} margin={{ left: 70 }} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber, PALETTE.violet, PALETTE.orange]}>
      <GanttSeries startField="start" endField="end" nameField="task" progressField="progress" barHeight={args.barHeight} radius={args.radius} progressColor={args.progressColor} />
      <Legend items={[
        { key: 'task', label: 'Task Duration', color: PALETTE.indigo },
        { key: 'progress', label: 'Progress', color: 'rgba(99, 102, 241, 0.4)' },
      ]} />
    </Chart>
  ),
};

export const WithoutProgress: Story = {
  args: { barHeight: 20, radius: 3, height: 300 },
  render: (args) => (
    <Chart data={ganttData} height={args.height} margin={{ left: 70 }} colors={[PALETTE.blue, PALETTE.rose, PALETTE.green, PALETTE.cyan, PALETTE.lime, PALETTE.red]}>
      <GanttSeries startField="start" endField="end" nameField="task" barHeight={args.barHeight} radius={args.radius} />
      <Legend items={[
        { key: 'task', label: 'Task Duration', color: PALETTE.blue },
      ]} />
    </Chart>
  ),
};

export const ThickBars: Story = {
  args: { barHeight: 36, radius: 6, height: 400 },
  render: (args) => (
    <Chart data={ganttData} height={args.height} margin={{ left: 70 }} colors={[PALETTE.violet, PALETTE.orange, PALETTE.teal, PALETTE.pink, PALETTE.blue, PALETTE.amber]}>
      <GanttSeries startField="start" endField="end" nameField="task" progressField="progress" barHeight={args.barHeight} radius={args.radius} progressColor={PALETTE.green} />
      <Legend items={[
        { key: 'task', label: 'Task Duration', color: PALETTE.violet },
        { key: 'progress', label: 'Progress', color: PALETTE.green },
      ]} />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: '0 0 4px' }}>{w}px</p>
          <Chart data={ganttData} height={w < 500 ? 220 : 320} margin={{ left: w < 500 ? 60 : 70, bottom: 30 }} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber, PALETTE.violet, PALETTE.orange]}>
            <GanttSeries startField="start" endField="end" nameField="task" progressField="progress" barHeight={w < 500 ? 16 : 24} />
            <Legend items={[
              { key: 'task', label: 'Task Duration', color: PALETTE.indigo },
              { key: 'progress', label: 'Progress', color: 'rgba(99, 102, 241, 0.4)' },
            ]} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
