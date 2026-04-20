import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFormat } from './use-format';

describe('useFormat', () => {
  it('returns identity function when no format given', () => {
    const { result } = renderHook(() => useFormat());
    expect(result.current(42)).toBe('42');
    expect(result.current('hello')).toBe('hello');
  });

  it('formats numbers with "number"', () => {
    const { result } = renderHook(() => useFormat('number'));
    expect(result.current(1234567)).toContain('1,234,567');
  });

  it('formats integers with "integer"', () => {
    const { result } = renderHook(() => useFormat('integer'));
    expect(result.current(1234.56)).toContain('1,235');
  });

  it('formats currency with "currency"', () => {
    const { result } = renderHook(() => useFormat('currency'));
    const formatted = result.current(42000);
    expect(formatted).toContain('$');
    expect(formatted).toContain('42,000');
  });

  it('formats percent with "percent"', () => {
    const { result } = renderHook(() => useFormat('percent'));
    const formatted = result.current(0.75);
    expect(formatted).toContain('75');
    expect(formatted).toContain('%');
  });

  it('formats compact numbers with "compact"', () => {
    const { result } = renderHook(() => useFormat('compact'));
    const formatted = result.current(42000);
    expect(formatted).toContain('42K');
  });

  it('accepts custom function', () => {
    const custom = (v: unknown) => `${v} units`;
    const { result } = renderHook(() => useFormat(custom));
    expect(result.current(100)).toBe('100 units');
  });

  it('handles null/undefined gracefully', () => {
    const { result } = renderHook(() => useFormat());
    expect(result.current(null)).toBe('');
    expect(result.current(undefined)).toBe('');
  });
});
