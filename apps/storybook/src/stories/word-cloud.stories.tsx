import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { WordCloud } from '@kodemaven/viskit-charts';
import { wordCloudData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { WordCloud } from '@kodemaven/viskit-charts';
 * ```
 *
 * Tag cloud with spiral placement. Font size is proportional to the
 * value field; words are placed using a spiral algorithm with
 * collision detection.
 *
 * ### Props
 * - `textField` — string field for word text
 * - `valueField` — numeric field for sizing
 * - `minFontSize` / `maxFontSize` — font size range
 * - `rotations` — array of rotation angles (degrees)
 * - `fontFamily` — font family
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <WordCloud textField="word" valueField="frequency" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 4/WordCloud',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    minFontSize: { control: { type: 'range', min: 8, max: 24, step: 1 }, description: 'Minimum font size' },
    maxFontSize: { control: { type: 'range', min: 24, max: 80, step: 2 }, description: 'Maximum font size' },
    fontFamily: { control: 'text', description: 'Font family' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { minFontSize: number; maxFontSize: number; fontFamily: string; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { minFontSize: 12, maxFontSize: 48, fontFamily: 'Inter, system-ui, sans-serif', height: 400 },
  render: (args) => (
    <Chart data={wordCloudData} height={args.height} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber, PALETTE.violet, PALETTE.orange, PALETTE.blue, PALETTE.red, PALETTE.green, PALETTE.rose]}>
      <WordCloud textField="word" valueField="frequency" minFontSize={args.minFontSize} maxFontSize={args.maxFontSize} fontFamily={args.fontFamily} />
    </Chart>
  ),
};

export const LargeText: Story = {
  args: { minFontSize: 16, maxFontSize: 72, fontFamily: 'Inter, system-ui, sans-serif', height: 500 },
  render: (args) => (
    <Chart data={wordCloudData} height={args.height} colors={[PALETTE.violet, PALETTE.cyan, PALETTE.lime, PALETTE.pink, PALETTE.blue, PALETTE.orange, PALETTE.green, PALETTE.amber, PALETTE.red, PALETTE.teal]}>
      <WordCloud textField="word" valueField="frequency" minFontSize={args.minFontSize} maxFontSize={args.maxFontSize} fontFamily={args.fontFamily} />
    </Chart>
  ),
};

export const WithRotation: Story = {
  args: { minFontSize: 12, maxFontSize: 48, fontFamily: 'Inter, system-ui, sans-serif', height: 400 },
  render: (args) => (
    <Chart data={wordCloudData} height={args.height} colors={[PALETTE.blue, PALETTE.rose, PALETTE.amber, PALETTE.teal, PALETTE.violet, PALETTE.pink, PALETTE.green, PALETTE.orange, PALETTE.red, PALETTE.cyan]}>
      <WordCloud textField="word" valueField="frequency" minFontSize={args.minFontSize} maxFontSize={args.maxFontSize} fontFamily={args.fontFamily} rotations={[0, -45, 45, 90]} />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <Chart data={wordCloudData} height={w < 500 ? 260 : 400} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber, PALETTE.violet, PALETTE.orange, PALETTE.blue, PALETTE.red, PALETTE.green, PALETTE.rose]}>
            <WordCloud textField="word" valueField="frequency" minFontSize={w < 500 ? 10 : 12} maxFontSize={w < 500 ? 32 : 48} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
