import { useEffect, useState } from 'react';

/**
 * Delays propagating a value until the specified delay has elapsed without
 * the value changing. Useful for deferring expensive operations (e.g. API
 * calls) triggered by rapid user input.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};