import { useMemo, useState, useCallback, useId } from 'react';
import { arc as d3Arc } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { useChartContext } from '@kodemaven/viskit-core';
import type { Dimensions } from '@kodemaven/viskit-core';

export interface RadialBarSeriesProps<TDatum = Record<string, unknown>> {
  field: keyof TDatum & string;
  nameField?: keyof TDatum & string;
  maxAngle?: number;
  innerRadius?: number;
  color?: string;
  opacity?: number;
  cornerRadius?: number;
  'aria-label'?: string;
}

export function RadialBarSeries<TDatum extends Record<string, unknown>>({
  field,
  nameField,
  maxAngle = 2 * Math.PI,
  innerRadius: innerRadiusRatio = 0.3,
  color,
  opacity = 0.85,
  cornerRadius = 3,
  'aria-label': ariaLabel,
}: RadialBarSeriesProps<TDatum>) {
  const { data, colorScale, dimensions } = useChartContext<TDatum>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gradIdBase = useId();

  const handleEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  const { innerWidth, innerHeight }: Dimensions = dimensions;
  const cx = innerWidth / 2;
  const cy = innerHeight / 2;
  const maxOuterRadius = Math.min(cx, cy) * 0.9;
  const resolvedInner = maxOuterRadius * innerRadiusRatio;

  const bars = useMemo(() => {
    const n = (data as TDatum[]).length;
    const bandWidth = (maxOuterRadius - resolvedInner) / n;
    const maxVal = Math.max(...(data as TDatum[]).map((d) => Number(d[field]) || 0));
    const angleScale = scaleLinear().domain([0, maxVal || 1]).range([0, maxAngle]);

    return (data as TDatum[]).map((d, i) => {
      const name = nameField ? String(d[nameField]) : `Bar ${i + 1}`;
      const value = Number(d[field]) || 0;
      const barInner = resolvedInner + bandWidth * i + 1;
      const barOuter = resolvedInner + bandWidth * (i + 1) - 1;
      const endAngle = angleScale(value);
      const barColor = color ?? colorScale(name);

      const arcGen = d3Arc<unknown, { startAngle: number; endAngle: number }>()
        .innerRadius(barInner)
        .outerRadius(barOuter)
        .startAngle(0)
        .endAngle(endAngle)
        .cornerRadius(cornerRadius);

      const hoverArcGen = d3Arc<unknown, { startAngle: number; endAngle: number }>()
        .innerRadius(barInner - 1)
        .outerRadius(barOuter + 2)
        .startAngle(0)
        .endAngle(endAngle)
        .cornerRadius(cornerRadius);

      const arcData = { startAngle: 0, endAngle };

      return {
        path: arcGen(arcData) ?? '',
        hoverPath: hoverArcGen(arcData) ?? '',
        color: barColor,
        name,
        value,
      };
    });
  }, [data, field, nameField, color, colorScale, maxAngle, resolvedInner, maxOuterRadius, cornerRadius]);

  return (
    <g transform={`translate(${cx}, ${cy})`} role="list" aria-label={ariaLabel ?? `${field} radial bars`}>
      <defs>
        {bars.map((bar, i) => (
          <linearGradient key={i} id={`${gradIdBase}-${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={bar.color} stopOpacity={1} />
            <stop offset="100%" stopColor={bar.color} stopOpacity={0.65} />
          </linearGradient>
        ))}
      </defs>
      {bars.map((bar, i) => {
        const isActive = hoveredIndex === i;
        const dimmed = hoveredIndex !== null && !isActive;

        return (
          <g key={i}>
            <path
              d={isActive ? bar.hoverPath : bar.path}
              fill={`url(#${gradIdBase}-${i})`}
              opacity={dimmed ? opacity * 0.35 : opacity}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 1.5 : 0}
              role="listitem"
              aria-label={`${bar.name}: ${bar.value}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer', transition: 'd 200ms ease, opacity 200ms ease' }}
            />
            {isActive && (
              <text
                x={0} y={0}
                textAnchor="middle" dominantBaseline="central"
                fill="#fff" fontSize={12} fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                {bar.name}: {bar.value.toLocaleString()}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
