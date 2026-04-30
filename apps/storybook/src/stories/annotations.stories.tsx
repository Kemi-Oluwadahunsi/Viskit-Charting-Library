import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { LineSeries, Annotations } from '@kodemaven/viskit-charts';
import type { AnnotationItem } from '@kodemaven/viskit-charts';
import { monthlyMetrics, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { LineSeries, Annotations } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders text labels, circles, arrows, and rectangles at specified
 * pixel coordinates within the chart. Use for callouts, highlights,
 * and custom annotations.
 *
 * ### Annotation types
 * - `text` — label at (x, y)
 * - `circle` — circle outline at (x, y)
 * - `arrow` — line with arrowhead from (x, y) by (dx, dy)
 * - `rect` — rectangle at (x, y) with width/height
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={300}>
 *   <LineSeries field="value" />
 *   <Annotations items={[
 *     { type: 'text', x: 100, y: 50, text: 'Peak' },
 *   ]} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 4/Annotations',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

const textAnnotations: AnnotationItem[] = [
  { type: 'text', x: 250, y: 30, text: 'Revenue Peak', color: PALETTE.indigo, fontSize: 13, fontWeight: 700 },
  { type: 'circle', x: 250, y: 60, radius: 6, color: PALETTE.indigo, fill: 'rgba(129, 140, 248, 0.2)' },
];

export const TextLabels: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={350} colors={[PALETTE.indigo]}>
      <LineSeries field="revenue" />
      <Annotations items={textAnnotations} />
    </Chart>
  ),
};

const arrowAnnotations: AnnotationItem[] = [
  { type: 'arrow', x: 180, y: 40, dx: 0, dy: 40, color: PALETTE.red, strokeWidth: 2 },
  { type: 'text', x: 180, y: 30, text: 'Drop', color: PALETTE.red, fontSize: 11, anchor: 'middle' },
];

export const ArrowCallout: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={350} colors={[PALETTE.teal]}>
      <LineSeries field="cost" />
      <Annotations items={arrowAnnotations} />
    </Chart>
  ),
};

const mixedAnnotations: AnnotationItem[] = [
  { type: 'rect', x: 100, y: 20, width: 120, height: 40, color: PALETTE.amber, fill: 'rgba(251, 191, 36, 0.1)', rx: 4 },
  { type: 'text', x: 160, y: 40, text: 'Highlight', color: PALETTE.amber, fontSize: 12, anchor: 'middle' },
  { type: 'circle', x: 320, y: 80, radius: 20, color: PALETTE.pink, fill: 'rgba(251, 113, 133, 0.1)' },
  { type: 'arrow', x: 320, y: 105, dx: 0, dy: 25, color: PALETTE.pink },
];

export const MixedAnnotations: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={350} colors={[PALETTE.indigo]}>
      <LineSeries field="revenue" />
      <Annotations items={mixedAnnotations} />
    </Chart>
  ),
};
