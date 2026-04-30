// ─────────────────────────────────────────────────
// <MarimekkoSeries> — Variable-width stacked bars (mosaic)
// ─────────────────────────────────────────────────
// Renders a Marimekko (mosaic) chart where bar widths
// represent one dimension and stacked segment heights
// represent another, giving a 2D area comparison.
//
// Usage:
//   <Chart data={segmentData} height={400}>
//     <MarimekkoSeries
//       widthField="marketShare"
//       heightFields={['online','retail','wholesale']}
//       nameField="region"
//     />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { useChartContext } from '@kodemaven/viskit-core';

export interface MarimekkoSeriesProps<TDatum = Record<string, unknown>> {
  /** Numeric field controlling column width */
  widthField: keyof TDatum & string;
  /** Numeric fields to stack within each column */
  heightFields: Array<keyof TDatum & string>;
  /** Category label field */
  nameField?: keyof TDatum & string;
  /** Gap between columns in px (default: 2) */
  gap?: number;
  /** Corner radius (default: 2) */
  radius?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function MarimekkoSeries<TDatum extends Record<string, unknown>>({
  widthField,
  heightFields,
  nameField,
  gap = 2,
  radius = 2,
  'aria-label': ariaLabel,
}: MarimekkoSeriesProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleEnter = useCallback((key: string) => setHovered(key), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;

  const columns = useMemo(() => {
    const typedData = data as TDatum[];
    if (typedData.length === 0 || heightFields.length === 0) return [];

    // Calculate total width value for proportional sizing
    const totalWidth = typedData.reduce((sum, d) => sum + (Number(d[widthField]) || 0), 0);
    if (totalWidth === 0) return [];

    const totalGap = gap * (typedData.length - 1);
    const availableWidth = innerWidth - totalGap;

    let xOffset = 0;
    return typedData.map((datum, di) => {
      const widthVal = Number(datum[widthField]) || 0;
      const colWidth = (widthVal / totalWidth) * availableWidth;
      const name = nameField ? String(datum[nameField]) : `Col ${di}`;

      // Stack segments within column
      const totalHeight = heightFields.reduce(
        (sum, f) => sum + (Number(datum[f]) || 0),
        0,
      );

      let yOffset = 0;
      const segments = heightFields.map((field) => {
        const val = Number(datum[field]) || 0;
        const segHeight = totalHeight > 0 ? (val / totalHeight) * innerHeight : 0;
        const seg = {
          x: xOffset,
          y: yOffset,
          width: colWidth,
          height: segHeight,
          field: field as string,
          value: val,
          color: colorScale(field as string),
          key: `${di}-${field as string}`,
        };
        yOffset += segHeight;
        return seg;
      });

      const col = { name, x: xOffset, width: colWidth, segments };
      xOffset += colWidth + gap;
      return col;
    });
  }, [data, widthField, heightFields, nameField, gap, innerWidth, innerHeight, colorScale]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Marimekko chart'}>
      {columns.map((col) => (
        <g key={col.name}>
          {/* Column label */}
          <text
            x={col.x + col.width / 2}
            y={innerHeight + 16}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={10}
            fontWeight={500}
          >
            {col.name}
          </text>

          {/* Stacked segments */}
          {col.segments.map((seg) => {
            const isActive = hovered === seg.key;
            return (
              <rect
                key={seg.key}
                x={seg.x}
                y={seg.y}
                width={Math.max(0, seg.width)}
                height={Math.max(0, seg.height)}
                rx={radius}
                ry={radius}
                fill={seg.color}
                opacity={hovered !== null && !isActive ? 0.4 : 0.85}
                stroke={isActive ? '#fff' : 'none'}
                strokeWidth={isActive ? 1.5 : 0}
                role="listitem"
                aria-label={`${col.name} — ${seg.field}: ${seg.value}`}
                tabIndex={0}
                onMouseEnter={() => handleEnter(seg.key)}
                onMouseLeave={handleLeave}
                style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
              />
            );
          })}
        </g>
      ))}
    </g>
  );
}
