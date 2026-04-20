import { describe, it, expect } from 'vitest';
import { createTheme } from './create-theme';
import { midnight } from './presets/midnight';

describe('createTheme', () => {
  it('returns a copy when no overrides', () => {
    const result = createTheme(midnight, {});
    expect(result.name).toBe('midnight');
    expect(result).not.toBe(midnight);
  });

  it('overrides top-level scalar values', () => {
    const result = createTheme(midnight, { name: 'custom' } as never);
    expect(result.name).toBe('custom');
  });

  it('replaces arrays entirely', () => {
    const newCategorical = ['#FF0000', '#00FF00'];
    const result = createTheme(midnight, { categorical: newCategorical });
    expect(result.categorical).toEqual(newCategorical);
    expect(result.categorical).not.toBe(midnight.categorical);
  });

  it('shallow-merges objects one level deep', () => {
    const result = createTheme(midnight, {
      surface: { background: '#000000' },
    } as never);
    expect(result.surface.background).toBe('#000000');
    // Other surface values should be preserved
    expect(result.surface.card).toBe(midnight.surface.card);
  });

  it('preserves unrelated sections', () => {
    const result = createTheme(midnight, {
      categorical: ['#111'],
    });
    expect(result.typography).toEqual(midnight.typography);
    expect(result.motion).toEqual(midnight.motion);
  });
});
