// ─────────────────────────────────────────────────
// useScale — React hook for D3 scale creation
// ─────────────────────────────────────────────────
// Wraps D3's scale constructors with a typed,
// memoized React interface. Consumers never import
// D3 directly — this hook handles everything.
//
// Usage:
//   const { scale, ticks, bandwidth } = useScale({
//     type: 'band',
//     domain: ['Jan', 'Feb', 'Mar'],
//     range: [0, 400],
//     padding: 0.2,
//   });
// ─────────────────────────────────────────────────

import { useMemo } from 'react';
import {
  scaleLinear,
  scaleLog,
  scaleSqrt,
  scalePow,
  scaleTime,
  scaleUtc,
  scaleOrdinal,
  scaleBand,
  scalePoint,
  scaleSequential,
  scaleDiverging,
  scaleThreshold,
  scaleQuantize,
  scaleQuantile,
  scaleSymlog,
} from 'd3-scale';
import type { ScaleConfig, ScaleResult, ScaleType } from '../types';

/**
 * Scale factory — maps a ScaleType string to its D3 constructor.
 * Each constructor is configured from the ScaleConfig fields.
 */
function createScale(config: ScaleConfig): unknown {
  const { type, domain, range, nice, clamp, padding, paddingInner, paddingOuter, round, exponent, base, reverse } = config;

  const resolvedRange = reverse && range ? [...range].reverse() : range;

  switch (type) {
    case 'linear': {
      const s = scaleLinear().domain(domain as number[] ?? [0, 1]).range(resolvedRange as number[] ?? [0, 1]);
      if (nice) s.nice(typeof nice === 'number' ? nice : undefined);
      if (clamp) s.clamp(true);
      return s;
    }
    case 'log': {
      const s = scaleLog().domain(domain as number[] ?? [1, 10]).range(resolvedRange as number[] ?? [0, 1]);
      if (base) s.base(base);
      if (nice) s.nice();
      if (clamp) s.clamp(true);
      return s;
    }
    case 'sqrt': {
      const s = scaleSqrt().domain(domain as number[] ?? [0, 1]).range(resolvedRange as number[] ?? [0, 1]);
      if (nice) s.nice();
      if (clamp) s.clamp(true);
      return s;
    }
    case 'pow': {
      const s = scalePow().domain(domain as number[] ?? [0, 1]).range(resolvedRange as number[] ?? [0, 1]);
      if (exponent) s.exponent(exponent);
      if (nice) s.nice();
      if (clamp) s.clamp(true);
      return s;
    }
    case 'symlog': {
      const s = scaleSymlog().domain(domain as number[] ?? [0, 1]).range(resolvedRange as number[] ?? [0, 1]);
      if (clamp) s.clamp(true);
      return s;
    }
    case 'time': {
      const s = scaleTime().domain(domain as Date[] ?? [new Date(0), new Date()]).range(resolvedRange as number[] ?? [0, 1]);
      if (nice) s.nice();
      if (clamp) s.clamp(true);
      return s;
    }
    case 'utc': {
      const s = scaleUtc().domain(domain as Date[] ?? [new Date(0), new Date()]).range(resolvedRange as number[] ?? [0, 1]);
      if (nice) s.nice();
      if (clamp) s.clamp(true);
      return s;
    }
    case 'ordinal': {
      return scaleOrdinal().domain(domain as string[] ?? []).range(resolvedRange as string[] ?? []);
    }
    case 'band': {
      const s = scaleBand().domain(domain as string[] ?? []).range(resolvedRange as [number, number] ?? [0, 1]);
      if (padding !== undefined) s.padding(padding);
      if (paddingInner !== undefined) s.paddingInner(paddingInner);
      if (paddingOuter !== undefined) s.paddingOuter(paddingOuter);
      if (round) s.round(true);
      return s;
    }
    case 'point': {
      const s = scalePoint().domain(domain as string[] ?? []).range(resolvedRange as [number, number] ?? [0, 1]);
      if (padding !== undefined) s.padding(padding);
      if (round) s.round(true);
      return s;
    }
    case 'sequential': {
      return scaleSequential().domain(domain as [number, number] ?? [0, 1]);
    }
    case 'diverging': {
      return scaleDiverging().domain(domain as [number, number, number] ?? [0, 0.5, 1]);
    }
    case 'threshold': {
      return scaleThreshold<number, string>().domain(domain as number[] ?? []).range(resolvedRange as string[] ?? []);
    }
    case 'quantize': {
      return scaleQuantize().domain(domain as [number, number] ?? [0, 1]).range(resolvedRange as number[] ?? []);
    }
    case 'quantile': {
      return scaleQuantile().domain(domain as number[] ?? []).range(resolvedRange as number[] ?? []);
    }
    default: {
      throw new Error(`[VisKit] Unknown scale type: "${type as string}"`);
    }
  }
}

/**
 * Detect the best scale type for a data field automatically.
 * Falls back to 'linear' if detection fails.
 */
export function detectScaleType(sampleValues: unknown[]): ScaleType {
  if (sampleValues.length === 0) return 'linear';

  const first = sampleValues[0];

  if (first instanceof Date) return 'time';
  if (typeof first === 'number') return 'linear';
  if (typeof first === 'string') {
    // Check if all strings are parseable as dates
    const looksLikeDate = sampleValues.every(
      (v) => typeof v === 'string' && !isNaN(Date.parse(v)),
    );
    if (looksLikeDate) return 'time';
    return 'band';
  }

  return 'linear';
}

/**
 * React hook that creates a memoized D3 scale from config.
 *
 * The scale is recreated only when config values change.
 * Returns the scale function, tick generator, domain, range,
 * and optionally bandwidth (for band scales) and invert
 * (for continuous scales).
 */
export function useScale<TDomain = unknown, TRange = unknown>(
  config: ScaleConfig<TDomain, TRange>,
): ScaleResult<TDomain, TRange> {
  const domainKey = JSON.stringify(config.domain);
  const rangeKey = JSON.stringify(config.range);

  return useMemo(() => {
    const raw = createScale(config as ScaleConfig);

    // Build the typed result, pulling features from the raw D3 scale
    const d3Scale = raw as Record<string, unknown>;
    const scaleFn = raw as (v: TDomain) => TRange;

    const result: ScaleResult<TDomain, TRange> = {
      scale: scaleFn,
      ticks: (count?: number) => {
        if ('ticks' in d3Scale && typeof d3Scale.ticks === 'function') {
          return d3Scale.ticks(count) as TDomain[];
        }
        // Band/ordinal scales use domain as ticks
        return (config.domain ?? []) as TDomain[];
      },
      domain: (typeof d3Scale.domain === 'function' ? d3Scale.domain() : config.domain ?? []) as TDomain[],
      range: (typeof d3Scale.range === 'function' ? d3Scale.range() : config.range ?? []) as TRange[],
    };

    // Bandwidth — only on band scales
    if ('bandwidth' in d3Scale && typeof d3Scale.bandwidth === 'function') {
      result.bandwidth = d3Scale.bandwidth() as number;
    }

    // Invert — only on continuous scales
    if ('invert' in d3Scale && typeof d3Scale.invert === 'function') {
      result.invert = d3Scale.invert.bind(d3Scale) as (v: TRange) => TDomain;
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.type,
    domainKey,
    rangeKey,
    config.nice,
    config.clamp,
    config.zero,
    config.padding,
    config.paddingInner,
    config.paddingOuter,
    config.round,
    config.exponent,
    config.base,
    config.reverse,
  ]);
}
