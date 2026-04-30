import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { RidgeLineSeries, Legend } from '@kodemaven/viskit-charts';
import { ridgelineData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { RidgeLineSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Joy plot / ridgeline chart with overlapping area curves stacked
 * vertically. Each field gets its own baseline row with a smooth
 * area fill, creating a layered distribution comparison.
 *
 * ### Props
 * - `fields` — numeric fields to render as ridges
 * - `overlap` — vertical overlap ratio (0–1)
 * - `fillOpacity` — area fill opacity
 * - `strokeWidth` — outline thickness
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <RidgeLineSeries fields={['desktop', 'mobile', 'tablet']} overlap={0.3} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 4/RidgeLineSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    overlap: { control: { type: 'range', min: 0, max: 0.8, step: 0.05 }, description: 'Vertical overlap ratio' },
    fillOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Area fill opacity' },
    strokeWidth: { control: { type: 'range', min: 0.5, max: 4, step: 0.5 }, description: 'Line thickness' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { overlap: number; fillOpacity: number; strokeWidth: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { overlap: 0.3, fillOpacity: 0.6, strokeWidth: 1.5, height: 400 },
  render: (args) => (
    <Chart data={ridgelineData} height={args.height} margin={{ left: 60 }} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal]}>
      <RidgeLineSeries fields={['desktop', 'mobile', 'tablet']} overlap={args.overlap} fillOpacity={args.fillOpacity} strokeWidth={args.strokeWidth} />
      <Legend items={[
        { key: 'desktop', label: 'Desktop', color: PALETTE.indigo },
        { key: 'mobile', label: 'Mobile', color: PALETTE.pink },
        { key: 'tablet', label: 'Tablet', color: PALETTE.teal },
      ]} />
    </Chart>
  ),
};

export const HighOverlap: Story = {
  args: { overlap: 0.6, fillOpacity: 0.5, strokeWidth: 2, height: 400 },
  render: (args) => (
    <Chart data={ridgelineData} height={args.height} margin={{ left: 60 }} colors={[PALETTE.violet, PALETTE.orange, PALETTE.green]}>
      <RidgeLineSeries fields={['desktop', 'mobile', 'tablet']} overlap={args.overlap} fillOpacity={args.fillOpacity} strokeWidth={args.strokeWidth} />
      <Legend items={[
        { key: 'desktop', label: 'Desktop', color: PALETTE.violet },
        { key: 'mobile', label: 'Mobile', color: PALETTE.orange },
        { key: 'tablet', label: 'Tablet', color: PALETTE.green },
      ]} />
    </Chart>
  ),
};

export const NoOverlap: Story = {
  args: { overlap: 0, fillOpacity: 0.7, strokeWidth: 1.5, height: 500 },
  render: (args) => (
    <Chart data={ridgelineData} height={args.height} margin={{ left: 60 }} colors={[PALETTE.blue, PALETTE.rose, PALETTE.amber]}>
      <RidgeLineSeries fields={['desktop', 'mobile', 'tablet']} overlap={args.overlap} fillOpacity={args.fillOpacity} strokeWidth={args.strokeWidth} />
      <Legend items={[
        { key: 'desktop', label: 'Desktop', color: PALETTE.blue },
        { key: 'mobile', label: 'Mobile', color: PALETTE.rose },
        { key: 'tablet', label: 'Tablet', color: PALETTE.amber },
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
          <Chart data={ridgelineData} height={w < 500 ? 260 : 400} margin={{ left: w < 500 ? 55 : 60 }} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal]}>
            <RidgeLineSeries fields={['desktop', 'mobile', 'tablet']} overlap={0.3} />
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
