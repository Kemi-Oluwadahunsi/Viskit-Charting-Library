import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@kodemaven/viskit-core';
import { CandlestickSeries, Legend } from '@kodemaven/viskit-charts';
import { ohlcData, ChartWrapper, PALETTE } from './shared-data';

/**
 * ```tsx
 * import { Chart } from '@kodemaven/viskit-core';
 * import { CandlestickSeries } from '@kodemaven/viskit-charts';
 * ```
 *
 * Renders candlestick (OHLC) charts for financial data. Each candle shows
 * open, high, low, and close values. Bullish candles (close > open) and
 * bearish candles (close < open) are colored independently.
 *
 * ### Props
 * - `openField` — field for opening price
 * - `highField` — field for highest price
 * - `lowField` — field for lowest price
 * - `closeField` — field for closing price
 * - `bodyWidth` — candle body width ratio (0–1)
 * - `wickWidth` — wick stroke width in px
 * - `bullishColor` — color for up candles
 * - `bearishColor` — color for down candles
 *
 * ### Usage
 * ```tsx
 * <Chart data={ohlcData} height={400}>
 *   <CandlestickSeries openField="open" highField="high" lowField="low" closeField="close" />
 * </Chart>
 * ```
 */
const meta: Meta = {
  title: 'Phase 3/CandlestickSeries',
  decorators: [(Story) => <ChartWrapper><Story /></ChartWrapper>],
  tags: ['autodocs'],
  argTypes: {
    bodyWidth: { control: { type: 'range', min: 0.2, max: 0.9, step: 0.05 }, description: 'Candle body width ratio' },
    wickWidth: { control: { type: 'range', min: 0.5, max: 3, step: 0.5 }, description: 'Wick stroke width (px)' },
    bullishColor: { control: 'color', description: 'Color for up candles' },
    bearishColor: { control: 'color', description: 'Color for down candles' },
    height: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Chart height' },
  },
};
export default meta;

interface Args { bodyWidth: number; wickWidth: number; bullishColor: string; bearishColor: string; height: number }
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { bodyWidth: 0.6, wickWidth: 1.5, bullishColor: PALETTE.green, bearishColor: PALETTE.red, height: 400 },
  render: (args) => (
    <Chart data={ohlcData} height={args.height}>
      <CandlestickSeries
        openField="open"
        highField="high"
        lowField="low"
        closeField="close"
        bodyWidth={args.bodyWidth}
        wickWidth={args.wickWidth}
        bullishColor={args.bullishColor}
        bearishColor={args.bearishColor}
      />
      <Legend items={[
        { key: 'bullish', label: 'Bullish', color: args.bullishColor },
        { key: 'bearish', label: 'Bearish', color: args.bearishColor },
      ]} />
    </Chart>
  ),
};

export const WideCandles: Story = {
  args: { bodyWidth: 0.85, wickWidth: 2, bullishColor: '#22c55e', bearishColor: '#ef4444', height: 400 },
  render: (args) => (
    <Chart data={ohlcData} height={args.height}>
      <CandlestickSeries openField="open" highField="high" lowField="low" closeField="close" bodyWidth={args.bodyWidth} wickWidth={args.wickWidth} bullishColor={args.bullishColor} bearishColor={args.bearishColor} />
    </Chart>
  ),
};

export const ThinCandles: Story = {
  args: { bodyWidth: 0.3, wickWidth: 1, bullishColor: '#22c55e', bearishColor: '#ef4444', height: 400 },
  render: (args) => (
    <Chart data={ohlcData} height={args.height}>
      <CandlestickSeries openField="open" highField="high" lowField="low" closeField="close" bodyWidth={args.bodyWidth} wickWidth={args.wickWidth} bullishColor={args.bullishColor} bearishColor={args.bearishColor} />
    </Chart>
  ),
};

export const CustomColors: Story = {
  args: { bodyWidth: 0.6, wickWidth: 1.5, bullishColor: '#6366f1', bearishColor: '#f59e0b', height: 400 },
  render: (args) => (
    <Chart data={ohlcData} height={args.height}>
      <CandlestickSeries openField="open" highField="high" lowField="low" closeField="close" bodyWidth={args.bodyWidth} wickWidth={args.wickWidth} bullishColor={args.bullishColor} bearishColor={args.bearishColor} />
    </Chart>
  ),
};
