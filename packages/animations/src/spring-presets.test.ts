import { describe, it, expect } from 'vitest';
import { springPresets, resolveSpringConfig } from './spring-presets';

describe('springPresets', () => {
  it('has all four presets', () => {
    expect(springPresets.responsive).toBeDefined();
    expect(springPresets.gentle).toBeDefined();
    expect(springPresets.bouncy).toBeDefined();
    expect(springPresets.immediate).toBeDefined();
  });

  it('responsive has correct tension/friction', () => {
    expect(springPresets.responsive.tension).toBe(300);
    expect(springPresets.responsive.friction).toBe(24);
  });

  it('immediate has duration 0', () => {
    expect(springPresets.immediate.duration).toBe(0);
  });
});

describe('resolveSpringConfig', () => {
  it('returns selected preset when animate is true', () => {
    const config = resolveSpringConfig('responsive');
    expect(config).toEqual(springPresets.responsive);
  });

  it('returns immediate when animate is false', () => {
    const config = resolveSpringConfig('responsive', { animate: false });
    expect(config).toEqual(springPresets.immediate);
  });

  it('returns immediate when reducedMotion is true', () => {
    const config = resolveSpringConfig('gentle', { reducedMotion: true });
    expect(config).toEqual(springPresets.immediate);
  });

  it('returns immediate when both are disabled', () => {
    const config = resolveSpringConfig('bouncy', { animate: false, reducedMotion: true });
    expect(config).toEqual(springPresets.immediate);
  });

  it('returns correct preset for each name', () => {
    expect(resolveSpringConfig('gentle')).toEqual(springPresets.gentle);
    expect(resolveSpringConfig('bouncy')).toEqual(springPresets.bouncy);
    expect(resolveSpringConfig('immediate')).toEqual(springPresets.immediate);
  });
});
