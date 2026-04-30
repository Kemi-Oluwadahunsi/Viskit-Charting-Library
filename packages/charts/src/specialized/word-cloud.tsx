// ─────────────────────────────────────────────────
// <WordCloud> — Weighted text layout
// ─────────────────────────────────────────────────
// Renders words positioned in a spiral layout where
// font size is proportional to a numeric value.
// Uses a simple spiral placement algorithm.
//
// Usage:
//   <Chart data={words} height={400}>
//     <WordCloud textField="word" valueField="frequency" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useMemo, useState, useCallback } from 'react';
import { scaleLinear } from 'd3-scale';
import { useChartContext } from '@kodemaven/viskit-core';

export interface WordCloudProps<TDatum = Record<string, unknown>> {
  /** Field containing the text/word */
  textField: keyof TDatum & string;
  /** Numeric field controlling word size */
  valueField: keyof TDatum & string;
  /** Minimum font size (default: 12) */
  minFontSize?: number;
  /** Maximum font size (default: 60) */
  maxFontSize?: number;
  /** Rotation angles in degrees (default: [0, -45, 45]) */
  rotations?: number[];
  /** Font family (default: 'Inter, system-ui, sans-serif') */
  fontFamily?: string;
  /** ARIA label */
  'aria-label'?: string;
}

export function WordCloud<TDatum extends Record<string, unknown>>({
  textField,
  valueField,
  minFontSize = 12,
  maxFontSize = 60,
  rotations = [0, 0, 0, -45, 45],
  fontFamily = 'Inter, system-ui, sans-serif',
  'aria-label': ariaLabel,
}: WordCloudProps<TDatum>) {
  const { data, dimensions, colorScale } = useChartContext<TDatum>();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const { innerWidth, innerHeight } = dimensions;
  const cx = innerWidth / 2;
  const cy = innerHeight / 2;

  const words = useMemo(() => {
    const typedData = data as TDatum[];
    if (typedData.length === 0) return [];

    const values = typedData.map((d) => Number(d[valueField]) || 0);
    const vMin = Math.min(...values);
    const vMax = Math.max(...values);

    const fontSize = scaleLinear()
      .domain([vMin, vMax])
      .range([minFontSize, maxFontSize]);

    // Sort descending by value (place large words first)
    const sorted = typedData
      .map((d, i) => ({
        text: String(d[textField]),
        value: Number(d[valueField]) || 0,
        originalIndex: i,
      }))
      .sort((a, b) => b.value - a.value);

    // Simple spiral placement
    const placed: Array<{
      text: string; value: number; x: number; y: number;
      size: number; rotation: number; color: string; width: number; height: number;
    }> = [];

    const boundingBoxes: Array<{ x: number; y: number; w: number; h: number }> = [];

    const overlaps = (bx: number, by: number, bw: number, bh: number) => {
      for (const box of boundingBoxes) {
        if (
          bx < box.x + box.w &&
          bx + bw > box.x &&
          by < box.y + box.h &&
          by + bh > box.y
        ) {
          return true;
        }
      }
      return false;
    };

    for (const word of sorted) {
      const size = fontSize(word.value);
      const rotation = rotations[word.originalIndex % rotations.length]!;
      const radians = (rotation * Math.PI) / 180;
      const textWidth = word.text.length * size * 0.6;
      const textHeight = size * 1.2;

      // Rotated bounding box approximation
      const absC = Math.abs(Math.cos(radians));
      const absS = Math.abs(Math.sin(radians));
      const boxW = textWidth * absC + textHeight * absS;
      const boxH = textWidth * absS + textHeight * absC;

      // Spiral outward from center
      let angle = 0;
      let radius = 0;
      let px = cx - boxW / 2;
      let py = cy - boxH / 2;
      let found = false;

      for (let step = 0; step < 500; step++) {
        px = cx + radius * Math.cos(angle) - boxW / 2;
        py = cy + radius * Math.sin(angle) - boxH / 2;

        // Stay within bounds
        if (px >= 0 && py >= 0 && px + boxW <= innerWidth && py + boxH <= innerHeight) {
          if (!overlaps(px, py, boxW, boxH)) {
            found = true;
            break;
          }
        }

        angle += 0.3;
        radius += 0.5;
      }

      if (found) {
        boundingBoxes.push({ x: px, y: py, w: boxW, h: boxH });
        placed.push({
          text: word.text,
          value: word.value,
          x: px + boxW / 2,
          y: py + boxH / 2,
          size,
          rotation,
          color: colorScale(word.text),
          width: boxW,
          height: boxH,
        });
      }
    }

    return placed;
  }, [data, textField, valueField, minFontSize, maxFontSize, rotations, innerWidth, innerHeight, colorScale, cx, cy]);

  return (
    <g role="list" aria-label={ariaLabel ?? 'Word cloud'}>
      {words.map((word, i) => (
        <text
          key={i}
          x={word.x}
          y={word.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={word.size}
          fontFamily={fontFamily}
          fontWeight={600}
          fill={word.color}
          opacity={hovered !== null && hovered !== i ? 0.3 : 0.9}
          transform={`rotate(${word.rotation}, ${word.x}, ${word.y})`}
          role="listitem"
          aria-label={`${word.text}: ${word.value}`}
          tabIndex={0}
          onMouseEnter={() => handleEnter(i)}
          onMouseLeave={handleLeave}
          style={{ cursor: 'pointer', transition: 'opacity 200ms ease' }}
        >
          {word.text}
        </text>
      ))}
    </g>
  );
}
