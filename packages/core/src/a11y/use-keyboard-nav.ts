import { useCallback, type KeyboardEvent } from 'react';

interface UseKeyboardNavOptions {
  /** Total number of navigable items */
  count: number;
  /** Currently focused index (null = none) */
  focusedIndex: number | null;
  /** Callback to set focused index */
  onFocusChange: (index: number | null) => void;
  /** Callback when Enter is pressed on an item */
  onSelect?: (index: number) => void;
}

/**
 * Keyboard navigation for chart data points.
 * Arrow keys move between points, Enter selects, Escape dismisses.
 */
export function useKeyboardNav({
  count,
  focusedIndex,
  onFocusChange,
  onSelect,
}: UseKeyboardNavOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<SVGElement>) => {
      if (count === 0) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown': {
          e.preventDefault();
          const next = focusedIndex === null ? 0 : Math.min(focusedIndex + 1, count - 1);
          onFocusChange(next);
          break;
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault();
          const prev = focusedIndex === null ? count - 1 : Math.max(focusedIndex - 1, 0);
          onFocusChange(prev);
          break;
        }
        case 'Home': {
          e.preventDefault();
          onFocusChange(0);
          break;
        }
        case 'End': {
          e.preventDefault();
          onFocusChange(count - 1);
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          if (focusedIndex !== null) {
            onSelect?.(focusedIndex);
          }
          break;
        }
        case 'Escape': {
          e.preventDefault();
          onFocusChange(null);
          break;
        }
      }
    },
    [count, focusedIndex, onFocusChange, onSelect],
  );

  return { handleKeyDown };
}
