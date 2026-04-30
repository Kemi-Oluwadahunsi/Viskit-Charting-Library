// ─────────────────────────────────────────────────
// <GanttSeries> — Timeline/schedule horizontal bars
// ─────────────────────────────────────────────────
// Renders horizontal bars along a time axis showing
// task/event durations. Supports progress indication.
//
// Usage:
//   <Chart data={tasks} height={300}>
//     <GanttSeries startField="start" endField="end" nameField="task" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { useChartContext } from '@kodemaven/viskit-core';

export interface GanttSeriesProps<TDatum = Record<string, unknown>> {
  /** Field for start value (number or Date) */
  startField: keyof TDatum & string;
  /** Field for end value (number or Date) */
  endField: keyof TDatum & string;
  /** Field for task/row name */
  nameField?: keyof TDatum & string;
  /** Optional progress field (0–1 or 0–100) for partial fill */
  progressField?: keyof TDatum & string;
  /** Bar height in pixels (default: 24). Capped to row bandwidth. */
  barHeight?: number;
  /** Corner radius (default: 4) */
  radius?: number;
  /** Progress bar color override */
  progressColor?: string;
  /** ARIA label */
  'aria-label'?: string;
}

export function GanttSeries<TDatum extends Record<string, unknown>>({
  startField,
  endField,
  nameField,
  progressField,
  barHeight = 24,
  radius = 4,
  progressColor,
  'aria-label': ariaLabel,
}: GanttSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const bars = useMemo(() => {
    const typedData = data as TDatum[];
    if (typedData.length === 0) return { tasks: [], xTicks: [] as number[] };

    const toNum = (val: unknown): number => {
      if (val instanceof Date) return val.getTime();
      if (typeof val === 'number') return val;
      const d = new Date(String(val));
      return isNaN(d.getTime()) ? Number(val) || 0 : d.getTime();
    };

    const starts = typedData.map((d) => toNum(d[startField]));
    const ends = typedData.map((d) => toNum(d[endField]));
    const xMin = Math.min(...starts);
    const xMax = Math.max(...ends);

    const names = typedData.map((d, i) =>
      nameField ? String(d[nameField]) : `Task ${i + 1}`,
    );

    const xScale = scaleLinear().domain([xMin, xMax]).range([0, innerWidth]).nice();
    const yScale = scaleBand<string>().domain(names).range([0, innerHeight]).padding(0.2);
    const bandwidth = yScale.bandwidth();
    const barH = Math.min(barHeight, bandwidth);
    const barOffset = (bandwidth - barH) / 2;

    const tasks = typedData.map((d, i) => {
      const s = toNum(d[startField]);
      const e = toNum(d[endField]);
      const name = names[i]!;
      const x = xScale(s);
      const w = xScale(e) - xScale(s);
      const y = (yScale(name) ?? 0) + barOffset;
      const raw = progressField ? Number(d[progressField]) || 0 : undefined;
      const progress = raw !== undefined ? (raw > 1 ? raw / 100 : raw) : undefined;

      return {
        x, y, width: w, height: barH,
        name, start: s, end: e,
        color: colorScale(name),
        progress,
      };
    });

    return { tasks, xTicks: xScale.ticks(6) };
  }, [data, startField, endField, nameField, progressField, barHeight, innerWidth, innerHeight, colorScale]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Gantt chart'}>
      {/* X-axis grid lines */}
      {bars.xTicks?.map((tick, i) => {
        const xScale = scaleLinear()
          .domain([
            Math.min(...(data as TDatum[]).map((d) => {
              const v = d[startField];
              return v instanceof Date ? v.getTime() : Number(v) || 0;
            })),
            Math.max(...(data as TDatum[]).map((d) => {
              const v = d[endField];
              return v instanceof Date ? v.getTime() : Number(v) || 0;
            })),
          ])
          .range([0, innerWidth])
          .nice();
        const x = xScale(tick);
        return (
          <g key={i}>
            <line x1={x} y1={0} x2={x} y2={innerHeight} stroke="#334155" strokeWidth={1} strokeDasharray="4 4" />
            <text x={x} y={innerHeight + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
              {tick}
            </text>
          </g>
        );
      })}

      {/* Task bars */}
      {bars.tasks?.map((task, i) => {
        const isActive = hovered === i;
        return (
          <g key={i}>
            {/* Row label */}
            <text
              x={-8}
              y={task.y + task.height / 2}
              textAnchor="end"
              dominantBaseline="central"
              fill="#94a3b8"
              fontSize={11}
            >
              {task.name}
            </text>

            {/* Background bar */}
            <rect
              x={task.x}
              y={task.y}
              width={Math.max(0, task.width)}
              height={task.height}
              rx={radius}
              ry={radius}
              fill={task.color}
              opacity={hovered !== null && !isActive ? 0.35 : 0.7}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 1.5 : 0}
              role="listitem"
              aria-label={`${task.name}: ${task.start} — ${task.end}`}
              tabIndex={0}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
            />

            {/* Progress overlay */}
            {task.progress !== undefined && task.progress > 0 && (
              <rect
                x={task.x}
                y={task.y}
                width={Math.max(0, task.width * Math.min(1, task.progress))}
                height={task.height}
                rx={radius}
                ry={radius}
                fill={progressColor ?? task.color}
                opacity={0.95}
                style={{ pointerEvents: 'none' }}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
