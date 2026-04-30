import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { VennDiagram, Legend } from '@kodemaven/viskit-charts';
import { vennSets, vennIntersections, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { VennDiagram } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders overlapping circles representing set relationships.
 * Supports 2 or 3 sets with labeled intersection regions —
 * ideal for showing skill overlaps, audience segments, or
 * feature comparisons.
 *
 * ### Props
 * - `sets` — array of `{ key, label, size, color? }` objects
 * - `intersections` — array of `{ sets: string[], size, label? }` objects
 * - `showLabels` — toggle label visibility
 * - `opacity` — circle fill opacity
 * - `strokeWidth` — circle border width
 */
const meta: Meta = {
  title: 'Phase 5/VennDiagram',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    showLabels: { control: 'boolean', description: 'Show set labels' },
    opacity: { control: { type: 'range', min: 0.1, max: 0.7, step: 0.05 }, description: 'Circle fill opacity' },
    strokeWidth: { control: { type: 'range', min: 0, max: 5, step: 0.5 }, description: 'Circle border width' },
    height: { control: { type: 'range', min: 300, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { showLabels: boolean; opacity: number; strokeWidth: number; height: number }
type Story = StoryObj<Args>;

const coloredSets = vennSets.map((s, i) => ({
  ...s,
  color: [PALETTE.indigo, PALETTE.pink, PALETTE.teal][i],
}));

export const Default: Story = {
  args: { showLabels: true, opacity: 0.35, strokeWidth: 2, height: 420 },
  render: (args) => (
    <Chart data={[]} height={args.height} margin={{ bottom: 50 }}>
      <VennDiagram
        sets={coloredSets}
        intersections={vennIntersections}
        showLabels={args.showLabels}
        opacity={args.opacity}
        strokeWidth={args.strokeWidth}
      />
      <Legend items={coloredSets.map((s) => ({
        key: s.key,
        label: `${s.label} (${s.size})`,
        color: s.color,
      }))} />
    </Chart>
  ),
};

export const TwoSets: Story = {
  args: { showLabels: true, opacity: 0.35, strokeWidth: 2, height: 400 },
  render: (args) => {
    const twoSets = [
      { key: 'Frontend', label: 'Frontend', size: 150, color: PALETTE.violet },
      { key: 'Backend', label: 'Backend', size: 130, color: PALETTE.amber },
    ];
    const twoInt = [{ sets: ['Frontend', 'Backend'], size: 60, label: 'Fullstack: 60' }];
    return (
      <Chart data={[]} height={args.height} margin={{ bottom: 50 }}>
        <VennDiagram
          sets={twoSets}
          intersections={twoInt}
          showLabels={args.showLabels}
          opacity={args.opacity}
          strokeWidth={args.strokeWidth}
        />
        <Legend items={twoSets.map((s) => ({
          key: s.key,
          label: `${s.label} (${s.size})`,
          color: s.color,
        }))} />
      </Chart>
    );
  },
};

export const Responsive: Story = {
  args: { showLabels: true, opacity: 0.35, strokeWidth: 2, height: 400 },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {[350, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>{w}px</div>
          <Chart data={[]} height={w < 500 ? 300 : args.height} margin={{ bottom: 50 }}>
            <VennDiagram
              sets={coloredSets}
              intersections={vennIntersections}
              showLabels={args.showLabels}
              opacity={args.opacity}
              strokeWidth={args.strokeWidth}
            />
            <Legend items={coloredSets.map((s) => ({
              key: s.key,
              label: `${s.label} (${s.size})`,
              color: s.color,
            }))} />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
