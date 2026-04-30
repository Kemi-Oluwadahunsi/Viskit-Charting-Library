import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { RadarSeries, Legend } from '@kodemaven/viskit-charts';
import { radarMulti, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { RadarSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders a radar (spider) chart with one polygon per value field
 * and axes based on data rows. Each data row is a dimension axis;
 * each value field is a colored polygon.
 *
 * ### Props
 * - `dimensionField` — string field identifying each axis label (e.g. `"dimension"`)
 * - `valueFields` — array of numeric fields, each rendered as a polygon
 * - `colors` — color per polygon
 * - `fillOpacity`, `strokeWidth`, `dotRadius` — visual tuning
 * - `showGrid`, `gridLevels` — concentric grid lines
 * - `showLabels`, `labelColor`, `labelSize` — axis labels
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={400}>
 *   <RadarSeries dimensionField="dimension"
 *     valueFields={['team_a', 'team_b']}
 *     colors={['#818CF8', '#FB7185']} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/RadarSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    fillOpacity: { control: { type: 'range', min: 0, max: 0.6, step: 0.05 }, description: 'Fill opacity' },
    strokeWidth: { control: { type: 'range', min: 1, max: 5, step: 0.5 }, description: 'Line width' },
    dotRadius: { control: { type: 'range', min: 0, max: 8, step: 1 }, description: 'Data point radius' },
    showGrid: { control: 'boolean', description: 'Show grid circles' },
    gridLevels: { control: { type: 'range', min: 2, max: 8, step: 1 }, description: 'Number of grid circles' },
    showLabels: { control: 'boolean', description: 'Show dimension labels' },
    labelSize: { control: { type: 'range', min: 8, max: 16, step: 1 } },
    height: { control: { type: 'range', min: 250, max: 600, step: 10 } },
  },
};
export default meta;

interface RadarArgs {
  fillOpacity: number;
  strokeWidth: number;
  dotRadius: number;
  showGrid: boolean;
  gridLevels: number;
  showLabels: boolean;
  labelSize: number;
  height: number;
}

type Story = StoryObj<RadarArgs>;

export const Default: Story = {
  args: { fillOpacity: 0.15, strokeWidth: 2, dotRadius: 3, showGrid: true, gridLevels: 5, showLabels: true, labelSize: 10, height: 400 },
  render: (args) => (
    <Chart data={radarMulti} height={args.height} title="Team Comparison">
      <RadarSeries
        dimensionField="dimension"
        valueFields={['team_a', 'team_b']}
        colors={[PALETTE.indigo, PALETTE.pink]}
        fillOpacity={args.fillOpacity}
        strokeWidth={args.strokeWidth}
        dotRadius={args.dotRadius}
        showGrid={args.showGrid}
        gridLevels={args.gridLevels}
        showLabels={args.showLabels}
        labelSize={args.labelSize}
      />
      <Legend items={[
        { key: 'team_a', label: 'Team A', color: PALETTE.indigo },
        { key: 'team_b', label: 'Team B', color: PALETTE.pink },
      ]} />
    </Chart>
  ),
};

export const SingleField: Story = {
  render: () => (
    <Chart data={radarMulti} height={400} title="Team A Only">
      <RadarSeries
        dimensionField="dimension"
        valueFields={['team_a']}
        colors={[PALETTE.teal]}
        fillOpacity={0.2}
      />
    </Chart>
  ),
};

export const HighFillOpacity: Story = {
  args: { fillOpacity: 0.45 },
  render: (args) => (
    <Chart data={radarMulti} height={400} title="High Fill Opacity">
      <RadarSeries
        dimensionField="dimension"
        valueFields={['team_a', 'team_b']}
        colors={[PALETTE.violet, PALETTE.amber]}
        fillOpacity={args.fillOpacity}
      />
    </Chart>
  ),
};

export const NoGrid: Story = {
  render: () => (
    <Chart data={radarMulti} height={400} title="No Grid">
      <RadarSeries
        dimensionField="dimension"
        valueFields={['team_a', 'team_b']}
        colors={[PALETTE.indigo, PALETTE.pink]}
        showGrid={false}
      />
    </Chart>
  ),
};

export const ThickLines: Story = {
  render: () => (
    <Chart data={radarMulti} height={400} title="Thick Lines">
      <RadarSeries
        dimensionField="dimension"
        valueFields={['team_a', 'team_b']}
        colors={[PALETTE.cyan, PALETTE.orange]}
        strokeWidth={4}
        dotRadius={5}
      />
    </Chart>
  ),
};

export const ManyGridLevels: Story = {
  args: { gridLevels: 8 },
  render: (args) => (
    <Chart data={radarMulti} height={400} title="Dense Grid">
      <RadarSeries
        dimensionField="dimension"
        valueFields={['team_a', 'team_b']}
        colors={[PALETTE.indigo, PALETTE.pink]}
        gridLevels={args.gridLevels}
      />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[280, 400, 600].map((s) => (
        <div key={s} style={{ width: s, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{s}px</p>
          <Chart data={radarMulti} height={s} title={`${s}px`}>
            <RadarSeries
              dimensionField="dimension"
              valueFields={['team_a', 'team_b']}
              colors={[PALETTE.indigo, PALETTE.pink]}
            />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
