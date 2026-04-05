import { useEffect, useState } from 'react';

/**
 * Delays the updating of a value until after the specified delay has passed
 * without the value changing.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced state
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timer if value changes (user keeps typing) or component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
