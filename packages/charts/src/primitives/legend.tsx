import { useState, useCallback, useMemo } from 'react';
import { useChartContext } from '@viskit/core';

export interface LegendProps {
  /** Position relative to chart (default: 'bottom') */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Layout direction (default: 'horizontal') */
  layout?: 'horizontal' | 'vertical';
  /** Series keys and labels to show. Auto-detected from data if omitted. */
  items?: LegendItem[];
  /** Callback when a series is toggled */
  onToggle?: (key: string, visible: boolean) => void;
  /** Swatch size in px */
  swatchSize?: number;
  /** Font size */
  fontSize?: number;
  /** Label color */
  color?: string;
  /** Gap between items in px */
  gap?: number;
}

export interface LegendItem {
  /** Unique series key */
  key: string;
  /** Display label */
  label: string;
  /** Series color (defaults to colorScale) */
  color?: string;
}

export function Legend({
  items: itemsProp,
  layout = 'horizontal',
  onToggle,
  swatchSize = 10,
  fontSize = 12,
  color = '#94A3B8',
  gap = 20,
}: LegendProps) {
  const { colorScale, data } = useChartContext();
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const items: LegendItem[] = useMemo(() => {
    if (itemsProp && itemsProp.length > 0) return itemsProp;
    if (!data || data.length === 0) return [];
    const first = data[0] as Record<string, unknown>;
    return Object.keys(first)
      .filter((k) => typeof first[k] === 'number')
      .map((k) => ({ key: k, label: k }));
  }, [itemsProp, data]);

  const handleClick = useCallback((key: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      const willBeVisible = next.has(key);
      if (willBeVisible) {
        next.delete(key);
      } else {
        next.add(key);
      }
      onToggle?.(key, willBeVisible);
      return next;
    });
  }, [onToggle]);

  const isVertical = layout === 'vertical';

  return (
    <g aria-label="Chart legend" role="list">
      {items.map((item, i) => {
        const isHidden = hidden.has(item.key);
        const resolvedColor = item.color ?? colorScale(item.key);
        const offset = i * (isVertical ? (swatchSize + gap) : 0);
        const xOffset = isVertical ? 0 : i * ((item.label.length * fontSize * 0.6) + swatchSize + gap);
        const yOffset = isVertical ? offset : 0;

        return (
          <g
            key={item.key}
            transform={`translate(${xOffset}, ${yOffset})`}
            role="listitem"
            style={{ cursor: 'pointer' }}
            onClick={() => handleClick(item.key)}
            opacity={isHidden ? 0.3 : 1}
          >
            <rect
              width={swatchSize}
              height={swatchSize}
              rx={2}
              fill={resolvedColor}
            />
            {isHidden && (
              <line
                x1={0}
                x2={swatchSize}
                y1={swatchSize / 2}
                y2={swatchSize / 2}
                stroke="#fff"
                strokeWidth={1.5}
              />
            )}
            <text
              x={swatchSize + 6}
              y={swatchSize / 2}
              dominantBaseline="central"
              fill={color}
              fontSize={fontSize}
              style={{ userSelect: 'none' }}
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}
