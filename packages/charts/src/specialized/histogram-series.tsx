import { useMemo, useState, useCallback, useId } from 'react';
import { bin as d3Bin } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { useChartContext } from '@viskit/core';
import type { Dimensions } from '@viskit/core';

export interface HistogramSeriesProps<TDatum = Record<string, unknown>> {
  field: keyof TDatum & string;
  bins?: number;
  color?: string;
  radius?: number;
  opacity?: number;
  gradientFill?: boolean;
  'aria-label'?: string;
}

export function HistogramSeries<TDatum extends Record<string, unknown>>({
  field,
  bins: binCount = 10,
  color,
  radius = 2,
  opacity = 1,
  gradientFill = true,
  'aria-label': ariaLabel,
}: HistogramSeriesProps<TDatum>) {
  const { data, colorScale, dimensions } = useChartContext<TDatum>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gradId = useId();

  const handleEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  const resolvedColor = color ?? colorScale(field);
  const { innerWidth, innerHeight }: Dimensions = dimensions;

  const histBars = useMemo(() => {
    const values = (data as TDatum[]).map((d) => Number(d[field]) || 0);
    const binGen = d3Bin().thresholds(binCount);
    const binnedData = binGen(values);

    const maxCount = Math.max(...binnedData.map((b) => b.length));
    const xMin = binnedData[0]?.x0 ?? 0;
    const xMax = binnedData[binnedData.length - 1]?.x1 ?? 1;

    const xScale = scaleLinear().domain([xMin, xMax]).range([0, innerWidth]);
    const yScale = scaleLinear().domain([0, maxCount * 1.1]).range([innerHeight, 0]).nice();

    return binnedData.map((b) => {
      const x = xScale(b.x0 ?? 0);
      const w = xScale(b.x1 ?? 0) - x;
      const y = yScale(b.length);
      const h = innerHeight - y;

      return {
        x, y, width: Math.max(0, w - 1), height: Math.max(0, h),
        count: b.length,
        rangeStart: b.x0 ?? 0,
        rangeEnd: b.x1 ?? 0,
      };
    });
  }, [data, field, binCount, innerWidth, innerHeight]);

  return (
    <g role="list" aria-label={ariaLabel ?? `${field} histogram`}>
      {gradientFill && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={resolvedColor} stopOpacity={1} />
            <stop offset="100%" stopColor={resolvedColor} stopOpacity={0.6} />
          </linearGradient>
        </defs>
      )}
      {histBars.map((bar, i) => {
        const isActive = hoveredIndex === i;
        const dimmed = hoveredIndex !== null && !isActive;

        return (
          <g key={i}>
            {isActive && (
              <rect
                x={bar.x - 1} y={bar.y - 1}
                width={bar.width + 2} height={Math.max(0, bar.height + 1)}
                rx={radius + 1} ry={radius + 1}
                fill={resolvedColor} opacity={0.15}
              />
            )}
            <rect
              x={bar.x} y={bar.y}
              width={bar.width} height={bar.height}
              rx={radius} ry={radius}
              fill={gradientFill ? `url(#${gradId})` : resolvedColor}
              opacity={dimmed ? opacity * 0.4 : opacity}
              role="listitem"
              aria-label={`${bar.rangeStart}–${bar.rangeEnd}: ${bar.count}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
            />
            {isActive && (
              <text
                x={bar.x + bar.width / 2} y={bar.y - 8}
                textAnchor="middle" fill={resolvedColor}
                fontSize={11} fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                {bar.count}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
