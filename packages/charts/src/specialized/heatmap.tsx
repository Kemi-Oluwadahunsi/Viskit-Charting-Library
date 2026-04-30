import { useMemo, useState, useCallback } from 'react';
import { scaleLinear, scaleBand, scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import { useChartContext } from '@kodemaven/viskit-core';
import type { Dimensions } from '@kodemaven/viskit-core';

export interface HeatmapProps<TDatum = Record<string, unknown>> {
  xField: keyof TDatum & string;
  yField: keyof TDatum & string;
  valueField: keyof TDatum & string;
  colors?: [string, string];
  radius?: number;
  opacity?: number;
  'aria-label'?: string;
}

export function Heatmap<TDatum extends Record<string, unknown>>({
  xField,
  yField,
  valueField,
  colors,
  radius = 2,
  opacity = 1,
  'aria-label': ariaLabel,
}: HeatmapProps<TDatum>) {
  const { data, dimensions } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight }: Dimensions = dimensions;

  const cells = useMemo(() => {
    const xCategories = [...new Set((data as TDatum[]).map((d) => String(d[xField])))];
    const yCategories = [...new Set((data as TDatum[]).map((d) => String(d[yField])))];
    const values = (data as TDatum[]).map((d) => Number(d[valueField]) || 0);
    const vMin = Math.min(...values);
    const vMax = Math.max(...values);

    const xBand = scaleBand<string>().domain(xCategories).range([0, innerWidth]).padding(0.05);
    const yBand = scaleBand<string>().domain(yCategories).range([0, innerHeight]).padding(0.05);

    let colorFn: (v: number) => string;
    if (colors) {
      const linear = scaleLinear<string>().domain([vMin, vMax]).range(colors);
      colorFn = (v: number) => linear(v);
    } else {
      const sequential = scaleSequential(interpolateBlues).domain([vMin, vMax]);
      colorFn = (v: number) => sequential(v);
    }

    return (data as TDatum[]).map((d) => {
      const xCat = String(d[xField]);
      const yCat = String(d[yField]);
      const val = Number(d[valueField]) || 0;

      return {
        x: xBand(xCat) ?? 0,
        y: yBand(yCat) ?? 0,
        width: xBand.bandwidth(),
        height: yBand.bandwidth(),
        color: colorFn(val),
        value: val,
        xLabel: xCat,
        yLabel: yCat,
      };
    });
  }, [data, xField, yField, valueField, colors, innerWidth, innerHeight]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Heatmap'}>
      {cells.map((cell, i) => {
        const isActive = hovered === i;

        return (
          <g key={i}>
            <rect
              x={cell.x} y={cell.y}
              width={cell.width} height={cell.height}
              rx={radius} ry={radius}
              fill={cell.color}
              opacity={hovered !== null && !isActive ? opacity * 0.5 : opacity}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 2 : 0}
              role="listitem"
              aria-label={`${cell.xLabel}, ${cell.yLabel}: ${cell.value}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
            />
            {isActive && (
              <text
                x={cell.x + cell.width / 2}
                y={cell.y + cell.height / 2}
                textAnchor="middle" dominantBaseline="central"
                fill="#fff" fontSize={11} fontWeight={700}
                style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
              >
                {cell.value.toLocaleString()}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
