import { useMemo, useState, useCallback, useId } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { useChartContext } from '@kodemaven/viskit-core';
import type { Dimensions } from '@kodemaven/viskit-core';

export interface HorizontalBarSeriesProps<TDatum = Record<string, unknown>> {
  field: keyof TDatum & string;
  labelField?: keyof TDatum & string;
  color?: string;
  radius?: number;
  opacity?: number;
  gradientFill?: boolean;
  barPadding?: number;
  'aria-label'?: string;
}

export function HorizontalBarSeries<TDatum extends Record<string, unknown>>({
  field,
  labelField,
  color,
  radius = 4,
  opacity = 1,
  gradientFill = true,
  barPadding = 0.2,
  'aria-label': ariaLabel,
}: HorizontalBarSeriesProps<TDatum>) {
  const { data, colorScale, dimensions } = useChartContext<TDatum>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gradId = useId();

  const handleEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  const resolvedColor = color ?? colorScale(field);
  const { innerWidth, innerHeight }: Dimensions = dimensions;

  // Auto-detect label field: first string-valued key
  const resolvedLabelField = useMemo(() => {
    if (labelField) return labelField;
    if (data.length === 0) return undefined;
    const first = data[0] as Record<string, unknown>;
    return Object.keys(first).find((k) => typeof first[k] === 'string') as (keyof TDatum & string) | undefined;
  }, [data, labelField]);

  const bars = useMemo(() => {
    const labels = (data as TDatum[]).map((d, i) =>
      resolvedLabelField ? String(d[resolvedLabelField]) : `Item ${i + 1}`,
    );

    const yBand = scaleBand<string>()
      .domain(labels)
      .range([0, innerHeight])
      .padding(barPadding);

    const maxVal = max(data as TDatum[], (d) => Number(d[field]) || 0) ?? 1;
    const xLinear = scaleLinear()
      .domain([0, maxVal * 1.1])
      .range([0, innerWidth])
      .nice();

    return (data as TDatum[]).map((d, i) => {
      const label = labels[i]!;
      const value = Number(d[field]) || 0;
      const y = yBand(label) ?? 0;
      const barWidth = xLinear(value);

      return {
        x: 0,
        y,
        width: Math.max(0, barWidth),
        height: yBand.bandwidth(),
        value,
        label,
        datum: d,
      };
    });
  }, [data, field, resolvedLabelField, innerWidth, innerHeight, barPadding]);

  return (
    <g role="list" aria-label={ariaLabel ?? `${field} horizontal bars`}>
      {gradientFill && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={resolvedColor} stopOpacity={0.6} />
            <stop offset="100%" stopColor={resolvedColor} stopOpacity={1} />
          </linearGradient>
        </defs>
      )}
      {bars.map((bar, i) => {
        const isActive = hoveredIndex === i;
        const barOpacity = hoveredIndex !== null && !isActive ? opacity * 0.4 : opacity;

        return (
          <g key={i}>
            {isActive && (
              <rect
                x={bar.x - 2} y={bar.y - 2}
                width={Math.max(0, bar.width + 4)} height={bar.height + 4}
                rx={radius + 2} ry={radius + 2}
                fill={resolvedColor} opacity={0.15}
              />
            )}
            <rect
              x={bar.x}
              y={bar.y}
              width={Math.max(0, isActive ? bar.width + 3 : bar.width)}
              height={bar.height}
              rx={radius} ry={radius}
              fill={gradientFill ? `url(#${gradId})` : resolvedColor}
              opacity={barOpacity}
              role="listitem"
              aria-label={`${field}: ${bar.value}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer', transition: 'width 200ms ease, opacity 200ms ease' }}
            />
            {isActive && (
              <text
                x={bar.x + bar.width + 8}
                y={bar.y + bar.height / 2}
                dominantBaseline="central"
                fill={resolvedColor}
                fontSize={11} fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                {bar.value.toLocaleString()}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
