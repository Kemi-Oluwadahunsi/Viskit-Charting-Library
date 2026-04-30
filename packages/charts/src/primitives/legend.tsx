import { useState, useCallback, useMemo } from 'react';
import { useChartContext } from '@kodemaven/viskit-core';

export interface LegendProps {
  /** Position relative to chart (default: 'bottom') */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Layout direction. Auto-detected from position if omitted. */
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
  position = 'bottom',
  items: itemsProp,
  layout: layoutProp,
  onToggle,
  swatchSize = 10,
  fontSize = 12,
  color = '#94A3B8',
  gap = 10,
}: LegendProps) {
  const { colorScale, data, dimensions } = useChartContext();
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

  const isVertical = layoutProp
    ? layoutProp === 'vertical'
    : (position === 'left' || position === 'right');

  const { innerWidth, innerHeight } = dimensions;

  const foProps = useMemo(() => {
    switch (position) {
      case 'bottom':
        return { x: 0, y: innerHeight + 30, width: innerWidth, height: 60 };
      case 'top':
        return { x: 0, y: -50, width: innerWidth, height: 44 };
      case 'right':
        return { x: innerWidth + 12, y: 0, width: 120, height: innerHeight };
      case 'left':
        return { x: -120, y: 0, width: 110, height: innerHeight };
    }
  }, [position, innerWidth, innerHeight]);

  return (
    <foreignObject
      x={foProps.x}
      y={foProps.y}
      width={foProps.width}
      height={foProps.height}
      overflow="visible"
      aria-label="Chart legend"
      role="list"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          flexWrap: 'wrap',
          justifyContent: isVertical ? 'flex-start' : 'center',
          alignItems: isVertical ? 'flex-start' : 'center',
          gap: `${isVertical ? 4 : 4}px ${gap}px`,
          width: '100%',
        }}
      >
        {items.map((item) => {
          const isHidden = hidden.has(item.key);
          const resolvedColor = item.color ?? colorScale(item.key);
          return (
            <div
              key={item.key}
              role="listitem"
              onClick={() => handleClick(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
                opacity: isHidden ? 0.3 : 1,
                userSelect: 'none',
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: swatchSize,
                  height: swatchSize,
                  minWidth: swatchSize,
                  borderRadius: 2,
                  backgroundColor: resolvedColor,
                  position: 'relative',
                }}
              >
                {isHidden && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      right: 0,
                      height: 1.5,
                      backgroundColor: '#fff',
                      transform: 'translateY(-50%)',
                    }}
                  />
                )}
              </span>
              <span style={{ fontSize, color, lineHeight: 1 }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </foreignObject>
  );
}
