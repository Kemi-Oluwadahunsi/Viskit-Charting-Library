// ─────────────────────────────────────────────────
// <TimelineSeries> — Event-based timeline with markers
// ─────────────────────────────────────────────────
// Renders events on a horizontal timeline with labeled
// markers and optional duration ranges. Supports both
// point events and ranged events.
//
// Usage:
//   <Chart data={events} height={300}>
//     <TimelineSeries
//       startField="date"
//       endField="endDate"
//       nameField="event"
//     />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { useChartContext } from '@kodemaven/viskit-core';

export interface TimelineSeriesProps<TDatum = Record<string, unknown>> {
  /** Field for start time (number or Date string) */
  startField: keyof TDatum & string;
  /** Optional field for end time (if omitted, events are point markers) */
  endField?: keyof TDatum & string;
  /** Field for event name/label */
  nameField?: keyof TDatum & string;
  /** Optional field for grouping into swim lanes */
  categoryField?: keyof TDatum & string;
  /** Marker size for point events (default: 8) */
  markerSize?: number;
  /** Bar height for range events (default: 20) */
  barHeight?: number;
  /** Corner radius (default: 4) */
  radius?: number;
  /** Opacity 0–1 (default: 1) */
  opacity?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function TimelineSeries<TDatum extends Record<string, unknown>>({
  startField,
  endField,
  nameField,
  categoryField,
  markerSize = 8,
  barHeight = 20,
  radius = 4,
  opacity = 1,
  'aria-label': ariaLabel,
}: TimelineSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const toNum = (val: unknown): number => {
    if (val instanceof Date) return val.getTime();
    if (typeof val === 'number') return val;
    const d = new Date(String(val));
    return isNaN(d.getTime()) ? Number(val) || 0 : d.getTime();
  };

  const events = useMemo(() => {
    const typedData = data as TDatum[];
    if (typedData.length === 0) return { items: [], xTicks: [] as number[] };

    const starts = typedData.map((d) => toNum(d[startField]));
    const ends = endField
      ? typedData.map((d) => toNum(d[endField]))
      : starts;

    const xMin = Math.min(...starts);
    const xMax = Math.max(...ends);

    const xScale = scaleLinear()
      .domain([xMin, xMax])
      .range([0, innerWidth])
      .nice();

    // Group into swim lanes by category or stack vertically
    const categories = categoryField
      ? [...new Set(typedData.map((d) => String(d[categoryField])))]
      : ['default'];

    const yScale = scaleBand<string>()
      .domain(categories)
      .range([0, innerHeight])
      .padding(0.3);

    const items = typedData.map((d, i) => {
      const startVal = starts[i]!;
      const endVal = ends[i]!;
      const name = nameField ? String(d[nameField]) : `Event ${i + 1}`;
      const category = categoryField ? String(d[categoryField]) : 'default';
      const isRange = endField && endVal > startVal;

      const x1 = xScale(startVal);
      const x2 = xScale(endVal);
      const laneY = yScale(category) ?? 0;
      const laneH = yScale.bandwidth();
      const barY = laneY + (laneH - barHeight) / 2;

      return {
        x: x1,
        width: isRange ? Math.max(x2 - x1, 2) : 0,
        y: barY,
        centerY: laneY + laneH / 2,
        name,
        category,
        isRange,
        color: colorScale(category === 'default' ? name : category),
        startVal,
        endVal,
        datum: d,
      };
    });

    const xTicks = xScale.ticks(6);

    return { items, xTicks };
  }, [data, startField, endField, nameField, categoryField, barHeight, innerWidth, innerHeight, colorScale]);

  return (
    <g
      role="list"
      aria-label={ariaLabel ?? 'Timeline chart'}
    >
      {/* Timeline axis line */}
      <line
        x1={0}
        y1={innerHeight}
        x2={innerWidth}
        y2={innerHeight}
        stroke="#475569"
        strokeWidth={1}
      />

      {events.items.map((evt, i) => (
        <g
          key={`${evt.name}-${i}`}
          role="listitem"
          aria-label={`${evt.name}: ${evt.startVal}${evt.isRange ? ` to ${evt.endVal}` : ''}`}
          onMouseEnter={() => handleEnter(i)}
          onMouseLeave={handleLeave}
          style={{ cursor: 'pointer' }}
        >
          {evt.isRange ? (
            // Range bar
            <rect
              x={evt.x}
              y={evt.y}
              width={evt.width}
              height={barHeight}
              rx={radius}
              ry={radius}
              fill={evt.color}
              opacity={hovered === null || hovered === i ? opacity : opacity * 0.4}
              stroke={hovered === i ? '#fff' : 'none'}
              strokeWidth={hovered === i ? 1.5 : 0}
            />
          ) : (
            // Point marker
            <>
              <line
                x1={evt.x}
                y1={evt.centerY}
                x2={evt.x}
                y2={innerHeight}
                stroke={evt.color}
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={hovered === null || hovered === i ? 0.6 : 0.2}
              />
              <circle
                cx={evt.x}
                cy={evt.centerY}
                r={hovered === i ? markerSize + 2 : markerSize}
                fill={evt.color}
                opacity={hovered === null || hovered === i ? opacity : opacity * 0.4}
                stroke={hovered === i ? '#fff' : 'none'}
                strokeWidth={hovered === i ? 2 : 0}
              />
            </>
          )}

          {/* Label */}
          <text
            x={evt.isRange ? evt.x + evt.width / 2 : evt.x}
            y={evt.isRange ? evt.y - 6 : evt.centerY - markerSize - 6}
            textAnchor="middle"
            fontSize={10}
            fill={hovered === i ? '#fff' : '#94A3B8'}
            fontWeight={hovered === i ? 600 : 400}
            pointerEvents="none"
          >
            {evt.name}
          </text>
        </g>
      ))}
    </g>
  );
}
