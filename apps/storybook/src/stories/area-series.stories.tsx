import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@viskit/core';
import { AreaSeries, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from '@viskit/charts';
import type { TooltipVariant } from '@viskit/charts';
import { monthlyMetrics, weeklyData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@viskit/core';
 * import { AreaSeries, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from '@viskit/charts';
 * ```
 *
 * Renders a filled area beneath a line. Supports gradient fills,
 * multiple curve types, layered areas, and custom opacity.
 *
 * ### Usage
 * ```tsx
 * <Chart data={data} height={300}>
 *   <AreaSeries field="revenue" color="#818CF8" gradient />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 1/AreaSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    field: { control: 'select', options: ['revenue', 'cost', 'profit', 'users'], description: 'Numeric field to plot' },
    color: { control: 'color', description: 'Area fill color' },
    gradient: { control: 'boolean', description: 'Enable gradient fill' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Fill opacity' },
    strokeWidth: { control: { type: 'range', min: 0, max: 5, step: 0.5 }, description: 'Stroke width' },
    curve: { control: 'select', options: ['monotone', 'linear', 'natural', 'basis', 'step'], description: 'Curve type' },
    height: { control: { type: 'range', min: 150, max: 600, step: 10 }, description: 'Chart height' },
    tooltipVariant: { control: 'select', options: ['default', 'minimal', 'compact', 'gradient', 'outline'] as TooltipVariant[], description: 'Tooltip style variant' },
  },
};
export default meta;

interface AreaArgs {
  field: string;
  color: string;
  gradient: boolean;
  opacity: number;
  strokeWidth: number;
  curve: 'linear' | 'monotone' | 'step' | 'basis' | 'cardinal' | 'catmull-rom' | 'natural';
  height: number;
  tooltipVariant: TooltipVariant;
}

type Story = StoryObj<AreaArgs>;

export const Default: Story = {
  args: { field: 'revenue', color: PALETTE.indigo, gradient: true, opacity: 0.3, strokeWidth: 2, curve: 'monotone', height: 350, tooltipVariant: 'gradient' },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="Revenue Area">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <AreaSeries field={args.field} color={args.color} gradient={args.gradient} opacity={args.opacity} strokeWidth={args.strokeWidth} curve={args.curve} />
      <Tooltip variant={args.tooltipVariant} />
    </Chart>
  ),
};

export const WithGradient: Story = {
  args: { field: 'profit', color: PALETTE.teal, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="Gradient Fill">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <AreaSeries field={args.field} color={args.color} gradient opacity={0.5} />
      <Tooltip />
    </Chart>
  ),
};

export const MultiArea: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={400} title="Layered Areas">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <AreaSeries field="revenue" color={PALETTE.indigo} opacity={0.2} gradient />
      <AreaSeries field="cost" color={PALETTE.pink} opacity={0.2} gradient />
      <AreaSeries field="profit" color={PALETTE.teal} opacity={0.3} gradient />
      <Legend />
      <Tooltip />
    </Chart>
  ),
};

export const LinearCurve: Story = {
  render: () => (
    <Chart data={weeklyData} height={300} title="Linear Curve">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <AreaSeries field="pageViews" color={PALETTE.blue} curve="linear" gradient opacity={0.35} />
      <Tooltip />
    </Chart>
  ),
};

export const HighOpacity: Story = {
  args: { field: 'revenue', color: PALETTE.violet, opacity: 0.8, height: 350 },
  render: (args) => (
    <Chart data={monthlyMetrics} height={args.height} title="High Opacity">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <AreaSeries field={args.field} color={args.color} opacity={args.opacity} />
    </Chart>
  ),
};

export const StepCurve: Story = {
  render: () => (
    <Chart data={monthlyMetrics} height={300} title="Step Area">
      <CartesianGrid />
      <XAxis />
      <YAxis format="compact" />
      <AreaSeries field="target" color={PALETTE.amber} curve="step" opacity={0.25} gradient />
      <Tooltip />
    </Chart>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[400, 600, 900].map((w) => (
        <div key={w} style={{ width: w, maxWidth: '100%' }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{w}px</p>
          <Chart data={monthlyMetrics} height={200} title={`${w}px`}>
            <CartesianGrid />
            <XAxis />
            <YAxis format="compact" />
            <AreaSeries field="revenue" color={PALETTE.indigo} gradient />
          </Chart>
        </div>
      ))}
    </div>
  ),
};
