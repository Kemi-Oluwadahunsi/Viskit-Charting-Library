import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScale, detectScaleType } from './use-scale';

describe('useScale', () => {
  describe('linear scale', () => {
    it('maps domain values to range values', () => {
      const { result } = renderHook(() =>
        useScale({ type: 'linear', domain: [0, 100], range: [0, 500] }),
      );
      expect(result.current.scale(0)).toBe(0);
      expect(result.current.scale(50)).toBe(250);
      expect(result.current.scale(100)).toBe(500);
    });

    it('generates ticks', () => {
      const { result } = renderHook(() =>
        useScale({ type: 'linear', domain: [0, 100], range: [0, 500] }),
      );
      const ticks = result.current.ticks(5);
      expect(ticks.length).toBeGreaterThan(0);
      expect(ticks[0]).toBe(0);
    });

    it('supports invert', () => {
      const { result } = renderHook(() =>
        useScale({ type: 'linear', domain: [0, 100], range: [0, 500] }),
      );
      expect(result.current.invert).toBeDefined();
      expect(result.current.invert!(250)).toBe(50);
    });

    it('applies clamp', () => {
      const { result } = renderHook(() =>
        useScale({ type: 'linear', domain: [0, 100], range: [0, 500], clamp: true }),
      );
      expect(result.current.scale(200)).toBe(500);
      expect(result.current.scale(-50)).toBe(0);
    });

    it('applies nice rounding', () => {
      const { result } = renderHook(() =>
        useScale({ type: 'linear', domain: [0.123, 9.876], range: [0, 100], nice: true }),
      );
      expect(result.current.domain[0]).toBe(0);
      expect(result.current.domain[1]).toBe(10);
    });
  });

  describe('band scale', () => {
    it('maps categories to positions', () => {
      const { result } = renderHook(() =>
        useScale({ type: 'band', domain: ['A', 'B', 'C'], range: [0, 300] }),
      );
      expect(typeof result.current.scale('A')).toBe('number');
      expect(result.current.bandwidth).toBeGreaterThan(0);
    });

    it('applies padding', () => {
      const { result: noPad } = renderHook(() =>
        useScale({ type: 'band', domain: ['A', 'B'], range: [0, 200], padding: 0 }),
      );
      const { result: withPad } = renderHook(() =>
        useScale({ type: 'band', domain: ['A', 'B'], range: [0, 200], padding: 0.5 }),
      );
      expect(withPad.current.bandwidth!).toBeLessThan(noPad.current.bandwidth!);
    });

    it('uses domain as ticks', () => {
      const { result } = renderHook(() =>
        useScale({ type: 'band', domain: ['X', 'Y', 'Z'], range: [0, 300] }),
      );
      expect(result.current.ticks()).toEqual(['X', 'Y', 'Z']);
    });
  });

  describe('log scale', () => {
    it('maps with logarithmic transform', () => {
      const { result } = renderHook(() =>
        useScale({ type: 'log', domain: [1, 1000], range: [0, 300] }),
      );
      const at1 = result.current.scale(1) as number;
      const at10 = result.current.scale(10) as number;
      const at100 = result.current.scale(100) as number;
      expect(at10 - at1).toBeCloseTo(at100 - at10, 0);
    });
  });

  describe('reverse option', () => {
    it('flips the range', () => {
      const { result } = renderHook(() =>
        useScale({ type: 'linear', domain: [0, 100], range: [0, 500], reverse: true }),
      );
      expect(result.current.scale(0)).toBe(500);
      expect(result.current.scale(100)).toBe(0);
    });
  });
});

describe('detectScaleType', () => {
  it('returns linear for numbers', () => {
    expect(detectScaleType([1, 2, 3])).toBe('linear');
  });

  it('returns band for strings', () => {
    expect(detectScaleType(['a', 'b', 'c'])).toBe('band');
  });

  it('returns time for Date objects', () => {
    expect(detectScaleType([new Date()])).toBe('time');
  });

  it('returns time for ISO date strings', () => {
    expect(detectScaleType(['2024-01-01', '2024-02-01'])).toBe('time');
  });

  it('returns linear for empty array', () => {
    expect(detectScaleType([])).toBe('linear');
  });
});
