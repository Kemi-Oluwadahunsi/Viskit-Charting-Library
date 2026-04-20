import { useMemo, useId } from 'react';
import { line, area, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
  showEndDot?: boolean;
  'aria-label'?: string;
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  color = '#6366F1',
  strokeWidth = 1.5,
  fill = true,
  showEndDot = true,
  'aria-label': ariaLabel,
}: SparklineProps) {
  const gradId = useId();

  const { linePath, areaPath, lastPoint } = useMemo(() => {
    if (data.length < 2) return { linePath: '', areaPath: '', lastPoint: null };

    const [yMin, yMax] = extent(data) as [number, number];
    const padding = (yMax - yMin) * 0.1 || 1;
    const xScale = scaleLinear().domain([0, data.length - 1]).range([2, width - 2]);
    const yScale = scaleLinear().domain([yMin - padding, yMax + padding]).range([height - 2, 2]);

    const lineGen = line<number>()
      .x((_d, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(curveMonotoneX);

    const areaGen = area<number>()
      .x((_d, i) => xScale(i))
      .y0(height)
      .y1((d) => yScale(d))
      .curve(curveMonotoneX);

    const last = { x: xScale(data.length - 1), y: yScale(data[data.length - 1]!) };

    return {
      linePath: lineGen(data) ?? '',
      areaPath: areaGen(data) ?? '',
      lastPoint: last,
    };
  }, [data, width, height]);

  if (data.length < 2) return null;

  return (
    <svg
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? 'Sparkline'}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradId})`} />
        </>
      )}
      <path
        d={linePath} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round"
      />
      {showEndDot && lastPoint && (
        <circle
          cx={lastPoint.x} cy={lastPoint.y} r={2}
          fill={color}
        />
      )}
    </svg>
  );
}
