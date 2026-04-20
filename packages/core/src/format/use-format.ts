// ─────────────────────────────────────────────────
// useFormat — Value formatting hook
// ─────────────────────────────────────────────────
// Converts raw values to display strings using
// built-in shortcuts ('currency', 'percent', etc.)
// or a custom function. Respects locale.
//
// Usage:
//   const fmt = useFormat('currency');
//   fmt(42000) // → '$42,000.00'
//
//   const fmt2 = useFormat((v) => `${v} units`);
//   fmt2(100) // → '100 units'
// ─────────────────────────────────────────────────

import { useMemo } from 'react';
import type { FormatFunction } from '../types';

/**
 * Returns a formatting function based on a format specifier.
 *
 * @param format - A built-in format name or custom function
 * @param locale - BCP 47 locale string (default: 'en-US')
 */
export function useFormat(
  format?: FormatFunction,
  locale: string = 'en-US',
): (value: unknown) => string {
  return useMemo(() => {
    // No format specified — convert to string
    if (!format) return (v: unknown) => String(v ?? '');

    // Custom function — use directly
    if (typeof format === 'function') return format;

    // Built-in format shortcuts
    switch (format) {
      case 'number':
        return (v: unknown) =>
          new Intl.NumberFormat(locale).format(Number(v));

      case 'integer':
        return (v: unknown) =>
          new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Number(v));

      case 'currency':
        return (v: unknown) =>
          new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(Number(v));

      case 'percent':
        return (v: unknown) =>
          new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: 1 }).format(Number(v));

      case 'compact':
        return (v: unknown) =>
          new Intl.NumberFormat(locale, { notation: 'compact' }).format(Number(v));

      case 'date':
        return (v: unknown) =>
          new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(v as string | number));

      case 'date:short':
        return (v: unknown) =>
          new Intl.DateTimeFormat(locale, { dateStyle: 'short' }).format(new Date(v as string | number));

      case 'time':
        return (v: unknown) =>
          new Intl.DateTimeFormat(locale, { timeStyle: 'short' }).format(new Date(v as string | number));

      case 'datetime':
        return (v: unknown) =>
          new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(v as string | number));

      case 'duration': {
        return (v: unknown) => {
          const seconds = Math.abs(Number(v));
          const h = Math.floor(seconds / 3600);
          const m = Math.floor((seconds % 3600) / 60);
          const s = Math.floor(seconds % 60);
          const parts: string[] = [];
          if (h > 0) parts.push(`${h}h`);
          if (m > 0) parts.push(`${m}m`);
          if (s > 0 || parts.length === 0) parts.push(`${s}s`);
          return parts.join(' ');
        };
      }

      default:
        return (v: unknown) => String(v ?? '');
    }
  }, [format, locale]);
}
