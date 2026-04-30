// ─────────────────────────────────────────────────
// <CalendarHeatmap> — GitHub-style day grid
// ─────────────────────────────────────────────────
// Renders a grid of day cells arranged in weeks and
// months, colored by a value field. Similar to the
// GitHub contributions graph.
//
// Usage:
//   <Chart data={contributions} height={200}>
//     <CalendarHeatmap dateField="date" valueField="count" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { scaleSequential, scaleLinear } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic';
import { useChartContext } from '@kodemaven/viskit-core';

export interface CalendarHeatmapProps<TDatum = Record<string, unknown>> {
  /** Field containing date values (Date or ISO string) */
  dateField: keyof TDatum & string;
  /** Numeric field for cell intensity */
  valueField: keyof TDatum & string;
  /** Color range [low, high] (default: green sequential) */
  colors?: [string, string];
  /** Cell corner radius (default: 2) */
  radius?: number;
  /** Cell gap in px (default: 2) */
  cellGap?: number;
  /** Empty day fill color (default: '#1e293b') */
  emptyColor?: string;
  /** ARIA label */
  'aria-label'?: string;
}

export function CalendarHeatmap<TDatum extends Record<string, unknown>>({
  dateField,
  valueField,
  colors,
  radius = 2,
  cellGap = 2,
  emptyColor = '#1e293b',
  'aria-label': ariaLabel,
}: CalendarHeatmapProps<TDatum>) {
  const { data, dimensions } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const { cells, months, dayLabels, cellSize } = useMemo(() => {
    const typedData = data as TDatum[];
    if (typedData.length === 0) return { cells: [], months: [], dayLabels: [], cellSize: 0 };

    // Parse dates and values into a map
    const dateMap = new Map<string, number>();
    let vMin = Infinity;
    let vMax = -Infinity;

    for (const d of typedData) {
      const raw = d[dateField];
      const date = raw instanceof Date ? raw : new Date(String(raw));
      if (isNaN(date.getTime())) continue;
      const key = date.toISOString().slice(0, 10);
      const val = Number(d[valueField]) || 0;
      dateMap.set(key, val);
      if (val < vMin) vMin = val;
      if (val > vMax) vMax = val;
    }

    if (dateMap.size === 0) return { cells: [], months: [], dayLabels: [], cellSize: 0 };

    // Determine date range
    const allDates = [...dateMap.keys()].sort();
    const start = new Date(allDates[0]!);
    const end = new Date(allDates[allDates.length - 1]!);

    // Align start to beginning of its week (Sunday)
    const startDay = new Date(start);
    startDay.setDate(startDay.getDate() - startDay.getDay());

    // Align end to end of its week (Saturday)
    const endDay = new Date(end);
    endDay.setDate(endDay.getDate() + (6 - endDay.getDay()));

    // Count weeks
    const totalDays = Math.round((endDay.getTime() - startDay.getTime()) / 86400000) + 1;
    const totalWeeks = Math.ceil(totalDays / 7);

    // Calculate cell size to fit
    const labelOffset = 28;
    const availWidth = innerWidth - labelOffset;
    const availHeight = innerHeight - 20;
    const cs = Math.min(
      (availWidth - cellGap * (totalWeeks - 1)) / totalWeeks,
      (availHeight - cellGap * 6) / 7,
      16,
    );
    const finalCellSize = Math.max(cs, 4);

    // Color scale
    let colorFn: (v: number) => string;
    if (colors) {
      const linear = scaleLinear<string>().domain([vMin, vMax]).range(colors);
      colorFn = (v: number) => linear(v);
    } else {
      const seq = scaleSequential(interpolateGreens).domain([0, vMax]);
      colorFn = (v: number) => seq(v);
    }

    // Generate cells
    const cellList: Array<{
      x: number; y: number; date: string; value: number;
      color: string; weekIndex: number; dayOfWeek: number;
    }> = [];

    const monthList: Array<{ label: string; x: number }> = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let lastMonth = -1;

    const cursor = new Date(startDay);
    for (let w = 0; w < totalWeeks; w++) {
      for (let d = 0; d < 7; d++) {
        const key = cursor.toISOString().slice(0, 10);
        const val = dateMap.get(key) ?? 0;
        const x = labelOffset + w * (finalCellSize + cellGap);
        const y = 18 + d * (finalCellSize + cellGap);

        // Month labels
        if (cursor.getMonth() !== lastMonth && d === 0) {
          lastMonth = cursor.getMonth();
          monthList.push({ label: monthNames[lastMonth]!, x });
        }

        cellList.push({
          x, y,
          date: key,
          value: val,
          color: val > 0 ? colorFn(val) : emptyColor,
          weekIndex: w,
          dayOfWeek: d,
        });

        cursor.setDate(cursor.getDate() + 1);
      }
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayLabelList = [1, 3, 5].map((i) => ({
      label: days[i]!,
      y: 18 + i * (finalCellSize + cellGap) + finalCellSize / 2,
    }));

    return { cells: cellList, months: monthList, dayLabels: dayLabelList, cellSize: finalCellSize };
  }, [data, dateField, valueField, colors, cellGap, emptyColor, innerWidth, innerHeight]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Calendar heatmap'}>
      {/* Month labels */}
      {months.map((m, i) => (
        <text key={i} x={m.x} y={10} fill="#94a3b8" fontSize={10} fontWeight={500}>
          {m.label}
        </text>
      ))}

      {/* Day labels */}
      {dayLabels.map((d) => (
        <text key={d.label} x={0} y={d.y} dominantBaseline="central" fill="#64748b" fontSize={9}>
          {d.label}
        </text>
      ))}

      {/* Cells */}
      {cells.map((cell, i) => (
        <rect
          key={i}
          x={cell.x} y={cell.y}
          width={cellSize} height={cellSize}
          rx={radius} ry={radius}
          fill={cell.color}
          opacity={hovered !== null && hovered !== i ? 0.6 : 1}
          stroke={hovered === i ? '#fff' : 'none'}
          strokeWidth={hovered === i ? 1.5 : 0}
          role="listitem"
          aria-label={`${cell.date}: ${cell.value}`}
          tabIndex={0}
          onMouseEnter={() => handleEnter(i)}
          onMouseLeave={handleLeave}
          style={{ cursor: 'pointer', transition: 'opacity 150ms ease' }}
        />
      ))}
    </g>
  );
}
