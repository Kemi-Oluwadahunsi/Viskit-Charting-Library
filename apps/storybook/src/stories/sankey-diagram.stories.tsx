import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { SankeyDiagram } from '@viskit/charts';
import { sankeyNodes, sankeyLinks, ChartWrapper } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { SankeyDiagram } from '@viskit/charts';
 * ```
 *
 * Renders a Sankey flow diagram showing weighted relationships between nodes.
 * Energy, money, or materials flow from left to right through curved links
 * whose width represents magnitude.
 *
 * ### Props
 * - `nodes` — array of `{ name }` objects
 * - `links` — array of `{ source, target, value }` where source/target are node names
 * - `nodeWidth` — width of node rectangles in px
 * - `nodePadding` — vertical gap between nodes in px
 * - `align` — node alignment: `left`, `right`, `center`, `justify`
 * - `linkOpacity` — opacity of flow links
 *
 * ### Usage
 * ```tsx
 * <Chart data={[]} height={450}>
 *   <SankeyDiagram nodes={nodes} links={links} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/SankeyDiagram',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    nodeWidth: { control: { type: 'range', min: 5, max: 30, step: 1 }, description: 'Node rectangle width (px)' },
    nodePadding: { control: { type: 'range', min: 2, max: 30, step: 1 }, description: 'Vertical gap between nodes' },
    align: { control: 'select', options: ['left', 'right', 'center', 'justify'], description: 'Node alignment strategy' },
    linkOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Flow link opacity' },
    height: { control: { type: 'range', min: 300, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { nodeWidth: number; nodePadding: number; align: string; linkOpacity: number; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { nodeWidth: 16, nodePadding: 12, align: 'justify', linkOpacity: 0.4, height: 450 },
  render: (args) => (
    <Chart data={[]} height={args.height}>
      <SankeyDiagram
        nodes={sankeyNodes}
        links={sankeyLinks}
        nodeWidth={args.nodeWidth}
        nodePadding={args.nodePadding}
        align={args.align as 'justify'}
        linkOpacity={args.linkOpacity}
      />
    </Chart>
  ),
};

export const LeftAligned: Story = {
  args: { nodeWidth: 20, nodePadding: 16, align: 'left', linkOpacity: 0.35, height: 450 },
  render: (args) => (
    <Chart data={[]} height={args.height}>
      <SankeyDiagram nodes={sankeyNodes} links={sankeyLinks} nodeWidth={args.nodeWidth} nodePadding={args.nodePadding} align="left" linkOpacity={args.linkOpacity} />
    </Chart>
  ),
};
