import { useCallback, useState } from 'react';

import type { ILogFilterState } from './types';

const DEFAULT_FILTERS: ILogFilterState = {
  query:     '',
  level:     '',
  service:   '',
  dateRange: null,
  page:      1,
};

export const useLogsFilters = () => {
  const [filters, setFilters] = useState<ILogFilterState>(DEFAULT_FILTERS);

  // The generic K ensures that the 'value' type perfectly matches the 'key' type
  const handleFilterChange = useCallback(
    <K extends keyof ILogFilterState>(key: K, value: ILogFilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        // Automatically reset to page 1 if a search/filter changes
        ...(key !== 'page' && { page: 1 }),
      }));
    },
    []
  );

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    filters,
    handleFilterChange,
    handleReset,
  };
};