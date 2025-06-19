import { useCallback, useEffect, useRef, useState } from "react";

export default function useDebouncedCallback<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const funcRef = useRef(func); // Use a ref to store the latest function to avoid stale closures

  // Update the funcRef whenever the provided func changes
  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  // The debounced function
  const debouncedFunc = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        funcRef.current(...args);
      }, delay);
    },
    [delay],
  ); // Only recreate debouncedFunc if delay changes

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunc;
}
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // More specific type for timeout ID

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
