import { useMemo, useState, useCallback } from 'react';
import { lineRadial, curveLinearClosed } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { useChartContext } from '@kodemaven/viskit-core';
import type { Dimensions } from '@kodemaven/viskit-core';

export interface RadarSeriesProps<TDatum = Record<string, unknown>> {
  dimensionField: keyof TDatum & string;
  valueFields: (keyof TDatum & string)[];
  colors?: string[];
  fillOpacity?: number;
  strokeWidth?: number;
  dotRadius?: number;
  showGrid?: boolean;
  gridLevels?: number;
  showLabels?: boolean;
  labelColor?: string;
  labelSize?: number;
  gridColor?: string;
  gridOpacity?: number;
  'aria-label'?: string;
}

export function RadarSeries<TDatum extends Record<string, unknown>>({
  dimensionField,
  valueFields,
  colors: colorsProp,
  fillOpacity = 0.15,
  strokeWidth = 2,
  dotRadius = 3,
  showGrid = true,
  gridLevels = 5,
  showLabels = true,
  labelColor = '#94a3b8',
  labelSize = 10,
  gridColor = '#94a3b8',
  gridOpacity = 0.2,
  'aria-label': ariaLabel,
}: RadarSeriesProps<TDatum>) {
  const { data, colorScale, dimensions } = useChartContext<TDatum>();
  const [hoveredDot, setHoveredDot] = useState<{ series: number; axis: number } | null>(null);

  const handleDotEnter = useCallback((si: number, ai: number) => setHoveredDot({ series: si, axis: ai }), []);
  const handleDotLeave = useCallback(() => setHoveredDot(null), []);

  const { innerWidth, innerHeight }: Dimensions = dimensions;
  const cx = innerWidth / 2;
  const cy = innerHeight / 2;
  const maxRadius = Math.min(cx, cy) * 0.8;
  const numAxes = (data as TDatum[]).length;
  const angleSlice = numAxes > 0 ? (2 * Math.PI) / numAxes : 0;

  const dimensionLabels = useMemo(
    () => (data as TDatum[]).map((d) => String(d[dimensionField])),
    [data, dimensionField],
  );

  const maxValue = useMemo(() => {
    let m = 0;
    for (const d of data as TDatum[]) {
      for (const f of valueFields) {
        const v = Number(d[f]) || 0;
        if (v > m) m = v;
      }
    }
    return m || 1;
  }, [data, valueFields]);

  const rScale = useMemo(
    () => scaleLinear().domain([0, maxValue]).range([0, maxRadius]),
    [maxValue, maxRadius],
  );

  // One polygon per valueField, with one point per datum/dimension
  const polygons = useMemo(() => {
    return valueFields.map((vf, si) => {
      const seriesColor = colorsProp?.[si] ?? colorScale(vf);
      const points = (data as TDatum[]).map((d, ai) => {
        const val = Number(d[vf]) || 0;
        const r = rScale(val);
        const angle = angleSlice * ai - Math.PI / 2;
        return {
          x: cx + r * Math.cos(angle),
          y: cy + r * Math.sin(angle),
          val,
          dimension: dimensionLabels[ai],
        };
      });

      const radialGen = lineRadial<{ val: number }>()
        .angle((_d, i) => angleSlice * i)
        .radius((pt) => rScale(pt.val))
        .curve(curveLinearClosed);

      const path = radialGen(points) ?? '';

      return { path, points, color: seriesColor, fieldName: vf, seriesIndex: si };
    });
  }, [data, valueFields, colorsProp, colorScale, cx, cy, rScale, angleSlice, dimensionLabels]);

  const grid = useMemo(() => {
    if (!showGrid) return { circles: [], axes: [] };

    const circles = Array.from({ length: gridLevels }, (_, i) => ({
      r: (maxRadius / gridLevels) * (i + 1),
    }));

    const axes = (data as TDatum[]).map((_d, ai) => {
      const angle = angleSlice * ai - Math.PI / 2;
      return {
        x2: cx + maxRadius * Math.cos(angle),
        y2: cy + maxRadius * Math.sin(angle),
      };
    });

    return { circles, axes };
  }, [showGrid, gridLevels, maxRadius, data, angleSlice, cx, cy]);

  const axisLabels = useMemo(() => {
    return dimensionLabels.map((label, ai) => {
      const angle = angleSlice * ai - Math.PI / 2;
      const labelR = maxRadius + 18;
      return {
        x: cx + labelR * Math.cos(angle),
        y: cy + labelR * Math.sin(angle),
        label,
        anchor: Math.abs(angle + Math.PI / 2) < 0.01 ? 'middle' as const
          : angle > -Math.PI / 2 && angle < Math.PI / 2 ? 'start' as const : 'end' as const,
      };
    });
  }, [dimensionLabels, angleSlice, maxRadius, cx, cy]);

  return (
    <g aria-label={ariaLabel ?? 'Radar chart'}>
      {showGrid && (
        <g opacity={gridOpacity}>
          {grid.circles.map((c, i) => (
            <circle key={i} cx={cx} cy={cy} r={c.r}
              fill="none" stroke={gridColor} strokeWidth={0.5} />
          ))}
          {grid.axes.map((a, i) => (
            <line key={i} x1={cx} y1={cy} x2={a.x2} y2={a.y2}
              stroke={gridColor} strokeWidth={0.5} />
          ))}
        </g>
      )}

      {showLabels && axisLabels.map((lbl, i) => (
        <text key={i} x={lbl.x} y={lbl.y}
          textAnchor={lbl.anchor} dominantBaseline="central"
          fill={labelColor} fontSize={labelSize} fontWeight={500}
        >
          {lbl.label}
        </text>
      ))}

      {polygons.map((poly) => (
        <g key={poly.seriesIndex}>
          <path
            d={poly.path}
            transform={`translate(${cx}, ${cy})`}
            fill={poly.color}
            fillOpacity={fillOpacity}
            stroke={poly.color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            style={{ transition: 'fill-opacity 200ms ease' }}
          />
          {poly.points.map((pt, ai) => {
            const isActive = hoveredDot?.series === poly.seriesIndex && hoveredDot?.axis === ai;
            const activeR = isActive ? dotRadius + 3 : dotRadius;

            return (
              <g key={ai}>
                {isActive && (
                  <circle cx={pt.x} cy={pt.y} r={activeR + 4}
                    fill="none" stroke={poly.color} strokeWidth={1.5} opacity={0.3} />
                )}
                <circle
                  cx={pt.x} cy={pt.y} r={activeR}
                  fill={isActive ? '#fff' : poly.color}
                  stroke={isActive ? poly.color : '#fff'}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  tabIndex={0}
                  aria-label={`${pt.dimension} ${poly.fieldName}: ${pt.val}`}
                  onMouseEnter={() => handleDotEnter(poly.seriesIndex, ai)}
                  onMouseLeave={handleDotLeave}
                  style={{ cursor: 'pointer', transition: 'r 150ms ease' }}
                />
                {isActive && (
                  <text x={pt.x} y={pt.y - activeR - 8}
                    textAnchor="middle" fill={poly.color}
                    fontSize={10} fontWeight={700}
                    style={{ pointerEvents: 'none' }}
                  >
                    {pt.val.toLocaleString()}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}
