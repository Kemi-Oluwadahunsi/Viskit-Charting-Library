// ─────────────────────────────────────────────────
// <Brush> — Draggable selection region
// ─────────────────────────────────────────────────
// Renders a draggable selection overlay on the chart
// for zooming/filtering data by range. Supports both
// horizontal and vertical brushing.
//
// Usage:
//   <Chart data={data} height={400}>
//     <LineSeries field="value" />
//     <Brush direction="horizontal" onBrush={setRange} />
//   </Chart>
// ─────────────────────────────────────────────────

import { useState, useCallback, useRef } from 'react';
import { useChartContext } from '@kodemaven/viskit-core';

export interface BrushProps {
  /** Brush direction (default: 'horizontal') */
  direction?: 'horizontal' | 'vertical' | 'both';
  /** Callback with normalized selection [start, end] in 0–1 range */
  onBrush?: (range: [number, number] | null) => void;
  /** Selection fill color (default: 'rgba(99, 102, 241, 0.15)') */
  fillColor?: string;
  /** Selection border color (default: '#6366f1') */
  strokeColor?: string;
  /** Handle width in px (default: 6) */
  handleWidth?: number;
  /** ARIA label */
  'aria-label'?: string;
}

export function Brush({
  direction = 'horizontal',
  onBrush,
  fillColor = 'rgba(99, 102, 241, 0.15)',
  strokeColor = '#6366f1',
  handleWidth = 6,
  'aria-label': ariaLabel,
}: BrushProps) {
  const { dimensions } = useChartContext();
  const { innerWidth, innerHeight } = dimensions;

  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const overlayRef = useRef<SVGRectElement>(null);

  const getPosition = useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      const svg = overlayRef.current?.closest('svg');
      if (!svg) return { x: 0, y: 0 };
      const rect = svg.getBoundingClientRect();
      const margin = dimensions.margin;
      return {
        x: Math.max(0, Math.min(innerWidth, e.clientX - rect.left - margin.left)),
        y: Math.max(0, Math.min(innerHeight, e.clientY - rect.top - margin.top)),
      };
    },
    [innerWidth, innerHeight, dimensions.margin],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGRectElement>) => {
      const pos = getPosition(e);
      dragStart.current = pos;
      setDragging(true);
      setSelection(null);
      onBrush?.(null);
    },
    [getPosition, onBrush],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGRectElement>) => {
      if (!dragging || !dragStart.current) return;
      const pos = getPosition(e);

      const isH = direction === 'horizontal' || direction === 'both';
      const startVal = isH ? dragStart.current.x : dragStart.current.y;
      const endVal = isH ? pos.x : pos.y;

      const s = Math.min(startVal, endVal);
      const en = Math.max(startVal, endVal);
      setSelection({ start: s, end: en });
    },
    [dragging, getPosition, direction],
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    dragStart.current = null;

    if (selection) {
      const isH = direction === 'horizontal' || direction === 'both';
      const total = isH ? innerWidth : innerHeight;
      const normalized: [number, number] = [
        selection.start / total,
        selection.end / total,
      ];
      onBrush?.(normalized);
    }
  }, [selection, direction, innerWidth, innerHeight, onBrush]);

  const handleDoubleClick = useCallback(() => {
    setSelection(null);
    onBrush?.(null);
  }, [onBrush]);

  const isH = direction === 'horizontal' || direction === 'both';

  return (
    <g aria-label={ariaLabel ?? 'Brush selection'}>
      {/* Invisible overlay for capturing events */}
      <rect
        ref={overlayRef}
        x={0}
        y={0}
        width={innerWidth}
        height={innerHeight}
        fill="transparent"
        style={{ cursor: 'crosshair' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />

      {/* Selection rectangle */}
      {selection && (
        <g>
          <rect
            x={isH ? selection.start : 0}
            y={isH ? 0 : selection.start}
            width={isH ? selection.end - selection.start : innerWidth}
            height={isH ? innerHeight : selection.end - selection.start}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={1}
            style={{ pointerEvents: 'none' }}
          />
          {/* Left/top handle */}
          <rect
            x={isH ? selection.start - handleWidth / 2 : 0}
            y={isH ? 0 : selection.start - handleWidth / 2}
            width={isH ? handleWidth : innerWidth}
            height={isH ? innerHeight : handleWidth}
            fill={strokeColor}
            opacity={0.6}
            rx={2}
            style={{ pointerEvents: 'none' }}
          />
          {/* Right/bottom handle */}
          <rect
            x={isH ? selection.end - handleWidth / 2 : 0}
            y={isH ? 0 : selection.end - handleWidth / 2}
            width={isH ? handleWidth : innerWidth}
            height={isH ? innerHeight : handleWidth}
            fill={strokeColor}
            opacity={0.6}
            rx={2}
            style={{ pointerEvents: 'none' }}
          />
        </g>
      )}
    </g>
  );
}
