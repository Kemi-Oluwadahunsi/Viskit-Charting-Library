// ─────────────────────────────────────────────────
// useStreamingData — Real-time data streaming hook
// ─────────────────────────────────────────────────
// Manages a ring buffer of streaming data points
// with configurable max size and append behavior.
//
// Usage:
//   const { data, append, clear } = useStreamingData<Row>({
//     maxSize: 200,
//   });
//
//   useEffect(() => {
//     const ws = new WebSocket(url);
//     ws.onmessage = (e) => append(JSON.parse(e.data));
//     return () => ws.close();
//   }, []);
//
//   <Chart data={data} height={300}>
//     <LineSeries field="value" />
//   </Chart>
// ─────────────────────────────────────────────────

import { useState, useCallback, useRef } from 'react';

export interface UseStreamingDataOptions {
  /** Maximum number of data points to keep (default: 500) */
  maxSize?: number;
  /** Initial data (default: []) */
  initialData?: unknown[];
}

export interface UseStreamingDataResult<TDatum> {
  /** Current data array */
  data: TDatum[];
  /** Append one or more data points */
  append: (items: TDatum | TDatum[]) => void;
  /** Replace all data */
  set: (items: TDatum[]) => void;
  /** Clear all data */
  clear: () => void;
  /** Number of total items received (including evicted) */
  totalReceived: number;
}

export function useStreamingData<TDatum extends Record<string, unknown>>(
  options: UseStreamingDataOptions = {},
): UseStreamingDataResult<TDatum> {
  const { maxSize = 500, initialData = [] } = options;
  const [data, setData] = useState<TDatum[]>(initialData as TDatum[]);
  const totalRef = useRef(initialData.length);

  const append = useCallback(
    (items: TDatum | TDatum[]) => {
      const arr = Array.isArray(items) ? items : [items];
      totalRef.current += arr.length;
      setData((prev) => {
        const next = [...prev, ...arr];
        if (next.length > maxSize) {
          return next.slice(next.length - maxSize);
        }
        return next;
      });
    },
    [maxSize],
  );

  const set = useCallback((items: TDatum[]) => {
    totalRef.current += items.length;
    setData(items);
  }, []);

  const clear = useCallback(() => {
    setData([]);
  }, []);

  return {
    data,
    append,
    set,
    clear,
    get totalReceived() {
      return totalRef.current;
    },
  };
}
