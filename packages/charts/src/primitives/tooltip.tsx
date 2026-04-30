import { useState, useCallback, useRef, type ReactNode, type MouseEvent } from 'react';
import { useChartContext, useCartesianContext } from '@kodemaven/viskit-core';
import type { TooltipPayload, FormatFunction } from '@kodemaven/viskit-core';
import { useFormat } from '@kodemaven/viskit-core';
import { TooltipContent } from './tooltip-content';
import type { TooltipVariant } from './tooltip-content';

export interface TooltipProps {
  /** Visual variant for the built-in tooltip */
  variant?: TooltipVariant;
  /** Format for tooltip values */
  format?: FormatFunction;
  /** Custom render function for tooltip body */
  renderContent?: (items: TooltipPayload[], label: string) => ReactNode;
  /** Offset from cursor in px (default: 12) */
  offset?: number;
  /** Series fields to include (default: all numeric fields) */
  fields?: string[];
  /** ARIA label */
  'aria-label'?: string;
}

export function Tooltip({
  variant,
  format,
  renderContent,
  offset = 12,
  fields,
}: TooltipProps) {
  const { data, colorScale, dimensions } = useChartContext();
  const cartesian = useCartesianContext();
  const fmt = useFormat(format ?? 'compact');
  const overlayRef = useRef<SVGRectElement>(null);

  const [state, setState] = useState<{
    x: number;
    y: number;
    visible: boolean;
    items: TooltipPayload[];
    label: string;
  }>({ x: 0, y: 0, visible: false, items: [], label: '' });

  const handleMouseMove = useCallback((e: MouseEvent<SVGRectElement>) => {
    const rect = overlayRef.current;
    if (!rect) return;

    const svgPoint = rect.ownerSVGElement?.createSVGPoint();
    if (!svgPoint) return;
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    const ctm = rect.getScreenCTM()?.inverse();
    if (!ctm) return;
    const localPt = svgPoint.matrixTransform(ctm);

    const mouseX = localPt.x;
    const mouseY = localPt.y;

    // Find closest datum by X position
    const xScale = cartesian.xScale;
    const bandwidth = xScale.bandwidth ?? 0;
    const ticks = xScale.ticks();

    let closestIdx = 0;
    let closestDist = Infinity;
    for (let i = 0; i < ticks.length; i++) {
      const tickX = (xScale.scale(ticks[i]) as number) + bandwidth / 2;
      const dist = Math.abs(tickX - mouseX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }

    const datum = data[closestIdx] as Record<string, unknown> | undefined;
    if (!datum) return;

    // Build payload from numeric fields
    const keys = Object.keys(datum);
    const numericFields = fields ??
      keys.filter((k) => typeof datum[k] === 'number');

    const categoryField = keys.find((k) => typeof datum[k] === 'string');
    const label = categoryField ? String(datum[categoryField]) : `#${closestIdx + 1}`;

    const items: TooltipPayload[] = numericFields.map((field) => ({
      key: field,
      label: field,
      value: datum[field],
      formattedValue: fmt(datum[field]),
      color: colorScale(field),
      datum,
    }));

    setState({
      x: mouseX,
      y: mouseY,
      visible: true,
      items,
      label,
    });
  }, [data, cartesian, colorScale, fmt, fields]);

  const handleMouseLeave = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  // Position tooltip ensuring it stays within chart bounds
  const tooltipWidth = 180;
  const tooltipHeight = 120;
  const innerW = dimensions.innerWidth;
  const innerH = dimensions.innerHeight;

  let tx = state.x + offset;
  let ty = state.y - tooltipHeight / 2;

  if (tx + tooltipWidth > innerW) {
    tx = state.x - tooltipWidth - offset;
  }
  if (ty < 0) ty = 0;
  if (ty + tooltipHeight > innerH) ty = innerH - tooltipHeight;

  return (
    <>
      {/* Invisible overlay to capture mouse events */}
      <rect
        ref={overlayRef}
        x={0}
        y={0}
        width={innerW}
        height={innerH}
        fill="transparent"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'crosshair' }}
      />

      {/* Vertical crosshair line */}
      {state.visible && (
        <line
          x1={state.x}
          x2={state.x}
          y1={0}
          y2={innerH}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
          strokeDasharray="4 3"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Tooltip body via foreignObject */}
      {state.visible && state.items.length > 0 && (
        <foreignObject
          x={tx}
          y={ty}
          width={tooltipWidth}
          height={tooltipHeight}
          style={{ pointerEvents: 'none', overflow: 'visible' }}
        >
          {renderContent ? (
            renderContent(state.items, state.label)
          ) : (
            <TooltipContent items={state.items} label={state.label} variant={variant} />
          )}
        </foreignObject>
      )}
    </>
  );
}
