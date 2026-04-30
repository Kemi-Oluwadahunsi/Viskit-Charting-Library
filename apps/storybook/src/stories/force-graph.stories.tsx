import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { ForceGraph, Legend } from '@kodemaven/viskit-charts';
import { forceNodes, forceLinks, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { ForceGraph } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders a force-directed graph where nodes are positioned by a physics
 * simulation. Nodes repel each other while links pull connected nodes
 * together, creating an organic network layout.
 *
 * ### Props
 * - `nodes` — array of `{ id, group? }` objects
 * - `links` — array of `{ source, target }` referencing node ids
 * - `radius` — node circle radius
 * - `charge` — repulsion strength (negative values)
 * - `linkDistance` — ideal link length in px
 *
 * ### Usage
 * ```tsx
 * <Chart data={[]} height={450}>
 *   <ForceGraph nodes={nodes} links={links} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/ForceGraph',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    radius: { control: { type: 'range', min: 4, max: 20, step: 1 }, description: 'Node circle radius' },
    charge: { control: { type: 'range', min: -300, max: -10, step: 10 }, description: 'Repulsion strength' },
    linkDistance: { control: { type: 'range', min: 30, max: 200, step: 10 }, description: 'Ideal link length (px)' },
    height: { control: { type: 'range', min: 300, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { radius: number; charge: number; linkDistance: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { radius: 8, charge: -120, linkDistance: 80, height: 450 },
  render: (args) => (
    <Chart data={[]} height={args.height} colors={[PALETTE.indigo, PALETTE.pink, PALETTE.teal, PALETTE.amber]}>
      <ForceGraph nodes={forceNodes} links={forceLinks} radius={args.radius} charge={args.charge} linkDistance={args.linkDistance} />
      <Legend items={[
        { key: '0', label: 'React Ecosystem' },
        { key: '1', label: 'Deployment' },
        { key: '2', label: 'Server' },
        { key: '3', label: 'Database' },
      ]} />
    </Chart>
  ),
};

export const LargeNodes: Story = {
  args: { radius: 16, charge: -200, linkDistance: 120, height: 500 },
  render: (args) => (
    <Chart data={[]} height={args.height}>
      <ForceGraph nodes={forceNodes} links={forceLinks} radius={args.radius} charge={args.charge} linkDistance={args.linkDistance} />
    </Chart>
  ),
};

export const TightCluster: Story = {
  args: { radius: 8, charge: -40, linkDistance: 40, height: 400 },
  render: (args) => (
    <Chart data={[]} height={args.height}>
      <ForceGraph nodes={forceNodes} links={forceLinks} radius={args.radius} charge={args.charge} linkDistance={args.linkDistance} />
    </Chart>
  ),
};

export const SpreadOut: Story = {
  args: { radius: 10, charge: -250, linkDistance: 150, height: 550 },
  render: (args) => (
    <Chart data={[]} height={args.height}>
      <ForceGraph nodes={forceNodes} links={forceLinks} radius={args.radius} charge={args.charge} linkDistance={args.linkDistance} />
    </Chart>
  ),
};
