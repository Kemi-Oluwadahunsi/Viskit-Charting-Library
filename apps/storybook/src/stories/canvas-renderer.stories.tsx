import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { CanvasRenderer, CartesianGrid, XAxis, YAxis, ScatterSeries } from '@viskit/charts';
import { ChartWrapper, PALETTE, scatterData } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { CanvasRenderer } from '@viskit/charts';
 * ```
 *
 * High-performance Canvas backend for rendering large datasets (5,000+ points).
 * Automatically falls back to SVG when data is below the threshold.
 *
 * Supports scatter, bubble, and heatmap rendering modes with hover detection
 * and animated fade-in. Respects `prefers-reduced-motion`.
 *
 * ### Usage
 * ```tsx
 * <Chart data={bigData} height={400}>
 *   <CanvasRenderer field="value" mode="scatter" threshold={5000} />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 2/CanvasRenderer',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'select', options: ['scatter', 'bubble', 'heatmap'], description: 'Rendering mode' },
    color: { control: 'color', description: 'Point color' },
    radius: { control: { type: 'range', min: 1, max: 10, step: 0.5 }, description: 'Point radius' },
    opacity: { control: { type: 'range', min: 0.1, max: 1, step: 0.05 }, description: 'Fill opacity' },
    threshold: { control: { type: 'number' }, description: 'SVG→Canvas switch threshold' },
    tooltipVariant: {
      control: 'select',
      options: ['default', 'minimal', 'compact', 'gradient', 'outline'],
      description: 'Tooltip visual variant',
    },
  },
};
export default meta;

interface CanvasArgs {
  mode: 'scatter' | 'bubble' | 'heatmap';
  color: string;
  radius: number;
  opacity: number;
  threshold: number;
  tooltipVariant: string;
}

type Story = StoryObj<CanvasArgs>;

// ── Generate large scatter dataset ──────────────
function generateLargeScatter(count: number) {
  const categories = Array.from({ length: Math.min(count, 200) }, (_, i) => `P${i}`);
  let seed = 42;
  const next = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  return categories.map((label) => ({
    label,
    value: Math.round(next() * 1000),
    size: Math.round(next() * 50) + 5,
  }));
}

const largeData = generateLargeScatter(200);
const massiveData = generateLargeScatter(150);

// ── Stories ─────────────────────────────────────

/** SVG fallback — data below threshold renders as standard SVG circles */
export const SVGFallback: Story = {
  args: { color: PALETTE.indigo, radius: 4, opacity: 0.8, threshold: 5000, mode: 'scatter', tooltipVariant: 'default' },
  render: (args) => (
    <Chart data={scatterData} height={320}>
      <CartesianGrid />
      <XAxis />
      <YAxis />
      <CanvasRenderer
        field="conversions"
        mode={args.mode}
        color={args.color}
        radius={args.radius}
        opacity={args.opacity}
        threshold={args.threshold}
      />
    </Chart>
  ),
};

/** Canvas mode — 200 points rendered on HTML Canvas overlay */
export const CanvasScatter: Story = {
  args: { color: PALETTE.teal, radius: 3, opacity: 0.7, threshold: 50, mode: 'scatter', tooltipVariant: 'default' },
  render: (args) => (
    <Chart data={largeData} height={400}>
      <CartesianGrid />
      <XAxis />
      <YAxis />
      <CanvasRenderer
        field="value"
        mode="scatter"
        color={args.color}
        radius={args.radius}
        opacity={args.opacity}
        threshold={args.threshold}
      />
    </Chart>
  ),
};

/** Bubble mode — circles sized by a secondary field */
export const CanvasBubble: Story = {
  args: { color: PALETTE.violet, radius: 3, opacity: 0.6, threshold: 50, mode: 'bubble', tooltipVariant: 'default' },
  render: (args) => (
    <Chart data={largeData} height={400}>
      <CartesianGrid />
      <XAxis />
      <YAxis />
      <CanvasRenderer
        field="value"
        sizeField="size"
        mode="bubble"
        color={args.color}
        opacity={args.opacity}
        threshold={args.threshold}
        minRadius={2}
        maxRadius={14}
      />
    </Chart>
  ),
};

/** Side-by-side comparison of SVG scatter vs Canvas scatter */
export const SVGvsCanvas: Story = {
  args: { color: PALETTE.blue, radius: 3, opacity: 0.7, threshold: 50, mode: 'scatter', tooltipVariant: 'default' },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <div>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', margin: '0 0 8px' }}>
          SVG ({massiveData.length} points)
        </p>
        <Chart data={massiveData} height={300}>
          <CartesianGrid />
          <XAxis />
          <YAxis />
          <ScatterSeries field="value" color={args.color} radius={args.radius} />
        </Chart>
      </div>
      <div>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', margin: '0 0 8px' }}>
          Canvas ({massiveData.length} points)
        </p>
        <Chart data={massiveData} height={300}>
          <CartesianGrid />
          <XAxis />
          <YAxis />
          <CanvasRenderer
            field="value"
            mode="scatter"
            color={args.color}
            radius={args.radius}
            opacity={args.opacity}
            threshold={args.threshold}
          />
        </Chart>
      </div>
    </div>
  ),
};

/** Custom color with high opacity */
export const CustomStyling: Story = {
  args: { color: PALETTE.pink, radius: 5, opacity: 0.9, threshold: 50, mode: 'scatter', tooltipVariant: 'gradient' },
  render: (args) => (
    <Chart data={largeData} height={400}>
      <CartesianGrid />
      <XAxis />
      <YAxis />
      <CanvasRenderer
        field="value"
        mode="scatter"
        color={args.color}
        radius={args.radius}
        opacity={args.opacity}
        threshold={args.threshold}
      />
    </Chart>
  ),
};
