import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { TimelineSeries, Legend } from '@kodemaven/viskit-charts';
import { timelineEvents, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { TimelineSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders events on a horizontal timeline with labeled markers
 * and optional duration ranges. Supports both point events and
 * ranged events with swim lanes for categories.
 *
 * ### Props
 * - `startField` — field for start time (number or Date)
 * - `endField` — field for end time (omit for point markers)
 * - `nameField` — field for event labels
 * - `categoryField` — field for swim lane grouping
 * - `markerSize` — size of point markers
 * - `barHeight` — height of range bars
 * - `radius` — corner radius on range bars
 * - `opacity` — fill opacity
 */
const meta: Meta = {
  title: 'Phase 5/TimelineSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    markerSize: { control: { type: 'range', min: 4, max: 16, step: 1 }, description: 'Point marker size' },
    barHeight: { control: { type: 'range', min: 10, max: 40, step: 2 }, description: 'Range bar height (px)' },
    radius: { control: { type: 'range', min: 0, max: 10, step: 1 }, description: 'Corner radius' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Fill opacity' },
    height: { control: { type: 'range', min: 250, max: 500, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { markerSize: number; barHeight: number; radius: number; opacity: number; height: number }
type Story = StoryObj<Args>;

const categories = ['Planning', 'Design', 'Dev', 'Testing', 'Release'];
const catColors = [PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber, PALETTE.violet];

export const Default: Story = {
  args: { markerSize: 8, barHeight: 20, radius: 4, opacity: 1, height: 380 },
  render: (args) => (
    <Chart data={timelineEvents} height={args.height} margin={{ top: 20, bottom: 50 }}>
      <TimelineSeries
        startField="date"
        endField="endDate"
        nameField="event"
        categoryField="category"
        markerSize={args.markerSize}
        barHeight={args.barHeight}
        radius={args.radius}
        opacity={args.opacity}
      />
      <Legend items={categories.map((c, i) => ({
        key: c,
        label: c,
        color: catColors[i],
      }))} />
    </Chart>
  ),
};

export const PointEvents: Story = {
  args: { markerSize: 10, barHeight: 20, radius: 4, opacity: 1, height: 350 },
  render: (args) => {
    const pointEvents = [
      { event: 'v1.0 Release', date: 10, category: 'Release' },
      { event: 'v1.1 Patch', date: 25, category: 'Release' },
      { event: 'Team Offsite', date: 38, category: 'Planning' },
      { event: 'v2.0 Beta', date: 50, category: 'Release' },
      { event: 'Conference', date: 62, category: 'Planning' },
      { event: 'v2.0 GA', date: 75, category: 'Release' },
    ];
    return (
      <Chart data={pointEvents} height={args.height} margin={{ top: 30, bottom: 50 }}>
        <TimelineSeries
          startField="date"
          nameField="event"
          categoryField="category"
          markerSize={args.markerSize}
          opacity={args.opacity}
        />
        <Legend items={[
          { key: 'Release', label: 'Release', color: PALETTE.teal },
          { key: 'Planning', label: 'Planning', color: PALETTE.indigo },
        ]} />
      </Chart>
    );
  },
};

export const Responsive: Story = {
  args: { markerSize: 8, barHeight: 18, radius: 4, opacity: 1, height: 380 },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>{w}px</div>
          <Chart data={timelineEvents} height={w < 500 ? 280 : args.height} margin={{ top: 20, bottom: 50 }}>
            <TimelineSeries
              startField="date"
              endField="endDate"
              nameField="event"
              categoryField="category"
              markerSize={w < 500 ? 6 : args.markerSize}
              barHeight={w < 500 ? 14 : args.barHeight}
              radius={args.radius}
              opacity={args.opacity}
            />
            <Legend items={categories.map((c, i) => ({
              key: c,
              label: c,
              color: catColors[i],
            }))} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
