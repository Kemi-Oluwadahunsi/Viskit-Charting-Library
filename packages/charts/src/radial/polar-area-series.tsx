import { useMemo, useState, useCallback } from 'react';
import { pie as d3Pie, arc as d3Arc } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { useChartContext } from '@viskit/core';
import type { Dimensions } from '@viskit/core';

export interface PolarAreaSeriesProps<TDatum = Record<string, unknown>> {
  field: keyof TDatum & string;
  nameField?: keyof TDatum & string;
  innerRadius?: number;
  color?: string;
  opacity?: number;
  cornerRadius?: number;
  'aria-label'?: string;
}

export function PolarAreaSeries<TDatum extends Record<string, unknown>>({
  field,
  nameField,
  innerRadius = 0,
  color,
  opacity = 0.85,
  cornerRadius = 2,
  'aria-label': ariaLabel,
}: PolarAreaSeriesProps<TDatum>) {
  const { data, colorScale, dimensions } = useChartContext<TDatum>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  const { innerWidth, innerHeight }: Dimensions = dimensions;
  const cx = innerWidth / 2;
  const cy = innerHeight / 2;
  const maxRadius = Math.min(cx, cy) * 0.85;
  const resolvedInner = maxRadius * innerRadius;

  const sectors = useMemo(() => {
    const values = (data as TDatum[]).map((d) => Number(d[field]) || 0);
    const maxVal = Math.max(...values);

    const rScale = scaleLinear().domain([0, maxVal || 1]).range([resolvedInner, maxRadius]);

    // Equal angles for all sectors
    const pieLayout = d3Pie<TDatum>()
      .value(() => 1) // equal slices
      .sort(null)
      .padAngle(0.02);

    const pieData = pieLayout(data as TDatum[]);

    return pieData.map((slice, i) => {
      const val = values[i]!;
      const outerR = rScale(val);
      const hoverR = Math.min(outerR + 6, maxRadius + 10);
      const name = nameField ? String((slice.data as TDatum)[nameField]) : `Segment ${i + 1}`;
      const segColor = color ?? colorScale(name);

      const arcGen = d3Arc<unknown, { startAngle: number; endAngle: number }>()
        .innerRadius(resolvedInner)
        .outerRadius(outerR)
        .cornerRadius(cornerRadius);

      const hoverArcGen = d3Arc<unknown, { startAngle: number; endAngle: number }>()
        .innerRadius(resolvedInner)
        .outerRadius(hoverR)
        .cornerRadius(cornerRadius);

      const centroidGen = d3Arc<unknown, { startAngle: number; endAngle: number }>()
        .innerRadius((resolvedInner + outerR) / 2)
        .outerRadius((resolvedInner + outerR) / 2);

      const centroid = centroidGen.centroid(slice);

      return {
        path: arcGen(slice) ?? '',
        hoverPath: hoverArcGen(slice) ?? '',
        centroidX: centroid[0],
        centroidY: centroid[1],
        color: segColor,
        name,
        value: val,
      };
    });
  }, [data, field, nameField, color, colorScale, resolvedInner, maxRadius, cornerRadius]);

  return (
    <g transform={`translate(${cx}, ${cy})`} role="list" aria-label={ariaLabel ?? `${field as string} polar area`}>
      {sectors.map((s, i) => {
        const isActive = hoveredIndex === i;
        const dimmed = hoveredIndex !== null && !isActive;

        return (
          <g key={i}>
            <path
              d={isActive ? s.hoverPath : s.path}
              fill={s.color}
              opacity={dimmed ? opacity * 0.35 : opacity}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 2 : 0}
              role="listitem"
              aria-label={`${s.name}: ${s.value}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{
                cursor: 'pointer',
                transition: 'd 250ms ease, opacity 200ms ease',
                filter: isActive ? `drop-shadow(0 0 6px ${s.color})` : 'none',
              }}
            />
            {isActive && (
              <text
                x={s.centroidX} y={s.centroidY}
                textAnchor="middle" dominantBaseline="central"
                fill="#fff" fontSize={11} fontWeight={700}
                style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
              >
                {s.value.toLocaleString()}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
