// ─────────────────────────────────────────────────
// <CandlestickSeries> — OHLC financial price charts
// ─────────────────────────────────────────────────
// Renders candlestick (OHLC) bars. Green for bullish
// (close > open), red for bearish (close < open).
//
// Usage:
//   <Chart data={ohlcData} height={400}>
//     <CandlestickSeries
//       openField="open" highField="high"
//       lowField="low" closeField="close"
//     />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { useChartContext, useCartesianContext } from '@viskit/core';

export interface CandlestickSeriesProps<TDatum = Record<string, unknown>> {
  /** Field for the open price */
  openField: keyof TDatum & string;
  /** Field for the high price */
  highField: keyof TDatum & string;
  /** Field for the low price */
  lowField: keyof TDatum & string;
  /** Field for the close price */
  closeField: keyof TDatum & string;
  /** Color for bullish candles (default: '#22c55e') */
  bullishColor?: string;
  /** Color for bearish candles (default: '#ef4444') */
  bearishColor?: string;
  /** Width ratio of candle body to band (0–1, default: 0.6) */
  bodyWidth?: number;
  /** Wick stroke width in px (default: 1.5) */
  wickWidth?: number;
  /** Opacity 0–1 (default: 1) */
  opacity?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function CandlestickSeries<TDatum extends Record<string, unknown>>({
  openField,
  highField,
  lowField,
  closeField,
  bullishColor = '#22c55e',
  bearishColor = '#ef4444',
  bodyWidth = 0.6,
  wickWidth = 1.5,
  opacity = 1,
  'aria-label': ariaLabel,
}: CandlestickSeriesProps<TDatum>) {
  const { data } = useChartContext<TDatum>();
  const { xScale, yScale } = useCartesianContext();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const candles = useMemo(() => {
    const typedData = data as TDatum[];
    const bandwidth = xScale.bandwidth ?? 20;
    const candleW = bandwidth * bodyWidth;

    return typedData.map((d, i) => {
      const open = Number(d[openField]) || 0;
      const high = Number(d[highField]) || 0;
      const low = Number(d[lowField]) || 0;
      const close = Number(d[closeField]) || 0;
      const bullish = close >= open;

      const domainValue = xScale.domain[i];
      const xBase = (xScale.scale(domainValue) as number) + (bandwidth - candleW) / 2;
      const xCenter = xBase + candleW / 2;

      const yOpen = yScale.scale(open as unknown) as number;
      const yClose = yScale.scale(close as unknown) as number;
      const yHigh = yScale.scale(high as unknown) as number;
      const yLow = yScale.scale(low as unknown) as number;

      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(1, Math.abs(yOpen - yClose));

      return {
        x: xBase,
        xCenter,
        bodyY: bodyTop,
        bodyW: candleW,
        bodyH: bodyHeight,
        wickTop: yHigh,
        wickBottom: yLow,
        color: bullish ? bullishColor : bearishColor,
        bullish,
        open,
        high,
        low,
        close,
      };
    });
  }, [data, openField, highField, lowField, closeField, xScale, yScale, bodyWidth, bullishColor, bearishColor]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Candlestick chart'}>
      {candles.map((c, i) => {
        const isActive = hovered === i;

        return (
          <g key={i}>
            {/* Wick (high–low line) */}
            <line
              x1={c.xCenter}
              y1={c.wickTop}
              x2={c.xCenter}
              y2={c.wickBottom}
              stroke={c.color}
              strokeWidth={wickWidth}
              opacity={hovered !== null && !isActive ? opacity * 0.35 : opacity}
              style={{ transition: 'opacity 200ms ease' }}
            />
            {/* Body (open–close rect) */}
            <rect
              x={c.x}
              y={c.bodyY}
              width={c.bodyW}
              height={c.bodyH}
              fill={c.bullish ? c.color : c.color}
              opacity={hovered !== null && !isActive ? opacity * 0.35 : opacity}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 1.5 : 0}
              rx={1}
              role="listitem"
              aria-label={`O:${c.open} H:${c.high} L:${c.low} C:${c.close}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
            />
            {/* Hover label */}
            {isActive && (
              <text
                x={c.xCenter}
                y={c.wickTop - 10}
                textAnchor="middle"
                fill={c.color}
                fontSize={10}
                fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                {`O${c.open} H${c.high} L${c.low} C${c.close}`}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
