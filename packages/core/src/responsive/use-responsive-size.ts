// ─────────────────────────────────────────────────
// useResponsiveSize — ResizeObserver hook
// ─────────────────────────────────────────────────
// Tracks the size of a container element using
// ResizeObserver. Returns width/height that update
// on resize, debounced for performance.
//
// This is what allows <Chart> to fill its container
// without requiring explicit width/height props.
// ─────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';

interface ResponsiveSizeOptions {
  /** Debounce delay in ms (default: 60) */
  debounce?: number;
  /** Fixed width override — skips observation */
  width?: number;
  /** Fixed height override */
  height?: number;
  /** Desired aspect ratio (width/height). Used when only width is known */
  aspect?: number;
  /** Minimum height in pixels */
  minHeight?: number;
  /** Maximum height in pixels */
  maxHeight?: number;
}

interface ResponsiveSize {
  width: number;
  height: number;
  /** Ref to attach to the container element */
  containerRef: RefObject<HTMLDivElement | null>;
}

export function useResponsiveSize(options: ResponsiveSizeOptions = {}): ResponsiveSize {
  const {
    debounce: debounceMs = 60,
    width: fixedWidth,
    height: fixedHeight,
    aspect = 16 / 9,
    minHeight = 100,
    maxHeight = Infinity,
  } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const calculateHeight = useCallback(
    (w: number, h: number): number => {
      // If a fixed height is specified, use it directly
      if (fixedHeight) return fixedHeight;

      // If the container has a natural height, use it
      // Otherwise derive from aspect ratio
      const derived = h > 0 ? h : w / aspect;

      return Math.min(Math.max(derived, minHeight), maxHeight);
    },
    [fixedHeight, aspect, minHeight, maxHeight],
  );

  useEffect(() => {
    // If both dimensions are fixed, no observation needed
    if (fixedWidth && fixedHeight) {
      setSize({ width: fixedWidth, height: fixedHeight });
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      // Debounce rapid resize events
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const entry = entries[0];
        if (!entry) return;

        const { width: observedWidth, height: observedHeight } = entry.contentRect;
        const w = fixedWidth ?? observedWidth;
        const h = calculateHeight(w, observedHeight);

        setSize((prev) => {
          // Skip update if nothing changed (avoids unnecessary re-renders)
          if (prev.width === w && prev.height === h) return prev;
          return { width: w, height: h };
        });
      }, debounceMs);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [fixedWidth, fixedHeight, debounceMs, calculateHeight]);

  return {
    width: fixedWidth ?? size.width,
    height: fixedHeight ?? size.height,
    containerRef,
  };
}
